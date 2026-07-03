/*
  Minimal text-only PDF generator for the Workers runtime (no dependencies).
  Produces a valid PDF 1.4 document: US Letter pages, Helvetica, wrapped
  lines, page numbers. Good for agreements and signed summaries; not a
  general layout engine.
*/

const PAGE_W = 612; // US Letter, points
const PAGE_H = 792;
const MARGIN = 54;
const FONT_SIZE = 10;
const LINE_HEIGHT = 14;
const TITLE_SIZE = 15;
const MAX_CHARS = 92; // conservative wrap width for Helvetica 10pt
const LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN * 2 - 30) / LINE_HEIGHT);

// PDF strings are Latin-1; escape delimiters and drop unsupported chars.
function pdfEscape(s) {
  return String(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, "-")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrap(text) {
  const out = [];
  for (const raw of String(text).split(/\r?\n/)) {
    if (raw.length <= MAX_CHARS) {
      out.push(raw);
      continue;
    }
    let line = "";
    for (const word of raw.split(" ")) {
      if ((line + " " + word).trim().length > MAX_CHARS) {
        out.push(line.trim());
        line = word;
      } else {
        line = (line + " " + word).trim();
      }
    }
    if (line) out.push(line);
  }
  return out;
}

/*
  makePdf(title, body) -> Uint8Array
  The body is plain text (markdown reads fine as plain text for this use).
*/
export function makePdf(title, body) {
  const lines = wrap(body);
  const pages = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE));
  }
  if (pages.length === 0) pages.push([]);

  const objects = [];
  const addObj = (content) => {
    objects.push(content);
    return objects.length; // 1-based object number
  };

  const fontObj = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  );
  const boldFontObj = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  );

  const pageObjNums = [];
  const contentObjNums = [];
  // Reserve numbers: pages tree comes after content; compute later by
  // building content first, then pages, then the tree and catalog.
  for (let p = 0; p < pages.length; p++) {
    let stream = "BT\n";
    let y = PAGE_H - MARGIN;
    if (p === 0) {
      stream += `/F2 ${TITLE_SIZE} Tf\n1 0 0 1 ${MARGIN} ${y} Tm\n(${pdfEscape(
        title
      )}) Tj\n`;
      y -= LINE_HEIGHT * 2;
    }
    stream += `/F1 ${FONT_SIZE} Tf\n${LINE_HEIGHT} TL\n1 0 0 1 ${MARGIN} ${y} Tm\n`;
    for (const line of pages[p]) {
      stream += `(${pdfEscape(line)}) Tj\nT*\n`;
    }
    // Page number footer
    stream += `/F1 8 Tf\n1 0 0 1 ${PAGE_W / 2 - 20} ${MARGIN / 2} Tm\n(Page ${
      p + 1
    } of ${pages.length}) Tj\n`;
    stream += "ET";
    const contentNum = addObj(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    );
    contentObjNums.push(contentNum);
  }

  // Pages: each page object references the tree object, which we place last
  // among these; compute its number ahead of time.
  const firstPageObj = objects.length + 1;
  const pagesTreeObj = firstPageObj + pages.length;
  for (let p = 0; p < pages.length; p++) {
    const num = addObj(
      `<< /Type /Page /Parent ${pagesTreeObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontObj} 0 R /F2 ${boldFontObj} 0 R >> >> /Contents ${contentObjNums[p]} 0 R >>`
    );
    pageObjNums.push(num);
  }
  addObj(
    `<< /Type /Pages /Kids [${pageObjNums
      .map((n) => `${n} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`
  );
  const catalogObj = addObj(
    `<< /Type /Catalog /Pages ${pagesTreeObj} 0 R >>`
  );

  // Assemble with a cross-reference table.
  let pdf = "%PDF-1.4\n";
  const offsets = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

// Base64 for email attachments (chunked so large docs do not blow the stack).
export function toBase64(bytes) {
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}
