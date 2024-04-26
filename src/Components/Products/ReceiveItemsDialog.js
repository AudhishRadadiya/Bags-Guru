import React, { memo } from 'react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { generateUniqueId } from 'Helper/Common';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';

const rollReceiveItemsColumns = [
  { label: 'gsm', value: 'GSM' },
  { label: 'length', value: 'Length' },
  { label: 'color', value: 'Color' },
  { label: 'brand_name', value: 'Brand Name' },
  { label: 'lamination', value: 'Lamination' },
  { label: 'is_mm', value: 'Is mm' },
  { label: 'texture', value: 'Texture' },
  { label: 'material', value: 'Material' },
  { label: 'design_name', value: 'Design Name' },
  { label: 'width', value: 'Width' },
  { label: 'qty', value: 'Qty' },
  { label: 'already_receive_qty', value: 'Already Receive Qty' },
  { label: 'receive_qty', value: 'Receive Qty' },
];

const rollPrePrintedReceiveItemsColumns = [
  { label: 'gsm', value: 'GSM' },
  { label: 'length', value: 'Length' },
  { label: 'color', value: 'Color' },
  { label: 'brand_name', value: 'Brand Name' },
  { label: 'lamination', value: 'Lamination' },
  { label: 'is_mm', value: 'Is mm' },
  { label: 'texture', value: 'Texture' },
  { label: 'material', value: 'Material' },
  { label: 'design_name', value: 'Design Name' },
  { label: 'width', value: 'Width' },
  { label: 'qty', value: 'Qty' },
  { label: 'already_receive_qty', value: 'Already Receive Qty' },
  { label: 'receive_qty', value: 'Receive Qty' },
  { label: 'cylinder_charge', value: 'Cylinder Charge' },
];

const cartonReceiveItemsColumns = [
  { label: 'length', value: 'Length' },
  { label: 'height', value: 'Height' },
  { label: 'width', value: 'Width' },
  { label: 'is_mm', value: 'Is mm' },
  { label: 'ply', value: 'Ply' },
  { label: 'qty', value: 'Qty' },
  // { label: 'receive_qty', value: 'Receive Qty' },
];

const InkReceiveItemsColumns = [
  // { label: 'checkbox', value: '' },
  { label: 'color', value: 'Color' },
  { label: 'ink_type', value: 'Ink Type' },
  { label: 'qty', value: 'Qty' },
  // { label: 'receive_qty', value: 'Receive Qty' },
];

const sellotapeReceiveItemsColumns = [
  // { label: 'checkbox', value: '' },
  { label: 'color', value: 'Color' },
  { label: 'name', value: 'Name' },
  { label: 'qty', value: 'Qty' },
  // { label: 'receive_qty', value: 'Receive Qty' },
];

