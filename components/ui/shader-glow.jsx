"use client";

import { useEffect, useRef } from "react";

/*
  ShaderGlow — a full-field "blue space" nebula rendered to a transparent WebGL
  canvas, meant to sit BEHIND a section (background layer) and fill it top to
  bottom. Domain-warped fbm in a bright space-blue palette; alpha-out so dark
  areas stay see-through and the section's own background shows. The buffer is
  downsampled (soft field, so low res upscales cleanly) to stay cheap on a tall
  section. Reduced-motion paints one static frame.
*/
const FRAG = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = vec2(uv.x * (iResolution.x / iResolution.y), uv.y) * 3.0;
    float t = iTime * 0.05;

    // Domain-warped fbm -> flowing nebula.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    float n = fbm(p + 2.0 * q + vec2(0.0, t * 1.5));
    n = smoothstep(0.15, 1.0, n);

    vec3 deep = vec3(0.03, 0.08, 0.26);   // deep space blue
    vec3 blue = vec3(0.13, 0.45, 1.0);    // bright space blue
    vec3 cyan = vec3(0.38, 0.82, 1.0);    // luminous edge
    vec3 col = mix(deep, blue, n);
    col = mix(col, cyan, smoothstep(0.6, 1.0, n) * 0.55);

    gl_FragColor = vec4(col, n * 0.95);
  }
`;

const VERT = `attribute vec2 aPosition; void main(){ gl_Position = vec4(aPosition, 0.0, 1.0); }`;

export default function ShaderGlow({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResLoc = gl.getUniformLocation(program, "iResolution");

    const resize = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      // Soft field -> render at low internal resolution and let CSS upscale.
      const q = Math.min(1, 760 / ch);
      const w = Math.max(1, Math.round(cw * q));
      const h = Math.max(1, Math.round(ch * q));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    let raf = 0;
    const render = (time) => {
      resize();
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      resize();
      gl.uniform1f(iTimeLoc, 0);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      raf = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={`block ${className}`} />
  );
}
