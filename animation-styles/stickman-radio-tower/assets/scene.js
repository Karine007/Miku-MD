(() => {
  // src/scene.js
  var W = 1920;
  var H = 1080;
  var clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  var lerp = (a, b, k) => a + (b - a) * k;
  var ease = (k) => k * k * (3 - 2 * k);
  var seg = (t, a, b) => clamp((t - a) / (b - a));
  var INK = "#23201d";
  function create(canvas) {
    const ctx = canvas.getContext("2d");
    let rs = 1;
    const rnd = () => {
      rs = rs * 16807 % 2147483647;
      return (rs - 1) / 2147483646;
    };
    let boil = 0;
    const J = (a = 1.6) => (rnd() - 0.5) * 2 * a;
    const paper = document.createElement("canvas");
    paper.width = W;
    paper.height = H;
    {
      const g = paper.getContext("2d");
      const d = g.createImageData(W, H);
      let s = 7;
      for (let i = 0; i < d.data.length; i += 4) {
        s = s * 16807 % 2147483647;
        const v = 225 + s % 30;
        d.data[i] = v;
        d.data[i + 1] = v - 4;
        d.data[i + 2] = v - 12;
        d.data[i + 3] = 255;
      }
      g.putImageData(d, 0, 0);
      g.globalAlpha = 0.05;
      for (let k = 0; k < 400; k++) {
        s = s * 16807 % 2147483647;
        g.fillStyle = "#7a6a55";
        g.beginPath();
        g.arc(s % W, (s >> 3) % H, 1 + s % 5, 0, 7);
        g.fill();
      }
    }
    function path(pts, { close = false, fill = null, stroke = INK, w = 4, j = 1.4, alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const P = pts.map(([x, y]) => [x + J(j), y + J(j)]);
      if (fill) {
        ctx.beginPath();
        P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.beginPath();
        const Q = close ? [...P, P[0]] : P;
        Q.forEach(([x, y], i) => {
          if (!i) {
            ctx.moveTo(x, y);
            return;
          }
          const [px, py] = Q[i - 1];
          ctx.quadraticCurveTo((px + x) / 2 + J(j), (py + y) / 2 + J(j), x, y);
        });
        ctx.stroke();
      }
      ctx.restore();
    }
    const line = (x1, y1, x2, y2, w = 4, stroke = INK, j = 1.2) => path([[x1, y1], [x2, y2]], { w, stroke, j });
    const rect = (x, y, w, h, fill, o = {}) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { close: true, fill, ...o });
    function circle(x, y, r, fill, o = {}) {
      const n = Math.max(10, Math.round(r / 2.5)), pts = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2;
        pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      }
      path(pts, { close: true, fill, j: Math.min(1.4, r / 12), ...o });
    }
    function text(s, x, y, size, { font = "Kalam", color = INK, align = "center", rot = 0, alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot + J(4e-3));
      ctx.font = `${size}px ${font}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.fillText(s, 0, 0);
      ctx.restore();
    }
    function wash(x, y, w, h, col, a = 0.5) {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
    const POSES = {
      stand: { lean: 0, head: 0, aL: [0.15, 0.1], aR: [-0.15, -0.1], lL: [0.08, 0], lR: [-0.08, 0] },
      sit: { lean: -0.05, head: 0, aL: [0.5, 1.2], aR: [0.4, 1.3], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      mic: { lean: 0.15, head: 0.05, aL: [0.9, 1.4], aR: [0.4, 1.2], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      phone: { lean: 0.05, head: -0.1, aL: [0.4, 1], aR: [2.4, 2.4], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      think: { lean: 0, head: 0.15, aL: [0.3, 2.6], aR: [0.5, 1.6], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      surprised: { lean: -0.18, head: -0.15, aL: [1.6, 0.6], aR: [1.4, 0.7], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      listen: { lean: 0.1, head: 0.2, aL: [2.5, 2.6], aR: [0.5, 1.2], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      cry: { lean: 0.35, head: 0.55, aL: [1.3, 2.5], aR: [1.2, 2.6], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
      scared: { lean: -0.15, head: -0.1, aL: [0.9, 1.6], aR: [0.8, 1.7], lL: [0.2, 0], lR: [-0.25, 0] },
      look: { lean: 0.05, head: 0.1, aL: [0.1, 0.1], aR: [-0.1, 0.2], lL: [0.06, 0], lR: [-0.06, 0] },
      binoculars: { lean: 0.08, head: 0, aL: [1.6, 1.4], aR: [1.4, 1.6], lL: [0.08, 0], lR: [-0.08, 0] },
      push: { lean: 0.5, head: 0.2, aL: [1.7, 0.2], aR: [1.5, 0.3], lL: [-0.5, 0.1], lR: [0.4, 0.4] },
      peek: { lean: 0.25, head: 0.25, aL: [1.2, 0.3], aR: [0.9, 1.4], lL: [0.1, 0], lR: [-0.25, 0] },
      reach: { lean: 0.1, head: -0.1, aL: [1.5, 0.2], aR: [0.2, 0.1], lL: [0.08, 0], lR: [-0.08, 0] },
      laugh: { lean: -0.2, head: -0.35, aL: [2.6, 0.3], aR: [2.4, 0.4], lL: [0.2, 0], lR: [-0.2, 0] },
      carry: { lean: 0.15, head: 0, aL: [0.9, 0.9], aR: [0.8, 1], lL: [0.1, 0], lR: [-0.1, 0] },
      pour: { lean: 0.3, head: 0.3, aL: [1.4, 0.8], aR: [1, 1.2], lL: [0.2, 0], lR: [-0.2, 0.2] },
      climb: { lean: 0, head: -0.4, aL: [3, 0.05], aR: [2.9, 0.05], lL: [0.4, -0.6], lR: [-0.1, -0.3] },
      sneak: { lean: 0.35, head: -0.2, aL: [0.6, 0.9], aR: [0.4, 1], lL: [0.6, -1], lR: [-0.2, -0.6] },
      freeze: { lean: 0, head: 0, aL: [0.05, 0], aR: [-0.05, 0], lL: [0.02, 0], lR: [-0.02, 0] },
      hug: { lean: 0.25, head: 0.2, aL: [1.5, 1.4], aR: [1.4, 1.5], lL: [0.1, 0], lR: [-0.15, 0] },
      zombie: { lean: 0.15, head: 0.35, aL: [1.5, 0.15], aR: [1.3, 0.25], lL: [0.12, 0], lR: [-0.15, 0.1] },
      wave: { lean: 0, head: -0.1, aL: [2.7, 0.6], aR: [0.2, 0.1], lL: [0.08, 0], lR: [-0.08, 0] }
    };
    function mixPose(a, b, k) {
      const o = {};
      for (const key of Object.keys(a)) o[key] = Array.isArray(a[key]) ? a[key].map((v, i) => lerp(v, b[key][i], k)) : lerp(a[key], b[key] ?? 0, k);
      return o;
    }
    function walkPose(ph, base = POSES.stand, amt = 1) {
      const s = Math.sin(ph) * amt;
      return { ...base, lL: [0.55 * s, Math.max(0, -s) * 0.7], lR: [-0.55 * s, Math.max(0, s) * 0.7], aL: [-0.45 * s + base.aL[0] * 0.3, 0.3], aR: [0.45 * s + base.aR[0] * 0.3, 0.3], bob: Math.abs(Math.cos(ph)) * 4 * amt };
    }
    const LOOK = {
      remi: { head: "#fffdf7", glasses: 1, phones: 1, scarf: "#c8452c", hair: "tuft" },
      tess: { head: "#fffdf7", pony: "#7a4a2a", coat: "#e2b53a" },
      kid: { head: "#fffdf7", cap: "#3b6fb6" },
      pilot: { head: "#fffdf7", helmet: "#6f7a5a" },
      zombie: { head: "#b9c4a2", zombie: 1, shirt: "#7d7364" },
      survivor: { head: "#fffdf7" }
    };
    function figure(x, y, s, pose, look = LOOK.remi, { dir = 1, face = "neutral", talk = 0, ink = INK, t = 0, prop = null } = {}) {
      const L = { thigh: 62, shin: 60, torso: 100, ua: 50, fa: 48, head: 36 };
      ctx.save();
      ctx.translate(x, y - (pose.bob || 0) * s);
      ctx.scale(s * dir, s);
      const w = 5.5 / Math.max(0.6, s) * Math.min(1, s * 1.2) + 1.5;
      const lw = Math.max(3.2, 5.5);
      const hipY = pose.sit ? -L.shin - 6 : -(L.thigh + L.shin) * (Math.cos(pose.lL[0]) * 0.5 + Math.cos(pose.lR[0]) * 0.5) * 0.98;
      const hip = [0, hipY];
      const leg = (hipA, kneeA) => {
        const k = [hip[0] + Math.sin(hipA) * L.thigh, hip[1] + Math.cos(hipA) * L.thigh];
        const f = [k[0] + Math.sin(hipA + kneeA) * L.shin, k[1] + Math.cos(hipA + kneeA) * L.shin];
        path([hip, k, f], { w: lw, stroke: ink });
        line(f[0], f[1], f[0] + 14, f[1] + 1, lw, ink);
      };
      leg(...pose.lL);
      leg(...pose.lR);
      const neck = [hip[0] + Math.sin(pose.lean) * L.torso, hip[1] - Math.cos(pose.lean) * L.torso];
      if (look.coat) path([[hip[0] - 16, hip[1] + 8], [neck[0] - 12, neck[1] + 12], [neck[0] + 12, neck[1] + 12], [hip[0] + 16, hip[1] + 8]], { close: true, fill: look.coat, w: 3, stroke: ink });
      if (look.shirt) path([[hip[0] - 13, hip[1]], [neck[0] - 10, neck[1] + 10], [neck[0] + 10, neck[1] + 10], [hip[0] + 13, hip[1] + 4], [hip[0], hip[1] - 6]], { close: true, fill: look.shirt, w: 2.5, stroke: ink, alpha: 0.9 });
      line(hip[0], hip[1], neck[0], neck[1], lw, ink);
      const sh = [lerp(hip[0], neck[0], 0.85), lerp(hip[1], neck[1], 0.85)];
      const hands = [];
      const arm = (a, e, back) => {
        const el = [sh[0] + Math.sin(a + pose.lean) * L.ua, sh[1] + Math.cos(a + pose.lean) * L.ua];
        const h = [el[0] + Math.sin(a + e + pose.lean) * L.fa, el[1] + Math.cos(a + e + pose.lean) * L.fa];
        path([sh, el, h], { w: lw, stroke: ink });
        hands.push(h);
      };
      arm(...pose.aR, 1);
      arm(...pose.aL, 0);
      if (prop) prop(hands, ctx);
      const ha = pose.lean + pose.head;
      const hc = [neck[0] + Math.sin(ha) * (L.head + 4), neck[1] - Math.cos(ha) * (L.head + 4)];
      if (look.scarf) {
        path([[neck[0] - 16, neck[1] + 6], [neck[0] + 18, neck[1] + 2], [neck[0] + 14, neck[1] + 14], [neck[0] - 14, neck[1] + 16]], { close: true, fill: look.scarf, w: 3, stroke: ink });
        path([[neck[0] - 6, neck[1] + 12], [neck[0] - 18, neck[1] + 44 + Math.sin(t * 3) * 3], [neck[0] - 4, neck[1] + 42]], { close: true, fill: look.scarf, w: 3, stroke: ink });
      }
      ctx.save();
      ctx.translate(hc[0], hc[1]);
      ctx.rotate(ha * 0.6);
      if (look.pony) {
        path([[-30, -18], [-58, 0 + Math.sin(t * 4) * 3], [-50, 22], [-28, 4]], { close: true, fill: look.pony, w: 3, stroke: ink });
      }
      circle(0, 0, L.head, look.head, { w: 5, stroke: ink });
      if (look.zombie) {
        path([[-30, -22], [-12, -40], [4, -30], [20, -42], [32, -20]], { w: 4, stroke: ink });
        circle(16, 8, 4, "#8a3b2a", { stroke: null });
      }
      if (look.hair === "tuft") path([[-8, -35], [0, -48], [6, -36], [14, -46], [16, -33]], { w: 4, stroke: ink });
      if (look.cap) {
        path([[-34, -8], [-30, -34], [0, -42], [28, -30], [34, -10]], { close: true, fill: look.cap, w: 4, stroke: ink });
        path([[20, -12], [58, -8], [34, -2]], { close: true, fill: look.cap, w: 4, stroke: ink });
      }
      if (look.helmet) {
        path([[-38, 4], [-36, -30], [0, -46], [36, -30], [38, 4]], { close: true, fill: look.helmet, w: 4, stroke: ink });
        rect(4, -18, 32, 16, "#9fd0e8", { w: 3, stroke: ink });
      }
      const ex = 12, ey = -6;
      if (face === "cry") {
        path([[ex - 12, ey], [ex - 4, ey + 3]], { w: 4, stroke: ink });
        path([[ex + 8, ey], [ex + 16, ey + 3]], { w: 4, stroke: ink });
        circle(ex - 6, ey + 16 + t * 30 % 12, 3, "#6fb4e0", { stroke: null });
      } else if (face === "happy") {
        path([[ex - 12, ey + 2], [ex - 7, ey - 4], [ex - 2, ey + 2]], { w: 4, stroke: ink });
        path([[ex + 6, ey + 2], [ex + 11, ey - 4], [ex + 16, ey + 2]], { w: 4, stroke: ink });
      } else if (look.zombie) {
        circle(ex - 6, ey, 6, "#fff", { w: 3, stroke: ink });
        circle(ex + 12, ey + 1, 5, "#fff", { w: 3, stroke: ink });
      } else {
        const big = face === "surprised" || face === "scared" ? 1.6 : 1;
        circle(ex - 6, ey, 3.6 * big, ink, { stroke: null });
        circle(ex + 12, ey, 3.6 * big, ink, { stroke: null });
      }
      if (look.glasses) {
        circle(ex - 6, ey, 11, null, { w: 3, stroke: ink });
        circle(ex + 13, ey, 10, null, { w: 3, stroke: ink });
        line(ex + 5, ey, ex + 3, ey, 3, ink);
        line(ex - 17, ey - 2, -26, -10, 3, ink);
      }
      const brow = { worried: [4, -4], scared: [5, -5], surprised: [-6, -6], think: [-2, 3], cry: [5, -5] }[face] || [0, 0];
      line(ex - 14, ey - 16 + brow[0] * 0.4, ex - 1, ey - 17 + brow[1] * 0.4, 3.5, ink);
      line(ex + 6, ey - 17 + brow[1] * 0.4, ex + 19, ey - 16 + brow[0] * 0.4, 3.5, ink);
      const my = ey + 20;
      if (talk > 0) {
        const o = 3 + Math.abs(Math.sin(t * 17)) * 7 * talk;
        circle(ex + 4, my, o * 0.8, "#5b2a22", { w: 3, stroke: ink, j: 0.5 });
      } else if (face === "happy") path([[ex - 8, my - 3], [ex + 4, my + 7], [ex + 16, my - 3]], { w: 4, stroke: ink });
      else if (face === "scared" || face === "surprised") circle(ex + 4, my + 2, 6, "#5b2a22", { w: 3, stroke: ink });
      else if (face === "worried" || face === "cry") path([[ex - 6, my + 4], [ex + 4, my - 1], [ex + 14, my + 4]], { w: 4, stroke: ink });
      else if (look.zombie) path([[ex - 8, my], [ex, my + 4], [ex + 8, my - 1], [ex + 16, my + 3]], { w: 4, stroke: ink });
      else line(ex - 4, my, ex + 12, my, 4, ink);
      ctx.restore();
      if (look.phones) {
        path([[neck[0] - 20, neck[1] - 2], [neck[0], neck[1] + 12], [neck[0] + 22, neck[1] - 2]], { w: 5, stroke: "#3a3a3a" });
        circle(neck[0] - 22, neck[1] - 2, 9, "#4b4f57", { w: 3, stroke: ink });
        circle(neck[0] + 23, neck[1] - 2, 9, "#4b4f57", { w: 3, stroke: ink });
      }
      ctx.restore();
      return hands.map(([hx, hy]) => [x + hx * s * dir, y + hy * s - (pose.bob || 0) * s]);
    }
    const MOOD = { day: ["#fff6e0", 0], night: ["#1d2a4a", 0.42], dark: ["#1a2233", 0.38], alarm: ["#5a0d0d", 0.35], storm: ["#2a3442", 0.45], dawn: ["#f2a874", 0.18], dusk: ["#6a3b5a", 0.3] };
    function mood(m, t) {
      const [c, a] = MOOD[m] || MOOD.day;
      if (!a) return;
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 1;
      ctx.fillStyle = c;
      ctx.globalAlpha = a + 0.25;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    function flashlight(x, y, r) {
      ctx.save();
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(5,8,14,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    function skyline(x0, y0, w, h, { light = "night", fire = 0, t = 0, glowTower = 0, towerX = null } = {}) {
      const skyCols = { night: ["#1b2440", "#3a3f63"], day: ["#bfd9e6", "#e9efe4"], dawn: ["#f3b98a", "#f7e1b8"], dusk: ["#5b4870", "#d98b6a"], storm: ["#4c5662", "#79828b"], dark: ["#10131c", "#1d2333"], alarm: ["#1b2440", "#3a3f63"] }[light] || ["#bfd9e6", "#e9efe4"];
      const g = ctx.createLinearGradient(0, y0, 0, y0 + h);
      g.addColorStop(0, skyCols[0]);
      g.addColorStop(1, skyCols[1]);
      ctx.fillStyle = g;
      ctx.fillRect(x0, y0, w, h);
      if (light === "night" || light === "dark" || light === "alarm") {
        rs = 99;
        for (let i = 0; i < 40; i++) circle(x0 + rnd() * w, y0 + rnd() * h * 0.4, 1.5, "#f4f0d8", { stroke: null });
        rs = boil * 977 + 5;
      }
      rs = 4242;
      const bld = [];
      for (let x = x0 - 20; x < x0 + w; ) {
        const bw = 60 + rnd() * 90, bh = h * (0.2 + rnd() * 0.45);
        bld.push([x, bw, bh, rnd()]);
        x += bw + 6;
      }
      rs = boil * 977 + 9;
      const isNight = ["night", "dark", "alarm", "dusk"].includes(light);
      const bc = isNight ? "#2b3150" : light === "storm" ? "#5d6670" : "#8d9aa3";
      bld.forEach(([x, bw, bh, r], i) => {
        rect(x, y0 + h - bh, bw, bh + 4, bc, { w: 3 });
        rs = 7e3 + i * 31;
        for (let wy = y0 + h - bh + 14; wy < y0 + h - 16; wy += 26) for (let wx = x + 10; wx < x + bw - 14; wx += 22) {
          const on = rnd();
          if (isNight ? on > 0.88 : on > 0.6) rect(wx, wy, 10, 12, isNight ? "#f2c66a" : "#c8d6dd", { stroke: null, j: 0.4 });
        }
        rs = boil * 977 + i;
      });
      if (towerX !== null) {
        const tx = x0 + towerX, th = h * 0.92, tw = 120;
        rect(tx, y0 + h - th, tw, th + 4, isNight ? "#262b45" : "#7f8c96", { w: 3.5 });
        path([[tx + tw / 2, y0 + h - th], [tx + tw / 2, y0 + h - th - 110]], { w: 5 });
        circle(tx + tw / 2, y0 + h - th - 112, 6, glowTower > 0.5 || Math.floor(t * 1.5) % 2 ? "#ff4b3a" : "#552", { w: 2 });
        rs = 31337;
        for (let wy = y0 + h - th + 16; wy < y0 + h - 14; wy += 24) for (let wx = tx + 12; wx < tx + tw - 12; wx += 20) {
          const k = rnd();
          const lit = glowTower > (wy - (y0 + h - th)) / th * 0.7 + k * 0.3;
          if (lit || k > 0.97) rect(wx, wy, 10, 12, lit ? "#ffe9a0" : "#f2c66a", { stroke: null, j: 0.3 });
        }
        rs = boil * 977 + 3;
        if (glowTower > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const gg = ctx.createRadialGradient(tx + tw / 2, y0 + h - th * 0.7, 10, tx + tw / 2, y0 + h - th * 0.6, th * 0.8);
          gg.addColorStop(0, `rgba(255,220,140,${0.35 * glowTower})`);
          gg.addColorStop(1, "rgba(255,220,140,0)");
          ctx.fillStyle = gg;
          ctx.fillRect(x0, y0, w, h);
          ctx.restore();
          const sa = -Math.PI / 2 + Math.sin(t * 0.9) * 0.6;
          ctx.save();
          ctx.globalAlpha = 0.25 * glowTower;
          ctx.fillStyle = "#fff3c0";
          ctx.beginPath();
          ctx.moveTo(tx + tw / 2, y0 + h - th);
          ctx.lineTo(tx + tw / 2 + Math.cos(sa - 0.06) * 2e3, y0 + h - th + Math.sin(sa - 0.06) * 2e3);
          ctx.lineTo(tx + tw / 2 + Math.cos(sa + 0.06) * 2e3, y0 + h - th + Math.sin(sa + 0.06) * 2e3);
          ctx.fill();
          ctx.restore();
        }
      }
      if (fire > 0) {
        [[0.18, 0.9], [0.47, 0.6], [0.72, 1], [0.88, 0.5]].forEach(([fx, s], i) => {
          if (s > fire + 0.3) return;
          const X = x0 + w * fx, Y = y0 + h - 40;
          for (let k = 0; k < 6; k++) {
            const yy = Y - 60 - k * 70 - (t * 30 + k * 40) % 70;
            circle(X + Math.sin(t + k + i) * 20 + k * 14, yy, 30 + k * 12, isNight ? "#3d3b45" : "#7d7a7a", { stroke: null, alpha: 0.5 - k * 0.06 });
          }
          for (let k = 0; k < 4; k++) path([[X - 30 + k * 18, Y], [X - 20 + k * 18 + J(8), Y - 40 - Math.abs(Math.sin(t * 9 + k)) * 40], [X - 8 + k * 18, Y]], { close: true, fill: k % 2 ? "#f7b538" : "#e2552c", stroke: null, j: 3 });
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const fg = ctx.createRadialGradient(X, Y, 5, X, Y, 160);
          fg.addColorStop(0, "rgba(255,120,40,0.35)");
          fg.addColorStop(1, "rgba(255,120,40,0)");
          ctx.fillStyle = fg;
          ctx.fillRect(X - 160, Y - 160, 320, 320);
          ctx.restore();
        });
      }
    }
    function helicopter(x, y, s, t, { light = true, dir = 1 } = {}) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s * dir, s);
      path([[-70, 0], [-20, -30], [50, -30], [80, 0], [50, 22], [-40, 22]], { close: true, fill: "#5d6b4e", w: 4 });
      path([[-70, -4], [-170, -14], [-170, 6], [-70, 8]], { close: true, fill: "#5d6b4e", w: 4 });
      path([[30, -26], [74, -2], [36, -2]], { close: true, fill: "#a9d2e6", w: 3 });
      line(-20, -30, -20, -46, 4);
      const r = 120 * Math.cos(t * 40);
      line(-20 - r, -48, -20 + r, -48, 5);
      line(-170, -6, -170 + 24 * Math.cos(t * 50), -6 + 24 * Math.sin(t * 50), 4);
      line(-40, 34, 50, 34, 4);
      line(-30, 22, -30, 34, 3);
      line(40, 22, 40, 34, 3);
      ctx.restore();
      if (light) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = "#fff6c8";
        ctx.beginPath();
        const a = Math.PI / 2 + Math.sin(t * 0.8) * 0.5;
        ctx.moveTo(x, y + 20 * s);
        ctx.lineTo(x + Math.cos(a - 0.18) * 900, y + Math.sin(a - 0.18) * 900);
        ctx.lineTo(x + Math.cos(a + 0.18) * 900, y + Math.sin(a + 0.18) * 900);
        ctx.fill();
        ctx.restore();
      }
    }
    function radioWaves(x, y, t, n = 3, col = "#c8452c") {
      for (let i = 0; i < n; i++) {
        const k = (t * 0.8 + i / n) % 1;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 20 + k * 120, -0.7, 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 20 + k * 120, Math.PI - 0.7, Math.PI + 0.7);
        ctx.stroke();
        ctx.restore();
      }
    }
    function speech(x, y, s, w = 0) {
      const tw = Math.max(200, s.length * 22);
      rect(x - tw / 2, y - 40, tw, 80, "#fffdf5", { w: 4 });
      path([[x - 20, y + 40], [x - 40, y + 80], [x + 10, y + 40]], { fill: "#fffdf5", w: 4 });
      text(s, x, y, 40, { font: "Patrick Hand" });
    }
    const S = {};
    S.studio = (b, p, t, i) => {
      const L = b.light;
      rect(-10, -10, W + 20, H + 20, "#e8dcc4", { stroke: null });
      wash(0, 0, W, 760, "#d7c7a8", 0.5);
      const wx = 1060, wy = 120, ww = 760, wh = 460;
      ctx.save();
      ctx.beginPath();
      ctx.rect(wx, wy, ww, wh);
      ctx.clip();
      skyline(wx, wy, ww, wh, { light: L === "alarm" ? "night" : L, fire: L === "day" ? 0.4 : 0.8, t });
      ctx.restore();
      rect(wx, wy, ww, wh, null, { w: 7 });
      line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 6);
      line(wx, wy + wh / 2, wx + ww, wy + wh / 2, 5);
      rect(110, 230, 220, 520, "#9a7a5a", { w: 5 });
      circle(300, 500, 10, "#c9b27a", { w: 3 });
      if (i >= 6) rect(90, 470, 170, 280, "#8c9499", { w: 5 }), line(110, 560, 240, 560, 4), line(110, 650, 240, 650, 4);
      if (i >= 24) rect(230, 590, 300, 160, "#4f7a6a", { w: 5 }), rect(230, 560, 300, 50, "#5e8b7a", { w: 5 });
      const on = b.onair || b.a === "onair";
      rect(560, 120, 240, 80, on ? "#e0402b" : "#6b3a33", { w: 5 });
      text("ON AIR", 680, 162, 50, { color: on ? "#fff6df" : "#c9a99a" });
      if (on) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.25 + 0.1 * Math.sin(t * 3);
        ctx.fillStyle = "#ff5a3c";
        ctx.beginPath();
        ctx.ellipse(680, 160, 220, 90, 0, 0, 7);
        ctx.fill();
        ctx.restore();
      }
      rect(-10, 750, W + 20, 340, "#a68a68", { w: 4 });
      rect(600, 600, 760, 70, "#6f5240", { w: 5 });
      rect(640, 670, 40, 220, "#5a4334", { w: 4 });
      rect(1280, 670, 40, 220, "#5a4334", { w: 4 });
      rect(760, 540, 360, 62, "#3d4048", { w: 4 });
      for (let k = 0; k < 9; k++) {
        rect(780 + k * 37, 552, 16, 38, "#1e2026", { stroke: null });
        rect(783 + k * 37, 560 + Math.sin(k * 7 + (on ? t * 6 : 0)) * 8 + 12, 10, 10, k % 3 ? "#c9c9c9" : "#e0402b", { stroke: null });
      }
      rect(1150, 560, 120, 42, "#2c2e33", { w: 4 });
      for (let k = 0; k < 4; k++) circle(1170 + k * 26, 572, 7, b.a === "onair" && i === 0 && p > 0.15 || b.a === "phone" ? Math.floor(t * 6 + k) % 2 ? "#ffd23f" : "#6b5a20" : "#4a4a40", { w: 2 });
      path([[700, 600], [700, 500], [820, 470]], { w: 7 });
      rect(810, 430, 46, 80, "#2c2e33", { w: 4 });
      rect(1020, 650, 30, 230, "#2f3238", { w: 4 });
      rect(900, 860, 170, 24, "#2f3238", { w: 4 });
      line(985, 884, 985, 1e3, 7);
      line(920, 1010, 1050, 1010, 7);
      const a = b.a;
      let pose = POSES.mic, face = "neutral", talk = 0, fx = 1010, fy = 1010, dir = -1;
      if (a === "onair") {
        pose = POSES.mic;
        talk = 1;
        face = i === 0 ? p > 0.25 ? "surprised" : "happy" : "neutral";
        if (i === 0 && p > 0.25) {
          pose = mixPose(POSES.mic, POSES.surprised, ease(seg(p, 0.25, 0.4)));
          talk = 0;
        }
      }
      if (a === "phone") {
        pose = POSES.phone;
        face = "scared";
      }
      if (a === "think") {
        pose = POSES.think;
        face = "think";
      }
      if (a === "surprised") {
        pose = mixPose(POSES.mic, POSES.surprised, ease(seg(p, 0.35, 0.5)));
        face = p > 0.35 ? "surprised" : "neutral";
        talk = p < 0.35 ? 1 : 0;
      }
      if (a === "listen") {
        pose = POSES.listen;
        face = "worried";
      }
      if (a === "worried") {
        pose = POSES.listen;
        face = "worried";
      }
      if (a === "cry") {
        pose = mixPose(POSES.listen, POSES.cry, ease(seg(p, 0.3, 0.6)));
        face = p > 0.4 ? "cry" : "happy";
      }
      if (a === "alarm") {
        pose = p > 0.15 ? POSES.scared : POSES.sit;
        fx = p > 0.15 ? 1150 : 1010;
        fy = p > 0.15 ? 1030 : 1010;
        face = "scared";
      }
      if (pose.sit) fy = 1e3;
      figure(fx, fy, 1.75, pose, LOOK.remi, { dir, face, talk, t, prop: a === "phone" ? (hs) => {
        rect(hs[0][0] - 12, hs[0][1] - 40, 24, 60, "#2c2e33", { w: 3 });
      } : null });
      if (on && b.a !== "cry") radioWaves(833, 410, t, 3);
      if (b.radio && Math.floor(t * 3) % 2) {
        text("((  \xB7  ))", 1210, 520, 40, { font: "Patrick Hand", color: "#c8452c" });
      }
      if (L === "alarm") {
        const off = p > 0.75;
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = off ? "#090b12" : Math.floor(t * 4) % 2 ? "#c83a2a" : "#5a1a1a";
        ctx.globalAlpha = off ? 0.82 : 0.55;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      } else mood(L, t);
      if (L === "night" || L === "dark") {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(900, 620, 20, 900, 620, 620);
        g.addColorStop(0, "rgba(255,190,110,0.28)");
        g.addColorStop(1, "rgba(255,190,110,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    };
    S.window = (b, p, t) => {
      const L = b.light;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.clip();
      skyline(0, 0, W, H, { light: L, fire: b.fire || 0, t, towerX: null });
      if (b.a === "heli_far") helicopter(lerp(300, 1500, p), 300 + Math.sin(t) * 20, 0.5, t, { dir: 1 });
      ctx.restore();
      mood(L === "day" ? "day" : "night", t);
      rect(-20, -20, W + 40, 70, "#5a4a3c", { w: 5 });
      rect(-20, H - 120, W + 40, 160, "#5a4a3c", { w: 5 });
      line(W * 0.62, 30, W * 0.62, H - 110, 10);
      const pose = b.a === "binoculars" ? POSES.binoculars : POSES.look;
      figure(330, H - 100, 1.75, pose, LOOK.remi, { dir: 1, face: b.a === "heli_far" ? "surprised" : "worried", t, prop: b.a === "binoculars" ? (hs) => {
        rect(hs[0][0] - 10, hs[0][1] - 36, 70, 44, "#2b2d33", { w: 4 });
      } : null });
    };
    S.stairs = (b, p, t) => {
      rect(-10, -10, W + 20, H + 20, "#3a3f4a", { stroke: null });
      rect(700, 120, 520, 820, "#5b6170", { w: 6 });
      const open = ease(seg(p, 0.15, 0.6)) * 0.4;
      rect(712, 132, 496 * open + 10, 796, "#0b0d12", { stroke: null });
      path([[712 + 496 * open, 132], [712 + 496 * open + 40, 160], [712 + 496 * open + 40, 900], [712 + 496 * open, 928]], { close: true, fill: "#77634f", w: 5 });
      rect(712 + 496 * open + 40, 132, 456 * (1 - open), 796, "#8a735c", { w: 5 });
      figure(560, 960, 2, POSES.peek, LOOK.remi, { dir: 1, face: "scared", t, prop: (hs) => {
        rect(hs[1][0] - 12, hs[1][1] - 20, 50, 26, "#c9c9c9", { w: 3 });
      } });
      mood("dark", t);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.3 * open / 0.4;
      ctx.fillStyle = "#fff2c4";
      ctx.beginPath();
      ctx.moveTo(760, 600);
      ctx.lineTo(1250, 380);
      ctx.lineTo(1250, 900);
      ctx.fill();
      ctx.restore();
    };
    S.stairwell = (b, p, t) => {
      rect(-10, -10, W + 20, H + 20, "#14161c", { stroke: null });
      const cx = W / 2, cy = H / 2 + 20;
      for (let k = 10; k >= 0; k--) {
        const s = Math.pow(0.78, k);
        const w = 1300 * s, h = 860 * s;
        rect(cx - w / 2, cy - h / 2, w, h, k % 2 ? "#3a3e48" : "#2f333c", { w: 4 * s + 1 });
        for (let st = 0; st < 6; st++) line(cx - w / 2 + st * w / 6, cy - h / 2, cx - w / 2 + st * w / 6 + 20 * s, cy - h / 2 + 60 * s, 2, "#555b68");
      }
      rect(cx - 70, cy - 46, 140, 92, "#050608", { stroke: null });
      const n = b.a === "horde" ? 26 : 3;
      rs = 555;
      for (let z = 0; z < n; z++) {
        const depth = 3 + rnd() * 7 + (b.a === "horde" ? -p * 2 : -p * 0.6);
        const s = Math.pow(0.78, depth);
        const side = Math.floor(rnd() * 4);
        const along = rnd() - 0.5;
        const w = 1300 * s, h = 860 * s;
        const pos = [[cx + along * w, cy - h / 2], [cx + w / 2, cy + along * h], [cx + along * w, cy + h / 2], [cx - w / 2, cy + along * h]][side];
        rs = 100 + z;
        figure(pos[0], pos[1] + 40 * s, 0.35 * s * 3.2, walkPose(t * 4 + z, POSES.zombie, 0.5), LOOK.zombie, { dir: z % 2 ? 1 : -1, t });
        rs = 555 + z * 7 + 3;
      }
      rs = boil * 977 + 1;
      flashlight(cx + Math.sin(t * 0.7) * 120, cy + Math.cos(t * 0.5) * 80, 520);
    };
    S.door = (b, p, t, i) => {
      rect(-10, -10, W + 20, H + 20, "#6a5d4c", { stroke: null });
      wash(0, 0, W, H, "#3a3326", 0.4);
      const shake = b.a === "scratch" || b.a === "hold" || b.a === "sofa" && p > 0.4 ? Math.sin(t * 40) * (b.a === "hold" ? 10 : 3) : 0;
      ctx.save();
      ctx.translate(shake, 0);
      rect(640, 80, 600, 900, "#8b8f94", { w: 7 });
      rect(680, 120, 520, 820, "#a7abaf", { w: 4 });
      text("STAIRS", 940, 220, 64, { font: "Kalam", color: "#3b3f44" });
      rect(1110, 520, 70, 26, "#55595e", { w: 4 });
      if (b.a === "scratch" || b.a === "hold") {
        rs = 77;
        for (let k = 0; k < 8; k++) {
          const x = 720 + rnd() * 440, y = 700 + rnd() * 200;
          path([[x, y], [x + 30, y + 60]], { w: 3, stroke: "#4a4038" });
        }
        rs = boil * 977;
      }
      if (b.a === "hold") {
        const k = Math.abs(Math.sin(t * 6));
        path([[640, 80], [1240, 80]], { w: 3, stroke: "#ffefc0", alpha: k });
      }
      ctx.restore();
      const cab = b.a === "barricade" ? ease(seg(p, 0.25, 0.7)) : 1;
      if (b.a !== "barricade" || p > 0.2) {
        rect(lerp(1500, 760, cab), 520, 300, 460, "#7f878d", { w: 6 });
        line(lerp(1500, 760, cab) + 30, 670, lerp(1500, 760, cab) + 270, 670, 5);
        line(lerp(1500, 760, cab) + 30, 820, lerp(1500, 760, cab) + 270, 820, 5);
      }
      if (i >= 24) {
        const sk = b.a === "sofa" ? ease(seg(p, 0.05, 0.45)) : 1;
        rect(lerp(-700, 520, sk), 760, 720, 220, "#4f7a6a", { w: 6 });
        rect(lerp(-700, 520, sk), 690, 720, 90, "#5e8b7a", { w: 6 });
      }
      let pose = POSES.scared, fx = 420, face = "scared";
      if (b.a === "barricade") {
        pose = p < 0.25 ? POSES.push : walkPose(t * 6, POSES.push, 0.5);
        fx = lerp(1300, 1400, 0);
        fx = lerp(1700, 1130, cab);
      }
      if (b.a === "sofa") {
        pose = POSES.push;
        fx = lerp(-300, 380, ease(seg(p, 0.05, 0.45)));
      }
      if (b.a === "hold") {
        pose = POSES.push;
        fx = 380;
      }
      if (b.a === "barricade") figure(fx + 290, 1040, 1.7, pose, LOOK.remi, { dir: -1, face: "scared", t });
      else figure(fx, 1040, 1.7, pose, LOOK.remi, { dir: 1, face, t });
      mood("dark", t);
      flashlight(900, 620, 1e3);
    };
    S.vending = (b, p, t) => {
      rect(-10, -10, W + 20, H + 20, "#cdbf9f", { stroke: null });
      rect(-10, 860, W + 20, 240, "#9c8566", { w: 4 });
      rect(980, 140, 520, 760, "#b3352b", { w: 7 });
      rect(1030, 190, 330, 560, "#d8ecf2", { w: 5 });
      const snacks = ["#e9b04a", "#5b8bd0", "#7a4a2a", "#4d9c5b", "#e07a3a"];
      for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {
        const gone = r * 4 + c < p * 10 && r > 3;
        if (!gone) rect(1050 + c * 78, 210 + r * 90, 60, 60, snacks[(r + c) % 5], { w: 3 });
      }
      rect(1390, 300, 70, 160, "#3c3c3c", { w: 4 });
      figure(700, 920, 1.6, mixPose(POSES.stand, POSES.reach, ease(seg(p, 0.1, 0.35))), LOOK.remi, { dir: 1, face: p > 0.5 ? "happy" : "neutral", t, prop: p > 0.4 ? (hs) => {
        rect(hs[0][0] - 20, hs[0][1] - 14, 60, 28, "#7a4a2a", { w: 3 });
      } : null });
      mood("day", t);
    };
    S.roof = (b, p, t) => {
      const L = b.light;
      skyline(0, 0, W, H * 0.8, { light: L === "storm" ? "storm" : L, fire: 0.3, t });
      rect(-10, 700, W + 20, 400, "#7d7f84", { w: 5 });
      line(0, 700, W, 700, 6);
      path([[1500, 700], [1560, 120], [1620, 700]], { w: 6 });
      for (let k = 0; k < 8; k++) line(1500 + k * 7, 700 - k * 72, 1620 - k * 7, 700 - k * 72 - 36, 3);
      rect(1150, 560, 260, 150, "#4f6b48", { w: 5 });
      text("GEN", 1280, 630, 50, { color: "#e9e2c8" });
      const genOn = b.a === "fuel" && p > 0.8 || b.a === "rescue";
      if (genOn) {
        for (let k = 0; k < 3; k++) circle(1180 + k * 30 + Math.sin(t * 9 + k) * 4, 540 - (t * 60 + k * 20) % 60, 10, "#bbb", { stroke: null, alpha: 0.5 });
      }
      if (b.a === "rain" || b.a === "laugh") [[300, 0.5], [450, 0.7], [600, 0.6], [760, 0.8]].forEach(([x, f]) => {
        rect(x, 600, 110, 140, "#6e7f87", { w: 5 });
        const lvl = (b.a === "laugh" ? 1 : p) * f;
        rect(x + 8, 740 - 130 * lvl, 94, 130 * lvl, "#6fb4e0", { stroke: null, alpha: 0.8 });
      });
      let pose = POSES.stand, face = "neutral", fx = 900, dir = 1;
      if (b.a === "rain") {
        pose = walkPose(t * 7, POSES.carry, 0.7);
        fx = lerp(200, 900, seg(p, 0, 0.6));
        face = "worried";
      }
      if (b.a === "laugh") {
        pose = POSES.laugh;
        face = "happy";
      }
      if (b.a === "fuel") {
        pose = POSES.pour;
        fx = 1040;
        face = "worried";
      }
      let fy = 760;
      if (b.a === "rescue") {
        pose = POSES.climb;
        fx = 900;
        fy = lerp(760, 520, ease(seg(p, 0.5, 1)));
        face = "surprised";
      }
      figure(fx, fy, 1.5, pose, LOOK.remi, { dir, face, t, prop: b.a === "fuel" ? (hs) => {
        rect(hs[0][0] - 10, hs[0][1] - 30, 70, 80, "#c8452c", { w: 4 });
        if (p > 0.15 && p < 0.8) path([[hs[0][0] + 60, hs[0][1]], [hs[0][0] + 110, 600]], { w: 5, stroke: "#7a6a3a" });
      } : null });
      if (b.a === "rescue") {
        helicopter(950, 150 + Math.sin(t * 2) * 10, 1.1, t, { light: true });
        line(950, 190, fx + 10, fy - 330 * 0.5 - 60, 4, "#d9c48a");
        line(fx + 10, fy - 230, fx + 10, H, 4, "#d9c48a");
      }
      mood(L, t);
      if (L === "storm") {
        ctx.save();
        ctx.strokeStyle = "rgba(200,220,240,0.55)";
        ctx.lineWidth = 2;
        rs = boil * 13 + 2;
        for (let k = 0; k < 160; k++) {
          const x = rnd() * W, y = rnd() * H;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 14, y + 40);
          ctx.stroke();
        }
        ctx.restore();
        const fl = b.a === "rain" && seg(p, 0.05, 0.1) > 0 && p < 0.12 || b.a === "laugh" && p > 0.6 && p < 0.66;
        if (fl) {
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fillRect(0, 0, W, H);
        }
      }
    };
    S.tower = (b, p, t) => {
      ctx.save();
      skyline(0, 0, W, H, { light: "night", fire: 0.3, t, towerX: 880, glowTower: b.a === "lightup" ? ease(seg(p, 0.3, 0.9)) : 1 });
      if (b.a === "heliturn") {
        const k = ease(p);
        helicopter(lerp(300, 820, k), lerp(330, 260, k), lerp(0.45, 0.7, k), t, { dir: 1 });
      }
      if (b.a === "lightup") helicopter(260, 330, 0.4, t, { dir: 1 });
      ctx.restore();
      mood("night", t);
    };
    S.street = (b, p, t) => {
      skyline(0, 0, W, 520, { light: "dawn", fire: 0.2, t });
      rect(-10, 420, W + 20, 380, "#b79e86", { w: 4 });
      for (let k = 0; k < 6; k++) rect(k * 330, 460, 300, 340, ["#c9a989", "#a88e78", "#c3b199"][k % 3], { w: 5 });
      rect(220, 520, 200, 50, "#e9dcc2", { w: 3 });
      text("BAKERY", 320, 546, 40);
      rect(-10, 800, W + 20, 300, "#8d8a86", { w: 4 });
      for (let k = 0; k < 10; k++) rect(k * 220 + 40, 930, 120, 14, "#d8d2c2", { stroke: null });
      rect(1100, 650, 520, 190, "#d9a43c", { w: 6 });
      for (let k = 0; k < 5; k++) rect(1130 + k * 95, 680, 70, 60, "#9fd0e8", { w: 3 });
      circle(1180, 850, 34, "#333", { w: 4 });
      circle(1540, 850, 34, "#333", { w: 4 });
      const zt = b.a === "freeze" ? p : b.a === "turnaway" ? 1 : 0;
      const look = b.a === "freeze" ? ease(seg(p, 0.15, 0.4)) : b.a === "turnaway" ? 1 - ease(seg(p, 0.35, 0.7)) : 0;
      figure(1380, 905, 1.25, walkPose(t * 2, POSES.zombie, 0.2), LOOK.zombie, { dir: look > 0.5 ? -1 : 1, t });
      figure(1720, 900, 1.1, walkPose(t * 2 + 1, POSES.zombie, 0.2), LOOK.zombie, { dir: 1, t });
      const prog = b.a === "sneak" ? ease(seg(p, 0.1, 1)) * 0.55 : b.a === "freeze" ? 0.55 : 0.55 + ease(seg(p, 0.6, 1)) * 0.35;
      const moving = !(b.a === "freeze" || b.a === "turnaway" && p < 0.6);
      const tx = lerp(80, 1700, prog);
      figure(tx, 980, 0.95, moving ? walkPose(t * 6, POSES.sneak, 0.5) : POSES.freeze, LOOK.tess, { dir: 1, face: b.a === "freeze" ? "scared" : "worried", t });
      figure(tx - 110, 985, 0.7, moving ? walkPose(t * 6 + 1, POSES.sneak, 0.5) : POSES.freeze, LOOK.kid, { dir: 1, face: "scared", t });
      if (b.a === "turnaway") {
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 4;
        for (let k = 0; k < 6; k++) {
          const y = 300 + k * 90, x = (t * 500 + k * 300) % (W + 400) - 200;
          ctx.beginPath();
          ctx.moveTo(W - x, y);
          ctx.bezierCurveTo(W - x - 80, y - 30, W - x - 160, y + 30, W - x - 240, y);
          ctx.stroke();
        }
        ctx.restore();
      }
      mood("dawn", t);
    };
    S.bridge = (b, p, t) => {
      skyline(0, 0, W, 560, { light: "dawn", fire: 0.1, t });
      rect(-10, 560, W + 20, 540, "#6f9fb4", { w: 4 });
      for (let k2 = 0; k2 < 14; k2++) path([[k2 * 150 + t * 30 % 150, 650 + k2 % 3 * 120], [k2 * 150 + 60 + t * 30 % 150, 640 + k2 % 3 * 120]], { w: 3, stroke: "#d8eef5" });
      path([[200, 520], [960, 380], [1720, 520]], { w: 12, stroke: "#5a4634" });
      line(200, 520, 1720, 520, 10, "#5a4634");
      for (let k2 = 0; k2 < 12; k2++) line(260 + k2 * 125, 520, 260 + k2 * 125, 520 - Math.sin((k2 + 0.5) / 12 * Math.PI) * 140, 4, "#5a4634");
      path([[700, 760], [1300, 760], [1220, 860], [780, 860]], { close: true, fill: "#a35a3a", w: 5 });
      rect(900, 680, 200, 80, "#e9e2c8", { w: 4 });
      [760, 840, 1120, 1200].forEach((x, k2) => figure(x, 770, 0.55, k2 % 2 ? POSES.wave : POSES.stand, LOOK.survivor, { dir: -1, face: "happy", t }));
      const k = ease(seg(p, 0, 0.7));
      figure(lerp(250, 640, k), 520, 0.8, k < 1 ? walkPose(t * 7, POSES.stand, 0.8) : POSES.wave, LOOK.tess, { dir: 1, face: "happy", t });
      figure(lerp(170, 560, k), 524, 0.6, k < 1 ? walkPose(t * 7 + 1, POSES.stand, 0.8) : POSES.wave, LOOK.kid, { dir: 1, face: "happy", t });
      mood("dawn", t);
    };
    S.heli = (b, p, t) => {
      rect(-10, -10, W + 20, H + 20, "#3d4536", { stroke: null });
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(1400, 420, 380, 260, 0, 0, 7);
      ctx.clip();
      skyline(1e3, 160, 800, 520, { light: "night", fire: 0.2, t: t + Math.sin(t) });
      ctx.restore();
      path([[1020, 420], [1400, 160], [1780, 420], [1400, 680]], { close: true, w: 8, stroke: "#23201d" });
      rect(-10, 860, W + 20, 240, "#2e3429", { w: 4 });
      line(0, 120, W, 160, 8, "#5b6a4a");
      figure(1120, 900, 1.5, POSES.reach, LOOK.pilot, { dir: -1, face: "happy", t, prop: (hs) => {
        circle(hs[0][0], hs[0][1], 20, "#444", { w: 4 });
      } });
      rect(420, 780, 360, 40, "#4b5340", { w: 4 });
      figure(620, 900, 1.6, mixPose(POSES.sit, POSES.cry, 0.3 * ease(seg(p, 0.6, 1))), LOOK.remi, { dir: 1, face: p > 0.6 ? "cry" : "surprised", t });
      mood("night", t);
      ctx.save();
      ctx.translate(Math.sin(t * 25) * 2, Math.cos(t * 31) * 2);
      ctx.restore();
    };
    S.camp = (b, p, t) => {
      skyline(0, 0, W, 540, { light: "dawn", fire: 0, t });
      rect(-10, 520, W + 20, 580, "#8fa56a", { w: 4 });
      rect(-10, 460, W + 20, 80, "#6f9fb4", { stroke: null });
      [[240, 0.9, "#c8452c"], [560, 1, "#d9a43c"], [1500, 1.1, "#3b6fb6"], [1760, 0.8, "#4d9c5b"]].forEach(([x, s, c]) => path([[x - 140 * s, 760], [x, 760 - 200 * s], [x + 140 * s, 760]], { close: true, fill: c, w: 5 }));
      for (let k2 = 0; k2 < 4; k2++) path([[920 + k2 * 20, 900], [930 + k2 * 20 + J(8), 840 - Math.abs(Math.sin(t * 8 + k2)) * 40], [950 + k2 * 20, 900]], { close: true, fill: k2 % 2 ? "#f7b538" : "#e2552c", stroke: null, j: 3 });
      [[300, 0.7], [700, 0.7], [1600, 0.72]].forEach(([x, s], k2) => figure(x, 900, s, POSES.stand, LOOK.survivor, { dir: k2 ? -1 : 1, face: "happy", t }));
      const k = ease(seg(p, 0.05, 0.55));
      figure(lerp(1950, 1180, k), 960, 1.2, k < 1 ? walkPose(t * 6, POSES.stand) : POSES.hug, LOOK.remi, { dir: -1, face: "happy", t });
      figure(lerp(980, 1060, k), 960, 0.9, k > 0.9 ? POSES.hug : POSES.wave, LOOK.tess, { dir: 1, face: "happy", t, prop: (hs) => rect(hs[1][0] - 14, hs[1][1] - 10, 36, 26, "#2c2e33", { w: 3 }) });
      figure(lerp(900, 980, k), 965, 0.66, POSES.wave, LOOK.kid, { dir: 1, face: "happy", t });
      mood("dawn", t);
    };
    function cardBase(title) {
      rect(-10, -10, W + 20, H + 20, "#f1e9d6", { stroke: null });
      text(title, W / 2, 150, 84, { font: "Kalam" });
      line(W / 2 - 260, 205, W / 2 + 260, 210, 5, "#c8452c");
    }
    function bottle(x, y, full = 1) {
      rect(x, y, 34, 80, full ? "#8fc6e8" : "#e9e2d0", { w: 3.5 });
      rect(x + 10, y - 14, 14, 14, "#3b6fb6", { w: 3 });
    }
    S.card = (b, p, t) => {
      const c = b.card, k = ease(seg(p, 0.05, 0.4));
      if (c === "supplies") {
        cardBase(b.vals.water > 10 ? "SUPPLIES \xB7 DAY 2" : "SUPPLIES \xB7 DAY 9");
        text("Water", 330, 340, 56, { align: "left" });
        for (let i = 0; i < 18; i++) bottle(560 + i * 50, 300, i < b.vals.water * k + 0.01 ? 1 : 0);
        text(`${Math.round(b.vals.water * k)} bottles`, 1540, 340, 56, { align: "left", color: b.vals.water < 10 ? "#c8452c" : INK });
        text("Food", 330, 520, 56, { align: "left" });
        for (let i = 0; i < 20; i++) rect(560 + i * 45, 490, 34, 56, i < b.vals.food / 41 * 20 * k ? "#7a4a2a" : "#e9e2d0", { w: 3 });
        text(`${Math.round(b.vals.food * k)} snacks`, 1540, 520, 56, { align: "left" });
        text("Fuel", 330, 700, 56, { align: "left" });
        rect(560, 670, 900, 60, "#e9e2d0", { w: 4 });
        rect(560, 670, 900 * b.vals.fuel / 40 * k, 60, "#c8452c", { w: 4 });
        text(`${Math.round(b.vals.fuel * k)} L`, 1540, 700, 56, { align: "left" });
        text("1 meal a day  \xB7  2 bottles a day", W / 2, 900, 46, { font: "Patrick Hand", color: "#6b5f50" });
      }
      if (c === "rules") {
        cardBase("REMI'S RULES");
        ["1.  One meal a day", "2.  Two bottles of water", "3.  No noise near the stairs"].forEach((s, i) => {
          const kk = ease(seg(p, 0.2 + i * 0.25, 0.35 + i * 0.25));
          text(s, 520, 400 + i * 170, 80, { align: "left", alpha: kk });
          if (kk > 0.5) path([[440, 400 + i * 170], [465, 430 + i * 170], [500, 360 + i * 170]], { w: 7, stroke: "#4d9c5b" });
        });
      }
      if (c === "fuel" || c === "fuel2") {
        cardBase(c === "fuel" ? "GENERATOR" : "FUEL \xB7 DAY 15");
        const left = c === "fuel" ? 40 : 3, hours = left / 2;
        rect(380, 360, 300, 420, "#c8452c", { w: 6 });
        rect(380, 780 - 420 * (left / 40) * (c === "fuel" ? 1 : 1), 300, 420 * left / 40, "#7a3a2a", { w: 3, alpha: 0.6 });
        text(`${left} L`, 530, 860, 70);
        text("\xF7  2 L per hour", 1e3, 470, 70, { align: "left", alpha: ease(seg(p, 0.25, 0.4)) });
        text(`=  ${hours} ${hours === 1 ? "hour" : "hours"} of power`, 1e3, 620, 84, { align: "left", color: "#c8452c", alpha: ease(seg(p, 0.45, 0.6)) });
        if (c === "fuel2") text("one last broadcast", 1e3, 760, 60, { align: "left", font: "Patrick Hand", alpha: ease(seg(p, 0.65, 0.8)) });
      }
      if (c === "notes") {
        cardBase("FIELD NOTES");
        rect(360, 260, 1200, 720, "#fffdf3", { w: 5 });
        for (let l = 0; l < 9; l++) line(380, 340 + l * 72, 1540, 340 + l * 72, 2, "#bcd3e0");
        ["Follow noise + light", "Avoid the cold river wind", "Slowest just after sunrise"].forEach((s, i) => {
          const kk = ease(seg(p, 0.1 + i * 0.3, 0.3 + i * 0.3));
          text("\u2022  " + s, 430, 380 + i * 180, 70, { align: "left", font: "Patrick Hand", alpha: kk });
        });
      }
      if (c === "map1" || c === "map2") {
        cardBase(c === "map1" ? "12 BLOCKS" : "THE ROUTE");
        const ox = 360, oy = 260;
        rect(ox, oy, 1200, 720, "#efe6cf", { w: 5 });
        path([[ox, oy + 600], [ox + 400, oy + 560], [ox + 800, oy + 640], [ox + 1200, oy + 580], [ox + 1200, oy + 720], [ox, oy + 720]], { close: true, fill: "#9cc3d4", w: 4 });
        text("river", ox + 980, oy + 660, 44, { font: "Patrick Hand", color: "#3b6fb6" });
        for (let r = 0; r < 5; r++) for (let q = 0; q < 8; q++) rect(ox + 40 + q * 140, oy + 40 + r * 105, 110, 75, "#d9cdb2", { w: 2.5, j: 1 });
        circle(ox + 1100, oy + 90, 26, "#c8452c", { w: 4 });
        text("TOWER", ox + 1100, oy + 150, 40);
        rect(ox + 90, oy + 430, 60, 60, "#fff", { w: 4 });
        line(ox + 120, oy + 440, ox + 120, oy + 480, 8, "#c8452c");
        line(ox + 100, oy + 460, ox + 140, oy + 460, 8, "#c8452c");
        text("PHARMACY", ox + 120, oy + 520, 36);
        if (c === "map1") {
          ctx.save();
          ctx.setLineDash([18, 14]);
          path([[ox + 150, oy + 440], [ox + 600, oy + 300], [ox + 1080, oy + 100]], { w: 6, stroke: INK });
          ctx.restore();
          rs = 8;
          for (let z = 0; z < 14; z++) circle(ox + 300 + rnd() * 700, oy + 120 + rnd() * 380, 12, "#7f9a62", { w: 3 });
          rs = boil * 977;
        } else {
          const k2 = ease(seg(p, 0.15, 0.8));
          const pts = [[ox + 120, oy + 490], [ox + 160, oy + 570], [ox + 500, oy + 540], [ox + 840, oy + 600], [ox + 1e3, oy + 560]];
          const n2 = Math.max(2, Math.ceil(pts.length * k2));
          path(pts.slice(0, n2), { w: 9, stroke: "#c8452c" });
          text("sunrise \u263C", ox + 300, oy + 610, 40, { font: "Patrick Hand" });
          text("\u2190 wind", ox + 760, oy + 520, 40, { font: "Patrick Hand", color: "#3b6fb6" });
          rect(ox + 980, oy + 540, 60, 30, "#a35a3a", { w: 3 });
          text("boat", ox + 1010, oy + 600, 34, { font: "Patrick Hand" });
        }
      }
      if (c === "end") {
        cardBase("18 DAYS");
        [["0", "fights"], ["18", "nights on air"], ["2", "kids guided home"], ["1", "light in the dark"]].forEach(([n, l], i) => {
          const kk = ease(seg(p, 0.08 + i * 0.18, 0.2 + i * 0.18));
          text(n, 560 + i % 2 * 720, 400 + Math.floor(i / 2) * 300, 140, { color: "#c8452c", alpha: kk });
          text(l, 560 + i % 2 * 720, 510 + Math.floor(i / 2) * 300, 56, { alpha: kk, font: "Patrick Hand" });
        });
      }
    };
    S.daycard = (b, p) => {
      rect(-10, -10, W + 20, H + 20, "#121315", { stroke: null });
      const k = ease(seg(p, 0, 0.25));
      text(b.day, W / 2, H / 2, 170, { color: "#f1e9d6", alpha: k, font: "Kalam" });
    };
    S.endcard = (b, p, t) => {
      rect(-10, -10, W + 20, H + 20, "#121315", { stroke: null });
      text("18 Days in the Radio Tower", W / 2, H / 2 - 60, 110, { color: "#f1e9d6", alpha: ease(seg(p, 0, 0.3)) });
      text("Thanks for listening.", W / 2, H / 2 + 80, 64, { color: "#c8452c", font: "Patrick Hand", alpha: ease(seg(p, 0.25, 0.5)) });
      radioWaves(W / 2, H / 2 + 220, t, 3, "#f1e9d6");
    };
    const FILM = window.FILM;
    function render(t) {
      boil = Math.floor(t * 8);
      const i = Math.max(0, FILM.beats.findIndex((b2) => t < b2.start + b2.dur));
      const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
      const p = clamp((t - b.start) / b.dur);
      rs = boil * 977 + 11;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cam = ["card", "daycard", "endcard"].includes(b.s) ? 1 : 1 + 0.05 * p;
      ctx.translate(W / 2, H / 2);
      ctx.scale(cam, cam);
      ctx.translate(-W / 2, -H / 2);
      (S[b.s] || S.daycard)(b, p, t, i);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.55;
      ctx.drawImage(paper, 0, 0);
      ctx.restore();
      const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
      if (b.title && p < 0.85) {
        const k = Math.min(seg(p, 0.02, 0.12), 1 - seg(p, 0.7, 0.85));
        const s = b.title.slice(0, Math.floor(b.title.length * seg(p, 0.02, 0.2)));
        text(s, 80, 80, 60, { align: "left", color: "#f1e9d6", alpha: k, font: "Kalam" });
      }
      const prev = FILM.beats[i - 1], next = FILM.beats[i + 1];
      let fade = 0;
      if (prev && prev.s !== b.s) fade = Math.max(fade, 1 - clamp((t - b.start) / 0.25));
      if (next && next.s !== b.s) fade = Math.max(fade, clamp((t - (b.start + b.dur - 0.25)) / 0.25));
      if (t < 0.6) fade = 1 - t / 0.6;
      if (fade > 0) {
        ctx.fillStyle = `rgba(10,10,12,${fade})`;
        ctx.fillRect(0, 0, W, H);
      }
    }
    return { render };
  }
  window.StickFilm = { create };
})();
