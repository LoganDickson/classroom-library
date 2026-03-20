"use client";

import { useState } from "react";
import BookList from "@/components/BookList";
import AddBookButton from "@/components/AddBookButton";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📚 Classroom Library
            </h1>
            <p className="text-gray-500 mt-1">
              Keep track of all your classroom books
            </p>
          </div>
          <AddBookButton onBookAdded={() => setRefreshKey((k) => k + 1)} />
        </div>
        <BookList refreshKey={refreshKey} />
      </div>
    </main>
  );
}