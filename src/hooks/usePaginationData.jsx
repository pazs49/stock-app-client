import React, { useState } from "react";

const usePaginationData = (data, itemsPerPage = 10) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const dataList = Array.isArray(data) ? data : [];
  const currentItems = dataList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(dataList.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return {
    currentItems,
    pageCount,
    handlePageClick,
  };
};

export default usePaginationData;
