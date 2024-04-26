import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const monthlyValuationList = [
  {
    month: 'January',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'February',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'March',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'April',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'May',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'June',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'July',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'August',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'September',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'October',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'November',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
  {
    month: 'December',
    2024: 16000,
    2023: 15000,
    2022: 15000,
    2021: 15000,
    2020: 15000,
    2019: 15000,
  },
];

const MonthlyTurnoverValuation = () => {
  const { salesTurnoverValuationList, updatedSalesTurnoverValuationList } =
    useSelector(({ salesTurnover }) => salesTurnover);

  return (
    <>
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <div className="page_title">
            <h3 className="m-0">Monthly Turnover Valuation</h3>
          </div>
        </div>
        <div className="data_table_wrapper tab_wrapper_table is_filter with_colspan_head montly_turnover">
          {/* <button
            type="button"
            className="table_filter_btn"
            // onClick={() => {
            //   dispatch(
            //     setAllCommon({
            //       ...allCommon,
            //       rollConsumption: {
            //         ...allCommon?.rollConsumption,
            //         filterToggle: !filterToggle,
            //       },
            //     }),
            //   );
            // }}
          >
            <img src={SearchIcon} alt="" />
          </button> */}
          <DataTable
            value={updatedSalesTurnoverValuationList}
            filterDisplay="row"
            dataKey="_id"
          >
            <Column
              field="month"
              header="Month"
              sortable
              // filter={filterToggle}
            />

            {salesTurnoverValuationList?.year?.map((year, index) => {
              const lastTwoDigits = (year % 100) - 1;
              const formattedYear = `${year}-${lastTwoDigits
                ?.toString()
                ?.padStart(2, '0')}`;

              return (
                <Column
                  key={index}
                  field={year}
                  header={formattedYear}
                  sortable
                  // filter={filterToggle}
                />
              );
            })}

            {/* <Column
              field="2024"
              header="2024-23"
              sortable
              // filter={filterToggle}
            />
            <Column
              field="2023"
              header="2023-22"
              sortable
              // filter={filterToggle}
            />
            <Column
              field="2022"
              header="2022-21"
              sortable
              // filter={filterToggle}
            />
            <Column
              field="2021"
              header="2021-20"
              sortable
              // filter={filterToggle}
            />
            <Column
              field="2020"
              header="2020-19"
              sortable
              // filter={filterToggle}
            />

            <Column
              field="2019"
              header="2019-18"
              sortable
              // filter={filterToggle}
            /> */}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default memo(MonthlyTurnoverValuation);
