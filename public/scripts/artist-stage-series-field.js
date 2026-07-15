/*
 * ARTIST STAGE / Series living pigment field
 * A dedicated WebGL1 backdrop for the Series constellation route.
 */
(function (global) {
  "use strict";

  var VERSION = "1.0.0";
  var DEFAULT_PALETTE = {
    ink: "#020403",
    deep: "#11170d",
    pigmentA: "#88a92d",
    pigmentB: "#9c7138",
    highlight: "#d9d493"
  };
  var DEFAULT_FIELD = {
    intensity: 0.74,
    morph: 0.62,
    contour: 0.56,
    bloom: 0.5,
    grain: 0.34,
    drift: 0.42
  };

  var VERTEX_SHADER = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = aPosition * 0.5 + 0.5;",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uInkColor;
uniform vec3 uDeepColor;
uniform vec3 uPigmentA;
uniform vec3 uPigmentB;
uniform vec3 uHighlightColor;
uniform float uIntensity;
uniform float uMorph;
uniform float uContour;
uniform float uBloom;
uniform float uGrain;
uniform float uDrift;
uniform float uEnergy;
uniform float uPulse;
uniform float uPulsePhase;
uniform vec2 uFocus;
uniform vec2 uPointer;
uniform float uPointerStrength;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(262144.0, 32768.0) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += noise(p) * amplitude;
    p = turn * p * 2.03 + vec2(8.7, 3.1);
    amplitude *= 0.5;
  }
  return value;
}

float ridged(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 turn = mat2(0.73, -0.68, 0.68, 0.73);
  for (int i = 0; i < 5; i++) {
    float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
    value += n * n * amplitude;
    p = turn * p * 2.12 + vec2(5.2, 11.8);
    amplitude *= 0.48;
  }
  return value;
}

vec2 cellular(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float nearest = 8.0;
  float second = 8.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 point = hash22(cell + offset);
      vec2 delta = offset + point - local;
      float distanceSquared = dot(delta, delta);
      if (distanceSquared < nearest) {
        second = nearest;
        nearest = distanceSquared;
      } else if (distanceSquared < second) {
        second = distanceSquared;
      }
    }
  }

  return sqrt(vec2(nearest, second));
}

float metaball(vec2 p, vec2 center, float radius) {
  vec2 delta = p - center;
  return radius * radius / (dot(delta, delta) + radius * radius * 0.2);
}

