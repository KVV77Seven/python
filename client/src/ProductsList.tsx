// src/ProductsList.tsx
import React from "react";
import { useInfiniteQuery } from "react-query";
import { fetchProducts } from "./api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
}

const ProductsList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery<Product[]>(
      "products",
      ({ pageParam = 1 }) => fetchProducts({ pageParam }),
      {
        getNextPageParam: (lastPage, pages) =>
          lastPage.length === 100 ? pages.length + 1 : undefined,
      }
    );

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных</div>;

  const products = data?.pages.flat() || [];
  return (
    <div style={{ flex: 1, overflowY: "auto", height: "100vh" }}>
      {products.map((product) => (
        <div
          key={product.id}
          style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
        >
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Цена: ${product.price}</p>
          <p>Бренд: {product.brand}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
