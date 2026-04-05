import React, { memo, useCallback, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { getDateWithTime } from 'Helper/Common';

const AuditLogsDialog = ({ auditLogsPopup, setAuditLogsPopup }) => {
  const [expandedRows, setExpandedRows] = useState(null);

  const { orderAuditLogsDetail } = useSelector(({ salesOrder }) => salesOrder);

  const handleChangeAtTemplate = row => {
    return getDateWithTime(row?.created_at) ?? '';
  };

  const rowExpansionTemplate = useCallback((data, i) => {
    return (
      <div className="inner_table_wrap" key={i}>
        <DataTable value={data.changes}>
          <Column field="field" header="Field" sortable></Column>
          <Column field="old_value" header="Old Value" sortable></Column>
          <Column field="new_value" header="New Value" sortable></Column>
        </DataTable>
      </div>
    );
  }, []);

  const allowExpansion = rowData => {
    return rowData?.changes?.length > 0;
  };

  return (
    <div>
      <Dialog
        header="Audit Logs"
        visible={!!auditLogsPopup}
        draggable={false}
        className="modal_Wrapper whatsapp_dialog"
        onHide={() => setAuditLogsPopup(false)}
        style={{ width: '50vw' }}
      >
        <div className="data_table_wrapper with_colspan_head cell_padding_large break_header max_height state_Wise_turnover state_table custom_height">
          <DataTable
            value={orderAuditLogsDetail}
            expandedRows={expandedRows}
            onRowToggle={e => {
              setExpandedRows(e?.data);
            }}
            rowExpansionTemplate={data =>
              data?.changes?.length > 0 && rowExpansionTemplate(data)
            }
            rows={10}
            scrollable
            sortOrder={1}
            dataKey="_id"
            sortMode="single"
            filterDisplay="row"
            rowGroupMode="rowspan"
            className="min_height state_wise_turnover_table"
          >
            <Column
              className="expander_toggle"
              expander={allowExpansion}
              style={{ width: '3rem' }}
            />
            <Column
              field="created_at"
              header="Created At"
              sortable
              body={handleChangeAtTemplate}
            ></Column>
            <Column field="user_name" header="Audit By" sortable></Column>
            <Column field="ref_type" header="Ref Type" sortable></Column>
            <Column field="action" header="Action" sortable></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default memo(AuditLogsDialog);
