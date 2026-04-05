import React, { memo } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { getDateWithTime } from 'Helper/Common';

const ProductHistoryDialog = ({
  productHistoryPopup,
  setProductHistoryPopup,
}) => {
  const { productHistoryDetails } = useSelector(({ product }) => product);

  const handleChangeAtTemplate = row => {
    return getDateWithTime(row?.changed_at) ?? '';
  };

  return (
    <div>
      <Dialog
        header="Designer History"
        visible={!!productHistoryPopup}
        draggable={false}
        className="modal_Wrapper whatsapp_dialog"
        onHide={() => setProductHistoryPopup(false)}
        style={{ width: '50vw' }}
      >
        <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover state_table custom_height">
          <DataTable
            value={productHistoryDetails}
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
            <Column
              field="old_designer"
              header="Old Designer"
              sortable
            ></Column>
            <Column
              field="new_designer"
              header="New Designer"
              sortable
            ></Column>
            <Column
              field="changed_by_name"
              header="Changed By"
              sortable
            ></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default memo(ProductHistoryDialog);
