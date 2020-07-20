import React from "react";

export default function Search({ onSearch, filterDescription }) {
  const handleInputSearch = (event) => {
    let value = event.target.value;
    onSearch(value);
  };

  return (
    <div style={style.container}>
      <input
        type="text"
        placeholder="Search"
        onChange={handleInputSearch}
        value={filterDescription}
      />
    </div>
  );
}
const style = {
  container: {
    width: "75%",
    padding: "2px",
  },
};
