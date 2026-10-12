import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Download, FolderOpen, Image, Link, Maximize2, Library, X } from "lucide-react";
import { formatNumber, slug } from "@/lib/flume/format";
import { tryConvertTable } from "@/lib/flume/parse";
import {
  downloadBlob,
  normalizeProject,
  packProject,
  projectFromLocation,
  readStoredProject,
  svgToPng,
  writeStoredProject,
} from "@/lib/flume/project";
import { render } from "@/lib/flume/render";
import { DEFAULT_PROJECT, SAMPLES } from "@/lib/flume/samples";
import { standaloneHtml } from "@/lib/flume/standalone";
import type { Project, Settings } from "@/lib/flume/types";
import { SankeySvg, type Focus } from "@/components/flume/sankey-svg";

type Menu = "samples" | "download" | null;

const SIZES: { label: string; width: number; height: number }[] = [
  { label: "Standard", width: 1120, height: 680 },
  { label: "Wide", width: 1440, height: 740 },
  { label: "Tall", width: 900, height: 1040 },
];

export function Workbench() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [booted, setBooted] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const [present, setPresent] = useState(false);
  const [focus, setFocus] = useState<Focus>(null);
  const [note, setNote] = useState<string | null>(null);
  const [tab, setTab] = useState<"diagram" | "edit">("diagram");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      const fromHash = await projectFromLocation();
      const next = fromHash ?? readStoredProject() ?? DEFAULT_PROJECT;
      if (cancel) return;
      setProject(next);
      setBooted(true);
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!booted) return;
    writeStoredProject(project);
  }, [project, booted]);

  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(null), 3600);
    return () => window.clearTimeout(id);
  }, [note]);

  useEffect(() => {
    if (!present) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPresent(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present]);

  const result = useMemo(() => render(project), [project]);
  const { meta, scene, svg } = result;
  const balanced = Math.abs(meta.totalIn - meta.totalOut) < 0.0001;
  const nudged = Object.values(project.offsets).some((value) => Math.abs(value) > 0.5);

  function patch(partial: Partial<Project>) {
    setProject((current) => ({ ...current, ...partial }));
  }

  function patchSettings(partial: Partial<Settings>) {
    setProject((current) => ({ ...current, settings: { ...current.settings, ...partial } }));
  }

  function loadSample(id: string) {
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
    if (packed.length > 7000) {
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

  async function savePng(scale: number) {
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
    downloadBlob(
      `${slug(project.title)}.flume.json`,
      new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }),
    );
    setMenu(null);
  }

  async function openFile(file: File) {
    const text = await file.text();
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) {
      try {
        const next = normalizeProject(JSON.parse(trimmed));
        if (next) {
          setProject(next);
          setNote("Project opened.");
          setMenu(null);
          return;
        }
      } catch {
        /* fall through and treat it as flows */
      }
    }
    const converted = tryConvertTable(text);
    patch({ source: (converted ?? text).replace(/\s+$/, "") + "\n", offsets: {} });
    setNote(converted ? "Turned that table into flows." : "Flows loaded.");
    setMenu(null);
    setTab("edit");
  }

  const diagram = scene ? (
    <SankeySvg
      scene={scene}
      focus={focus}
      offsets={project.offsets}
      onFocus={setFocus}
      onOffset={(id, offset) => {
        setProject((current) => {
          const offsets = { ...current.offsets };
          if (Math.abs(offset) < 0.5) delete offsets[id];
          else offsets[id] = offset;
          return { ...current, offsets };
        });
      }}
    />
  ) : (
    <div className="bg-paper text-ink px-8 py-16">
      <p className="font-display text-2xl">Nothing to draw yet.</p>
      <p className="text-paper-muted mt-3 max-w-sm text-base">
        One line is a flow. Try <span className="font-mono">Wages [6400] Rent</span>, or open a sample.
      </p>
    </div>
  );

  return (
    <div className="bg-bg text-fg flex h-dvh flex-col">
      <h1 className="sr-only">{project.title || "Flume"}</h1>
      <header className="border-line relative z-30 border-b">
        <div className="flex items-center gap-2 px-3 pt-2">
          <img src="/favicon.svg" alt="" className="size-8 shrink-0" />
          <p className="font-display shrink-0 text-xl tracking-tight">Flume</p>
          <div className="ml-auto flex items-center gap-1">
            <IconButton label="Samples" icon={<Library className="size-4" />} onClick={() => setMenu(menu === "samples" ? null : "samples")} pressed={menu === "samples"} />
            <IconButton label="Present" icon={<Maximize2 className="size-4" />} onClick={() => { if (!scene) return; setMenu(null); setPresent(true); }} />
            <IconButton label="Copy link" icon={<Link className="size-4" />} onClick={() => void copyLink()} />
            <IconButton label="Download" icon={<Download className="size-4" />} onClick={() => setMenu(menu === "download" ? null : "download")} pressed={menu === "download"} />
          </div>
        </div>
        <div className="px-3 pt-1 pb-2">
          <input
            aria-label="Diagram title"
            value={project.title}
            placeholder="Untitled"
            onChange={(event) => patch({ title: event.target.value })}
            className="font-display placeholder:text-muted w-full bg-transparent text-xl tracking-tight outline-none"
          />
        </div>
        {menu ? (
          <>
            <button className="fixed inset-0 z-20 cursor-default" aria-label="Close menu" onClick={() => setMenu(null)} />
            <div className="border-line bg-surface absolute top-full right-3 z-30 mt-1 w-72 rounded-lg border p-2 shadow-sheet">
              {menu === "samples" ? (
                <ul>
                  {SAMPLES.map((sample) => (
                    <li key={sample.id}>
                      <button
                        className="hover:bg-raised w-full rounded-md px-3 py-2 text-left"
                        onClick={() => loadSample(sample.id)}
                      >
                        <span className="block text-base">{sample.name}</span>
                        <span className="text-muted block text-sm">{sample.blurb}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col">
                  <MenuItem onClick={saveHtml} icon={<Download className="size-4" />} title="HTML page" detail="One file. Still editable offline." />
                  <MenuItem onClick={() => void savePng(2)} icon={<Image className="size-4" />} title="PNG" detail="Sharp enough for a slide." />
                  <MenuItem onClick={() => void savePng(4)} icon={<Image className="size-4" />} title="PNG, large" detail="Four times the pixels." />
                  <MenuItem onClick={saveSvg} icon={<Image className="size-4" />} title="SVG" detail="Vectors, for a layout tool." />
                  <MenuItem onClick={saveProjectFile} icon={<FolderOpen className="size-4" />} title="Project file" detail="Open it here later." />
                  <MenuItem onClick={() => fileRef.current?.click()} icon={<FolderOpen className="size-4" />} title="Open project or table" detail="JSON, flows, or a spreadsheet paste." />
                </div>
              )}
            </div>
          </>
        ) : null}
      </header>

      <div className="border-line flex border-b md:hidden">
        <TabButton active={tab === "diagram"} onClick={() => setTab("diagram")}>Diagram</TabButton>
        <TabButton active={tab === "edit"} onClick={() => setTab("edit")}>Edit</TabButton>
      </div>

      <div className="flex min-h-0 flex-1">
        <section className={`${tab === "edit" ? "flex" : "hidden"} border-line min-h-0 w-full flex-col border-r md:flex md:w-96`}>
          <div className="flex items-baseline justify-between px-4 pt-4">
            <label htmlFor="flows" className="text-muted text-sm tracking-widest uppercase">Flows</label>
            <span className="text-muted text-sm">Source [amount] Target</span>
          </div>
          <textarea
            id="flows"
            value={project.source}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            onChange={(event) => patch({ source: event.target.value })}
            onPaste={(event) => {
              const text = event.clipboardData.getData("text/plain");
              const converted = tryConvertTable(text);
              if (!converted) return;
              event.preventDefault();
              const target = event.currentTarget;
              const next = target.value.slice(0, target.selectionStart) + converted + target.value.slice(target.selectionEnd);
              patch({ source: next });
              setNote("Turned that table into flows.");
            }}
            className="border-line bg-bg font-mono text-fg mx-3 mt-2 min-h-48 flex-1 resize-none rounded-md border p-3 text-sm leading-6 outline-none"
          />
          <p className="text-muted px-4 pt-2 text-sm">
            <span className="font-mono">[*]</span> remainder · <span className="font-mono">[?]</span> shortfall · <span className="font-mono">:Name #color</span>
          </p>
          <div className="max-h-40 space-y-1 overflow-auto px-4 py-3 text-sm">
            <p className={balanced ? "text-fg" : "text-danger"}>
              {meta.totalIn === 0 && meta.totalOut === 0
                ? "No flows yet."
                : balanced
                  ? `Balances · ${formatNumber(meta.totalIn, project.settings)} in and out`
                  : `Off by ${formatNumber(meta.totalIn - meta.totalOut, project.settings)} · ${formatNumber(meta.totalIn, project.settings)} in, ${formatNumber(meta.totalOut, project.settings)} out`}
            </p>
            {meta.computed.map((row) => (
              <p key={`${row.kind}:${row.source}:${row.target}`} className="text-muted">
                <span className="text-fg">
                  {row.kind === "rest"
                    ? `${row.target} is the remainder of ${row.source}`
                    : `${row.source} fills the shortfall into ${row.target}`}
                </span>
                {" · "}
                {formatNumber(row.value, project.settings)}
              </p>
            ))}
            {meta.errors.map((error) => (
              <p key={`${error.line}:${error.message}`} className="text-danger">
                {error.line ? `Line ${error.line}: ` : ""}
                {error.message}
              </p>
            ))}
            {meta.warnings.map((warning) => (
              <p key={warning} className="text-brass">{warning}</p>
            ))}
            {meta.balances
              .filter((row) => Math.abs(row.gap) >= 0.0001)
              .map((row) => (
                <p key={row.name} className="text-danger">
                  {row.name} received {formatNumber(row.inn, project.settings)} and sent {formatNumber(row.out, project.settings)}.
                </p>
              ))}
          </div>
          <details className="border-line border-t px-4 py-3">
            <summary className="text-sm">Tune the sheet</summary>
            <div className="mt-3 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted">Subtitle</span>
                <input
                  value={project.subtitle}
                  onChange={(event) => patch({ subtitle: event.target.value })}
                  className="border-line bg-bg rounded-md border px-2 py-2"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {(["left", "justify", "right"] as const).map((align) => (
                  <Choice key={align} active={project.settings.align === align} onClick={() => patchSettings({ align })}>
                    {align === "justify" ? "Spread" : align === "left" ? "As entered" : "To the right"}
                  </Choice>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <Choice
                    key={size.label}
                    active={project.settings.width === size.width && project.settings.height === size.height}
                    onClick={() => patchSettings({ width: size.width, height: size.height })}
                  >
                    {size.label}
                  </Choice>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Choice active={project.settings.showLabels} onClick={() => patchSettings({ showLabels: !project.settings.showLabels })}>
                  Labels
                </Choice>
                <Choice active={project.settings.showValues} onClick={() => patchSettings({ showValues: !project.settings.showValues })}>
                  Values
                </Choice>
                <Choice active={project.settings.sort === "value"} onClick={() => patchSettings({ sort: project.settings.sort === "value" ? "entry" : "value" })}>
                  Largest first
                </Choice>
              </div>
              <div className="flex gap-2">
                {(["cream", "white", "ink"] as const).map((paper) => (
                  <Choice key={paper} active={project.settings.paper === paper} onClick={() => patchSettings({ paper })}>
                    {paper === "cream" ? "Cream" : paper === "white" ? "White" : "Ink"}
                  </Choice>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Prefix" value={project.settings.prefix} onChange={(prefix) => patchSettings({ prefix })} />
                <Field label="Suffix" value={project.settings.suffix} onChange={(suffix) => patchSettings({ suffix })} />
              </div>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map((decimals) => (
                  <Choice key={decimals} active={project.settings.decimals === decimals} onClick={() => patchSettings({ decimals })}>
                    {decimals === 0 ? "Whole numbers" : `${decimals} decimal${decimals > 1 ? "s" : ""}`}
                  </Choice>
                ))}
              </div>
              <Slider label="Gap" min={8} max={40} step={1} value={project.settings.nodeGap} onChange={(nodeGap) => patchSettings({ nodeGap })} />
              <Slider label="Ribbon" min={0.2} max={0.85} step={0.05} value={project.settings.flowOpacity} onChange={(flowOpacity) => patchSettings({ flowOpacity })} />
              {nudged ? (
                <button className="text-brass min-h-11 text-left text-sm" onClick={() => patch({ offsets: {} })}>
                  Reset nudged bars
                </button>
              ) : null}
            </div>
          </details>
        </section>

        <section className={`${tab === "diagram" ? "flex" : "hidden"} min-h-0 min-w-0 flex-1 flex-col md:flex`}>
          <div className="min-h-0 flex-1 overflow-auto p-3 md:p-6">
            <div className="shadow-sheet mx-auto overflow-hidden rounded-lg">{present ? null : diagram}</div>
            <p className="text-muted mx-auto mt-3 max-w-xl text-sm">
              Drag a bar to nudge it. Hover a ribbon to see only that path. The numbers beside the source are the check: if it balances, every unit is accounted for.
            </p>
          </div>
        </section>
      </div>

      {note ? (
        <p className="border-line bg-surface text-fg fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border px-4 py-2 text-sm shadow-sheet" role="status">
          {note}
        </p>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept=".json,.txt,.csv,.tsv,text/plain"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void openFile(file);
          event.target.value = "";
        }}
      />

      {present && scene ? (
        <div className="bg-bg fixed inset-0 z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-display text-xl">Flume</p>
            <button className="border-line hover:bg-raised flex min-h-11 items-center gap-2 rounded-full border px-4" onClick={() => setPresent(false)}>
              <X className="size-4" />
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-4 pb-8">
            <div className="shadow-sheet mx-auto max-w-6xl overflow-hidden rounded-lg">{diagram}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  pressed,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-2 rounded-full px-3 ${pressed ? "bg-brass text-brass-ink" : "hover:bg-raised"}`}
    >
      {icon}
      <span className="hidden text-sm sm:inline">{label}</span>
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 flex-1 text-sm ${active ? "border-brass text-fg border-b-2" : "text-muted"}`}
    >
      {children}
    </button>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-full px-3 text-sm ${active ? "bg-brass text-brass-ink" : "border-line hover:bg-raised border"}`}
    >
      {children}
    </button>
  );
}

function MenuItem({
  onClick,
  icon,
  title,
  detail,
}: {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <button type="button" onClick={onClick} className="hover:bg-raised flex min-h-11 items-start gap-3 rounded-md px-2 py-2 text-left">
      <span className="text-brass mt-1">{icon}</span>
      <span>
        <span className="block text-sm">{title}</span>
        <span className="text-muted block text-sm">{detail}</span>
      </span>
    </button>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="border-line bg-bg rounded-md border px-2 py-2" />
    </label>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="text-muted w-16">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-h-11 flex-1"
      />
    </label>
  );
}
