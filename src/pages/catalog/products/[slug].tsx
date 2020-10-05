import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";

const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>loading...</p>,
});

export default function Products() {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  return (
    <>
      <h1>{router.query.slug}</h1>
      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </>
  );
}
