import React from "react";
import Eclipse from "../assets/image/loading.svg";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={Eclipse} width="125" alt="loading" />
    </div>
  );
}
