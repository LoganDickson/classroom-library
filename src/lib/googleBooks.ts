export type BookResult = {
  isbn: string;
  title: string;
  author: string;
  cover_url: string;
};

export async function searchBook(query: string): Promise<BookResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`
  );
  const data = await res.json();

  const item = data.items?.[0];
  if (!item) return null;

  const info = item.volumeInfo;
  const isbn =
    info.industryIdentifiers?.find(
      (id: { type: string }) => id.type === "ISBN_13"
    )?.identifier ?? "";

  return {
    isbn,
    title: info.title ?? "Unknown Title",
    author: info.authors?.[0] ?? "Unknown Author",
    cover_url: info.imageLinks?.thumbnail ?? "",
  };
}