"use client";

import { useEffect, useRef } from "react";

/*
  ShaderGlow — a re-themed, scoped take on the animated-glassy-pricing shader.
  Instead of a full-screen rainbow canvas, this renders transparent concentric
  "orbital" rings in the brand palette (edge cyan -> champagne, white-hot inner
  line) sized to its own element, so it can sit behind a section as ambient
  motion without touching the content. Reduced-motion paints one static frame.
*/
const FRAG = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;

  mat2 rotate2d(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
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
    // Centered + aspect-corrected so the rings stay circular.
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float radius = 0.35;
    float mask = 0.0;
    mask += ring(p, radius, 0.035);
    mask += ring(p, radius - 0.018, 0.01);
    mask += ring(p, radius + 0.018, 0.005);
    float inner = ring(p, radius, 0.003);

    vec2 v = rotate2d(iTime * 0.3) * p;
    vec3 edgeColor = vec3(0.37, 0.83, 0.96);   // boundary cyan
    vec3 goldColor = vec3(0.89, 0.78, 0.60);   // champagne
    float t = 0.5 + 0.5 * sin(iTime * 0.25 + v.x * 4.0 + v.y * 3.0);
    vec3 col = mix(edgeColor, goldColor, t);
    col = mix(col, vec3(1.0), inner);          // white-hot inner line

    float alpha = clamp(mask + inner, 0.0, 1.0);
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
      antialias: true,
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
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
