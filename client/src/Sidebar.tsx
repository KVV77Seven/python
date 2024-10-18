// src/Sidebar.tsx
import React from "react";

interface SidebarProps {
  activeTab: "products" | "brands";
  setActiveTab: React.Dispatch<React.SetStateAction<"products" | "brands">>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <div style={{ width: "200px", background: "#f0f0f0" }}>
    <button
      onClick={() => setActiveTab("products")}
      style={{
        width: "100%",
        padding: "10px",
        background: activeTab === "products" ? "#ccc" : "transparent",
      }}
    >
      Продукты
    </button>
    <button
      onClick={() => setActiveTab("brands")}
      style={{
        width: "100%",
        padding: "10px",
        background: activeTab === "brands" ? "#ccc" : "transparent",
      }}
    >
      Бренды
    </button>
  </div>
);

export default Sidebar;
