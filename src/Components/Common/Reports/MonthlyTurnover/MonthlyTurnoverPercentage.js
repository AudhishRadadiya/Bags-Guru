import React, { memo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';

// const monthlyPercentageList = [
//   {
//     month: 'January',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'February',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'March',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'April',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'May',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'June',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'July',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'August',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'September',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'October',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'November',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
//   {
//     month: 'December',
//     2024: '16%',
//     2023: '15%',
//     2022: '15%',
//     2021: '15%',
//     2020: '15%',
//     2019: '15%',
//   },
// ];

const MonthlyTurnoverPercentage = () => {
  const { salesTurnoverPercentageList, updatedSalesTurnoverPercentageList } =
    useSelector(({ salesTurnover }) => salesTurnover);

  return (
    <>
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <div className="page_title">
            <h3 className="m-0">Monthly Turnover Percentage</h3>
          </div>
        </div>
        <div className="data_table_wrapper tab_wrapper_table is_filter with_colspan_head montly_turnover">
          <DataTable
            value={updatedSalesTurnoverPercentageList}
            filterDisplay="row"
            dataKey="_id"
          >
            <Column field="month" header="Month" sortable />

            {salesTurnoverPercentageList?.year?.map((year, index) => {
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
                />
              );
            })}
            {/* <Column
              field="2024"
              header="2024-23 %"
              sortable
              // filter={filterToggle}
            /> */}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default memo(MonthlyTurnoverPercentage);
