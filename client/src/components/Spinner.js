import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
export default function Spinner({ description = "Aguarde..." }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "15px",
        color: theme === "dark" ? "#f7fff7" : "#222831",
      }}
    >
      <div className="preloader-wrapper small active">
        <div className="spinner-layer spinner-green-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>

      <span style={{ marginLeft: "10px", fontSize: "1.2rem" }}>
        {description}
      </span>
    </div>
  );
}