float lineGlow(float value, float width) {
  return exp(-pow(value / max(width, 0.001), 2.0));
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = uv - 0.5;
  p.x *= aspect;

  vec2 focus = vec2(uFocus.x, 1.0 - uFocus.y) - 0.5;
  focus.x *= aspect;
  vec2 pointer = vec2(uPointer.x, 1.0 - uPointer.y) - 0.5;
  pointer.x *= aspect;

  float energy = clamp(uEnergy, 0.0, 1.0);
  float pulse = clamp(uPulse, 0.0, 1.0);
  float pulsePhase = clamp(uPulsePhase, 0.0, 1.0);
  float time = uTime * (0.21 + uDrift * 0.24);
  float morphCycle = 0.5 + 0.5 * sin(time * 0.88);
  float splitCycle = 0.5 + 0.5 * cos(time * 0.63 + 1.7);
  float transitionLife = sin(pulsePhase * 3.14159265) * pulse;
  float transitionDistance = length((p - focus) * vec2(0.82, 1.0));
  float transitionRadius = mix(0.04, 1.48, pulsePhase);
  float transitionWave = lineGlow(transitionDistance - transitionRadius, 0.1 + energy * 0.045) * transitionLife;

  vec2 flowA = vec2(
    fbm(p * 1.12 + vec2(time * 0.4, -time * 0.27)),
    fbm(p * 1.08 + vec2(-time * 0.31, time * 0.36) + 12.7)
  ) - 0.5;
  vec2 flowB = vec2(
    fbm(p * 2.04 + flowA * 1.7 + vec2(-time * 0.26, time * 0.18)),
    fbm(p * 1.86 - flowA * 1.45 + vec2(time * 0.22, time * 0.3) + 7.2)
  ) - 0.5;

  vec2 pointerDelta = p - pointer;
  float pointerDistance = length(pointerDelta);
  float pointerPressure = exp(-dot(pointerDelta, pointerDelta) * 2.15) * uPointerStrength;
  float pointerGuard = smoothstep(0.055, 0.2, pointerDistance);
  vec2 pointerTangent = vec2(-pointerDelta.y, pointerDelta.x) / (0.24 + pointerDistance);
  vec2 transitionDirection = normalize(p - focus + vec2(0.001, 0.001));
  vec2 q = p;
  q += flowA * (0.24 + uMorph * 0.22 + energy * 0.1);
  q += flowB * (0.11 + uMorph * 0.11);
  q += pointerTangent * pointerPressure * pointerGuard * 0.045;
  q += flowB * pointerPressure * 0.018;
  q += transitionDirection * transitionWave * (0.12 + uMorph * 0.11);

  vec2 c1 = focus * 0.42 + vec2(-0.34 + sin(time * 0.73) * 0.17, 0.08 + cos(time * 0.51) * 0.13);
  vec2 c2 = focus * 0.62 + vec2(0.23 + cos(time * 0.57) * 0.19, -0.13 + sin(time * 0.67) * 0.16);
  vec2 c3 = vec2(-0.06 + sin(time * 0.39) * 0.32, 0.28 + cos(time * 0.59) * 0.16);
  vec2 c4 = vec2(0.42 + cos(time * 0.41) * 0.21, 0.18 + sin(time * 0.54) * 0.21);
  vec2 c5 = vec2(-0.5 + sin(time * 0.36) * 0.17, -0.28 + cos(time * 0.49) * 0.2);

  float matter = 0.0;
  matter += metaball(q, c1, 0.33 + sin(time * 0.76) * 0.045 + morphCycle * 0.045);
  matter += metaball(q, c2, 0.29 + cos(time * 0.68) * 0.048 + (1.0 - morphCycle) * 0.05);
  matter += metaball(q, c3, 0.24 + splitCycle * 0.08) * mix(0.76, 1.08, morphCycle);
  matter += metaball(q, c4, 0.27 + (1.0 - splitCycle) * 0.075);
  matter += metaball(q, c5, 0.27 + morphCycle * 0.065);
  matter += metaball(q, focus, 0.19 + transitionLife * 0.12);
  matter += (fbm(q * 1.7 - flowB * 1.2 + vec2(time * 0.07, -time * 0.052)) - 0.48) * (0.72 + uMorph * 0.5);
  matter += transitionWave * (0.24 + uMorph * 0.18);

  float body = smoothstep(1.02, 1.82, matter);
  float innerBody = smoothstep(1.55, 2.8, matter);
  float membrane = lineGlow(matter - 1.42, 0.13 + energy * 0.025);
  float outerMembrane = lineGlow(matter - 1.04, 0.075);

  vec2 tissueUv = q * vec2(2.45, 2.12) + flowB * 1.4;
  float tissue = fbm(tissueUv + vec2(time * 0.21, -time * 0.15));
  float fiber = ridged(q * vec2(6.2, 4.7) + flowA * 2.6 - vec2(time * 0.24, -time * 0.14));
  vec2 cells = cellular(q * vec2(3.35, 2.85) + flowA * 0.9 + vec2(time * 0.072, -time * 0.054));
  float cellSeam = 1.0 - smoothstep(0.025, 0.12, cells.y - cells.x);
  float charcoal = smoothstep(0.58, 0.91, fiber + cellSeam * 0.16);

  float bandCoordinate = matter * 0.92 + tissue * 0.54 + flowA.x * 0.24;
  float bandDistance = abs(fract(bandCoordinate * 2.35) - 0.5);
  float contourLines = 1.0 - smoothstep(0.028 + tissue * 0.012, 0.082 + tissue * 0.018, bandDistance);
  float contourBreak = smoothstep(0.34, 0.74, fbm(q * 1.48 - flowA * 1.3 + vec2(time * 0.14, -time * 0.1)));
  contourLines *= smoothstep(0.78, 1.22, matter) * (0.12 + contourBreak * 0.88) * (0.52 + body * 0.48);

  float pigmentFlow = fbm(q * 1.62 + flowA * 2.2 + vec2(-time * 0.22, time * 0.15));
  float chromaTide = 0.5 + 0.5 * sin(q.x * 2.7 - q.y * 1.8 + time * 0.92 + flowB.x * 3.4);
  float pigmentSplit = smoothstep(0.34, 0.7, pigmentFlow + flowB.y * 0.34 + sin(q.x * 2.4 - q.y * 1.7) * 0.08);
  pigmentSplit = mix(pigmentSplit, smoothstep(0.18, 0.82, chromaTide), 0.46);
  float pigmentPoolA = smoothstep(0.46, 0.76, fbm(q * 1.36 + flowB * 2.1 + vec2(time * 0.2, -time * 0.14))) * body;
  float pigmentPoolB = smoothstep(0.44, 0.74, fbm(q * 1.24 - flowA * 2.35 + vec2(-time * 0.17, time * 0.21) + 8.4)) * body;
  pigmentPoolA *= 1.0 - pigmentPoolB * 0.56;
  pigmentPoolB *= 1.0 - pigmentPoolA * 0.34;
  float rupture = smoothstep(0.64, 0.89, ridged(q * 2.72 + flowB * 1.8 - vec2(time * 0.15, time * 0.09))) * innerBody;
  float shadowCurrent = smoothstep(0.56, 0.82, fbm(q * 1.16 - flowB * 1.9 + vec2(time * 0.12, -time * 0.16) + 4.7)) * body;
  float wash = smoothstep(0.1, 0.92, body * 0.72 + membrane * 0.42 + tissue * 0.22);

  float focusDistance = length((p - focus) * vec2(0.82, 1.0));
  float focusAura = exp(-focusDistance * focusDistance * 1.8);
  float fieldAura = 1.0 - smoothstep(0.06, 1.35, length(p * vec2(0.56, 0.92)));

  vec3 color = mix(uInkColor * 0.58, uDeepColor * 0.82, 0.36 + fieldAura * 0.36);
  color += uDeepColor * (tissue * 0.16 + fieldAura * 0.1);

  float colorBreath = 0.5 + 0.5 * sin(time * 0.72 + tissue * 4.2);
  vec3 livingPigmentA = mix(uPigmentA, uHighlightColor, 0.05 + colorBreath * 0.14);
  vec3 livingPigmentB = mix(uPigmentB, uPigmentA, (1.0 - colorBreath) * 0.12);
  vec3 bodyColor = mix(livingPigmentA, livingPigmentB, pigmentSplit);
  bodyColor = mix(bodyColor, uDeepColor, 0.16 + charcoal * 0.13);
  color = mix(color, bodyColor * (0.46 + uIntensity * 0.37), wash * (0.35 + uIntensity * 0.31));
  color += livingPigmentA * pigmentPoolA * (0.055 + uBloom * 0.14);
  color += livingPigmentB * pigmentPoolB * (0.08 + uBloom * 0.22);
  color = mix(color, uInkColor * 0.62, rupture * (0.06 + uMorph * 0.12));
  color = mix(color, uDeepColor * 0.52, shadowCurrent * (0.1 + uMorph * 0.13));
  color += livingPigmentA * membrane * (0.16 + uBloom * 0.34);
  color += livingPigmentB * outerMembrane * (0.11 + uBloom * 0.26);
  color += mix(livingPigmentA, uHighlightColor, 0.58) * innerBody * tissue * (0.08 + uBloom * 0.17);

  float livingVeins = smoothstep(0.66, 0.94, fiber) * body;
  color = mix(color, uInkColor * 0.72, livingVeins * (0.2 + uContour * 0.28));
  color = mix(color, uDeepColor * 0.58, contourLines * (0.1 + uContour * 0.24));
  color += uHighlightColor * contourLines * membrane * (0.045 + uContour * 0.085);
  color += livingPigmentA * cellSeam * body * (0.025 + uContour * 0.06);

  float transitionBloom = lineGlow(transitionDistance - transitionRadius * 0.72, 0.24 + pulsePhase * 0.14) * transitionLife;
  color += mix(livingPigmentB, uHighlightColor, 0.48) * transitionWave * (0.18 + uBloom * 0.3);
  color += mix(livingPigmentA, livingPigmentB, pulsePhase) * transitionBloom * (0.05 + uBloom * 0.11);
  color += livingPigmentA * focusAura * (0.04 + uBloom * 0.085 + energy * 0.065);

  float pointerWash = pointerPressure * (0.42 + tissue * 0.58) * pointerGuard;
  color += mix(livingPigmentA, uHighlightColor, 0.34) * pointerWash * 0.018;

  float wetEdge = membrane * (0.5 + 0.5 * sin(fiber * 9.0 - time * 1.35));
  color += mix(livingPigmentA, uHighlightColor, 0.62) * wetEdge * (0.045 + uBloom * 0.12);
  float breathingLight = 0.5 + 0.5 * sin(time * 1.08 + tissue * 2.8);
  color += mix(livingPigmentA, livingPigmentB, tissue) * body * breathingLight * (0.025 + uBloom * 0.055);

  float grain = hash21(gl_FragCoord.xy + fract(uTime) * 173.0) - 0.5;
  color += grain * uGrain * 0.032;

  float vignette = 1.0 - smoothstep(0.16, 1.32, length(p * vec2(0.62, 0.94)));
  float edgeInk = mix(0.5, 1.0, vignette);
  float topQuiet = smoothstep(0.66, 1.0, uv.y);
  color *= edgeInk;
  color = mix(color, uInkColor * 0.56, topQuiet * 0.055);
  color = max(color, uInkColor * 0.3);
  color = 1.0 - exp(-color * (0.94 + uIntensity * 0.48));
  color = pow(color, vec3(0.92));

  gl_FragColor = vec4(color, 1.0);
}
`;

  var UNIFORM_NAMES = [
    "uTime",
    "uResolution",
    "uInkColor",
    "uDeepColor",
    "uPigmentA",
    "uPigmentB",
    "uHighlightColor",
    "uIntensity",
    "uMorph",
    "uContour",
    "uBloom",
    "uGrain",
    "uDrift",
    "uEnergy",
    "uPulse",
    "uPulsePhase",
    "uFocus",
    "uPointer",
    "uPointerStrength"
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function damp(current, target, delta, speed) {
    return current + (target - current) * (1 - Math.exp(-delta * (speed || 1)));
  }

  function parseColor(value, fallback) {
    var source = typeof value === "string" ? value.trim() : "";
    var match;
    var red;
    var green;
    var blue;

    if (/^#[0-9a-f]{3}$/i.test(source)) {
      red = parseInt(source.charAt(1) + source.charAt(1), 16);
      green = parseInt(source.charAt(2) + source.charAt(2), 16);
      blue = parseInt(source.charAt(3) + source.charAt(3), 16);
    } else if (/^#[0-9a-f]{6}$/i.test(source)) {
      red = parseInt(source.slice(1, 3), 16);
      green = parseInt(source.slice(3, 5), 16);
      blue = parseInt(source.slice(5, 7), 16);
    } else {
      match = source.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
      if (match) {
        red = Number(match[1]);
        green = Number(match[2]);
        blue = Number(match[3]);
      }
    }

    if (![red, green, blue].every(Number.isFinite)) {
      return fallback ? fallback.slice() : [0, 0, 0];
    }

    return [red / 255, green / 255, blue / 255];
  }

  function copyField(field) {
    var source = field || {};
    return {
      intensity: clamp(Number.isFinite(source.intensity) ? source.intensity : DEFAULT_FIELD.intensity, 0, 1.5),
      morph: clamp(Number.isFinite(source.morph) ? source.morph : DEFAULT_FIELD.morph, 0, 1.5),
      contour: clamp(Number.isFinite(source.contour) ? source.contour : DEFAULT_FIELD.contour, 0, 1.5),
      bloom: clamp(Number.isFinite(source.bloom) ? source.bloom : DEFAULT_FIELD.bloom, 0, 1.5),
      grain: clamp(Number.isFinite(source.grain) ? source.grain : DEFAULT_FIELD.grain, 0, 1.5),
      drift: clamp(Number.isFinite(source.drift) ? source.drift : DEFAULT_FIELD.drift, 0, 1.5)
    };
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(shader) || "Unknown shader error";
      gl.deleteShader(shader);
      throw new Error("ARTIST STAGE Series shader failed: " + log);
    }

    return shader;
  }

  function createProgram(gl) {
    var program = gl.createProgram();
    var vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    var fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(program) || "Unknown program error";
      gl.deleteProgram(program);
      throw new Error("ARTIST STAGE Series program failed: " + log);
    }

    return program;
  }

  function createCanvas() {
    var canvas = document.createElement("canvas");
    canvas.className = "artist-stage-series-field__canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    return canvas;
  }

  function LivingPigmentField(target, options) {
    this.options = options || {};
    this.container = typeof target === "string" ? document.querySelector(target) : target;

    if (!this.container) {
      throw new Error("ARTIST STAGE Series field target was not found.");
    }

    this.canvas = createCanvas();
    this.gl = this.canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance"
    }) || this.canvas.getContext("experimental-webgl");

    if (!this.gl) {
      throw new Error("WebGL is not available in this browser.");
    }

    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.maxDpr = Number.isFinite(this.options.maxDpr) ? Math.max(1, this.options.maxDpr) : 1.4;
    this.reducedMotion = Boolean(this.options.reducedMotion);
    this.pointerEnabled = this.options.pointer !== false;
    this.time = 0;
    this.running = false;
    this.raf = 0;
    this.lastFrame = 0;
    this.lastReducedFrame = 0;
    this.resumeAfterVisibility = false;
    this.energy = 0;
    this.targetEnergy = 0;
    this.pulse = 0;
    this.pulsePhase = 1;
    this.pulseStrength = 0;
    this.focus = { x: 0.57, y: 0.5, targetX: 0.57, targetY: 0.5 };
    this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, strength: 0, targetStrength: 0 };

    var palette = Object.assign({}, DEFAULT_PALETTE, this.options.palette || {});
    this.currentPalette = {
      ink: parseColor(palette.ink),
      deep: parseColor(palette.deep),
      pigmentA: parseColor(palette.pigmentA),
      pigmentB: parseColor(palette.pigmentB),
      highlight: parseColor(palette.highlight)
    };
    this.targetPalette = {
      ink: this.currentPalette.ink.slice(),
      deep: this.currentPalette.deep.slice(),
      pigmentA: this.currentPalette.pigmentA.slice(),
      pigmentB: this.currentPalette.pigmentB.slice(),
      highlight: this.currentPalette.highlight.slice()
    };
    this.currentField = copyField(Object.assign({}, DEFAULT_FIELD, this.options.field || {}));
    this.targetField = copyField(this.currentField);

    this._onFrame = this._onFrame.bind(this);
    this._onResize = this.resize.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    this._initGL();
    this._bindEvents();
    this.resize();
    this.play();
  }

  LivingPigmentField.prototype._initGL = function () {
    var gl = this.gl;
    this.program = createProgram(gl);
    this.uniforms = {};
    UNIFORM_NAMES.forEach(function (name) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }, this);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(this.program);
    var position = gl.getAttribLocation(this.program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0.005, 0.008, 0.006, 1);
  };

  LivingPigmentField.prototype._bindEvents = function () {
    if (this.pointerEnabled) {
      window.addEventListener("pointermove", this._onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", this._onPointerLeave, { passive: true });
    }

    if (typeof ResizeObserver === "function") {
      this.resizeObserver = new ResizeObserver(this._onResize);
      this.resizeObserver.observe(this.container);
    }

    window.addEventListener("resize", this._onResize, { passive: true });
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  };

  LivingPigmentField.prototype._onPointerMove = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var nextX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    var nextY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    var velocity = Math.hypot(nextX - this.pointer.targetX, nextY - this.pointer.targetY);
    this.pointer.targetX = nextX;
    this.pointer.targetY = nextY;
    this.pointer.targetStrength = this.reducedMotion
      ? 0
      : Math.max(this.pointer.targetStrength, clamp(velocity * 10, 0.12, 0.72));
  };

  LivingPigmentField.prototype._onPointerLeave = function () {
    this.pointer.targetStrength = 0;
  };

  LivingPigmentField.prototype._onVisibilityChange = function () {
    if (document.hidden) {
      this.resumeAfterVisibility = this.running;
      this.pause();
    } else if (this.resumeAfterVisibility) {
      this.resumeAfterVisibility = false;
      this.play();
    }
  };

  LivingPigmentField.prototype.resize = function () {
    var rect = this.container.getBoundingClientRect();
    var dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), this.maxDpr);
    var width = Math.max(1, Math.round(rect.width * dpr));
    var height = Math.max(1, Math.round(rect.height * dpr));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, width, height);
    return this;
  };

  LivingPigmentField.prototype._update = function (delta) {
    var paletteSpeed = this.reducedMotion ? 2.8 : 1.08;
    var fieldSpeed = this.reducedMotion ? 3.4 : 1.25;
    var keys = ["ink", "deep", "pigmentA", "pigmentB", "highlight"];
    var fieldKeys = ["intensity", "morph", "contour", "bloom", "grain", "drift"];

    this.time += delta * (this.reducedMotion ? 0.035 : 0.72);

    keys.forEach(function (key) {
      for (var channel = 0; channel < 3; channel++) {
        this.currentPalette[key][channel] = damp(
          this.currentPalette[key][channel],
          this.targetPalette[key][channel],
          delta,
          paletteSpeed
        );
      }
    }, this);

    fieldKeys.forEach(function (key) {
      this.currentField[key] = damp(this.currentField[key], this.targetField[key], delta, fieldSpeed);
    }, this);

    this.focus.x = damp(this.focus.x, this.focus.targetX, delta, 1.45);
    this.focus.y = damp(this.focus.y, this.focus.targetY, delta, 1.45);
    this.pointer.x = damp(this.pointer.x, this.pointer.targetX, delta, 2.1);
    this.pointer.y = damp(this.pointer.y, this.pointer.targetY, delta, 2.1);
    this.pointer.strength = damp(
      this.pointer.strength,
      this.reducedMotion ? 0 : this.pointer.targetStrength,
      delta,
      2.1
    );
    this.pointer.targetStrength *= Math.exp(-delta * 2.4);
    this.energy = damp(this.energy, this.targetEnergy, delta, 2.6);
    this.targetEnergy *= Math.exp(-delta * 1.7);

    if (this.pulsePhase < 1) {
      this.pulsePhase = Math.min(1, this.pulsePhase + delta / (this.reducedMotion ? 0.18 : 2.9));
      this.pulse = Math.sin(this.pulsePhase * Math.PI) * this.pulseStrength;
      if (this.pulsePhase >= 1) this.pulseStrength = 0;
    } else {
      this.pulse = 0;
    }
  };

  LivingPigmentField.prototype._draw = function () {
    var gl = this.gl;
    var uniforms = this.uniforms;
    var palette = this.currentPalette;
    var field = this.currentField;

    gl.useProgram(this.program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.uTime, this.time);
    gl.uniform2f(uniforms.uResolution, this.width, this.height);
    gl.uniform3fv(uniforms.uInkColor, palette.ink);
    gl.uniform3fv(uniforms.uDeepColor, palette.deep);
    gl.uniform3fv(uniforms.uPigmentA, palette.pigmentA);
    gl.uniform3fv(uniforms.uPigmentB, palette.pigmentB);
    gl.uniform3fv(uniforms.uHighlightColor, palette.highlight);
    gl.uniform1f(uniforms.uIntensity, field.intensity);
    gl.uniform1f(uniforms.uMorph, field.morph);
    gl.uniform1f(uniforms.uContour, field.contour);
    gl.uniform1f(uniforms.uBloom, field.bloom);
    gl.uniform1f(uniforms.uGrain, field.grain);
    gl.uniform1f(uniforms.uDrift, field.drift);
    gl.uniform1f(uniforms.uEnergy, this.energy);
    gl.uniform1f(uniforms.uPulse, this.pulse);
    gl.uniform1f(uniforms.uPulsePhase, this.pulsePhase);
    gl.uniform2f(uniforms.uFocus, this.focus.x, this.focus.y);
    gl.uniform2f(uniforms.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(uniforms.uPointerStrength, this.pointer.strength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  LivingPigmentField.prototype._onFrame = function (now) {
    if (this.reducedMotion && now - this.lastReducedFrame < 100) {
      if (this.running) this.raf = window.requestAnimationFrame(this._onFrame);
      return;
    }

    var seconds = now * 0.001;
    var delta = this.lastFrame ? clamp(seconds - this.lastFrame, 0.001, 0.1) : 0.016;
    this.lastFrame = seconds;
    this.lastReducedFrame = now;
    this._update(delta);
    this._draw();

    if (this.running) this.raf = window.requestAnimationFrame(this._onFrame);
  };

  LivingPigmentField.prototype.play = function () {
    if (!this.running) {
      this.running = true;
      this.lastFrame = 0;
      this.raf = window.requestAnimationFrame(this._onFrame);
    }
    return this;
  };

  LivingPigmentField.prototype.pause = function () {
    this.running = false;
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = 0;
    return this;
  };

  LivingPigmentField.prototype.setPalette = function (palette) {
    var next = palette || {};
    this.targetPalette = {
      ink: parseColor(next.ink, this.targetPalette.ink),
      deep: parseColor(next.deep, this.targetPalette.deep),
      pigmentA: parseColor(next.pigmentA, this.targetPalette.pigmentA),
      pigmentB: parseColor(next.pigmentB, this.targetPalette.pigmentB),
      highlight: parseColor(next.highlight, this.targetPalette.highlight)
    };
    return this;
  };

  LivingPigmentField.prototype.setField = function (field) {
    this.targetField = copyField(Object.assign({}, this.targetField, field || {}));
    return this;
  };

  LivingPigmentField.prototype.setFocus = function (focus) {
    if (!focus) return this;
    this.focus.targetX = clamp(Number(focus.x) || 0.5, 0.04, 0.96);
    this.focus.targetY = clamp(Number(focus.y) || 0.5, 0.04, 0.96);
    return this;
  };

  LivingPigmentField.prototype.setEnergy = function (energy) {
    this.targetEnergy = Math.max(this.targetEnergy, clamp(Number(energy) || 0, 0, 1));
    return this;
  };

  LivingPigmentField.prototype.pulseField = function (strength) {
    if (this.reducedMotion) return this;
    this.pulseStrength = clamp(Number(strength) || 0.8, 0, 1);
    this.pulsePhase = 0;
    this.pulse = 0;
    return this;
  };

  LivingPigmentField.prototype.setReducedMotion = function (reducedMotion) {
    this.reducedMotion = Boolean(reducedMotion);
    if (this.reducedMotion) {
      this.pointer.targetStrength = 0;
      this.targetEnergy = 0;
    }
    return this;
  };

  LivingPigmentField.prototype.destroy = function () {
    this.pause();
    if (this.pointerEnabled) {
      window.removeEventListener("pointermove", this._onPointerMove);
      document.documentElement.removeEventListener("pointerleave", this._onPointerLeave);
    }
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  };

  global.ArtistStageSeriesField = {
    version: VERSION,
    mount: function (target, options) {
      return new LivingPigmentField(target, options || {});
    }
  };
})(typeof window !== "undefined" ? window : this);
