export const fetchProducts = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `http://localhost:5000/products?page=${pageParam}&per_page=100`
  );
  return res.json();
};

export const fetchBrands = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `http://localhost:5000/brands?page=${pageParam}&per_page=100`
  );
  return res.json();
};
