// src/BrandsList.tsx
import React from "react";
import { useInfiniteQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import { fetchBrands } from "./api";

interface Brand {
  id: number;
  name: string;
  product_count: number;
}

const BrandsList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery<Brand[]>(
      "brands",
      ({ pageParam = 1 }) => fetchBrands({ pageParam }),
      {
        getNextPageParam: (lastPage, pages) =>
          lastPage.length === 100 ? pages.length + 1 : undefined,
      }
    );

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных</div>;

  const brands = data?.pages.flat() || [];

  return (
    <div style={{ flex: 1 }}>
      <List
        height={window.innerHeight}
        itemCount={brands.length}
        itemSize={60}
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex >= brands.length - 1 && hasNextPage) {
            fetchNextPage();
          }
        }}
        width={"100%"}
      >
        {({ index, style }) => {
          const brand = brands[index];
          return (
            <div style={style} key={brand.id}>
              <h2>{brand.name}</h2>
              <p>Количество продуктов: {brand.product_count}</p>
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default BrandsList;
