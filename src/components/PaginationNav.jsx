import ReactPaginate from "react-paginate";

import React from "react";

const PaginationNav = ({ handlePageClick, pageCount }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      containerClassName="flex justify-center mt-6 gap-2"
      pageClassName="page-item" // li
      pageLinkClassName="px-3 py-1 rounded-md bg-muted hover:bg-primary hover:text-white transition-colors cursor-pointer"
      activeLinkClassName="bg-primary text-white rounded-md" // a
      previousLinkClassName="px-3 py-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer"
      nextLinkClassName="px-3 py-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer"
      breakLinkClassName="px-3 py-1 rounded-md bg-muted text-muted-foreground cursor-pointer"
    />
  );
};

export default PaginationNav;
