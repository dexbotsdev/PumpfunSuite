import React from "react";

export const Page404: React.FC = () => {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>404</h2>
        <h3>This page doesn't exist</h3>
      </div>
    </main>
  );
};
