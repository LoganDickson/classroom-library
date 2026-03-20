"use client";

import { useState } from "react";
import { searchBook, BookResult } from "@/lib/googleBooks";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Props = {
  onClose: () => void;
  onBookAdded: () => void;
};

export default function AddBookModal({ onClose, onBookAdded }: Props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<BookResult | null>(null);
  const [status, setStatus] = useState<
    "idle" | "searching" | "found" | "duplicate" | "saving" | "error"
  >("idle");

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("searching");
    setResult(null);

    const book = await searchBook(query);
    if (!book) {
      setStatus("error");
      return;
    }

    // Check for duplicate
    const { data } = await supabase
      .from("books")
      .select("id")
      .eq("isbn", book.isbn)
      .single();

    if (data) {
      setResult(book);
      setStatus("duplicate");
      return;
    }

    setResult(book);
    setStatus("found");
  }

  async function handleSave() {
    if (!result) return;
    setStatus("saving");

    const { error } = await supabase.from("books").insert([result]);

    if (error) {
      setStatus("error");
      return;
    }

    onBookAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add a Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by title or ISBN..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={status === "searching"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {status === "searching" ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 flex gap-4">
            {result.cover_url && (
              <Image
                src={result.cover_url}
                alt={result.title}
                width={60}
                height={80}
                className="object-cover rounded"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{result.title}</p>
              <p className="text-sm text-gray-500">{result.author}</p>
              <p className="text-xs text-gray-400 mt-1">ISBN: {result.isbn}</p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status === "duplicate" && (
          <p className="text-amber-600 text-sm mb-4">
            ⚠️ This book is already in the library!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm mb-4">
            No book found. Try a different search.
          </p>
        )}

        {/* Save Button */}
        {status === "found" && (
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Add to Library
          </button>
        )}
      </div>
    </div>
  );
}