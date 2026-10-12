import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Library, c as Download, i as Link, o as Image$1, r as Maximize2, s as FolderOpen, t as X } from "../_libs/lucide-react.mjs";
import { a as right, i as left, n as center, r as justify, t as Sankey } from "../_libs/d3-sankey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BJ-L6NnM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function clean(n) {
	return Math.round(n * 1e6) / 1e6;
}
function formatNumber(n, settings) {
	if (!Number.isFinite(n)) return "—";
	const digits = Math.min(4, Math.max(0, settings.decimals));
	const body = clean(n).toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
	return `${settings.prefix}${body}${settings.suffix}`;
}
function slug(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "flume";
}
function entity(name) {
	return `&${name};`;
}
function escapeXml(value) {
	return value.replace(/&/g, entity("amp")).replace(/</g, entity("lt")).replace(/>/g, entity("gt")).replace(/"/g, entity("quot"));
}
function expandHex(raw) {
	const s = raw.toLowerCase();
	if (s.length === 3) return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
	return `#${s}`;
}
var EPS$1 = 1e-6;
function splitColor(rest) {
	const hash = rest.lastIndexOf("#");
	if (hash < 0) return {
		name: rest.trim(),
		color: null,
		opacity: null
	};
	if (hash > 0 && !/\s/.test(rest[hash - 1])) return {
		name: rest.trim(),
		color: null,
		opacity: null
	};
	const match = rest.slice(hash).trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:\s*\.\s*(\d*\.?\d+))?$/);
	if (!match) return {
		name: rest.trim(),
		color: null,
		opacity: null
	};
	let opacity = null;
	if (match[2]) {
		const n = Number(match[2]);
		if (Number.isFinite(n)) opacity = Math.min(1, Math.max(0, n));
	}
	return {
		name: rest.slice(0, hash).trim(),
		color: expandHex(match[1]),
		opacity
	};
}
function parseAmount(raw) {
	const t = raw.trim();
	if (t === "*") return {
		kind: "rest",
		amount: null
	};
	if (t === "?") return {
		kind: "need",
		amount: null
	};
	const n = Number(t.replace(/,/g, ""));
	if (!Number.isFinite(n) || n <= 0) return null;
	return {
		kind: "value",
		amount: n
	};
}
function parseFlow(line, lineNo) {
	const lb = line.indexOf("[");
	const rb = line.indexOf("]", lb + 1);
	if (lb <= 0 || rb < 0) return { error: "Expected Source [amount] Target" };
	const source = line.slice(0, lb).trim();
	if (!source) return { error: "That flow needs a source." };
	const amount = parseAmount(line.slice(lb + 1, rb));
	if (!amount) return { error: "Amount should be a positive number, [*], or [?]." };
	const { name: target, color, opacity } = splitColor(line.slice(rb + 1));
	if (!target) return { error: "That flow needs a target." };
	if (source === target) return { error: "A flow can't start and end in the same place." };
	return { flow: {
		line: lineNo,
		source,
		target,
		color,
		opacity,
		...amount
	} };
}
function parseNode(line) {
	let body = line.slice(1).trim();
	let paintIn = false;
	let paintOut = false;
	const arrows = body.match(/^(.*?)(?:\s+((?:<<|>>)(?:\s*(?:<<|>>))*))\s*$/);
	if (arrows?.[2]) {
		body = arrows[1].trim();
		paintIn = arrows[2].includes("<<");
		paintOut = arrows[2].includes(">>");
	}
	const { name, color } = splitColor(body);
	if (!name) return { error: "A node line needs a name, like :Rent #c4622d" };
	return { style: {
		name,
		style: {
			color,
			paintIn,
			paintOut
		}
	} };
}
function parseSource(source) {
	const flows = [];
	const styles = /* @__PURE__ */ new Map();
	const errors = [];
	const lines = source.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = (lines[i] ?? "").trim();
		const lineNo = i + 1;
		if (!line || line.startsWith("//")) continue;
		if (line.startsWith(":")) {
			const parsed = parseNode(line);
			if (parsed.error) errors.push({
				line: lineNo,
				message: parsed.error
			});
			else if (parsed.style) styles.set(parsed.style.name, parsed.style.style);
			continue;
		}
		const parsed = parseFlow(line, lineNo);
		if (parsed.error || !parsed.flow) errors.push({
			line: lineNo,
			message: parsed.error ?? "Could not read that line."
		});
		else flows.push(parsed.flow);
	}
	return {
		flows,
		styles,
		errors
	};
}
function sum(rows) {
	let total = 0;
	for (const row of rows) total += row.value ?? 0;
	return total;
}
/** [*] takes what a node received but did not pass on. [?] fills what a node must pass on but has not received. */
function resolveFlows(drafts) {
	const rows = drafts.map((flow) => ({
		line: flow.line,
		source: flow.source,
		target: flow.target,
		kind: flow.kind,
		color: flow.color,
		opacity: flow.opacity,
		value: flow.kind === "value" ? flow.amount : null
	}));
	const warnings = [];
	const errors = [];
	const names = /* @__PURE__ */ new Set();
	for (const row of rows) {
		names.add(row.source);
		names.add(row.target);
	}
	const warned = /* @__PURE__ */ new Set();
	let guard = rows.length + 3;
	while (guard-- > 0) {
		let progress = false;
		for (const name of names) {
			if (fillRest(name, rows, warnings, warned)) progress = true;
			if (fillNeed(name, rows, warnings, warned)) progress = true;
		}
		if (!progress) break;
	}
	const flows = [];
	for (const row of rows) {
		if (row.value == null) {
			errors.push({
				line: row.line,
				message: row.kind === "rest" ? `Couldn't compute the remainder leaving ${row.source}. Give that step a numeric inflow first.` : `Couldn't compute the shortfall into ${row.target}. That step needs a known outflow.`
			});
			continue;
		}
		const value = clean(row.value);
		if (value <= EPS$1) {
			warnings.push(`${row.source} → ${row.target} is zero, so it isn't drawn.`);
			continue;
		}
		flows.push({
			...row,
			value
		});
	}
	return {
		flows,
		warnings,
		errors
	};
}
function fillRest(source, rows, warnings, warned) {
	const outgoing = rows.filter((row) => row.source === source);
	const incoming = rows.filter((row) => row.target === source);
	const pending = outgoing.filter((row) => row.value == null);
	const rests = pending.filter((row) => row.kind === "rest");
	if (rests.length === 0 || pending.length !== rests.length) return false;
	if (incoming.some((row) => row.value == null)) return false;
	if (incoming.length === 0 && outgoing.every((row) => row.value == null)) return false;
	let remainder = clean(sum(incoming) - sum(outgoing.filter((row) => row.value != null)));
	if (remainder < 0) {
		const key = `over:${source}`;
		if (!warned.has(key)) {
			warned.add(key);
			warnings.push(`${source} already sends more than it receives. The remainder is zero.`);
		}
		remainder = 0;
	}
	if (rests.length > 1 && !warned.has(`split:${source}`)) {
		warned.add(`split:${source}`);
		warnings.push(`${source} has ${rests.length} remainder flows. The leftover is split evenly.`);
	}
	const share = remainder / rests.length;
	for (const row of rests) row.value = share;
	return true;
}
function fillNeed(target, rows, warnings, warned) {
	const outgoing = rows.filter((row) => row.source === target);
	const incoming = rows.filter((row) => row.target === target);
	const pending = incoming.filter((row) => row.value == null);
	const needs = pending.filter((row) => row.kind === "need");
	if (needs.length === 0 || pending.length !== needs.length) return false;
	if (outgoing.length === 0 || outgoing.some((row) => row.value == null)) return false;
	let deficit = clean(sum(outgoing) - sum(incoming.filter((row) => row.value != null)));
	if (deficit < 0) {
		const key = `under:${target}`;
		if (!warned.has(key)) {
			warned.add(key);
			warnings.push(`${target} already receives more than it sends. The shortfall is zero.`);
		}
		deficit = 0;
	}
	if (needs.length > 1 && !warned.has(`needs:${target}`)) {
		warned.add(`needs:${target}`);
		warnings.push(`${target} has ${needs.length} shortfall flows. The gap is split evenly.`);
	}
	const share = deficit / needs.length;
	for (const row of needs) row.value = share;
	return true;
}
function findCycle(flows) {
	const next = /* @__PURE__ */ new Map();
	for (const flow of flows) {
		const list = next.get(flow.source);
		if (list) list.push(flow.target);
		else next.set(flow.source, [flow.target]);
	}
	const state = /* @__PURE__ */ new Map();
	const stack = [];
	function walk(name) {
		state.set(name, 1);
		stack.push(name);
		for (const target of next.get(name) ?? []) {
			const seen = state.get(target) ?? 0;
			if (seen === 1) {
				const at = stack.indexOf(target);
				return [...stack.slice(at), target];
			}
			if (seen === 0) {
				const found = walk(target);
				if (found) return found;
			}
		}
		stack.pop();
		state.set(name, 2);
		return null;
	}
	for (const name of next.keys()) {
		if ((state.get(name) ?? 0) !== 0) continue;
		const found = walk(name);
		if (found) return `These flows loop (${found.join(" → ")}). A diagram needs a direction.`;
	}
	return null;
}
function tryConvertTable(text) {
	const lines = text.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
	if (lines.length === 0 || lines.some((line) => line.includes("["))) return null;
	const rows = lines.map((line) => (line.includes("	") ? line.split("	") : splitCsv(line)).map((cell) => cell.trim()));
	if (rows.some((row) => row.length < 3)) return null;
	const header = rows[0].map((cell) => cell.toLowerCase());
	const body = header.some((cell) => [
		"source",
		"from",
		"target",
		"to",
		"amount",
		"value"
	].includes(cell)) && rows.length > 1 ? rows.slice(1) : rows;
	if (body.length === 0) return null;
	const numeric = [
		0,
		1,
		2
	].find((index) => body.filter((row) => isAmount(row[index] ?? "")).length >= Math.ceil(body.length * .8));
	if (numeric == null) return null;
	const nameCols = [
		0,
		1,
		2
	].filter((index) => index !== numeric);
	let sourceCol = nameCols[0];
	let targetCol = nameCols[1];
	if (header[sourceCol]?.match(/target|to/) && header[targetCol]?.match(/source|from/)) [sourceCol, targetCol] = [targetCol, sourceCol];
	return body.map((row) => {
		const amount = (row[numeric] ?? "").replace(/[$,\s]/g, "");
		return `${row[sourceCol]} [${amount}] ${row[targetCol]}`;
	}).join("\n");
}
function splitCsv(line) {
	const cells = [];
	let current = "";
	let quoted = false;
	for (const char of line) {
		if (char === "\"") {
			quoted = !quoted;
			continue;
		}
		if (char === "," && !quoted) {
			cells.push(current);
			current = "";
			continue;
		}
		current += char;
	}
	cells.push(current);
	return cells;
}
function isAmount(value) {
	const n = Number(value.replace(/[$,\s]/g, ""));
	return Number.isFinite(n) && n > 0;
}
var PALETTE = [
	"#1f4b4a",
	"#c4622d",
	"#3d5a3d",
	"#8c3a3a",
	"#3a4a6b",
	"#8a6232",
	"#4a4458",
	"#2f6f6a",
	"#7a4e3a",
	"#3e5c48"
];
var PAPERS = {
	cream: {
		bg: "#f3eee6",
		fg: "#1c1915",
		muted: "#6f675e",
		rule: "#e39a62"
	},
	white: {
		bg: "#fbfbfa",
		fg: "#1a1a1a",
		muted: "#5e5a55",
		rule: "#e39a62"
	},
	ink: {
		bg: "#1c1915",
		fg: "#f4efe6",
		muted: "#b3a89c",
		rule: "#e39a62"
	}
};
var DEFAULT_SETTINGS = {
	prefix: "",
	suffix: "",
	decimals: 0,
	width: 1120,
	height: 680,
	nodeWidth: 16,
	nodeGap: 20,
	flowOpacity: .5,
	align: "justify",
	sort: "entry",
	showLabels: true,
	showValues: true,
	paper: "cream"
};
var KEY = "flume.project.v1";
function isRecord(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function pickSettings(value) {
	const raw = isRecord(value) ? value : {};
	const align = raw.align;
	const sort = raw.sort;
	const paper = raw.paper;
	return {
		...DEFAULT_SETTINGS,
		prefix: typeof raw.prefix === "string" ? raw.prefix : DEFAULT_SETTINGS.prefix,
		suffix: typeof raw.suffix === "string" ? raw.suffix : DEFAULT_SETTINGS.suffix,
		decimals: clampNum(raw.decimals, 0, 4, DEFAULT_SETTINGS.decimals),
		width: clampNum(raw.width, 640, 2400, DEFAULT_SETTINGS.width),
		height: clampNum(raw.height, 420, 2400, DEFAULT_SETTINGS.height),
		nodeWidth: clampNum(raw.nodeWidth, 6, 40, DEFAULT_SETTINGS.nodeWidth),
		nodeGap: clampNum(raw.nodeGap, 4, 64, DEFAULT_SETTINGS.nodeGap),
		flowOpacity: clampNum(raw.flowOpacity, .08, .95, DEFAULT_SETTINGS.flowOpacity),
		align: align === "left" || align === "right" || align === "center" || align === "justify" ? align : DEFAULT_SETTINGS.align,
		sort: sort === "value" || sort === "entry" ? sort : DEFAULT_SETTINGS.sort,
		showLabels: typeof raw.showLabels === "boolean" ? raw.showLabels : DEFAULT_SETTINGS.showLabels,
		showValues: typeof raw.showValues === "boolean" ? raw.showValues : DEFAULT_SETTINGS.showValues,
		paper: paper === "cream" || paper === "white" || paper === "ink" ? paper : DEFAULT_SETTINGS.paper
	};
}
function clampNum(value, min, max, fallback) {
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}
function normalizeProject(input) {
	if (!isRecord(input) || typeof input.source !== "string") return null;
	const offsets = {};
	if (isRecord(input.offsets)) {
		for (const [key, value] of Object.entries(input.offsets)) if (typeof value === "number" && Number.isFinite(value)) offsets[key] = value;
	}
	return {
		v: 1,
		title: typeof input.title === "string" ? input.title : "Untitled",
		subtitle: typeof input.subtitle === "string" ? input.subtitle : "",
		source: input.source,
		settings: pickSettings(input.settings),
		offsets
	};
}
function readStoredProject() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		return normalizeProject(JSON.parse(raw));
	} catch {
		return null;
	}
}
function writeStoredProject(project) {
	try {
		localStorage.setItem(KEY, JSON.stringify(project));
	} catch {}
}
async function packProject(project) {
	const stream = new Blob([JSON.stringify(project)]).stream().pipeThrough(new CompressionStream("gzip"));
	const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
	let bin = "";
	for (const byte of bytes) bin += String.fromCharCode(byte);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function unpackProject(encoded) {
	const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
	const bin = atob(padded);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
	const text = await new Response(stream).text();
	return normalizeProject(JSON.parse(text));
}
async function projectFromLocation() {
	const hash = window.location.hash;
	if (!hash.startsWith("#f=")) return null;
	try {
		return await unpackProject(hash.slice(3));
	} catch {
		return null;
	}
}
function downloadBlob(filename, blob) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
async function svgToPng(svg, scale) {
	const root = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
	const width = Number(root.getAttribute("width"));
	const height = Number(root.getAttribute("height"));
	if (!width || !height) throw new Error("This diagram has no size yet.");
	const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
	try {
		const img = new Image();
		img.decoding = "async";
		await new Promise((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Could not draw the image."));
			img.src = url;
		});
		const canvas = document.createElement("canvas");
		canvas.width = Math.round(width * scale);
		canvas.height = Math.round(height * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not draw the image.");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
		if (!blob) throw new Error("Could not encode the PNG.");
		return blob;
	} finally {
		URL.revokeObjectURL(url);
	}
}
var EPS = 1e-4;
var ALIGNS = {
	justify,
	left,
	right,
	center
};
function balancesOf(flows) {
	const order = [];
	const inn = /* @__PURE__ */ new Map();
	const out = /* @__PURE__ */ new Map();
	const touch = (name) => {
		if (inn.has(name)) return;
		inn.set(name, 0);
		out.set(name, 0);
		order.push(name);
	};
	for (const flow of flows) {
		touch(flow.source);
		touch(flow.target);
		out.set(flow.source, (out.get(flow.source) ?? 0) + flow.value);
		inn.set(flow.target, (inn.get(flow.target) ?? 0) + flow.value);
	}
	return order.map((name) => {
		const i = clean(inn.get(name) ?? 0);
		const o = clean(out.get(name) ?? 0);
		return {
			name,
			inn: i,
			out: o,
			gap: clean(i - o)
		};
	});
}
function estimate(text, size) {
	return text.length * size * .56;
}
function ribbon(x0, x1, y0, y1, width) {
	const half = Math.max(width, 0) / 2;
	const c = (x0 + x1) / 2;
	const n = (v) => Math.round(v * 100) / 100;
	return [
		`M${n(x0)},${n(y0 - half)}`,
		`C${n(c)},${n(y0 - half)} ${n(c)},${n(y1 - half)} ${n(x1)},${n(y1 - half)}`,
		`L${n(x1)},${n(y1 + half)}`,
		`C${n(c)},${n(y1 + half)} ${n(c)},${n(y0 + half)} ${n(x0)},${n(y0 + half)}`,
		"Z"
	].join("");
}
function buildDiagram(project) {
	const parsed = parseSource(project.source);
	const resolved = resolveFlows(parsed.flows);
	const warnings = [...resolved.warnings];
	const errors = [...parsed.errors, ...resolved.errors];
	const empty = {
		scene: null,
		meta: {
			errors,
			warnings,
			balances: [],
			computed: [],
			totalIn: 0,
			totalOut: 0
		}
	};
	if (resolved.flows.length === 0) return empty;
	const cycle = findCycle(resolved.flows);
	if (cycle) {
		errors.push({
			line: 0,
			message: cycle
		});
		return {
			scene: null,
			meta: {
				...empty.meta,
				errors
			}
		};
	}
	const balances = balancesOf(resolved.flows);
	for (const [name] of parsed.styles) if (!balances.some((row) => row.name === name)) warnings.push(`${name} is styled, but it isn't in a flow.`);
	const colors = /* @__PURE__ */ new Map();
	let paletteAt = 0;
	for (const row of balances) {
		const chosen = parsed.styles.get(row.name)?.color;
		colors.set(row.name, chosen ?? PALETTE[paletteAt++ % PALETTE.length]);
	}
	const settings = project.settings;
	const paper = PAPERS[settings.paper];
	const sources = balances.filter((row) => row.inn <= EPS && row.out > EPS);
	const sinks = balances.filter((row) => row.out <= EPS && row.inn > EPS);
	const totalIn = clean(sources.reduce((t, row) => t + row.out, 0));
	const totalOut = clean(sinks.reduce((t, row) => t + row.inn, 0));
	const labelWidth = (name) => {
		if (!settings.showLabels) return 0;
		const value = formatNumber(Math.max(balances.find((row) => row.name === name)?.inn ?? 0, balances.find((row) => row.name === name)?.out ?? 0), settings);
		return Math.max(estimate(name, 13), settings.showValues ? estimate(value, 11) : 0);
	};
	const left = 32 + (settings.showLabels ? Math.max(0, ...sources.map((row) => labelWidth(row.name))) : 0);
	const right = 32 + (settings.showLabels ? Math.max(0, ...sinks.map((row) => labelWidth(row.name)), ...balances.map((row) => labelWidth(row.name) * 0)) : 0);
	const top = project.title && project.subtitle ? 84 : project.title ? 68 : 28;
	const bottom = 32;
	const stack = Math.max(sources.length, sinks.length, 1);
	const width = Math.max(settings.width, left + right + settings.nodeWidth * 3 + 80);
	const height = Math.max(settings.height, top + bottom + stack * 26 + Math.max(0, stack - 1) * settings.nodeGap);
	const generator = Sankey().nodeId((node) => String(node.id)).nodeWidth(settings.nodeWidth).nodePadding(settings.nodeGap).nodeAlign(ALIGNS[settings.align]).iterations(32).extent([[left, top], [width - right, height - bottom]]).nodeSort(settings.sort === "value" ? (a, b) => (b.value ?? 0) - (a.value ?? 0) : null);
	let graph;
	try {
		graph = generator({
			nodes: balances.map((row) => ({ id: row.name })),
			links: resolved.flows.map((flow) => ({
				source: flow.source,
				target: flow.target,
				value: flow.value,
				color: flow.color,
				opacity: flow.opacity,
				kind: flow.kind
			}))
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Could not lay out these flows.";
		const friendly = message.toLowerCase().includes("circular") ? "These flows loop. A diagram needs a direction." : message;
		errors.push({
			line: 0,
			message: friendly
		});
		return {
			scene: null,
			meta: {
				errors,
				warnings,
				balances,
				computed: computedOf(resolved.flows),
				totalIn,
				totalOut
			}
		};
	}
	for (const node of graph.nodes) {
		const dy = project.offsets[String(node.id)] ?? 0;
		if (!dy || node.y0 == null || node.y1 == null) continue;
		const h = node.y1 - node.y0;
		const y0 = Math.max(top, Math.min(height - bottom - h, node.y0 + dy));
		node.y0 = y0;
		node.y1 = y0 + h;
	}
	generator.update(graph);
	const nodes = graph.nodes.map((node) => ({
		id: String(node.id),
		x: node.x0 ?? 0,
		y: node.y0 ?? 0,
		w: (node.x1 ?? 0) - (node.x0 ?? 0),
		h: Math.max(0, (node.y1 ?? 0) - (node.y0 ?? 0)),
		color: colors.get(String(node.id)) ?? PALETTE[0],
		value: node.value ?? 0
	}));
	const nodeById = new Map(nodes.map((node) => [node.id, node]));
	const lastLayer = graph.nodes.reduce((max, node) => Math.max(max, node.layer ?? 0), 0);
	const links = [];
	graph.links.forEach((link, index) => {
		const source = link.source;
		const target = link.target;
		if (typeof source === "string" || typeof target === "string") return;
		const sourceId = String(source.id);
		const targetId = String(target.id);
		const sourceNode = nodeById.get(sourceId);
		const targetNode = nodeById.get(targetId);
		if (!sourceNode || !targetNode || link.y0 == null || link.y1 == null || link.width == null) return;
		const sourceStyle = parsed.styles.get(sourceId);
		const targetStyle = parsed.styles.get(targetId);
		const explicit = typeof link.color === "string" ? link.color : null;
		const opacity = typeof link.opacity === "number" ? link.opacity : settings.flowOpacity;
		let gradient = null;
		let fill = explicit ?? sourceNode.color;
		if (!explicit && sourceStyle?.paintOut && sourceStyle.color) fill = sourceStyle.color;
		else if (!explicit && targetStyle?.paintIn && targetStyle.color) fill = targetStyle.color;
		else if (!explicit) {
			const id = `g${index}`;
			gradient = {
				id,
				x1: sourceNode.x + sourceNode.w,
				y1: link.y0,
				x2: targetNode.x,
				y2: link.y1,
				from: sourceNode.color,
				to: targetNode.color
			};
			fill = `url(#${id})`;
		}
		links.push({
			id: `${sourceId}->${targetId}:${index}`,
			d: ribbon(sourceNode.x + sourceNode.w, targetNode.x, link.y0, link.y1, link.width),
			fill,
			opacity,
			source: sourceId,
			target: targetId,
			gradient
		});
	});
	const labels = settings.showLabels ? graph.nodes.flatMap((node) => {
		const id = String(node.id);
		const drawn = nodeById.get(id);
		if (!drawn || node.y0 == null || node.y1 == null || node.layer == null) return [];
		const onLeft = node.layer === 0 && lastLayer > 0;
		return [{
			id,
			x: onLeft ? drawn.x - 10 : drawn.x + drawn.w + 10,
			y: drawn.y + drawn.h / 2,
			anchor: onLeft ? "end" : "start",
			name: id,
			value: formatNumber(node.value ?? 0, settings),
			showValue: settings.showValues
		}];
	}) : [];
	return {
		scene: {
			width,
			height,
			paper,
			title: project.title,
			subtitle: project.subtitle,
			links,
			nodes,
			labels
		},
		meta: {
			errors,
			warnings,
			balances,
			computed: computedOf(resolved.flows),
			totalIn,
			totalOut
		}
	};
}
function computedOf(flows) {
	const rows = [];
	for (const flow of flows) {
		if (flow.kind === "value") continue;
		rows.push({
			source: flow.source,
			target: flow.target,
			value: flow.value,
			kind: flow.kind
		});
	}
	return rows;
}
var SANS$1 = "Source Sans 3, Segoe UI, Helvetica, sans-serif";
var DISPLAY$1 = "Fraunces, Georgia, Times New Roman, serif";
function sceneToSvg(scene) {
	const { paper } = scene;
	const grads = scene.links.filter((link) => link.gradient).map((link) => {
		const g = link.gradient;
		return `<linearGradient id="${g.id}" gradientUnits="userSpaceOnUse" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}"><stop offset="0%" stop-color="${g.from}"/><stop offset="100%" stop-color="${g.to}"/></linearGradient>`;
	}).join("");
	const links = scene.links.map((link) => `<path data-flow="${escapeXml(link.id)}" data-source="${escapeXml(link.source)}" data-target="${escapeXml(link.target)}" data-opacity="${link.opacity}" d="${link.d}" fill="${link.fill}" opacity="${link.opacity}"/>`).join("");
	const nodes = scene.nodes.map((node) => `<rect data-node="${escapeXml(node.id)}" x="${node.x}" y="${node.y}" width="${node.w}" height="${Math.max(node.h, .8)}" rx="2" fill="${node.color}"/>`).join("");
	const labels = scene.labels.map((label) => {
		const value = label.showValue ? `<tspan x="${label.x}" dy="1.2em" fill="${paper.muted}" font-size="11">${escapeXml(label.value)}</tspan>` : "";
		const dy = label.showValue ? "-0.45em" : "0.35em";
		return `<text data-label="${escapeXml(label.id)}" x="${label.x}" y="${label.y}" text-anchor="${label.anchor}" fill="${paper.fg}" font-family="${SANS$1}" font-size="13" stroke="${paper.bg}" stroke-width="3" paint-order="stroke fill" stroke-linejoin="round"><tspan x="${label.x}" dy="${dy}">${escapeXml(label.name)}</tspan>${value}</text>`;
	}).join("");
	const title = scene.title ? `<text x="32" y="40" fill="${paper.fg}" font-family="${DISPLAY$1}" font-size="${scene.title.length > 42 ? 22 : 28}" font-weight="560">${escapeXml(scene.title)}</text>` : "";
	const subtitle = scene.subtitle ? `<text x="32" y="62" fill="${paper.muted}" font-family="${SANS$1}" font-size="14">${escapeXml(scene.subtitle)}</text>` : "";
	const ruleY = scene.title && scene.subtitle ? 74 : scene.title ? 56 : 0;
	const rule = scene.title ? `<rect x="32" y="${ruleY}" width="36" height="2" fill="${paper.rule}"/>` : "";
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}" role="img" aria-label="${escapeXml(scene.title || "Sankey diagram")}">
<style>text{font-variant-numeric:tabular-nums}</style>
<rect width="100%" height="100%" fill="${paper.bg}"/>
${title}${subtitle}${rule}
<defs>${grads}</defs>
<g class="flows">${links}</g>
<g class="nodes">${nodes}</g>
<g class="labels">${labels}</g>
</svg>`;
}
function render(project) {
	const diagram = buildDiagram(project);
	return {
		scene: diagram.scene,
		svg: diagram.scene ? sceneToSvg(diagram.scene) : "",
		meta: diagram.meta
	};
}
function project(title, subtitle, source, settings) {
	return {
		v: 1,
		title,
		subtitle,
		source: source.trim() + "\n",
		settings: {
			...DEFAULT_SETTINGS,
			...settings
		},
		offsets: {}
	};
}
var SAMPLES = [
	{
		id: "year",
		name: "Where the year went",
		blurb: "A company, source to profit",
		project: project("Where the year went", "Thousands. Illustrative.", `
// Money in
Product [4200] Revenue
Services [1800] Revenue
Licensing [640] Revenue

// What it cost to deliver
Revenue [2100] Cost of revenue
Revenue [*] Gross profit

// Running the company
Gross profit [980] People
Gross profit [310] Go to market
Gross profit [240] Infrastructure
Gross profit [150] General & admin
Gross profit [*] Operating profit

// What remained
Operating profit [740] Tax
Operating profit [*] Net profit

:Product #1f6a62
:Services #3d8b78
:Licensing #7e9a72
:Revenue #1c2e2c
:Cost of revenue #8f3d32
:Gross profit #1f4b4a
:People #c4622d
:Go to market #c48a3a
:Infrastructure #3a4a6b
:General & admin #8a7564
:Operating profit #1f4b4a
:Tax #6e3b3b
:Net profit #143f3a
`, {
			align: "left",
			width: 1180,
			height: 700,
			prefix: "",
			decimals: 0
		})
	},
	{
		id: "home",
		name: "A month at home",
		blurb: "Income, spending, what remains",
		project: project("A month at home", "After tax. Illustrative.", `
// A month, after tax
Wages [6400] Budget
Side work [480] Budget

Budget [2100] Rent
Budget [860] Food
Budget [420] Transport
Budget [310] Utilities
Budget [240] Health
Budget [180] Everything else
Budget [*] Savings

:Wages #1f4b4a
:Side work #3d8b78
:Budget #1c2e2c
:Rent #8f3d32
:Food #c4622d
:Transport #c48a3a
:Utilities #3a4a6b
:Health #6e3b3b
:Everything else #8a7564
:Savings #143f3a
`, {
			align: "justify",
			prefix: "$",
			decimals: 0,
			width: 1080,
			height: 640
		})
	},
	{
		id: "grid",
		name: "A small grid",
		blurb: "Fuel, generation, end use",
		project: project("A small grid", "Units of energy. Illustrative.", `
// Fuel in
Coal [12] Generation
Gas [31] Generation
Nuclear [18] Generation
Wind [16] Generation
Solar [9] Generation
Oil [28] Engines
Biofuel [4] Engines

Generation [8] Losses
Generation [*] Grid

Grid [24] Homes
Grid [21] Industry
Grid [*] Shops

Engines [*] Mobility

:Coal #3a3532
:Gas #c4622d
:Nuclear #3a4a6b
:Wind #3d8b78
:Solar #c48a3a
:Oil #6e3b3b
:Biofuel #7e9a72
:Generation #1c2e2c
:Engines #243044
:Losses #8a7564
:Grid #1f4b4a
:Homes #c4622d
:Industry #3a4a6b
:Shops #8a6232
:Mobility #143f3a
`, {
			align: "left",
			decimals: 0,
			width: 1120,
			height: 760,
			nodeGap: 16
		})
	},
	{
		id: "cherry",
		name: "Cherry to cup",
		blurb: "Shrinkage, step by step",
		project: project("Cherry to cup", "One hundred units of fruit.", `
// One hundred units of fruit, and where they go
Harvest [100] Cherry

Cherry [82] Washed
Cherry [*] Rejected fruit

Washed [70] Green bean
Washed [*] Pulp and water

Green bean [64] Roaster
Green bean [*] Dockage

Roaster [52] Bags
Roaster [*] Roast loss

Bags [28] Cafes
Bags [15] Grocers
Bags [*] Subscriptions

:Harvest #7e9a72
:Cherry #8f3d32
:Rejected fruit #8a7564
:Washed #c4622d
:Pulp and water #6e3b3b
:Green bean #3d5a3d
:Dockage #8a7564
:Roaster #1c2e2c
:Roast loss #6e3b3b
:Bags #c48a3a
:Cafes #1f4b4a
:Grocers #3a4a6b
:Subscriptions #143f3a
`, {
			align: "left",
			decimals: 0,
			width: 1180,
			height: 720
		})
	}
];
var DEFAULT_PROJECT = SAMPLES[0].project;
var engine_iife_default = "\"use strict\";var FlumeEngine=(()=>{var ot=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var Ft=Object.getOwnPropertyNames;var It=Object.prototype.hasOwnProperty;var Tt=(e,n)=>{for(var r in n)ot(e,r,{get:n[r],enumerable:!0})},Ct=(e,n,r,o)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let s of Ft(n))!It.call(e,s)&&s!==r&&ot(e,s,{get:()=>n[s],enumerable:!(o=Nt(n,s))||o.enumerable});return e};var Rt=e=>Ct(ot({},\"__esModule\",{value:!0}),e);var Kt={};Tt(Kt,{render:()=>Mt});function V(e,n){let r;if(n===void 0)for(let o of e)o!=null&&(r<o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let s of e)(s=n(s,++o,e))!=null&&(r<s||r===void 0&&s>=s)&&(r=s)}return r}function C(e,n){let r;if(n===void 0)for(let o of e)o!=null&&(r>o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let s of e)(s=n(s,++o,e))!=null&&(r>s||r===void 0&&s>=s)&&(r=s)}return r}function R(e,n){let r=0;if(n===void 0)for(let o of e)(o=+o)&&(r+=o);else{let o=-1;for(let s of e)(s=+n(s,++o,e))&&(r+=s)}return r}function Pt(e){return e.target.depth}function st(e){return e.depth}function it(e,n){return n-1-e.height}function G(e,n){return e.sourceLinks.length?e.depth:n-1}function at(e){return e.targetLinks.length?e.depth:e.sourceLinks.length?C(e.sourceLinks,Pt)-1:0}function P(e){return function(){return e}}function ct(e,n){return Y(e.source,n.source)||e.index-n.index}function dt(e,n){return Y(e.target,n.target)||e.index-n.index}function Y(e,n){return e.y0-n.y0}function lt(e){return e.value}function At(e){return e.index}function Dt(e){return e.nodes}function Ot(e){return e.links}function mt(e,n){let r=e.get(n);if(!r)throw new Error(\"missing: \"+n);return r}function gt({nodes:e}){for(let n of e){let r=n.y0,o=r;for(let s of n.sourceLinks)s.y0=r+s.width/2,r+=s.width;for(let s of n.targetLinks)s.y1=o+s.width/2,o+=s.width}}function Z(){let e=0,n=0,r=1,o=1,s=24,u=8,m,c=At,g=G,b,f,w=Dt,p=Ot,F=6;function x(){let t={nodes:w.apply(null,arguments),links:p.apply(null,arguments)};return W(t),A(t),H(t),U(t),q(t),gt(t),t}x.update=function(t){return gt(t),t},x.nodeId=function(t){return arguments.length?(c=typeof t==\"function\"?t:P(t),x):c},x.nodeAlign=function(t){return arguments.length?(g=typeof t==\"function\"?t:P(t),x):g},x.nodeSort=function(t){return arguments.length?(b=t,x):b},x.nodeWidth=function(t){return arguments.length?(s=+t,x):s},x.nodePadding=function(t){return arguments.length?(u=m=+t,x):u},x.nodes=function(t){return arguments.length?(w=typeof t==\"function\"?t:P(t),x):w},x.links=function(t){return arguments.length?(p=typeof t==\"function\"?t:P(t),x):p},x.linkSort=function(t){return arguments.length?(f=t,x):f},x.size=function(t){return arguments.length?(e=n=0,r=+t[0],o=+t[1],x):[r-e,o-n]},x.extent=function(t){return arguments.length?(e=+t[0][0],r=+t[1][0],n=+t[0][1],o=+t[1][1],x):[[e,n],[r,o]]},x.iterations=function(t){return arguments.length?(F=+t,x):F};function W({nodes:t,links:i}){for(let[d,l]of t.entries())l.index=d,l.sourceLinks=[],l.targetLinks=[];let a=new Map(t.map((d,l)=>[c(d,l,t),d]));for(let[d,l]of i.entries()){l.index=d;let{source:h,target:y}=l;typeof h!=\"object\"&&(h=l.source=mt(a,h)),typeof y!=\"object\"&&(y=l.target=mt(a,y)),h.sourceLinks.push(l),y.targetLinks.push(l)}if(f!=null)for(let{sourceLinks:d,targetLinks:l}of t)d.sort(f),l.sort(f)}function A({nodes:t}){for(let i of t)i.value=i.fixedValue===void 0?Math.max(R(i.sourceLinks,lt),R(i.targetLinks,lt)):i.fixedValue}function H({nodes:t}){let i=t.length,a=new Set(t),d=new Set,l=0;for(;a.size;){for(let h of a){h.depth=l;for(let{target:y}of h.sourceLinks)d.add(y)}if(++l>i)throw new Error(\"circular link\");a=d,d=new Set}}function U({nodes:t}){let i=t.length,a=new Set(t),d=new Set,l=0;for(;a.size;){for(let h of a){h.height=l;for(let{source:y}of h.targetLinks)d.add(y)}if(++l>i)throw new Error(\"circular link\");a=d,d=new Set}}function D({nodes:t}){let i=V(t,l=>l.depth)+1,a=(r-e-s)/(i-1),d=new Array(i);for(let l of t){let h=Math.max(0,Math.min(i-1,Math.floor(g.call(null,l,i))));l.layer=h,l.x0=e+h*a,l.x1=l.x0+s,d[h]?d[h].push(l):d[h]=[l]}if(b)for(let l of d)l.sort(b);return d}function O(t){let i=C(t,a=>(o-n-(a.length-1)*m)/R(a,lt));for(let a of t){let d=n;for(let l of a){l.y0=d,l.y1=d+l.value*i,d=l.y1+m;for(let h of l.sourceLinks)h.width=h.value*i}d=(o-d+m)/(a.length+1);for(let l=0;l<a.length;++l){let h=a[l];h.y0+=d*(l+1),h.y1+=d*(l+1)}nt(a)}}function q(t){let i=D(t);m=Math.min(u,(o-n)/(V(i,a=>a.length)-1)),O(i);for(let a=0;a<F;++a){let d=Math.pow(.99,a),l=Math.max(1-d,(a+1)/F);z(i,d,l),K(i,d,l)}}function K(t,i,a){for(let d=1,l=t.length;d<l;++d){let h=t[d];for(let y of h){let L=0,$=0;for(let{source:M,value:E}of y.targetLinks){let I=E*(y.layer-M.layer);L+=J(M,y)*I,$+=I}if(!($>0))continue;let N=(L/$-y.y0)*i;y.y0+=N,y.y1+=N,T(y)}b===void 0&&h.sort(Y),j(h,a)}}function z(t,i,a){for(let d=t.length,l=d-2;l>=0;--l){let h=t[l];for(let y of h){let L=0,$=0;for(let{target:M,value:E}of y.sourceLinks){let I=E*(M.layer-y.layer);L+=rt(y,M)*I,$+=I}if(!($>0))continue;let N=(L/$-y.y0)*i;y.y0+=N,y.y1+=N,T(y)}b===void 0&&h.sort(Y),j(h,a)}}function j(t,i){let a=t.length>>1,d=t[a];B(t,d.y0-m,a-1,i),S(t,d.y1+m,a+1,i),B(t,o,t.length-1,i),S(t,n,0,i)}function S(t,i,a,d){for(;a<t.length;++a){let l=t[a],h=(i-l.y0)*d;h>1e-6&&(l.y0+=h,l.y1+=h),i=l.y1+m}}function B(t,i,a,d){for(;a>=0;--a){let l=t[a],h=(l.y1-i)*d;h>1e-6&&(l.y0-=h,l.y1-=h),i=l.y0-m}}function T({sourceLinks:t,targetLinks:i}){if(f===void 0){for(let{source:{sourceLinks:a}}of i)a.sort(dt);for(let{target:{targetLinks:a}}of t)a.sort(ct)}}function nt(t){if(f===void 0)for(let{sourceLinks:i,targetLinks:a}of t)i.sort(dt),a.sort(ct)}function J(t,i){let a=t.y0-(t.sourceLinks.length-1)*m/2;for(let{target:d,width:l}of t.sourceLinks){if(d===i)break;a+=l+m}for(let{source:d,width:l}of i.targetLinks){if(d===t)break;a-=l}return a}function rt(t,i){let a=i.y0-(i.targetLinks.length-1)*m/2;for(let{source:d,width:l}of i.targetLinks){if(d===t)break;a+=l+m}for(let{target:d,width:l}of t.sourceLinks){if(d===i)break;a-=l}return a}return x}function k(e){return Math.round(e*1e6)/1e6}function ut(e,n){if(!Number.isFinite(e))return\"\\u2014\";let r=Math.min(4,Math.max(0,n.decimals)),o=k(e).toLocaleString(\"en-US\",{minimumFractionDigits:r,maximumFractionDigits:r});return`${n.prefix}${o}${n.suffix}`}function Q(e){return`&${e};`}function v(e){return e.replace(/&/g,Q(\"amp\")).replace(/</g,Q(\"lt\")).replace(/>/g,Q(\"gt\")).replace(/\"/g,Q(\"quot\"))}function pt(e){let n=e.toLowerCase();return n.length===3?`#${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`:`#${n}`}var zt=1e-6;function ht(e){let n=e.lastIndexOf(\"#\");if(n<0)return{name:e.trim(),color:null,opacity:null};if(n>0&&!/\\s/.test(e[n-1]))return{name:e.trim(),color:null,opacity:null};let o=e.slice(n).trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:\\s*\\.\\s*(\\d*\\.?\\d+))?$/);if(!o)return{name:e.trim(),color:null,opacity:null};let s=null;if(o[2]){let u=Number(o[2]);Number.isFinite(u)&&(s=Math.min(1,Math.max(0,u)))}return{name:e.slice(0,n).trim(),color:pt(o[1]),opacity:s}}function jt(e){let n=e.trim();if(n===\"*\")return{kind:\"rest\",amount:null};if(n===\"?\")return{kind:\"need\",amount:null};let r=Number(n.replace(/,/g,\"\"));return!Number.isFinite(r)||r<=0?null:{kind:\"value\",amount:r}}function Bt(e,n){let r=e.indexOf(\"[\"),o=e.indexOf(\"]\",r+1);if(r<=0||o<0)return{error:\"Expected Source [amount] Target\"};let s=e.slice(0,r).trim();if(!s)return{error:\"That flow needs a source.\"};let u=jt(e.slice(r+1,o));if(!u)return{error:\"Amount should be a positive number, [*], or [?].\"};let{name:m,color:c,opacity:g}=ht(e.slice(o+1));return m?s===m?{error:\"A flow can't start and end in the same place.\"}:{flow:{line:n,source:s,target:m,color:c,opacity:g,...u}}:{error:\"That flow needs a target.\"}}function Et(e){let n=e.slice(1).trim(),r=!1,o=!1,s=n.match(/^(.*?)(?:\\s+((?:<<|>>)(?:\\s*(?:<<|>>))*))\\s*$/);s?.[2]&&(n=s[1].trim(),r=s[2].includes(\"<<\"),o=s[2].includes(\">>\"));let{name:u,color:m}=ht(n);return u?{style:{name:u,style:{color:m,paintIn:r,paintOut:o}}}:{error:\"A node line needs a name, like :Rent #c4622d\"}}function yt(e){let n=[],r=new Map,o=[],s=e.split(/\\r?\\n/);for(let u=0;u<s.length;u++){let c=(s[u]??\"\").trim(),g=u+1;if(!c||c.startsWith(\"//\"))continue;if(c.startsWith(\":\")){let f=Et(c);f.error?o.push({line:g,message:f.error}):f.style&&r.set(f.style.name,f.style.style);continue}let b=Bt(c,g);b.error||!b.flow?o.push({line:g,message:b.error??\"Could not read that line.\"}):n.push(b.flow)}return{flows:n,styles:r,errors:o}}function _(e){let n=0;for(let r of e)n+=r.value??0;return n}function xt(e){let n=e.map(g=>({line:g.line,source:g.source,target:g.target,kind:g.kind,color:g.color,opacity:g.opacity,value:g.kind===\"value\"?g.amount:null})),r=[],o=[],s=new Set;for(let g of n)s.add(g.source),s.add(g.target);let u=new Set,m=n.length+3;for(;m-- >0;){let g=!1;for(let b of s)Vt(b,n,r,u)&&(g=!0),Gt(b,n,r,u)&&(g=!0);if(!g)break}let c=[];for(let g of n){if(g.value==null){o.push({line:g.line,message:g.kind===\"rest\"?`Couldn't compute the remainder leaving ${g.source}. Give that step a numeric inflow first.`:`Couldn't compute the shortfall into ${g.target}. That step needs a known outflow.`});continue}let b=k(g.value);if(b<=zt){r.push(`${g.source} \\u2192 ${g.target} is zero, so it isn't drawn.`);continue}c.push({...g,value:b})}return{flows:c,warnings:r,errors:o}}function Vt(e,n,r,o){let s=n.filter(p=>p.source===e),u=n.filter(p=>p.target===e),m=s.filter(p=>p.value==null),c=m.filter(p=>p.kind===\"rest\");if(c.length===0||m.length!==c.length||u.some(p=>p.value==null)||u.length===0&&s.every(p=>p.value==null))return!1;let g=_(u),b=_(s.filter(p=>p.value!=null)),f=k(g-b);if(f<0){let p=`over:${e}`;o.has(p)||(o.add(p),r.push(`${e} already sends more than it receives. The remainder is zero.`)),f=0}c.length>1&&!o.has(`split:${e}`)&&(o.add(`split:${e}`),r.push(`${e} has ${c.length} remainder flows. The leftover is split evenly.`));let w=f/c.length;for(let p of c)p.value=w;return!0}function Gt(e,n,r,o){let s=n.filter(p=>p.source===e),u=n.filter(p=>p.target===e),m=u.filter(p=>p.value==null),c=m.filter(p=>p.kind===\"need\");if(c.length===0||m.length!==c.length||s.length===0||s.some(p=>p.value==null))return!1;let g=_(s),b=_(u.filter(p=>p.value!=null)),f=k(g-b);if(f<0){let p=`under:${e}`;o.has(p)||(o.add(p),r.push(`${e} already receives more than it sends. The shortfall is zero.`)),f=0}c.length>1&&!o.has(`needs:${e}`)&&(o.add(`needs:${e}`),r.push(`${e} has ${c.length} shortfall flows. The gap is split evenly.`));let w=f/c.length;for(let p of c)p.value=w;return!0}function bt(e){let n=new Map;for(let u of e){let m=n.get(u.source);m?m.push(u.target):n.set(u.source,[u.target])}let r=new Map,o=[];function s(u){r.set(u,1),o.push(u);for(let m of n.get(u)??[]){let c=r.get(m)??0;if(c===1){let g=o.indexOf(m);return[...o.slice(g),m]}if(c===0){let g=s(m);if(g)return g}}return o.pop(),r.set(u,2),null}for(let u of n.keys()){if((r.get(u)??0)!==0)continue;let m=s(u);if(m)return`These flows loop (${m.join(\" \\u2192 \")}). A diagram needs a direction.`}return null}var tt=[\"#1f4b4a\",\"#c4622d\",\"#3d5a3d\",\"#8c3a3a\",\"#3a4a6b\",\"#8a6232\",\"#4a4458\",\"#2f6f6a\",\"#7a4e3a\",\"#3e5c48\"],wt={cream:{bg:\"#f3eee6\",fg:\"#1c1915\",muted:\"#6f675e\",rule:\"#e39a62\"},white:{bg:\"#fbfbfa\",fg:\"#1a1a1a\",muted:\"#5e5a55\",rule:\"#e39a62\"},ink:{bg:\"#1c1915\",fg:\"#f4efe6\",muted:\"#b3a89c\",rule:\"#e39a62\"}};var et=1e-4,Wt={justify:G,left:st,right:it,center:at};function Ht(e){let n=[],r=new Map,o=new Map,s=u=>{r.has(u)||(r.set(u,0),o.set(u,0),n.push(u))};for(let u of e)s(u.source),s(u.target),o.set(u.source,(o.get(u.source)??0)+u.value),r.set(u.target,(r.get(u.target)??0)+u.value);return n.map(u=>{let m=k(r.get(u)??0),c=k(o.get(u)??0);return{name:u,inn:m,out:c,gap:k(m-c)}})}function $t(e,n){return e.length*n*.56}function Ut(e,n,r,o,s){let u=Math.max(s,0)/2,m=(e+n)/2,c=g=>Math.round(g*100)/100;return[`M${c(e)},${c(r-u)}`,`C${c(m)},${c(r-u)} ${c(m)},${c(o-u)} ${c(n)},${c(o-u)}`,`L${c(n)},${c(o+u)}`,`C${c(m)},${c(o+u)} ${c(m)},${c(r+u)} ${c(e)},${c(r+u)}`,\"Z\"].join(\"\")}function vt(e){let n=yt(e.source),r=xt(n.flows),o=[...r.warnings],s=[...n.errors,...r.errors],u={scene:null,meta:{errors:s,warnings:o,balances:[],computed:[],totalIn:0,totalOut:0}};if(r.flows.length===0)return u;let m=bt(r.flows);if(m)return s.push({line:0,message:m}),{scene:null,meta:{...u.meta,errors:s}};let c=Ht(r.flows);for(let[t]of n.styles)c.some(i=>i.name===t)||o.push(`${t} is styled, but it isn't in a flow.`);let g=new Map,b=0;for(let t of c){let i=n.styles.get(t.name)?.color;g.set(t.name,i??tt[b++%tt.length])}let f=e.settings,w=wt[f.paper],p=c.filter(t=>t.inn<=et&&t.out>et),F=c.filter(t=>t.out<=et&&t.inn>et),x=k(p.reduce((t,i)=>t+i.out,0)),W=k(F.reduce((t,i)=>t+i.inn,0)),A=t=>{if(!f.showLabels)return 0;let i=ut(Math.max(c.find(a=>a.name===t)?.inn??0,c.find(a=>a.name===t)?.out??0),f);return Math.max($t(t,13),f.showValues?$t(i,11):0)},H=32+(f.showLabels?Math.max(0,...p.map(t=>A(t.name))):0),U=32+(f.showLabels?Math.max(0,...F.map(t=>A(t.name)),...c.map(t=>A(t.name)*0)):0),D=e.title&&e.subtitle?84:e.title?68:28,O=32,q=Math.max(p.length,F.length,1),K=Math.max(f.width,H+U+f.nodeWidth*3+80),z=Math.max(f.height,D+O+q*26+Math.max(0,q-1)*f.nodeGap),j=Z().nodeId(t=>String(t.id)).nodeWidth(f.nodeWidth).nodePadding(f.nodeGap).nodeAlign(Wt[f.align]).iterations(32).extent([[H,D],[K-U,z-O]]).nodeSort(f.sort===\"value\"?(t,i)=>(i.value??0)-(t.value??0):null),S;try{S=j({nodes:c.map(t=>({id:t.name})),links:r.flows.map(t=>({source:t.source,target:t.target,value:t.value,color:t.color,opacity:t.opacity,kind:t.kind}))})}catch(t){let i=t instanceof Error?t.message:\"Could not lay out these flows.\",a=i.toLowerCase().includes(\"circular\")?\"These flows loop. A diagram needs a direction.\":i;return s.push({line:0,message:a}),{scene:null,meta:{errors:s,warnings:o,balances:c,computed:kt(r.flows),totalIn:x,totalOut:W}}}for(let t of S.nodes){let i=e.offsets[String(t.id)]??0;if(!i||t.y0==null||t.y1==null)continue;let a=t.y1-t.y0,d=Math.max(D,Math.min(z-O-a,t.y0+i));t.y0=d,t.y1=d+a}j.update(S);let B=S.nodes.map(t=>({id:String(t.id),x:t.x0??0,y:t.y0??0,w:(t.x1??0)-(t.x0??0),h:Math.max(0,(t.y1??0)-(t.y0??0)),color:g.get(String(t.id))??tt[0],value:t.value??0})),T=new Map(B.map(t=>[t.id,t])),nt=S.nodes.reduce((t,i)=>Math.max(t,i.layer??0),0),J=[];S.links.forEach((t,i)=>{let a=t.source,d=t.target;if(typeof a==\"string\"||typeof d==\"string\")return;let l=String(a.id),h=String(d.id),y=T.get(l),L=T.get(h);if(!y||!L||t.y0==null||t.y1==null||t.width==null)return;let $=n.styles.get(l),N=n.styles.get(h),M=typeof t.color==\"string\"?t.color:null,E=typeof t.opacity==\"number\"?t.opacity:f.flowOpacity,I=null,X=M??y.color;if(!M&&$?.paintOut&&$.color)X=$.color;else if(!M&&N?.paintIn&&N.color)X=N.color;else if(!M){let ft=`g${i}`;I={id:ft,x1:y.x+y.w,y1:t.y0,x2:L.x,y2:t.y1,from:y.color,to:L.color},X=`url(#${ft})`}J.push({id:`${l}->${h}:${i}`,d:Ut(y.x+y.w,L.x,t.y0,t.y1,t.width),fill:X,opacity:E,source:l,target:h,gradient:I})});let rt=f.showLabels?S.nodes.flatMap(t=>{let i=String(t.id),a=T.get(i);if(!a||t.y0==null||t.y1==null||t.layer==null)return[];let d=t.layer===0&&nt>0;return[{id:i,x:d?a.x-10:a.x+a.w+10,y:a.y+a.h/2,anchor:d?\"end\":\"start\",name:i,value:ut(t.value??0,f),showValue:f.showValues}]}):[];return{scene:{width:K,height:z,paper:w,title:e.title,subtitle:e.subtitle,links:J,nodes:B,labels:rt},meta:{errors:s,warnings:o,balances:c,computed:kt(r.flows),totalIn:x,totalOut:W}}}function kt(e){let n=[];for(let r of e)r.kind!==\"value\"&&n.push({source:r.source,target:r.target,value:r.value,kind:r.kind});return n}var St=\"Source Sans 3, Segoe UI, Helvetica, sans-serif\",qt=\"Fraunces, Georgia, Times New Roman, serif\";function Lt(e){let{paper:n}=e,r=e.links.filter(f=>f.gradient).map(f=>{let w=f.gradient;return`<linearGradient id=\"${w.id}\" gradientUnits=\"userSpaceOnUse\" x1=\"${w.x1}\" y1=\"${w.y1}\" x2=\"${w.x2}\" y2=\"${w.y2}\"><stop offset=\"0%\" stop-color=\"${w.from}\"/><stop offset=\"100%\" stop-color=\"${w.to}\"/></linearGradient>`}).join(\"\"),o=e.links.map(f=>`<path data-flow=\"${v(f.id)}\" data-source=\"${v(f.source)}\" data-target=\"${v(f.target)}\" data-opacity=\"${f.opacity}\" d=\"${f.d}\" fill=\"${f.fill}\" opacity=\"${f.opacity}\"/>`).join(\"\"),s=e.nodes.map(f=>`<rect data-node=\"${v(f.id)}\" x=\"${f.x}\" y=\"${f.y}\" width=\"${f.w}\" height=\"${Math.max(f.h,.8)}\" rx=\"2\" fill=\"${f.color}\"/>`).join(\"\"),u=e.labels.map(f=>{let w=f.showValue?`<tspan x=\"${f.x}\" dy=\"1.2em\" fill=\"${n.muted}\" font-size=\"11\">${v(f.value)}</tspan>`:\"\",p=f.showValue?\"-0.45em\":\"0.35em\";return`<text data-label=\"${v(f.id)}\" x=\"${f.x}\" y=\"${f.y}\" text-anchor=\"${f.anchor}\" fill=\"${n.fg}\" font-family=\"${St}\" font-size=\"13\" stroke=\"${n.bg}\" stroke-width=\"3\" paint-order=\"stroke fill\" stroke-linejoin=\"round\"><tspan x=\"${f.x}\" dy=\"${p}\">${v(f.name)}</tspan>${w}</text>`}).join(\"\"),m=e.title?`<text x=\"32\" y=\"40\" fill=\"${n.fg}\" font-family=\"${qt}\" font-size=\"${e.title.length>42?22:28}\" font-weight=\"560\">${v(e.title)}</text>`:\"\",c=e.subtitle?`<text x=\"32\" y=\"62\" fill=\"${n.muted}\" font-family=\"${St}\" font-size=\"14\">${v(e.subtitle)}</text>`:\"\",g=e.title&&e.subtitle?74:e.title?56:0,b=e.title?`<rect x=\"32\" y=\"${g}\" width=\"36\" height=\"2\" fill=\"${n.rule}\"/>`:\"\";return`<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${e.width}\" height=\"${e.height}\" viewBox=\"0 0 ${e.width} ${e.height}\" role=\"img\" aria-label=\"${v(e.title||\"Sankey diagram\")}\">\n<style>text{font-variant-numeric:tabular-nums}</style>\n<rect width=\"100%\" height=\"100%\" fill=\"${n.bg}\"/>\n${m}${c}${b}\n<defs>${r}</defs>\n<g class=\"flows\">${o}</g>\n<g class=\"nodes\">${s}</g>\n<g class=\"labels\">${u}</g>\n</svg>`}function Mt(e){let n=vt(e);return{scene:n.scene,svg:n.scene?Lt(n.scene):\"\",meta:n.meta}}return Rt(Kt);})();\n";
function safeJson(value) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
function standaloneHtml(project) {
	const title = project.title || "Flume diagram";
	const engine = engine_iife_default.replace(/<\/script/gi, "<\\/script");
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
<script id="flume-project" type="application/json">${safeJson(project)}<\/script>
<script>${engine}<\/script>
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
<\/script>
</body>
</html>`;
}
var SANS = "Source Sans 3, Segoe UI, Helvetica, sans-serif";
var DISPLAY = "Fraunces, Georgia, Times New Roman, serif";
function linkHot(link, focus) {
	if (!focus) return true;
	if (focus.kind === "link") return link.id === focus.id;
	return link.source === focus.id || link.target === focus.id;
}
function nodeHot(id, focus, links) {
	if (!focus) return true;
	if (focus.kind === "node") {
		if (id === focus.id) return true;
		return links.some((link) => (link.source === focus.id || link.target === focus.id) && (link.source === id || link.target === id));
	}
	const link = links.find((item) => item.id === focus.id);
	return link?.source === id || link?.target === id;
}
function SankeySvg({ scene, focus, offsets, onFocus, onOffset }) {
	const svgRef = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)(null);
	const onOffsetRef = (0, import_react.useRef)(onOffset);
	onOffsetRef.current = onOffset;
	(0, import_react.useEffect)(() => {
		const move = (event) => {
			const current = drag.current;
			if (!current) return;
			onOffsetRef.current(current.id, current.base + (event.clientY - current.y) * current.scale);
		};
		const up = () => {
			drag.current = null;
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
	}, []);
	const ruleY = scene.title && scene.subtitle ? 74 : scene.title ? 56 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		ref: svgRef,
		viewBox: `0 0 ${scene.width} ${scene.height}`,
		width: scene.width,
		height: scene.height,
		className: "block h-auto w-full select-none",
		role: "group",
		"aria-label": scene.title || "Sankey diagram",
		onPointerLeave: () => onFocus(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "100%",
				height: "100%",
				fill: scene.paper.bg
			}),
			scene.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 32,
				y: 40,
				fill: scene.paper.fg,
				fontFamily: DISPLAY,
				fontSize: scene.title.length > 42 ? 22 : 28,
				fontWeight: 560,
				children: scene.title
			}) : null,
			scene.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 32,
				y: 62,
				fill: scene.paper.muted,
				fontFamily: SANS,
				fontSize: 14,
				children: scene.subtitle
			}) : null,
			scene.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 32,
				y: ruleY,
				width: 36,
				height: 2,
				fill: scene.paper.rule
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: scene.links.map((link) => link.gradient ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: link.gradient.id,
				gradientUnits: "userSpaceOnUse",
				x1: link.gradient.x1,
				y1: link.gradient.y1,
				x2: link.gradient.x2,
				y2: link.gradient.y2,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: link.gradient.from
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: link.gradient.to
				})]
			}, link.gradient.id) : null) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: scene.links.map((link) => {
				const hot = linkHot(link, focus);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: link.d,
					fill: link.fill,
					opacity: hot ? Math.min(.92, link.opacity + (focus ? .28 : 0)) : link.opacity * .12,
					className: "cursor-pointer transition-opacity duration-150",
					onPointerEnter: () => onFocus({
						kind: "link",
						id: link.id
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${link.source} → ${link.target}` })
				}, link.id);
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: scene.nodes.map((node) => {
				const hot = nodeHot(node.id, focus, scene.links);
				const hitHeight = Math.max(node.h, 18);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					opacity: hot ? 1 : .22,
					className: "transition-opacity duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: node.x,
						y: node.y,
						width: node.w,
						height: Math.max(node.h, .8),
						rx: 2,
						fill: node.color,
						pointerEvents: "none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: node.x - 8,
						y: node.y - (hitHeight - node.h) / 2,
						width: node.w + 16,
						height: hitHeight,
						fill: "transparent",
						className: "cursor-ns-resize touch-none",
						onPointerEnter: () => onFocus({
							kind: "node",
							id: node.id
						}),
						onPointerDown: (event) => {
							const svg = svgRef.current;
							if (!svg) return;
							event.preventDefault();
							const rect = svg.getBoundingClientRect();
							const box = svg.viewBox.baseVal;
							drag.current = {
								id: node.id,
								y: event.clientY,
								scale: box.height / rect.height,
								base: offsets[node.id] ?? 0
							};
						},
						onDoubleClick: (event) => {
							event.preventDefault();
							drag.current = null;
							onOffset(node.id, 0);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${node.id}. Drag to nudge, double-click to reset.` })
					})]
				}, node.id);
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				pointerEvents: "none",
				style: { fontVariantNumeric: "tabular-nums" },
				children: scene.labels.map((label) => {
					const hot = nodeHot(label.id, focus, scene.links);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: label.x,
						y: label.y,
						textAnchor: label.anchor,
						fill: scene.paper.fg,
						fontFamily: SANS,
						fontSize: 13,
						stroke: scene.paper.bg,
						strokeWidth: 3,
						paintOrder: "stroke fill",
						strokeLinejoin: "round",
						opacity: hot ? 1 : .28,
						className: "transition-opacity duration-150",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: label.x,
							dy: label.showValue ? "-0.45em" : "0.35em",
							children: label.name
						}), label.showValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: label.x,
							dy: "1.2em",
							fill: scene.paper.muted,
							fontSize: 11,
							stroke: scene.paper.bg,
							children: label.value
						}) : null]
					}, label.id);
				})
			})
		]
	});
}
var SIZES = [
	{
		label: "Standard",
		width: 1120,
		height: 680
	},
	{
		label: "Wide",
		width: 1440,
		height: 740
	},
	{
		label: "Tall",
		width: 900,
		height: 1040
	}
];
function Workbench() {
	const [project, setProject] = (0, import_react.useState)(DEFAULT_PROJECT);
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [present, setPresent] = (0, import_react.useState)(false);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("diagram");
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			const next = await projectFromLocation() ?? readStoredProject() ?? DEFAULT_PROJECT;
			if (cancel) return;
			setProject(next);
			setBooted(true);
		})();
		return () => {
			cancel = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!booted) return;
		writeStoredProject(project);
	}, [project, booted]);
	(0, import_react.useEffect)(() => {
		if (!note) return;
		const id = window.setTimeout(() => setNote(null), 3600);
		return () => window.clearTimeout(id);
	}, [note]);
	(0, import_react.useEffect)(() => {
		if (!present) return;
		const onKey = (event) => {
			if (event.key === "Escape") setPresent(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [present]);
	const { meta, scene, svg } = (0, import_react.useMemo)(() => render(project), [project]);
	const balanced = Math.abs(meta.totalIn - meta.totalOut) < 1e-4;
	const nudged = Object.values(project.offsets).some((value) => Math.abs(value) > .5);
	function patch(partial) {
		setProject((current) => ({
			...current,
			...partial
		}));
	}
	function patchSettings(partial) {
		setProject((current) => ({
			...current,
			settings: {
				...current.settings,
				...partial
			}
		}));
	}
	function loadSample(id) {
		const sample = SAMPLES.find((item) => item.id === id);
		if (!sample) return;
		setProject(structuredClone(sample.project));
		setFocus(null);
		setMenu(null);
		setTab("diagram");
		setNote(sample.name);
	}
	async function copyLink() {
		const packed = await packProject(project);
		if (packed.length > 7e3) {
			setNote("Too big for a link. Download the HTML page instead.");
			setMenu("download");
			return;
		}
		const url = new URL(window.location.href);
		url.hash = `f=${packed}`;
		try {
			await navigator.clipboard.writeText(url.toString());
			setNote("Link copied.");
		} catch {
			window.location.hash = `f=${packed}`;
			setNote("Link is in the address bar. Copy it from there.");
		}
		setMenu(null);
	}
	async function savePng(scale) {
		if (!svg) return;
		const blob = await svgToPng(svg, scale);
		downloadBlob(`${slug(project.title)}@${scale}x.png`, blob);
		setMenu(null);
	}
	function saveSvg() {
		if (!svg) return;
		downloadBlob(`${slug(project.title)}.svg`, new Blob([svg], { type: "image/svg+xml" }));
		setMenu(null);
	}
	function saveHtml() {
		const html = standaloneHtml(project);
		downloadBlob(`${slug(project.title)}.html`, new Blob([html], { type: "text/html" }));
		setMenu(null);
		setNote("HTML page downloaded. It still edits, with no install.");
	}
	function saveProjectFile() {
		downloadBlob(`${slug(project.title)}.flume.json`, new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }));
		setMenu(null);
	}
	async function openFile(file) {
		const text = await file.text();
		const trimmed = text.trim();
		if (trimmed.startsWith("{")) try {
			const next = normalizeProject(JSON.parse(trimmed));
			if (next) {
				setProject(next);
				setNote("Project opened.");
				setMenu(null);
				return;
			}
		} catch {}
		const converted = tryConvertTable(text);
		patch({
			source: (converted ?? text).replace(/\s+$/, "") + "\n",
			offsets: {}
		});
		setNote(converted ? "Turned that table into flows." : "Flows loaded.");
		setMenu(null);
		setTab("edit");
	}
	const diagram = scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SankeySvg, {
		scene,
		focus,
		offsets: project.offsets,
		onFocus: setFocus,
		onOffset: (id, offset) => {
			setProject((current) => {
				const offsets = { ...current.offsets };
				if (Math.abs(offset) < .5) delete offsets[id];
				else offsets[id] = offset;
				return {
					...current,
					offsets
				};
			});
		}
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-paper text-ink px-8 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Nothing to draw yet."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-paper-muted mt-3 max-w-sm text-base",
			children: [
				"One line is a flow. Try ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono",
					children: "Wages [6400] Rent"
				}),
				", or open a sample."
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-bg text-fg flex h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: project.title || "Flume"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-line relative z-30 border-b",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 px-3 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/favicon.svg",
								alt: "",
								className: "size-8 shrink-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display shrink-0 text-xl tracking-tight",
								children: "Flume"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Samples",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }),
										onClick: () => setMenu(menu === "samples" ? null : "samples"),
										pressed: menu === "samples"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Present",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" }),
										onClick: () => {
											if (!scene) return;
											setMenu(null);
											setPresent(true);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Copy link",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-4" }),
										onClick: () => void copyLink()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Download",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
										onClick: () => setMenu(menu === "download" ? null : "download"),
										pressed: menu === "download"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pt-1 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Diagram title",
							value: project.title,
							placeholder: "Untitled",
							onChange: (event) => patch({ title: event.target.value }),
							className: "font-display placeholder:text-muted w-full bg-transparent text-xl tracking-tight outline-none"
						})
					}),
					menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "fixed inset-0 z-20 cursor-default",
						"aria-label": "Close menu",
						onClick: () => setMenu(null)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-line bg-surface absolute top-full right-3 z-30 mt-1 w-72 rounded-lg border p-2 shadow-sheet",
						children: menu === "samples" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "hover:bg-raised w-full rounded-md px-3 py-2 text-left",
							onClick: () => loadSample(sample.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-base",
								children: sample.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted block text-sm",
								children: sample.blurb
							})]
						}) }, sample.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: saveHtml,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
									title: "HTML page",
									detail: "One file. Still editable offline."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: () => void savePng(2),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-4" }),
									title: "PNG",
									detail: "Sharp enough for a slide."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: () => void savePng(4),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-4" }),
									title: "PNG, large",
									detail: "Four times the pixels."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: saveSvg,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-4" }),
									title: "SVG",
									detail: "Vectors, for a layout tool."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: saveProjectFile,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" }),
									title: "Project file",
									detail: "Open it here later."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onClick: () => fileRef.current?.click(),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" }),
									title: "Open project or table",
									detail: "JSON, flows, or a spreadsheet paste."
								})
							]
						})
					})] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-line flex border-b md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === "diagram",
					onClick: () => setTab("diagram"),
					children: "Diagram"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === "edit",
					onClick: () => setTab("edit"),
					children: "Edit"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `${tab === "edit" ? "flex" : "hidden"} border-line min-h-0 w-full flex-col border-r md:flex md:w-96`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between px-4 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "flows",
								className: "text-muted text-sm tracking-widest uppercase",
								children: "Flows"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted text-sm",
								children: "Source [amount] Target"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "flows",
							value: project.source,
							spellCheck: false,
							autoCapitalize: "off",
							autoCorrect: "off",
							onChange: (event) => patch({ source: event.target.value }),
							onPaste: (event) => {
								const converted = tryConvertTable(event.clipboardData.getData("text/plain"));
								if (!converted) return;
								event.preventDefault();
								const target = event.currentTarget;
								patch({ source: target.value.slice(0, target.selectionStart) + converted + target.value.slice(target.selectionEnd) });
								setNote("Turned that table into flows.");
							},
							className: "border-line bg-bg font-mono text-fg mx-3 mt-2 min-h-48 flex-1 resize-none rounded-md border p-3 text-sm leading-6 outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted px-4 pt-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "[*]"
								}),
								" remainder · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "[?]"
								}),
								" shortfall · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: ":Name #color"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-40 space-y-1 overflow-auto px-4 py-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: balanced ? "text-fg" : "text-danger",
									children: meta.totalIn === 0 && meta.totalOut === 0 ? "No flows yet." : balanced ? `Balances · ${formatNumber(meta.totalIn, project.settings)} in and out` : `Off by ${formatNumber(meta.totalIn - meta.totalOut, project.settings)} · ${formatNumber(meta.totalIn, project.settings)} in, ${formatNumber(meta.totalOut, project.settings)} out`
								}),
								meta.computed.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: row.kind === "rest" ? `${row.target} is the remainder of ${row.source}` : `${row.source} fills the shortfall into ${row.target}`
										}),
										" · ",
										formatNumber(row.value, project.settings)
									]
								}, `${row.kind}:${row.source}:${row.target}`)),
								meta.errors.map((error) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-danger",
									children: [error.line ? `Line ${error.line}: ` : "", error.message]
								}, `${error.line}:${error.message}`)),
								meta.warnings.map((warning) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-brass",
									children: warning
								}, warning)),
								meta.balances.filter((row) => Math.abs(row.gap) >= 1e-4).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-danger",
									children: [
										row.name,
										" received ",
										formatNumber(row.inn, project.settings),
										" and sent ",
										formatNumber(row.out, project.settings),
										"."
									]
								}, row.name))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "border-line border-t px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "text-sm",
								children: "Tune the sheet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-1 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "Subtitle"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: project.subtitle,
											onChange: (event) => patch({ subtitle: event.target.value }),
											className: "border-line bg-bg rounded-md border px-2 py-2"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											"left",
											"justify",
											"right"
										].map((align) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: project.settings.align === align,
											onClick: () => patchSettings({ align }),
											children: align === "justify" ? "Spread" : align === "left" ? "As entered" : "To the right"
										}, align))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: SIZES.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: project.settings.width === size.width && project.settings.height === size.height,
											onClick: () => patchSettings({
												width: size.width,
												height: size.height
											}),
											children: size.label
										}, size.label))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
												active: project.settings.showLabels,
												onClick: () => patchSettings({ showLabels: !project.settings.showLabels }),
												children: "Labels"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
												active: project.settings.showValues,
												onClick: () => patchSettings({ showValues: !project.settings.showValues }),
												children: "Values"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
												active: project.settings.sort === "value",
												onClick: () => patchSettings({ sort: project.settings.sort === "value" ? "entry" : "value" }),
												children: "Largest first"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: [
											"cream",
											"white",
											"ink"
										].map((paper) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: project.settings.paper === paper,
											onClick: () => patchSettings({ paper }),
											children: paper === "cream" ? "Cream" : paper === "white" ? "White" : "Ink"
										}, paper))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Prefix",
											value: project.settings.prefix,
											onChange: (prefix) => patchSettings({ prefix })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Suffix",
											value: project.settings.suffix,
											onChange: (suffix) => patchSettings({ suffix })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											0,
											1,
											2
										].map((decimals) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: project.settings.decimals === decimals,
											onClick: () => patchSettings({ decimals }),
											children: decimals === 0 ? "Whole numbers" : `${decimals} decimal${decimals > 1 ? "s" : ""}`
										}, decimals))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										label: "Gap",
										min: 8,
										max: 40,
										step: 1,
										value: project.settings.nodeGap,
										onChange: (nodeGap) => patchSettings({ nodeGap })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										label: "Ribbon",
										min: .2,
										max: .85,
										step: .05,
										value: project.settings.flowOpacity,
										onChange: (flowOpacity) => patchSettings({ flowOpacity })
									}),
									nudged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-brass min-h-11 text-left text-sm",
										onClick: () => patch({ offsets: {} }),
										children: "Reset nudged bars"
									}) : null
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: `${tab === "diagram" ? "flex" : "hidden"} min-h-0 min-w-0 flex-1 flex-col md:flex`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1 overflow-auto p-3 md:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shadow-sheet mx-auto overflow-hidden rounded-lg",
							children: present ? null : diagram
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted mx-auto mt-3 max-w-xl text-sm",
							children: "Drag a bar to nudge it. Hover a ribbon to see only that path. The numbers beside the source are the check: if it balances, every unit is accounted for."
						})]
					})
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-line bg-surface text-fg fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border px-4 py-2 text-sm shadow-sheet",
				role: "status",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".json,.txt,.csv,.tsv,text/plain",
				className: "hidden",
				onChange: (event) => {
					const file = event.target.files?.[0];
					if (file) openFile(file);
					event.target.value = "";
				}
			}),
			present && scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-bg fixed inset-0 z-50 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Flume"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "border-line hover:bg-raised flex min-h-11 items-center gap-2 rounded-full border px-4",
						onClick: () => setPresent(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Close"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-auto px-4 pb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shadow-sheet mx-auto max-w-6xl overflow-hidden rounded-lg",
						children: diagram
					})
				})]
			}) : null
		]
	});
}
function IconButton({ label, icon, onClick, pressed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-label": label,
		"aria-pressed": pressed,
		onClick,
		className: `flex min-h-11 items-center gap-2 rounded-full px-3 ${pressed ? "bg-brass text-brass-ink" : "hover:bg-raised"}`,
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden text-sm sm:inline",
			children: label
		})]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 flex-1 text-sm ${active ? "border-brass text-fg border-b-2" : "text-muted"}`,
		children
	});
}
function Choice({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: `min-h-11 rounded-full px-3 text-sm ${active ? "bg-brass text-brass-ink" : "border-line hover:bg-raised border"}`,
		children
	});
}
function MenuItem({ onClick, icon, title, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "hover:bg-raised flex min-h-11 items-start gap-3 rounded-md px-2 py-2 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-brass mt-1",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted block text-sm",
			children: detail
		})] })]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (event) => onChange(event.target.value),
			className: "border-line bg-bg rounded-md border px-2 py-2"
		})]
	});
}
function Slider({ label, min, max, step, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted w-16",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (event) => onChange(Number(event.target.value)),
			className: "min-h-11 flex-1"
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workbench, {});
}
//#endregion
export { Home as component };
