"use client";

import { useEffect, useRef } from "react";

/*
  FluidCursor — a real-time GPU fluid simulation (Navier-Stokes, Jacobi
  pressure solve with vorticity confinement) that liquifies and swirls where
  the cursor moves, like lusion.co. Rendered to a transparent canvas behind the
  page content and tinted to the brand blue/cyan so it reads as ambient liquid
  light, not rainbow dye.

  Self-contained WebGL2 (half-float framebuffers). Desktop + motion-allowed
  only, pauses when the tab is hidden, and bails quietly if WebGL2/float
  targets are unavailable. Adapted from the widely-reproduced WebGL fluid sim.
*/
const CONFIG = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 384,
  DENSITY_DISSIPATION: 2.5,
  VELOCITY_DISSIPATION: 0.5,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 10,
  CURL: 11,
  SPLAT_RADIUS: 0.06,
  SPLAT_FORCE: 3600,
};

export default function FluidCursor({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
    };
    const gl = canvas.getContext("webgl2", params);
    if (!gl) return;

    const halfFloat = gl.HALF_FLOAT;
    const ext = gl.getExtension("EXT_color_buffer_float");
    let linearSupported = !!gl.getExtension("OES_texture_float_linear");
    if (!ext) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const baseVertex = `#version 300 es
      precision highp float;
      in vec2 aPosition; out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
      uniform vec2 texelSize;
      void main(){ vUv = aPosition*0.5+0.5; vL = vUv-vec2(texelSize.x,0.); vR = vUv+vec2(texelSize.x,0.); vT = vUv+vec2(0.,texelSize.y); vB = vUv-vec2(0.,texelSize.y); gl_Position = vec4(aPosition,0.,1.); }`;

    const makeProgram = (fragSrc) => {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, baseVertex));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, "#version 300 es\n" + fragSrc));
      gl.linkProgram(p);
      const uniforms = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i).name;
        uniforms[name] = gl.getUniformLocation(p, name);
      }
      return { program: p, uniforms };
    };

    const clearProg = makeProgram(`precision mediump float; precision mediump sampler2D; in vec2 vUv; uniform sampler2D uTexture; uniform float value; out vec4 o;
      void main(){ o = value * texture(uTexture, vUv); }`);
    const splatProg = makeProgram(`precision highp float; precision highp sampler2D; in vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; out vec4 o;
      void main(){ vec2 p = vUv-point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p,p)/radius)*color; vec3 base = texture(uTarget, vUv).xyz; o = vec4(base+splat,1.); }`);
    const advectionProg = makeProgram(`precision highp float; precision highp sampler2D; in vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation; out vec4 o;
      vec4 bilerp(sampler2D s, vec2 uv, vec2 ts){ vec2 st = uv/ts-0.5; vec2 iuv = floor(st); vec2 fuv = fract(st); vec4 a = texture(s,(iuv+vec2(0.5,0.5))*ts); vec4 b = texture(s,(iuv+vec2(1.5,0.5))*ts); vec4 c = texture(s,(iuv+vec2(0.5,1.5))*ts); vec4 d = texture(s,(iuv+vec2(1.5,1.5))*ts); return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y); }
      void main(){ vec2 coord = vUv - dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize; vec4 result = bilerp(uSource,coord,dyeTexelSize); float decay = 1.+dissipation*dt; o = result/decay; }`);
    const divergenceProg = makeProgram(`precision mediump float; precision mediump sampler2D; in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; uniform sampler2D uVelocity; out vec4 o;
      void main(){ float L = texture(uVelocity,vL).x; float R = texture(uVelocity,vR).x; float T = texture(uVelocity,vT).y; float B = texture(uVelocity,vB).y; vec2 C = texture(uVelocity,vUv).xy; if(vL.x<0.) L=-C.x; if(vR.x>1.) R=-C.x; if(vT.y>1.) T=-C.y; if(vB.y<0.) B=-C.y; float div = 0.5*(R-L+T-B); o = vec4(div,0.,0.,1.); }`);
    const curlProg = makeProgram(`precision mediump float; precision mediump sampler2D; in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; uniform sampler2D uVelocity; out vec4 o;
      void main(){ float L = texture(uVelocity,vL).y; float R = texture(uVelocity,vR).y; float T = texture(uVelocity,vT).x; float B = texture(uVelocity,vB).x; float vort = R-L-T+B; o = vec4(0.5*vort,0.,0.,1.); }`);
    const vorticityProg = makeProgram(`precision highp float; precision highp sampler2D; in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; out vec4 o;
      void main(){ float L = texture(uCurl,vL).x; float R = texture(uCurl,vR).x; float T = texture(uCurl,vT).x; float B = texture(uCurl,vB).x; float C = texture(uCurl,vUv).x; vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L)); force /= length(force)+0.0001; force *= curl*C; force.y *= -1.; vec2 vel = texture(uVelocity,vUv).xy; vel += force*dt; vel = min(max(vel,-1000.),1000.); o = vec4(vel,0.,1.); }`);
    const pressureProg = makeProgram(`precision mediump float; precision mediump sampler2D; in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; out vec4 o;
      void main(){ float L = texture(uPressure,vL).x; float R = texture(uPressure,vR).x; float T = texture(uPressure,vT).x; float B = texture(uPressure,vB).x; float div = texture(uDivergence,vUv).x; float p = (L+R+B+T-div)*0.25; o = vec4(p,0.,0.,1.); }`);
    const gradientProg = makeProgram(`precision mediump float; precision mediump sampler2D; in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; out vec4 o;
      void main(){ float L = texture(uPressure,vL).x; float R = texture(uPressure,vR).x; float T = texture(uPressure,vT).x; float B = texture(uPressure,vB).x; vec2 vel = texture(uVelocity,vUv).xy; vel.xy -= vec2(R-L,T-B); o = vec4(vel,0.,1.); }`);
    const displayProg = makeProgram(`precision highp float; precision highp sampler2D; in vec2 vUv; uniform sampler2D uTexture; out vec4 o;
      void main(){ vec3 c = texture(uTexture, vUv).rgb; float a = max(c.r, max(c.g, c.b)); o = vec4(c, a); }`);

    // Fullscreen quad
    const quad = gl.createVertexArray();
    gl.bindVertexArray(quad);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    const blit = (target) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const createFBO = (w, h, internal, format, type, filter) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      let texId = 0;
      return {
        texture, fbo, width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
      };
    };
    const createDoubleFBO = (w, h, internal, format, type, filter) => {
      let fbo1 = createFBO(w, h, internal, format, type, filter);
      let fbo2 = createFBO(w, h, internal, format, type, filter);
      return {
        width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
      };
    };

    const filtering = linearSupported ? gl.LINEAR : gl.NEAREST;
    let dye, velocity, divergence, curl, pressure;

    const initFBOs = () => {
      const simRes = getResolution(CONFIG.SIM_RESOLUTION);
      const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA, halfFloat, filtering);
      velocity = createDoubleFBO(simRes.width, simRes.height, gl.RG16F, gl.RG, halfFloat, filtering);
      divergence = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, gl.NEAREST);
    };

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
      return { width: min, height: max };
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        initFBOs();
      }
    };

    const use = (prog) => gl.useProgram(prog.program);

    // pointer
    const pointers = [{ x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: [0, 0, 0] }];
    const brandColor = () => {
      // deeper blue (210-245, less cyan), and 15% darker so it stays a quiet
      // accent that does not pull the eye
      const hue = (210 + Math.random() * 35) / 360;
      const c = hslToRgb(hue, 0.85, 0.55);
      return [c[0] * 0.47, c[1] * 0.47, c[2] * 0.47];
    };
    function hslToRgb(h, s, l) {
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r, g, b];
    }

    const onMove = (e) => {
      const p = pointers[0];
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      p.dx = (x - p.x) * CONFIG.SPLAT_FORCE;
      p.dy = (y - p.y) * CONFIG.SPLAT_FORCE;
      p.x = x; p.y = y;
      p.moved = Math.abs(p.dx) > 0 || Math.abs(p.dy) > 0;
      if (!p._init) { p._init = true; p.moved = false; }
      if (p.moved) {
        p.color = brandColor();
        lastActive = performance.now();
        if (!raf && visible) { lastTime = lastActive; raf = requestAnimationFrame(update); }
      }
    };
    window.addEventListener("pointermove", onMove);

    const splat = (x, y, dx, dy, color) => {
      use(splatProg);
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0);
      gl.uniform1f(splatProg.uniforms.radius, correctRadius(CONFIG.SPLAT_RADIUS / 100));
      blit(velocity.write); velocity.swap();
      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write); dye.swap();
    };
    const correctRadius = (r) => {
      const aspectRatio = canvas.width / canvas.height;
      return aspectRatio > 1 ? r * aspectRatio : r;
    };

    let lastTime = performance.now();
    let visible = true;
    let raf = 0;
    // Idle auto-pause: stop simulating a few seconds after the cursor stops
    // (by then the dye has fully dissipated) so the GPU does nothing while the
    // user reads. Movement restarts it instantly. Starts idle until first move.
    const IDLE_MS = 3000;
    let lastActive = performance.now() - 100000;

    const step = (dt) => {
      gl.disable(gl.BLEND);

      use(curlProg);
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      use(vorticityProg);
      gl.uniform2f(vorticityProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProg.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProg.uniforms.curl, CONFIG.CURL);
      gl.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write); velocity.swap();

      use(divergenceProg);
      gl.uniform2f(divergenceProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      use(clearProg);
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, CONFIG.PRESSURE);
      blit(pressure.write); pressure.swap();

      use(pressureProg);
      gl.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      use(gradientProg);
      gl.uniform2f(gradientProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      use(advectionProg);
      gl.uniform2f(advectionProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform2f(advectionProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProg.uniforms.dt, dt);
      gl.uniform1f(advectionProg.uniforms.dissipation, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();

      gl.uniform2f(advectionProg.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProg.uniforms.dissipation, CONFIG.DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
    };

    const render = () => {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      use(displayProg);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    };

    const applyInputs = () => {
      const p = pointers[0];
      if (p.moved) {
        p.moved = false;
        splat(p.x, p.y, p.dx, p.dy, p.color);
      }
    };

    const update = () => {
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastTime = now;
      resize();
      applyInputs();
      step(dt);
      render();
      raf = visible && now - lastActive < IDLE_MS ? requestAnimationFrame(update) : 0;
    };

    resize();
    initFBOs();
    raf = requestAnimationFrame(update);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      lastTime = performance.now();
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
