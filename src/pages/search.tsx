import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import Prismic from "prismic-javascript";
import { client } from "@/lib/prismic";

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map((product) => {
          return (
            <li key={product.id}>
              <Link href={`catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context
) => {
  const { q } = context.query;

  if (!q) {
    return { props: { searchResults: [] } };
  }

  const searchResults = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.fulltext("my.product.title", String(q)),
  ]);

  return {
    props: {
      searchResults: searchResults.results,
    },
  };
};
