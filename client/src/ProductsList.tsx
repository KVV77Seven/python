// src/ProductsList.tsx
import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fetchProducts } from "./api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
}

const ProductsList: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Product[]>(
    "products",
    ({ pageParam = 1 }) => fetchProducts({ pageParam }),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length + 1 : undefined,
    }
  );

  const products = data?.pages.flat() || [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? products.length + 1 : products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (
      lastItem &&
      lastItem.index >= products.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    products.length,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных</div>;

  return (
    <div
      ref={parentRef}
      style={{
        height: "100vh",
        overflow: "auto",
        width: "100%",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > products.length - 1;
          const product = products[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                borderBottom: "1px solid #ccc",
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div>Загрузка...</div>
                ) : (
                  <div>Больше данных нет</div>
                )
              ) : (
                <>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <p>Цена: ${product.price}</p>
                  <p>Бренд: {product.brand}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
