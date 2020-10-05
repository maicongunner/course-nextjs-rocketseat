import { GetStaticProps } from "next";

interface IProduct {
  id: string;
  title: string;
}

interface Top10Props {
  products: IProduct[];
}

export default function top10({ products }: Top10Props) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}

// revalidate: next.js will generate the static pages each 5s
export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 5,
  };
};
