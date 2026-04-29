import { Navigate, Route, Routes } from "react-router-dom";
import { L2TablePage } from "./pages/L2/L2TablePage";
import { TanStackComparisonPage } from "./pages/TanStack/TanStackComparisonPage";
import "./App.css";
import { L2StaticTablePage } from "./pages/L2/L2StaticTablePage";

function App() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <h1>Table Comparison</h1>
      <nav
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <a href="/l2/live">L2 Table (Live)</a>
        <a href="/l2/static">L2 Table (Static)</a>
        <a href="/tanstack">TanStack Table</a>
      </nav>
      <Routes>
        <Route path="/l2/live" element={<L2TablePage />} />
        <Route path="/l2/static" element={<L2StaticTablePage />} />
        <Route path="/tanstack" element={<TanStackComparisonPage />} />
        <Route path="*" element={<Navigate to="/l2" replace />} />
      </Routes>
    </div>
  );
}

export default App;
