import React from 'react';
import { getDateWithTime } from 'Helper/Common';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setRollStockConsumptionHistory } from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import { useNavigate } from 'react-router-dom';

const StockConsumptionHistoryDialog = ({
  stockConsumptionHistoryPopup,
  setStockConsumptionHistoryPopup,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rollStockConsumptionHistory } = useSelector(
    ({ purchaseOrder }) => purchaseOrder,
  );

  const handleDateTemplate = row => {
    return getDateWithTime(row?.date) ?? '';
  };

  const JobNoTemplate = data => {
    if (typeof data?.job_no === 'number') {
      return (
        <div
          className="cursor-pointer column_hover_effect"
          onClick={() => {
            navigate(`/job-details/${data.ref_id}`);
          }}
        >
          {data?.job_no}
        </div>
      );
    }

    return data?.job_no;
  };

  return (
    <div>
      <Dialog
        header="Stock Consumption History"
        visible={!!stockConsumptionHistoryPopup}
        draggable={false}
        className="modal_Wrapper whatsapp_dialog"
        onHide={() => {
          setStockConsumptionHistoryPopup(false);
          dispatch(setRollStockConsumptionHistory([]));
        }}
        style={{ width: '50vw' }}
      >
        <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover state_table custom_height">
          <DataTable
            value={rollStockConsumptionHistory}
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
              field="date"
              header="Date"
              sortable
              body={handleDateTemplate}
            ></Column>
            <Column
              field="job_no"
              header="Job No."
              sortable
              body={JobNoTemplate}
            ></Column>
            <Column field="design_name" header="Design Name" sortable></Column>
            <Column field="bag_size_gsm" header="Bag Size" sortable></Column>
            <Column field="qty_pcs" header="Qty (pcs)" sortable></Column>
            <Column field="qty_kg" header="Qty (kg)" sortable></Column>
            <Column field="ref_type" header="Type" sortable></Column>
            <Column field="change" header="Change" sortable></Column>
            <Column field="stock_after" header="Stock After" sortable></Column>
            <Column field="created_by" header="Created By" sortable></Column>
            <Column field="remark" header="Remark" sortable></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default StockConsumptionHistoryDialog;
