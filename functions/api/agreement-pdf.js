import { AGREEMENTS } from "../_lib/agreements-data.js";
import { makePdf } from "../_lib/pdf.js";

/*
  GET /api/agreement-pdf?id=csa
  Streams the CURRENT version of an agreement as a downloadable PDF, generated
  from the same source text the /agree pages render and the signing record
  hashes.
*/
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id") || "";
  const a = AGREEMENTS[id];
  if (!a) {
    return new Response(JSON.stringify({ error: "Unknown agreement." }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  const pdf = makePdf(a.name, a.text);
  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${id}-${a.version}.pdf"`,
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}
