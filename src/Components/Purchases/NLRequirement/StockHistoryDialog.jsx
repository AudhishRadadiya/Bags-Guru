import React, { memo } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { getDateWithTime } from 'Helper/Common';
import { setRollStockHistory } from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import { useDispatch } from 'react-redux';

const StockHistoryDialog = ({ stockHistoryPopup, setStockHistoryPopup }) => {
  const dispatch = useDispatch();

  const { rollStockHistory } = useSelector(
    ({ purchaseOrder }) => purchaseOrder,
  );

  const handleChangeAtTemplate = row => {
    return getDateWithTime(row?.changed_at) ?? '';
  };

  return (
    <div>
      <Dialog
        header="Stock History"
        visible={!!stockHistoryPopup}
        draggable={false}
        className="modal_Wrapper whatsapp_dialog"
        onHide={() => {
          setStockHistoryPopup(false);
          dispatch(setRollStockHistory([]));
        }}
        style={{ width: '50vw' }}
      >
        <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover state_table custom_height">
          <DataTable
            value={rollStockHistory}
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
              field="changed_at"
              header="Changed At"
              sortable
              body={handleChangeAtTemplate}
            ></Column>
            <Column field="user_name" header="Changed By" sortable></Column>
            <Column field="new_value" header="New Value" sortable></Column>
            <Column field="old_value" header="Old Value" sortable></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default memo(StockHistoryDialog);
