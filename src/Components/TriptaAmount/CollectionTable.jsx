import React, { memo, useState } from 'react';
import { Column } from 'primereact/column';
import Skeleton from 'react-loading-skeleton';
import { DataTable } from 'primereact/datatable';
import { useSelector, useDispatch } from 'react-redux';
import whatsappIcon from '../../Assets/Images/whatsapp.svg';
import {
  setSortCollectionField,
  setSortCollectionOrder,
  setTriptaAmountList,
} from 'Store/Reducers/TriptaAmount/TriptaAmountSlice';
import CheckGreen from '../../Assets/Images/check-round-green.svg';
import { thousandSeparator } from 'Helper/Common';
import { ColumnGroup } from 'primereact/columngroup';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Row } from 'react-bootstrap';
import { updateParties } from 'Services/partiesService';

const NormalNoteCell = memo(({ row, onSaveNormalNote }) => {
  const [note, setNote] = useState(row.collection_note || '');

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
        disabled={!note || note === row.collection_note}
        onClick={() => onSaveNormalNote(row, note)}
      >
        <img src={CheckGreen} alt="" />
      </Button>
    </div>
  );
});

const CollectionTable = ({ setWhatsAppContent }) => {
  const dispatch = useDispatch();

  const {
    triptaAmountList,
    triptaAmountLoading,
    sortCollectionField,
    sortCollectionOrder,
    triptaAmountListCommonData,
  } = useSelector(({ triptaAmount }) => triptaAmount);
  const { allCommon } = useSelector(({ common }) => common);

  const { filterToggle } = allCommon?.triptaAmount;

  const TotalDuesTemplate = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_total_due)}`}</span>;
  };

  const tripta0to15Template = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_0_to_15_amount)}`}</span>;
  };

  const tripta16to30Template = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_16_to_30_amount)}`}</span>;
  };

  const tripta31to45Template = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_31_to_45_amount)}`}</span>;
  };

  const tripta46to90Template = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_46_to_90_amount)}`}</span>;
  };

  const triptaAbove90Template = row => {
    return <span>{`₹${thousandSeparator(row?.tripta_above_90_amount)}`}</span>;
  };

  const handleWhatsApp = data => {
    return (
      <span
        className="cursor-pointer"
        onClick={() =>
          setWhatsAppContent({
            whatsAppData: data,
            whatsAppPopup: true,
          })
        }
      >
        <img src={whatsappIcon} alt="" />
      </span>
    );
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={7} />
        <Column footer={triptaAmountListCommonData?.total_tripta_total_due} />
        <Column
          footer={triptaAmountListCommonData?.total_tripta_0_to_15_amount}
        />
        <Column
          footer={triptaAmountListCommonData?.total_tripta_16_to_30_amount}
        />
        <Column
          footer={triptaAmountListCommonData?.total_tripta_31_to_45_amount}
        />
        <Column
          footer={triptaAmountListCommonData?.total_tripta_46_to_90_amount}
        />
        <Column
          footer={triptaAmountListCommonData?.total_tripta_above_90_amount}
        />
        <Column colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const updateTableRowData = (uniqueId, updatedData) => {
    let updatedTriptaAmountData = [...(triptaAmountList || [])];

    const index = updatedTriptaAmountData.findIndex(
      item => item._id === uniqueId,
    );

    if (index >= 0) {
      const oldObj = {
        ...updatedTriptaAmountData[index],
      };

      const newObj = {
        ...oldObj,
        ...updatedData,
      };

      updatedTriptaAmountData[index] = newObj;

      dispatch(setTriptaAmountList(updatedTriptaAmountData));
    }
  };

  const handleNoteSave = (row, note) => {
    dispatch(
      updateParties({
        party_id: row._id,
        collection_note: note,
      }),
    );

    updateTableRowData(row._id, {
      collection_note: note,
    });
  };

  const onSort = e => {
    const { sortField, sortOrder } = e;

    dispatch(setSortCollectionField(sortField));
    dispatch(setSortCollectionOrder(sortOrder));
  };

  return (
    <DataTable
      value={triptaAmountList}
      sortMode="single" // multiple
      onSort={onSort}
      sortField={sortCollectionField}
      sortOrder={sortCollectionOrder}
      dataKey="_id"
      filterDisplay="row"
      emptyMessage={triptaAmountLoading && <Skeleton count={10} />}
      footerColumnGroup={footerGroup}
      className="collections_table"
    >
      <Column
        field="party_type_name"
        header="Party Type"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="party_name"
        header="Party Name"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="personal_contact_no"
        header="Contact Number"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="state_name"
        header="State"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="city_name"
        header="City"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="present_advisor_name"
        header="Present Advisor"
        sortable
        filter={filterToggle}
      ></Column>
      <Column
        field="collection_note"
        header="Collection Note"
        sortable
        filter={filterToggle}
        body={row => (
          <NormalNoteCell
            key={row.unique_id}
            row={row}
            onSaveNormalNote={handleNoteSave}
          />
        )}
      ></Column>
      <Column
        field="tripta_total_due"
        header="Total Dues"
        sortable
        filter={filterToggle}
        body={TotalDuesTemplate}
      ></Column>
      <Column
        field="tripta_0_to_15_amount"
        header="0 To 15"
        sortable
        filter={filterToggle}
        body={tripta0to15Template}
      ></Column>
      <Column
        field="tripta_16_to_30_amount"
        header="16 To 30"
        sortable
        filter={filterToggle}
        body={tripta16to30Template}
      ></Column>
      <Column
        field="tripta_31_to_45_amount"
        header="31 To 45"
        sortable
        filter={filterToggle}
        body={tripta31to45Template}
      ></Column>
      <Column
        field="tripta_46_to_90_amount"
        header="46 To 90"
        sortable
        filter={filterToggle}
        body={tripta46to90Template}
      ></Column>
      <Column
        field="tripta_above_90_amount"
        header=">90"
        sortable
        filter={filterToggle}
        body={triptaAbove90Template}
      ></Column>
      <Column field="" header="" body={handleWhatsApp}></Column>
    </DataTable>
  );
};

export default memo(CollectionTable);
