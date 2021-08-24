import React, { useCallback, useContext, useRef, useState } from "react";

import css from "../../styles/components/List.module.css";

import ListItem from "./ListItem";

import { ThemeContext } from "../../contexts/ThemeContext";

export default function List({ datalist, onUpdate, onDelete, checkAllList }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setloading] = useState(false);
  const [hasMore, sethasMore] = useState(false);
  const [paginationPage, setpaginationPage] = useState(10);

  const total_page = Math.round(datalist.length / 10);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      //prettier-ignore
      sethasMore((datalist.length - paginationPage) > 0 ? true : false);
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        setloading(true);
        setTimeout(() => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            pageNumber <= total_page
          ) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
            setpaginationPage((prevPaginationPage) => prevPaginationPage + 10);
            setloading(false);
          }
        }, 1000);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleActionClick = (_id, type) => {
    const transiction = datalist.find((item) => item._id === _id);

    if (type === "delete") {
      onDelete(transiction);
      return;
    }
    onUpdate(transiction);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <>
      <p
        style={{
          textAlign: "left",
          margin: ".35rem",
          marginLeft: "4.2rem",
          fontSize: "1.25rem",
          color: theme === "dark" && "#f7fff7",
        }}
      >
        Lançamentos: <b>{datalist.length}</b>
      </p>
      <div className={css.listContainer}>
        {datalist
          .sort((a, b) => a.day - b.day)
          .map((item, index) => {
            if (index <= paginationPage) {
              if (index === paginationPage) {
                return (
                  <ListItem
                    refKey={lastBookElementRef}
                    listItem={item}
                    key={index}
                    onActionClickItem={handleActionClick}
                    theme={theme}
                  />
                );
              } else {
                return (
                  <ListItem
                    listItem={item}
                    key={index}
                    onActionClickItem={handleActionClick}
                    theme={theme}
                  />
                );
              }
            }
          })}
        <div style={{ margin: "1.5rem" }}>
          {loading && checkAllList && (
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
          )}
        </div>
      </div>
    </>
  );
}
