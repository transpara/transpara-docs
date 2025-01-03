import React, { useState, useMemo } from 'react';
import '../../css/table.css';

const JsonToTable = ({ jsonData, tableHeight }) => {
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [rowsToShow, setRowsToShow] = useState(jsonData.length <= 10 ? jsonData.length : 5);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtering logic
  const filteredData = useMemo(() => {
    const filteredRows = jsonData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );

    if (filteredRows.length === 0) {
      const naRow = Object.keys(jsonData[0]).reduce((acc, key) => {
        acc[key] = '-';
        return acc;
      }, {});
      return [naRow];
    }

    return filteredRows;
  }, [jsonData, filter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (sortColumn) {
      return [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    return filteredData;
  }, [filteredData, sortColumn, sortOrder]);

  const generateArray = (length) => {
    const result = [5, 10, 25, 50, 100].reduce((acc, curr) => {
      if (curr < length) {
        acc.push(curr);
      }
      return acc;
    }, []);
  
    result.push(length);
  
    return result;
  }

  // Pagination logic  
  const totalPages = Math.ceil(sortedData.length / rowsToShow);
  const startIndex = (currentPage - 1) * rowsToShow;
  const endIndex = startIndex + rowsToShow;

  // Table header for sorting
  const headers = Object.keys(jsonData[0]).map((key) => (
    <th key={key} onClick={() => handleSort(key)} style={{ width: `${105 / Object.keys(jsonData[0]).length}%` }}>
      {key}
      {sortColumn === key && (
        <span>{sortOrder === 'asc' ? '▴' : '▾'}</span>
      )}
    </th>
  ));

  const processedData = useMemo(() => {
    let data = jsonData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );

    if (!data.length) {
      const naRow = Object.keys(jsonData[0]).reduce((acc, key) => {
        acc[key] = '-';
        return acc;
      }, {});
      data = [naRow];
    }

    if (sortColumn) {
      data.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
    }

    // Grouping data for rowspan
    const groupedData = [];
    data.forEach(row => {
      const lastGroup = groupedData[groupedData.length - 1];
      if (lastGroup && lastGroup[0][Object.keys(row)[0]] === row[Object.keys(row)[0]] && lastGroup[0][Object.keys(row)[0]] !== '') {
        lastGroup.push(row);
      } else {
        groupedData.push([row]);
      }
    });

    return groupedData;
  }, [jsonData, filter, sortColumn, sortOrder]);

  // Table rows
  const rows = processedData.slice(startIndex, endIndex).map((group, groupIndex) => (
    group.map((row, rowIndex) => (
      <tr key={groupIndex + "-" + rowIndex}>
        {Object.keys(row).map((key, colIndex) => {
          if (colIndex === 0 && rowIndex === 0) {
            return <td key={colIndex} rowSpan={group.length}>{row[key]}</td>;
          } else if (colIndex !== 0) {
            return <td key={colIndex}>{row[key]}</td>;
          }
          return null;
        })}
      </tr>
    ))
  ));

  const handleSort = (column) => {
    if (sortColumn === column && sortOrder === 'desc') {
      setSortColumn(null);
      setSortOrder('');
    } else if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="filters_container">
        <label htmlFor="rowsToShow" className="filter_label">
          Show
          <select 
            id="rowsToShow"
            value={rowsToShow}
            onChange={ (e) => setRowsToShow(Number(e.target.value)) }>
            {generateArray(sortedData.length).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          Entries
        </label>
        <div className="search_container">
          <label htmlFor="filterInput" className="filter_label">
            Search
          </label>
          <div className="search_input_container">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M4.99991 8.99983C7.209 8.99983 8.99983 7.209 8.99983 4.99991C8.99983 2.79082 7.209 1 4.99991 1C2.79082 1 1 2.79082 1 4.99991C1 7.209 2.79082 8.99983 4.99991 8.99983Z" stroke="#494949" stroke-width="0.999978" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.0001 9.99978L7.8252 7.82483" stroke="#494949" stroke-width="0.999978" stroke-linecap="round" stroke-linejoin="round"/>
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
      <div className="table_container" style={{ maxHeight: tableHeight }}>
        <table>
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <div className="filters_container">
        <span className="filter_label">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
        </span>
        <div>
          <button className="table_pagination_btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button className="table_pagination_btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default JsonToTable;
