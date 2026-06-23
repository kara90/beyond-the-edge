"use client";

import { useEffect, useRef } from "react";

/*
  ShaderGlow — a crisp neon "circle" (concentric blue rings) on a transparent
  WebGL canvas, meant to sit BEHIND a section as an ambient accent. Rendered at
  full resolution (capped dpr) so the ring stays sharp; keep this canvas a
  contained size (not a giant full-section element) so the buffer stays light.
  Reduced-motion paints one static frame.
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

  void main(){
    // Centered neon circle (concentric rings), kept perfectly circular.
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float radius = 0.34;
    float rings = ring(p, radius, 0.02) + ring(p, radius - 0.012, 0.007) + ring(p, radius + 0.012, 0.004);
    float inner = ring(p, radius, 0.0016);

    vec3 blue = vec3(0.14, 0.46, 1.0);
    vec3 cyan = vec3(0.42, 0.82, 1.0);
    vec3 col = mix(blue, cyan, clamp(rings, 0.0, 1.0));
    col = mix(col, vec3(1.0), inner * 0.85);

    float alpha = clamp(rings * 0.95 + inner, 0.0, 1.0);
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
      // Full resolution (capped dpr) so the ring stays crisp, not pixelated.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
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
