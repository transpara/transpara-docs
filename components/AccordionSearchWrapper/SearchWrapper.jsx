import React, { useState, useMemo } from "react";
import "./style.css";
import { AccordionGroup } from "@site/src/components";

const SearchWrapper = ({ children }) => {
  const [filter, setFilter] = useState("");

  // Filtering logic
  const filteredData = useMemo(() => {
    // console.log(children)
    return children.props.children.filter((child) =>
      child.props.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [children, filter]);

  return (
    <>
      <div className="filters_container">
        <div className="search_container faq_search_container">
          <label htmlFor="filterInput" className="filter_label">
            Search
          </label>
          <div className="search_input_container faq_search_input_container">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
              >
                <path
                  d="M4.99991 8.99983C7.209 8.99983 8.99983 7.209 8.99983 4.99991C8.99983 2.79082 7.209 1 4.99991 1C2.79082 1 1 2.79082 1 4.99991C1 7.209 2.79082 8.99983 4.99991 8.99983Z"
                  stroke="#494949"
                  strokeWidth="0.999978"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 9.99978L7.8252 7.82483"
                  stroke="#494949"
                  strokeWidth="0.999978"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="filterInput"
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <AccordionGroup>
          {filteredData.length > 0 && filteredData.map((child, index) => child)}
        </AccordionGroup>
      </div>
      {/* <div className="filters_container">
        <span className="filter_label">
          {filteredData.length ? `Showing ${filteredData.length} entries` : "No entries found"}
        </span>
      </div> */}
    </>
  );
};

export default SearchWrapper;
