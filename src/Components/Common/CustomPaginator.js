import { memo } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import LeftArrow from '../../Assets/Images/left-arrow.svg';
import RightArrow from '../../Assets/Images/right-arrow.svg';

const CustomPaginator = ({
  dataList = [],
  pageLimit = 30,
  currentPage = 1,
  totalCount = 0,
  onPageChange,
  onPageRowsChange,
}) => {
  const template = {
    layout:
      currentPage === 0
        ? 'CurrentPageReport RowsPerPageDropdown'
        : 'PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown',
    PrevPageLink: options => {
      return (
        <button
          className="border border-0 prev_arrow"
          onClick={() => onPageChange({ page: 'Prev' })}
          disabled={currentPage === 1 ? true : false}
        >
          <img
            src={LeftArrow}
            alt="left-arrow"
            className="rounded-circle"
            width={24}
            height={24}
          />
        </button>
      );
    },
    NextPageLink: options => {
      const totalPages = Math.ceil(totalCount / pageLimit);

      return (
        <button
          className="border border-0 next_arrow"
          onClick={() => onPageChange({ page: 'Next' })}
          disabled={currentPage === totalPages ? true : false}
        >
          <img
            src={RightArrow}
            alt="left-arrow"
            className="rounded-circle"
            width={24}
            height={24}
          />
        </button>
      );
    },
    PageLinks: options => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        return <span style={{ userSelect: 'none' }}>...</span>;
      }

      return (
        <Button
          type="button"
          className={
            options.page === currentPage - 1
              ? 'p-paginator-page p-paginator-element p-link p-paginator-page-end p-highlight'
              : 'p-paginator-page p-paginator-element p-link p-paginator-page-start'
          }
          onClick={() => onPageChange(options.page + 1)}
        >
          {options.page + 1}
        </Button>
      );
    },
    RowsPerPageDropdown: options => {
      const dropdownOptions = [
        { label: 30, value: 30 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
        { label: 200, value: 200 },
        { label: 'All', value: 0 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={e => onPageRowsChange(e.value)}
        />
      );
    },
  };

  return (
    <>
      <Paginator
        rows={pageLimit}
        first={currentPage * pageLimit}
        totalRecords={totalCount}
        rowsPerPageOptions={[5, 10, 25, 50]}
        currentPageReportTemplate={`Showing ${
          dataList?.length ? pageLimit * (currentPage - 1) + 1 : 0
        } to ${
          pageLimit * (currentPage - 1) + dataList?.length
        } of ${totalCount} entries`}
        template={template}
      />
    </>
  );
};

export default memo(CustomPaginator);
