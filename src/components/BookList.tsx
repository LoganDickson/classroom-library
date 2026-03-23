"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover_url: string;
  added_at: string;
};

type Props = {
  refreshKey: number;
  search: string;
};

export default function BookList({ refreshKey, search }: Props) {
  const supabase = createClient();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("title", { ascending: true });

      setBooks(data ?? []);
      setLoading(false);
    }

    fetchBooks();
  }, [refreshKey]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this book?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    await supabase.from("books").delete().eq("id", id);
    setBooks((prev) => prev.filter((book) => book.id !== id));
    setDeletingId(null);
  }

  const filtered = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">Loading books...</div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        No books yet. Add your first one!
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} of {books.length} books
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col items-center text-center relative group"
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(book.id)}
              disabled={deletingId === book.id}
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
              title="Remove book"
            >
              &times;
            </button>

            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                width={80}
                height={110}
                className="object-cover rounded mb-3"
              />
            ) : (
              <div className="w-20 h-28 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-300 text-3xl">
                📚
              </div>
            )}
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
              {book.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}