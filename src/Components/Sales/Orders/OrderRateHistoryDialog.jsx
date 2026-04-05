import React, { memo } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { getDateWithTime } from 'Helper/Common';
import { Tag } from 'primereact/tag';
import { getOrderSeverity, getStatusText } from '../Order';
import { setOrderRateHistoryDetails } from 'Store/Reducers/Sales/SalesOrderSlice';
import { useDispatch } from 'react-redux';

//0=pending, 1= approved for mfg 2= progress 3= complete 4= cancelled 5= rejected 6= approved for dispatch

const OrderRateHistoryDialog = ({
  orderRateHistoryPopup,
  setOrderRateHistoryPopup,
}) => {
  const dispatch = useDispatch();

  const { orderRateHistoryDetails } = useSelector(
    ({ salesOrder }) => salesOrder,
  );

  const handleOrderAtTemplate = row => {
    return getDateWithTime(row?.order_date) ?? '';
  };

  const handleRateTemplate = row => {
    return row?.rate ? `₹${row?.rate}` : '';
  };

  const historyStatusTemplate = ({ status }) => {
    return (
      <Tag
        value={getStatusText(status)}
        severity={getOrderSeverity(status ? status : 0)}
      />
    );
  };

  return (
    <div>
      <Dialog
        header="Rate History"
        visible={!!orderRateHistoryPopup}
        draggable={false}
        className="modal_Wrapper whatsapp_dialog"
        onHide={() => {
          setOrderRateHistoryPopup(false);
          dispatch(setOrderRateHistoryDetails([]));
        }}
        style={{ width: '50vw' }}
      >
        <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover state_table custom_height">
          <DataTable
            value={orderRateHistoryDetails}
            sortMode="single"
            sortField="name"
            sortOrder={1}
            rows={10}
            dataKey="id"
            scrollable
            rowGroupMode="rowspan"
            className="min_height state_wise_turnover_table"
          >
            <Column
              field="order_date"
              header="Order Date"
              sortable
              body={handleOrderAtTemplate}
            ></Column>
            <Column field="job_no" header="Job No" sortable></Column>
            <Column field="order_no" header="Order No" sortable></Column>
            <Column field="qty" header="Qty" sortable></Column>
            <Column
              field="rate"
              header="Rate"
              body={handleRateTemplate}
              sortable
            ></Column>
            <Column
              field="status"
              header="Status"
              body={historyStatusTemplate}
              sortable
            ></Column>
            <Column field="comment" header="Comment" sortable></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default memo(OrderRateHistoryDialog);
