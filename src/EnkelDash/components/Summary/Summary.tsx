import React, { useEffect, useMemo } from "react";
import { useDashboardStore } from "../../store/DashboardStore";
import type { ToolKey } from "../../types/activity";
import { TOOL_LABELS } from "../../types/activity";
import "./Summary.scss";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export default function Summary() {
  const { items, loading, init, filters, setTools } = useDashboardStore();

  useEffect(() => { init(); }, [init]);

  // Ultimo aggiornamento per ciascun tool
  const latestPerTool = useMemo(() => {
    const map = new Map<ToolKey, number>();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const t = it.tool as ToolKey;
      const prevIdx = map.get(t);
      if (prevIdx == null) {
        map.set(t, i);
      } else {
        const prev = items[prevIdx];
        if (+new Date(it.createdAt) > +new Date(prev.createdAt)) map.set(t, i);
      }
    }
    const picked = Array.from(map.values()).map(idx => items[idx]);
    picked.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return picked;
  }, [items]);

  // Applica solo i filtri per tool (chip)
  const filtered = useMemo(() => {
    if (!filters.tools.length) return latestPerTool;
    const set = new Set(filters.tools);
    return latestPerTool.filter(i => set.has(i.tool as ToolKey));
  }, [latestPerTool, filters.tools]);

  const toggleTool = (k: ToolKey) => {
    const active = new Set(filters.tools);
    active.has(k) ? active.delete(k) : active.add(k);
    setTools(Array.from(active));
  };

  return (
    <section className="summary">
      <div className="summary-head">
        <h3>Senaste uppdateringar (senaste per verktyg)</h3>

        <div className="summary-filters">
          <div className="tools">
            {(Object.keys(TOOL_LABELS) as ToolKey[]).map(k => (
              <button
                key={k}
                className={`chip ${filters.tools.includes(k) ? "on" : ""}`}
                onClick={() => toggleTool(k)}
              >
                {TOOL_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="summary-list">
        {filtered.map(it => (
          <article key={it.id} className={`summary-item tool-${it.tool}`}>
            <header>
              <h4>{TOOL_LABELS[it.tool as ToolKey] ?? it.title}</h4>
              <time dateTime={it.createdAt}>{fmt(it.createdAt)}</time>
            </header>
            <p className="text">{it.text}</p>
          </article>
        ))}

        {!filtered.length && !loading && (
          <div className="empty">Inga uppdateringar.</div>
        )}
      </div>
    </section>
  );
}