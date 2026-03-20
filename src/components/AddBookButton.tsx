"use client";

import { useState } from "react";
import AddBookModal from "@/components/AddBookModal";

export default function AddBookButton({
  onBookAdded,
}: {
  onBookAdded: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        + Add Book
      </button>
      {open && (
        <AddBookModal
          onClose={() => setOpen(false)}
          onBookAdded={onBookAdded}
        />
      )}
    </>
  );
}