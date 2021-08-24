import React, { useContext, useEffect, useState } from "react";
import ChartView from "../components/Charts";
import { Context } from "../contexts/AuthContext";
import Loading from "../components/Loading";
export default function Charts() {
  const { loading = true, setLoading } = useContext(Context);

  useEffect(() => {
    document.title = "Econtas - Charts";

    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  return (
    <div className="container">{loading ? <Loading /> : <ChartView />}</div>
  );
}
