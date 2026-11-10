// A search box above a group of accordions: as the reader types, only the
// accordions whose title contains the text stay visible.
//
//   import SearchWrapper from '/snippets/SearchWrapper.jsx';
//
//   <SearchWrapper>
//     <AccordionGroup>
//       <Accordion title="Can I override the status of a KPI?">...</Accordion>
//     </AccordionGroup>
//   </SearchWrapper>
//
// The accordions are writedocs' own components, rendered when the site is
// built - here they arrive as finished HTML, not as React elements, so the
// filter works on the page itself: it hides each `.wd-accordion` whose
// title doesn't match. Styles: snippets/JsonToTable.css (the search box is
// the same as JsonToTable's).
import { useState, useEffect, useRef, useId } from "react";

const SearchWrapper = ({ children }) => {
  const id = useId();
  const [filter, setFilter] = useState("");
  const [matches, setMatches] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const query = filter.trim().toLowerCase();
    let shown = 0;
    for (const accordion of list.querySelectorAll(".wd-accordion")) {
      const title = accordion.querySelector(".wd-accordion-title")?.textContent ?? "";
      // The title's "#" link to itself is part of its text.
      const match = title.replace(/#\s*$/, "").toLowerCase().includes(query);
      accordion.hidden = !match;
      if (match) shown += 1;
    }
    // A group with nothing left in it would still show its border.
    for (const group of list.querySelectorAll(".wd-accordion-group")) {
      group.hidden = !group.querySelector(".wd-accordion:not([hidden])");
    }
    setMatches(query ? shown : null);
  }, [filter]);

  return (
    <div className="search-wrapper">
      <div className="filters_container">
        <div className="search_container">
          <label htmlFor={`${id}-filter`} className="filter_label">
            Search
          </label>
          <div className="search_input_container">
            <div className="search_icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
              >
                <path
                  d="M4.99991 8.99983C7.209 8.99983 8.99983 7.209 8.99983 4.99991C8.99983 2.79082 7.209 1 4.99991 1C2.79082 1 1 2.79082 1 4.99991C1 7.209 2.79082 8.99983 4.99991 8.99983Z"
                  stroke="currentColor"
                  strokeWidth="0.999978"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 9.99978L7.8252 7.82483"
                  stroke="currentColor"
                  strokeWidth="0.999978"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id={`${id}-filter`}
              className="filter_input"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div ref={listRef}>{children}</div>
      {matches === 0 && <p className="search_no_results">No questions match "{filter.trim()}".</p>}
    </div>
  );
};

export default SearchWrapper;
