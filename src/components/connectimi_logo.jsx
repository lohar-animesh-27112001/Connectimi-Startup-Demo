import React from "react";

const Connectimi_logo = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        backgroundColor: "#ffffff",
        width: "fit-content",
        // borderBottom: "1px solid #e0e0e0",
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <img
        src="public/Connectimi_logo.png"
        alt="Connectimi Logo"
        style={{
          width: "36px",
          height: "36px",
          objectFit: "contain",
        }}
      />

      <p
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#355ae0b5", // LinkedIn blue
          margin: 0,
          letterSpacing: "0.5px",
        }}
      >
        Connectimi
      </p>
    </div>
  );
};

export default Connectimi_logo;