const ReceiveItemsDialog = props => {
  const {
    openItemdialog,
    setOpenItemdialog,
    // receivePurchaseData,
    // setReceivePurchaseData,
    // receiveItemsData,
    // setReceiveItemsData,
    selectedReceiveItems,
    itemColumnsName,
    itemGroupName,
    purchaseItemName,
    receivePurchaseData,
    receiveItemsData,
    // setReceiveItems,
    commonUpdateFieldValue,
    handleChangeFieldsdData,
  } = props;

  const { addSelectedReceivePurchaseOrderData } = useSelector(
    ({ purchaseOrder }) => purchaseOrder,
  );

  // const [columnsName, setColumnsName] = useState([]);
  // const [itemGroupName, setItemGroupName] = useState('');
  // const [purchaseItemName, setPurchaseItemName] = useState('');

  // const [receiveItems, setReceiveItems] = useState([]);
  // const [dummyReceiveItems, setDummyReceiveItems] = useState([]);

  // const { purchaseItemIdList, receivePurchaseData, receiveItemsData } =
  //   useSelector(({ purchaseOrder }) => purchaseOrder);

  // useEffect(() => {
  //   const itemGroup = purchaseItemIdList?.item_group_name?.toLowerCase();
  //   const itemName = purchaseItemIdList?.item_name?.toLowerCase();

  //   // 'nonWoven_prePrinted'
  //   // 'nonWoven_nonLaminated'

  //   setItemGroupName(itemGroup);
  //   setPurchaseItemName(itemName);

  //   if (
  //     itemGroup === 'roll' &&
  //     (itemName === 'nonwoven non laminated' ||
  //       itemName === 'nonwoven laminated plain')
  //   ) {
  //     setColumnsName(rollReceiveItemsColumns);
  //   } else if (
  //     itemGroup === 'roll' &&
  //     itemName === 'nonwoven laminated pre-printed'
  //   ) {
  //     setColumnsName(rollPrePrintedReceiveItemsColumns);
  //   } else if (itemGroup === 'ink') {
  //     setColumnsName(InkReceiveItemsColumns);
  //   } else if (itemGroup === 'carton') {
  //     setColumnsName(cartonReceiveItemsColumns);
  //   } else if (itemGroup === 'sellotape') {
  //     setColumnsName(sellotapeReceiveItemsColumns);
  //   }

  //   if (
  //     Object.keys(purchaseItemIdList).length > 0 &&
  //     !receiveItemsData?.length
  //   ) {
  //     const updatedData = purchaseItemIdList?.purchase_order_item?.items?.map(
  //       (items, i) => {
  //         const {
  //           amount,
  //           gross_weight,
  //           net_weight,
  //           rate,
  //           received_item,
  //           tax,
  //           tax_amount,
  //           total,
  //           total_amount,
  //           id,
  //           ...Obj
  //         } = items;
  //         return {
  //           ...Obj,
  //           id: i + 1,
  //           is_mm: Boolean(items?.is_mm),
  //           purchase_item_id: items?.id,
  //           // receive_qty: items?.received_item?.length
  //           //   ? String(items?.received_item?.length)
  //           //   : '',
  //           receive_qty: '',
  //           // weight: items?.net_weight,
  //           already_receive_qty: items?.received_item?.length
  //             ? String(items?.received_item?.length)
  //             : 0,
  //           unit: purchaseItemIdList?.unit,
  //         };
  //       },
  //     );

  //     // setReceiveItemsData(updatedData);
  //     // if (!receiveItemsData?.length) {
  //     dispatch(setReceiveItemsData(updatedData));
  //     // }
  //   }
  // }, [dispatch, purchaseItemIdList]);

  // const handleChcekedItems = () => {
  //   if (itemGroupName !== 'roll') {
  //     const checkedData = receiveItemsData?.filter(item => {
  //       return receivePurchaseData.some(
  //         data => data?.purchase_item_id === item?.purchase_item_id,
  //       );
  //     });
  //     setReceiveItems(checkedData);
  //   }
  // };

  // useEffect(() => {
  //   if (itemGroupName !== 'roll') {
  //     handleChcekedItems();
  //   }
  // }, [receiveItemsData, receivePurchaseData, itemGroupName]);

  const handlefieldChange = (e, eventValue, eventName, rowData) => {
    const value = eventValue;
    const name = eventName;

    let updatedList = [...receiveItemsData];
    const index = updatedList?.findIndex(x => x?.id === rowData?.id);

    if (index !== -1) {
      const oldObj = updatedList[index];
      const updatedObj = {
        ...oldObj,
        [name]: value,
      };
      updatedList[index] = updatedObj;
      // setReceiveItemsData(updatedList);
      // dispatch(setReceiveItemsData(updatedList));
      commonUpdateFieldValue('receive_items_data', updatedList);
    }
  };

  const ColumnTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;
    const column = ['is_mm', 'checkbox'].includes(fieldName);

    if (column) {
      return (
        <Checkbox
          name={fieldName}
          checked={data[fieldName]}
          onChange={e =>
            handlefieldChange(e, e.target.checked, e.target.name, data)
          }
          disabled
        />
      );
    } else if (fieldName === 'cylinder_charge') {
      return (
        <div className="item_input_Wrap">
          <div className="form_group">
            <InputNumber
              name={fieldName}
              useGrouping={false}
              maxFractionDigits={2}
              value={data[fieldName]}
              placeholder={`Enter ${headerName}`}
              onChange={e => handlefieldChange(e, e.value, e.name, data)}
              disabled={data?.oldObject}
              className="min_100"
            />
          </div>
        </div>
      );
    } else if (fieldName === 'receive_qty' || fieldName === 'rate') {
      return (
        <div className="item_input_Wrap">
          <div className="form_group">
            <InputText
              name={fieldName}
              value={data[fieldName]}
              placeholder={`Enter ${headerName}`}
              onChange={e =>
                handlefieldChange(e, e.target.value, e.target.name, data)
              }
              disabled={data?.oldObject}
              className="min_100"
            />
          </div>
        </div>
      );
    } else {
      return <span>{data[fieldName] ? data[fieldName] : '-'}</span>;
    }

    // return column ? (
    //   <Checkbox
    //     name={fieldName}
    //     checked={data[fieldName]}
    //     onChange={e => handlefieldChange(e, e.target.checked, data)}
    //     disabled
    //   />
    // ) : fieldName === 'receive_qty' ||
    //   fieldName === 'rate' ||
    //   fieldName === 'cylinder_charge' ? (
    //   <div className="item_input_Wrap">
    //     <div className="form_group">
    //       <InputText
    //         name={fieldName}
    //         value={data[fieldName]}
    //         placeholder={`Enter ${headerName}`}
    //         onChange={e => handlefieldChange(e, e.target.value, data)}
    //         disabled={data?.oldObject}
    //         className="min_100"
    //       />
    //     </div>
    //   </div>
    // ) : (
    //   <span>{data[fieldName] ? data[fieldName] : '-'}</span>
    // );
  };

  const handleGenerateItems = () => {
    const appendData = [];
    let updatedList = [...receivePurchaseData];
    let changeFieldValue = { selected_receive_item: [] };

    if (itemGroupName === 'roll') {
      receiveItemsData?.forEach(item => {
        // const existingItem = receivePurchaseData?.filter(data => {
        //   return (
        //     item.purchase_item_id === data.purchase_item_id &&
        //     item.lamination === (data.lamination || '') &&
        //     item.color?.toLowerCase() === data.color?.toLowerCase() &&
        //     item.gsm === data.gsm &&
        //     item.width === data.width &&
        //     item.is_mm === data.is_mm &&
        //     item.design_name === data.design_name &&
        //     item.texture === (data.texture || '')
        //   );
        // });

        const existingItem = receivePurchaseData?.filter(data => {
          return (
            !data.oldObject &&
            item.purchase_item_id === data.purchase_item_id &&
            item.lamination === (data.lamination || '') &&
            item.color?.toLowerCase() === data.color?.toLowerCase() &&
            item.gsm === data.gsm &&
            item.width === data.width &&
            item.is_mm === data.is_mm &&
            item.design_name === data.design_name &&
            item.texture === (data.texture || '')
          );
        });

        // const existingItem = receivePurchaseData?.filter(data =>
        //   (itemGroupName === 'roll'
        //     ? appendRoll
        //     : itemGroupName === 'ink'
        //     ? appendInk
        //     : appendCarton
        //   ).every(key => data[key] === item[key]),
        // );

        const difference = Math.abs(
          existingItem?.length - Number(item.receive_qty),
          // existingItem?.length - Number(item.already_receive_qty),
        );

        // const aa = Math.abs(
        //   Number(item.already_receive_qty) - Number(item.receive_qty),
        //   // existingItem?.length - Number(item.already_receive_qty),
        // );

        if (Number(item.receive_qty) > 0) {
          for (let i = 1; i <= difference; i++) {
            appendData.push({
              ...item,
              // ...(itemGroupName === 'roll' && { length: '' }),
              length: '',
              // rate: '',
              weight: '',
              id_number: '',
              // ...(itemGroupName === 'roll' && { id_number: '' }),
              unique_id: generateUniqueId(),
              oldObject: false,
            });
          }
        } else {
          if (purchaseItemName === 'nonwoven laminated pre-printed') {
            const index = updatedList?.findIndex(
              x =>
                x?.id === item?.id ||
                x?.purchase_item_id === item?.purchase_item_id,
            );

            if (index !== -1) {
              const oldObj = updatedList[index];
              const updatedObj = {
                ...oldObj,
                cylinder_charge: Number(item?.cylinder_charge),
              };
              updatedList[index] = updatedObj;
            }
          }
        }
      });
      // setReceivePurchaseData([...receivePurchaseData, ...appendData]);
      // dispatch(setReceivePurchaseData([...updatedList, ...appendData]));

      changeFieldValue = {
        ...changeFieldValue,
        receive_purchase_data: [...updatedList, ...appendData],
      };

      // commonUpdateFieldValue('receive_purchase_data', [
      //   ...updatedList,
      //   ...appendData,
      // ]);
    } else {
      // const aa = receiveItems.filter(item => {
      //   return receivePurchaseData?.length > 0
      //     ? receivePurchaseData?.length > receiveItems?.length
      //       ? !receivePurchaseData.some(data => data.id === item.id)
      //       : receivePurchaseData.some(data => data.id === item.id)
      //     : item;
      // });

      let res = selectedReceiveItems?.map(item => {
        return {
          ...item,
          rate: '',
          weight: '',
          unique_id: generateUniqueId(),
          oldObject: false,
        };
      });

      // ******* // For add only remain checked item when checked the checkbox in Item Dialog Box
      // let res = receiveItems.map(item => {
      //   const obj = receivePurchaseData.find(
      //     item2 =>
      //       item2?.purchase_item_id === item?.purchase_item_id ||
      //       item2?.id === item?.id,
      //   );
      //   if (obj) {
      //     return obj;
      //   }
      //   return {
      //     ...item,
      //     rate: '',
      //     weight: '',
      //     unique_id: generateUniqueId(),
      //     oldObject: false,
      //   };
      // });

      // dispatch(setReceivePurchaseData([...receivePurchaseData, ...res]));

      changeFieldValue = {
        ...changeFieldValue,
        receive_purchase_data: [...receivePurchaseData, ...res],
      };

      // commonUpdateFieldValue('receive_purchase_data', [
      //   ...receivePurchaseData,
      //   ...res,
      // ]);

      // setReceivePurchaseData(res);
      // setDummyReceiveItems(receiveItems);
    }

    handleChangeFieldsdData(changeFieldValue);
    handleCancelModal();
  };

  const handleCheckboxTemplate = rowItem => {
    // setReceiveItems(rowItem);
    commonUpdateFieldValue('selected_receive_item', rowItem);
  };

  const handleCancelModal = () => {
    setOpenItemdialog(false);
    // handleChcekedItems();
    // setReceiveItems();
    // commonUpdateFieldValue('selected_receive_item', []);
  };

  return (
    <>
      <Dialog
        header="Add Items"
        visible={openItemdialog}
        draggable={false}
        className="modal_Wrapper model_extra_large"
        onHide={() => setOpenItemdialog(false)}
      >
        <div className="add_product_content_wrap">
          <div className="table_main_Wrapper bg-white">
            <div className="data_table_wrapper without_all_select data_table_collapsable auto_height break_header">
              <DataTable
                value={receiveItemsData}
                // filterDisplay="row"
                sortMode="single"
                selectionMode="checkbox"
                onSelectionChange={e => handleCheckboxTemplate(e.value)}
                selection={selectedReceiveItems}
                sortField="name"
                sortOrder={1}
                dataKey="id"
              >
                {itemGroupName !== 'roll' && (
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                )}
                {itemColumnsName?.map((row, i) => {
                  return (
                    <Column
                      key={i}
                      field={row.label}
                      header={row.value}
                      sortable
                      body={ColumnTemplate}
                    ></Column>
                  );
                })}
              </DataTable>
            </div>
          </div>
          <div className="button_group d-flex justify-content-end mt-3">
            <Button
              className="btn_border"
              onClick={
                () => handleCancelModal()
                //   {
                //   setOpenItemdialog(false);
                //   setReceiveItems(receivePurchaseData);
                // }
              }
            >
              Cancel
            </Button>
            <Button className="btn_primary ms-3" onClick={handleGenerateItems}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default memo(ReceiveItemsDialog);
