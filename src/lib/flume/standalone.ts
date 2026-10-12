import { escapeXml, slug } from "./format";
import type { Project } from "./types";
import engineSource from "./engine.iife.txt?raw";

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function standaloneHtml(project: Project): string {
  const title = project.title || "Flume diagram";
  const engine = engineSource.replace(/<\/script/gi, "<\\/script");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeXml(title)}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    background: #221e1a;
    color: #f4efe6;
    font: 16px/1.45 "Segoe UI", Helvetica, sans-serif;
    min-height: 100%;
  }
  header, main { max-width: 1180px; margin: 0 auto; }
  header { display: flex; gap: 16px; align-items: flex-end; padding: 28px 20px 8px; }
  .mark { font-family: Georgia, "Times New Roman", serif; font-size: 28px; letter-spacing: -0.03em; }
  .mark span { color: #e39a62; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 560; font-size: 28px; margin: 0; letter-spacing: -0.03em; }
  .sub { margin: 4px 0 0; color: #b3a89c; }
  main { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 18px; padding: 12px 20px 40px; align-items: start; }
  #stage { background: #f3eee6; border-radius: 12px; overflow: auto; box-shadow: 0 18px 50px rgb(0 0 0 / 0.28); }
  #stage svg { display: block; width: 100%; height: auto; }
  #stage path { transition: opacity 160ms ease; }
  aside { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #b3a89c; }
  textarea {
    width: 100%; min-height: 280px; resize: vertical; border-radius: 10px;
    border: 1px solid #463e36; background: #2c2722; color: #f4efe6;
    font: 13px/1.5 ui-monospace, Menlo, Consolas, monospace; padding: 12px;
  }
  textarea:focus { outline: 2px solid #e39a62; outline-offset: 1px; }
  .status { font-size: 14px; }
  .status.off { color: #f0b2a4; }
  .row { font-size: 14px; color: #b3a89c; }
  .row strong { color: #f4efe6; font-weight: 600; }
  .warn { color: #e39a62; font-size: 14px; margin: 0; }
  .hint { color: #b3a89c; font-size: 13px; margin: 8px 0 0; }
  button {
    font: inherit; color: #2a160c; background: #e39a62; border: 0; border-radius: 999px;
    min-height: 44px; padding: 0 16px; cursor: pointer;
  }
  @media (max-width: 860px) {
    main { grid-template-columns: 1fr; }
    header { flex-direction: column; align-items: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) {
    #stage path { transition: none; }
  }
  @media print {
    body { background: white; }
    aside, .hint, button { display: none !important; }
    main { display: block; max-width: none; padding: 0; }
    #stage { box-shadow: none; }
  }
</style>
</head>
<body>
<header>
  <div class="mark">Fl<span>u</span>me</div>
  <div>
    <h1 id="title">${escapeXml(title)}</h1>
    <p class="sub" id="sub">${escapeXml(project.subtitle)}</p>
  </div>
</header>
<main>
  <div id="stage"></div>
  <aside>
    <label for="source">Flows</label>
    <textarea id="source" spellcheck="false" aria-label="Flows"></textarea>
    <div id="status" class="status"></div>
    <div id="extra"></div>
    <button id="png" type="button">Download PNG</button>
    <p class="hint">This file is the whole instrument. Edit a line, or drag a bar. Nothing to install, and nothing leaves the browser.</p>
  </aside>
</main>
<script id="flume-project" type="application/json">${safeJson(project)}</script>
<script>${engine}</script>
<script>
(function () {
  var project = JSON.parse(document.getElementById("flume-project").textContent);
  var stage = document.getElementById("stage");
  var source = document.getElementById("source");
  var status = document.getElementById("status");
  var extra = document.getElementById("extra");
  source.value = project.source;
  var drag = null;

  function money(n) {
    var d = project.settings.decimals || 0;
    var body = Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    return (project.settings.prefix || "") + body + (project.settings.suffix || "");
  }

  function draw() {
    var out = FlumeEngine.render(project);
    stage.innerHTML = out.svg || '<p style="color:#1c1915;padding:28px;font-family:Georgia,serif">Add a flow to draw the diagram.</p>';
    var gap = Math.abs(out.meta.totalIn - out.meta.totalOut) > 0.0001;
    status.className = "status" + (gap ? " off" : "");
    status.textContent = gap
      ? "Off by " + money(out.meta.totalIn - out.meta.totalOut) + " · " + money(out.meta.totalIn) + " in, " + money(out.meta.totalOut) + " out"
      : "Balances · " + money(out.meta.totalIn) + " in and out";
    var bits = [];
    out.meta.computed.forEach(function (row) {
      var text = row.kind === "rest"
        ? row.target + " is the remainder of " + row.source
        : row.source + " fills the shortfall into " + row.target;
      bits.push('<p class="row"><strong>' + escapeText(text) + '</strong> · ' + money(row.value) + '</p>');
    });
    out.meta.errors.forEach(function (err) {
      bits.push('<p class="warn">' + escapeText(err.line ? "Line " + err.line + ": " : "") + escapeText(err.message) + '</p>');
    });
    out.meta.warnings.forEach(function (warning) {
      bits.push('<p class="warn">' + escapeText(warning) + '</p>');
    });
    out.meta.balances.forEach(function (row) {
      if (Math.abs(row.gap) < 0.0001) return;
      bits.push('<p class="warn">' + escapeText(row.name) + ' is off by ' + money(row.gap) + '</p>');
    });
    extra.innerHTML = bits.join("");
    document.getElementById("title").textContent = project.title || "Untitled";
    document.getElementById("sub").textContent = project.subtitle || "";
    document.title = project.title || "Flume diagram";
  }

  function escapeText(value) {
    function entity(name) { return "&" + name + ";"; }
    return String(value).replace(/&/g, entity("amp")).replace(/</g, entity("lt")).replace(/>/g, entity("gt"));
  }

  function highlight(nodeId, flow) {
    var flows = stage.querySelectorAll("[data-flow]");
    var nodes = stage.querySelectorAll("[data-node]");
    var labels = stage.querySelectorAll("[data-label]");
    flows.forEach(function (el) {
      var base = Number(el.getAttribute("data-opacity") || "0.5");
      var on = !nodeId && !flow
        || (flow && el === flow)
        || (nodeId && (el.getAttribute("data-source") === nodeId || el.getAttribute("data-target") === nodeId));
      el.style.opacity = String(on ? Math.min(0.92, base + 0.25) : base * 0.12);
    });
    nodes.forEach(function (el) {
      var id = el.getAttribute("data-node");
      var on = !nodeId && !flow || id === nodeId || (flow && (flow.getAttribute("data-source") === id || flow.getAttribute("data-target") === id));
      if (nodeId && id !== nodeId) {
        var linked = false;
        flows.forEach(function (f) {
          if (f.getAttribute("data-source") === nodeId && f.getAttribute("data-target") === id) linked = true;
          if (f.getAttribute("data-target") === nodeId && f.getAttribute("data-source") === id) linked = true;
        });
        on = linked || id === nodeId;
      }
      el.style.opacity = on || (!nodeId && !flow) ? "1" : "0.25";
    });
    labels.forEach(function (el) {
      var id = el.getAttribute("data-label");
      var bar = stage.querySelector('[data-node="' + CSS.escape(id) + '"]');
      el.style.opacity = bar ? bar.style.opacity : "1";
    });
  }

  source.addEventListener("input", function () {
    project.source = source.value;
    project.offsets = {};
    draw();
  });

  stage.addEventListener("pointerover", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    var flow = event.target.closest && event.target.closest("[data-flow]");
    highlight(node && node.getAttribute("data-node"), flow);
  });
  stage.addEventListener("pointerleave", function () { highlight(null, null); });

  stage.addEventListener("pointerdown", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    if (!node) return;
    var svg = stage.querySelector("svg");
    if (!svg) return;
    event.preventDefault();
    var rect = svg.getBoundingClientRect();
    var id = node.getAttribute("data-node");
    drag = {
      id: id,
      y: event.clientY,
      scale: svg.viewBox.baseVal.height / rect.height,
      base: project.offsets[id] || 0
    };
  });
  window.addEventListener("pointermove", function (event) {
    if (!drag) return;
    project.offsets[drag.id] = drag.base + (event.clientY - drag.y) * drag.scale;
    draw();
  });
  window.addEventListener("pointerup", function () { drag = null; });
  stage.addEventListener("dblclick", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    if (!node) return;
    delete project.offsets[node.getAttribute("data-node")];
    draw();
  });

  document.getElementById("png").addEventListener("click", function () {
    var svg = stage.querySelector("svg");
    if (!svg) return;
    var xml = new XMLSerializer().serializeToString(svg);
    var w = svg.viewBox.baseVal.width;
    var h = svg.viewBox.baseVal.height;
    var url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = w * 2;
      canvas.height = h * 2;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = ${JSON.stringify(slug(project.title))}.replace(/[^a-z0-9-]/g, "") || "flume";
        a.download += ".png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  });

  draw();
})();
</script>
</body>
</html>`;
}
