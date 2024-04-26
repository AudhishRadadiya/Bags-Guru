import { useTable, usePagination, useSortBy } from 'react-table';
import LeftArrow from '../../Assets/Images/left-arrow.svg';
import RightArrow from '../../Assets/Images/right-arrow.svg';
import { memo } from 'react';

// export function useHorizontalScroll() {
//   const elRef = useRef();
//   useEffect(() => {
//     const el = elRef.current;
//     if (el) {
//       const onWheel = e => {
//         if (e.deltaY == 0) return;
//         e.preventDefault();
//         el.scrollTo({
//           top: el.scrollTop + e.deltaY,
//           left: el.scrollLeft + e.deltaY,
//           behavior: 'smooth',
//         });
//       };
//       el.addEventListener('wheel', onWheel);
//       return () => el.removeEventListener('wheel', onWheel);
//     }
//   }, []);
//   return elRef;
// }

const ReactTable = ({ columns, data }) => {
  // const scrollRef = useHorizontalScroll();
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 },
    },
    useSortBy,
    usePagination,
  );

  /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */

  return (
    <>
      <div className="table_scroll_wrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <span>{column.render('Header')}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* {data?.length > 3 && (
        <div className="pagination">
          <div className="pagination_btn">
            <ul>
              <li className="show_select">
                <label>Show</label>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="page_select"
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <img src={LeftArrow} alt="" />
                </button>
              </li>
              <li>
                <div className="number_pagination">
                  <ul>
                    <li>
                      <span className="active">1</span>
                    </li>
                    <li>
                      <span>2</span>
                    </li>
                    <li>
                      <span>3</span>
                    </li>
                    <li>
                      <span className="empty">...</span>
                    </li>
                    <li>
                      <span>20</span>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  <img src={RightArrow} alt="" />
                </button>
              </li>
            </ul>
          </div>
          <div className="pagination_result">
            <span>
              Result:&nbsp;
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
        </div>
      )} */}
    </>
  );
};

export default memo(ReactTable);
