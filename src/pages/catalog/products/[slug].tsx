import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";

interface ProductProps {
  product: Document;
}

const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>loading...</p>,
});

export default function Products({ product }: ProductProps) {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  if (router.isFallback) {
    return <p>loading...</p>;
  }

  return (
    <>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>
      <button onClick={handleAddToCart}>Add to cart</button>
      {isAddToCartModalVisible && <AddToCartModal />}

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>

      <p>Price: ${product.data.price}</p>

      <img
        src={product.data.thumbnail.url}
        alt={product.data.title}
        width="200"
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;
  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
};
