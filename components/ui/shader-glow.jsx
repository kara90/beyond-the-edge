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

  float variation(vec2 v1, vec2 v2, float strength, float speed){
    return sin(dot(normalize(v1), normalize(v2)) * strength + iTime * speed) / 100.0;
  }
  float ring(vec2 p, float rad, float width){
    float len = length(p);
    len += variation(p, vec2(0.0, 1.0), 5.0, 2.0);
    len -= variation(p, vec2(1.0, 0.0), 5.0, 2.0);
    return smoothstep(rad - width, rad, len) - smoothstep(rad, rad + width, len);
  }
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++){ v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5; } return v; }

  void main(){
    // Neon circle (concentric rings), centered in the upper area, kept circular.
    vec2 c = vec2(0.5, 0.80) * iResolution.xy;
    vec2 p = (gl_FragCoord.xy - c) / min(iResolution.x, iResolution.y);
    float radius = 0.34;
    float rings = ring(p, radius, 0.03) + ring(p, radius - 0.018, 0.01) + ring(p, radius + 0.018, 0.005);
    float inner = ring(p, radius, 0.0025);

    // Faint blue-space nebula fill so the whole block still reads as space.
    vec2 q = gl_FragCoord.xy / iResolution.xy * 3.0;
    float neb = smoothstep(0.25, 1.0, fbm(q + iTime * 0.03)) * 0.16;

    vec3 blue = vec3(0.14, 0.46, 1.0);
    vec3 cyan = vec3(0.42, 0.82, 1.0);
    vec3 col = mix(blue, cyan, clamp(rings, 0.0, 1.0));
    col = mix(col, vec3(1.0), inner * 0.85);

    float alpha = clamp(rings * 0.95 + inner + neb, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
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
      // Render at a modest internal resolution and let CSS upscale.
      const q = Math.min(1, 900 / ch);
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
