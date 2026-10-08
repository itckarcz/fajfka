"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveItemAction } from "./actions";

export default function ArchiveButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    startTransition(async () => {
      await archiveItemAction(id);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isPending}
      className="ml-3 flex-shrink-0 h-9 px-3 rounded-md border border-line text-caption text-ink-muted font-semibold disabled:opacity-40"
      aria-label="Archivovat"
    >
      {isPending ? "…" : "Arch."}
    </button>
  );
}
