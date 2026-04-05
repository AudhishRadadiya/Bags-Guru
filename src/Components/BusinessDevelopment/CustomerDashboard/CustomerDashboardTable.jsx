import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Skeleton from 'react-loading-skeleton';
import { DataTable } from 'primereact/datatable';
import { setAllCommon } from 'Store/Reducers/Common';
import { InputTextarea } from 'primereact/inputtextarea';
import CheckGreen from '../../../Assets/Images/check-round-green.svg';

const NormalNoteCell = memo(({ row, onSaveNormalNote }) => {
  const [note, setNote] = useState(row.customer_dashboard_note || '');

  return (
    <div className="d-flex align-items-center customer_dashboard_note">
      <InputTextarea
        placeholder="Note"
        rows={1}
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <Button
        className="btn_transperant opening_btn"
        disabled={!note || note === row.customer_dashboard_note}
        onClick={() => onSaveNormalNote(row, note)}
      >
        <img src={CheckGreen} alt="" />
      </Button>
    </div>
  );
});

const CustomerDashboardTable = memo(
  ({
    onSort,
    companyNameTemplate,
    lastDiscussionDateTemplate,
    sortCustomerDashboardOrder,
    sortCustomerDashboardField,
    customerAnalyticsData,
    filterToggle,
    customerDashboardFilters,
    customerDashboardLoading,
    handleNoteSave,
  }) => {
    const dispatch = useDispatch();

    const { allCommon } = useSelector(({ common }) => common);

    const bg_color = data => {
      return {
        [`bg_${data.row_color_code}`]: true,
      };
    };

    return (
      <DataTable
        value={customerAnalyticsData}
        sortMode="single"
        filterDisplay="row"
        onSort={onSort}
        sortField={sortCustomerDashboardField}
        sortOrder={sortCustomerDashboardOrder}
        dataKey="_id"
        filters={customerDashboardFilters}
        onFilter={event => {
          dispatch(
            setAllCommon({
              ...allCommon,
              customerDashboard: {
                ...allCommon?.customerDashboard,
                customerDashboardFilters: event?.filters,
              },
            }),
          );
        }}
        emptyMessage={customerDashboardLoading && <Skeleton count={10} />}
        rowClassName={bg_color}
      >
        <Column
          field="company_name"
          header="Company Name"
          sortable
          filter={filterToggle}
          className="view_detail"
          body={companyNameTemplate}
        ></Column>
        <Column
          field="no_of_outlets"
          header="Outlets"
          sortable
          filter={filterToggle}
          className="column_text_end"
        ></Column>
        <Column
          field="past_12m_revenue"
          header="Previous 12 month Revenue"
          sortable
          filter={filterToggle}
          className="text-wrap column_text_center border-right"
        ></Column>
        <Column
          field="revenue_12m"
          header="12 Months Revenue"
          sortable
          className="text-wrap column_text_end"
          filter={filterToggle}
        ></Column>
        <Column
          field="revenue_6m"
          header="6 Months Revenue"
          sortable
          className="text-wrap column_text_end"
          filter={filterToggle}
        ></Column>
        <Column
          field="revenue_3m"
          header="3 Months Revenue"
          sortable
          className="text-wrap column_text_end"
          filter={filterToggle}
        ></Column>
        <Column
          field="revenue_1m"
          header="1 Month Revenue"
          sortable
          className="text-wrap border-right column_text_end"
          filter={filterToggle}
        ></Column>
        <Column
          field="avg_12m_revenue_per_outlet_raw"
          header="Avg 12 month Revenue by outlet"
          sortable
          filter={filterToggle}
          className="text-wrap border-right column_text_end"
        ></Column>
        <Column
          field="bags_0_5"
          header="Rs.0-5"
          sortable
          filter={filterToggle}
          className="column_text_end"
        ></Column>
        <Column
          field="bags_5_10"
          header="Rs.5-10"
          sortable
          filter={filterToggle}
          className="column_text_end"
        ></Column>
        <Column
          field="bags_10_20"
          header="Rs. 10-20"
          sortable
          filter={filterToggle}
          className="column_text_end"
        ></Column>
        <Column
          field="bags_20_plus"
          header=">Rs. 20"
          sortable
          filter={filterToggle}
          className="border-right column_text_end"
        ></Column>
        <Column
          field="orders_count"
          header="Orders"
          sortable
          filter={filterToggle}
          className="column_text_end"
        ></Column>
        <Column
          field="avg_days_to_repeat"
          header="Average Days To Repeat Order"
          sortable
          className="text-wrap column_text_end"
          filter={filterToggle}
        ></Column>
        <Column
          field="days_since_last_order"
          header="Days Since Last Order"
          sortable
          filter={filterToggle}
          className="text-wrap column_text_end"
        ></Column>
        <Column
          field="last_call_date"
          header="Last Discussion on Call"
          body={lastDiscussionDateTemplate}
        ></Column>
        <Column
          field="days_since_last_call"
          header="Days Since Last Call"
          className="text-wrap column_text_end"
        ></Column>
        <Column
          field="customer_dashboard_note"
          header="Note"
          // body={normalNoteTemplate}
          body={row => (
            <NormalNoteCell
              key={row.unique_id}
              row={row}
              onSaveNormalNote={handleNoteSave}
            />
          )}
        ></Column>
      </DataTable>
    );
  },
);

export default CustomerDashboardTable;
