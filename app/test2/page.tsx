"use client";

import { useState, useRef, useEffect } from "react";

export default function ResizableSidebar() {
  /* ───── Config ───── */
  const MIN_W = 160;   // px
  const MAX_W = 400;   // px
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState(240);      // live width

  /* ───── Drag logic ───── */
  const dragRef = useRef<HTMLDivElement | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current?.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startWidth = width;

    function onMove(ev: PointerEvent) {
      const next = Math.min(
        MAX_W,
        Math.max(MIN_W, startWidth + (ev.clientX - startX)),
      );
      setWidth(next);
    }
    function onUp(ev: PointerEvent) {
      dragRef.current?.releasePointerCapture(ev.pointerId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  /* ───── TW width utility string ───── */
  const sidebarWidth = open ? `w-[${width}px]` : "w-0";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ─────────── Sidebar ─────────── */}
      <aside
        className={`shrink-0 overflow-hidden border-r border-gray-700
          bg-gray-900 text-white transition-[width] duration-200 ease-in-out
          ${sidebarWidth}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-2 px-4">
          {open && <span className="text-lg font-semibold">My&nbsp;App</span>}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="ml-auto rounded-md p-2 hover:bg-gray-800 active:scale-95 transition"
          >
            {/* tiny chevron icon (inline SVG) */}
            {open ? (
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <path d="M12 5.5 7 10l5 4.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <path d="M8 14.5 13 10 8 5.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex flex-col gap-1">
          {[
            ["M10 3 3 10l7 7", "Home"],
            ["M4 14h12M4 10h12M4 6h12", "Reports"],
            ["M4 5h12l-6 10z", "Settings"],
          ].map(([d, label]) => (
            <NavItem key={label} d={d as string} label={label as string} />
          ))}

          <div className="flex-grow" />
          <NavItem
            d="M6 6l8 8M6 14 14 6"    /* X icon */
            label="Log out"
          />
        </nav>
      </aside>

      {/* ─────────── Drag handle ─────────── */}
      {open && (
        <div
          ref={dragRef}
          onPointerDown={onPointerDown}
          className="w-2 cursor-col-resize bg-transparent hover:bg-gray-200/40
                     active:bg-gray-300 transition-colors"
        />
      )}

      {/* ─────────── Main content ───────── */}
      <main className="flex-1 select-none overflow-y-auto bg-gray-50 p-8">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p>Resize the sidebar by dragging the thin handle. Collapse/expand with the chevron.</p>
      </main>
    </div>
  );
}

/* ---------- Simple nav link (icon + label) ---------- */
function NavItem({ d, label }: { d: string; label: string }) {
  return (
    <a
      href="#"
      className="group flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors"
      title={label}
    >
      <svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        className="shrink-0"
      >
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
