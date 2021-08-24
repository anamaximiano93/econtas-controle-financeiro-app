import React, { useEffect, useState } from "react";
import CategoriaChart from "./CategoryChart";
import PerYearMonthChart from "./PerYearMonthChart";
import PerYearChart from "./PerYearChart";
import Loading from "../Loading";

export default function ChartView() {
  const [spinner, setspinner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setspinner(false);
    }, 5000);
  }, []);

  return (
    <div className="row" style={{ marginBottom: 0 }}>
      {spinner ? (
        <Loading />
      ) : (
        <>
          <div className="col l6 s12">
            <CategoriaChart />
          </div>
          <div className="col l6 s12">
            <PerYearChart />
          </div>
          <div className="col l12 s12">
            <PerYearMonthChart />
          </div>
        </>
      )}
    </div>
  );
}
