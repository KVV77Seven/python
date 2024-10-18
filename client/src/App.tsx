// src/App.tsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProductsList from "./ProductsList";
import BrandsList from "./BrandList";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "brands">("products");

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "products" ? <ProductsList /> : <BrandsList />}
    </div>
  );
};

export default App;
