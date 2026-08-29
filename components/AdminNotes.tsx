"use client";

import { useState, useTransition } from "react";
import { saveAdminNotes, markContacted } from "@/app/actions/admin";
import { formatDateTime } from "@/app/lib/timezone";

export default function AdminNotes({
  id,
  notes,
  contactedAt,
}: {
  id: string;
  notes: string | null;
  contactedAt: string | null;
}) {
  const [text, setText] = useState(notes ?? "");
  const [saved, setSaved] = useState(notes ?? "");
  const [contacted, setContacted] = useState(contactedAt);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    if (text === saved) return;
    startTransition(async () => {
      const result = await saveAdminNotes(id, text);
      if (result.ok) {
        setSaved(text);
        setMessage("Saved");
        setTimeout(() => setMessage(null), 1500);
      } else {
        setMessage(result.error);
      }
    });
  }

  function toggleContacted(next: boolean) {
    const previous = contacted;
    setContacted(next ? new Date().toISOString() : null);
    startTransition(async () => {
      const result = await markContacted(id, next);
      if (!result.ok) {
        setContacted(previous);
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-slate-800">
        <input
          type="checkbox"
          checked={Boolean(contacted)}
          disabled={pending}
          onChange={(e) => toggleContacted(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        Customer contacted
        {contacted && (
          <span className="text-xs text-slate-500">({formatDateTime(contacted)})</span>
        )}
      </label>

      <div>
        <label htmlFor="adminNotes" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Internal notes (customer never sees this)
        </label>
        <textarea
          id="adminNotes"
          rows={4}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          placeholder="Deposit paid, delivering to hotel at 9:00, flight number…"
          className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <span aria-live="polite">{message ?? (text !== saved ? "Unsaved changes" : "")}</span>
          <button
            type="button"
            onClick={save}
            disabled={pending || text === saved}
            className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>
    </div>
  );
}
