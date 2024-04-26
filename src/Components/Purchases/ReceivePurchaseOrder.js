import { useEffect, useState, useCallback, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import PlusIcon from '../../Assets/Images/plus.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  getPurchaseItemIdList,
  getSupplierList,
  purchaseOrderReceived,
} from 'Services/Purchase/purchaseOrderService';
import { useSelector } from 'react-redux';
import { getCompanyDetails } from 'Services/Settings/companyService';
import {
  getActiveItemGroupList,
  getActiveLaminationTypeList,
  getActiveRawItemListByGroup,
  getActiveWarehouseList,
} from 'Services/Settings/MiscMasterService';
import {
  covertDMYIntoLocalFormat,
  generateUniqueId,
  getFormattedDate,
} from 'Helper/Common';
import TranchIcon from '../../Assets/Images/trash.svg';
import Loader from 'Components/Common/Loader';
import { Checkbox } from 'primereact/checkbox';
import ReceiveItemsDialog from 'Components/Products/ReceiveItemsDialog';
import { toast } from 'react-toastify';
import {
  setReceiveItemsData,
  setReceivePurchaseData,
  setReceivePurchaseViewData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';

export let receivePurchaseColumn = {
  id: '',
  purchase_item_id: '',
  id_number: '',
  length: '',
  weight: '',
  rate: '',
  oldObject: false,
  lamination: '',
};

const rollColumns = [
  { label: 'material', value: 'Material' },
  { label: 'lamination', value: 'Lamination' },
  { label: 'color', value: 'Color' },
  { label: 'gsm', value: 'GSM' },
  { label: 'width', value: 'Width' },
  { label: 'is_mm', value: 'Is mm' },
  { label: 'design_name', value: 'Design Name' },
  { label: 'texture', value: 'Texture' },
];

const InkColumns = [
  { label: 'color', value: 'Color' },
  { label: 'ink_type', value: 'Ink Type' },
];

const cartonColumns = [
  { label: 'is_mm', value: 'Is mm' },
  { label: 'width', value: 'Width' },
  { label: 'length', value: 'Length' },
  { label: 'height', value: 'Heigth' },
  { label: 'ply', value: 'Ply' },
];

// const genericColumns = [{ label: 'lamination', value: 'Lamination' }];

const sellotapeColumns = [
  { label: 'color', value: 'Color' },
  { label: 'name', value: 'Name' },
];

export default function ReceivePurchaseOrder() {
  const { id } = useParams();
  const location = useLocation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [receivePurchaseData, setReceivePurchaseData] = useState([]);
  // const [itemsNumber, setItemsNumber] = useState();
  const [receiveDate, setReceiveDate] = useState(new Date());
  const [companyDetails, setCompanyDetails] = useState({
    companyData: {},
    bill_to: {},
    ship_to: {},
  });
  const [receiveOrderData, setReceiveOrderData] = useState();
  // const [purchaseOption, setPurchaseOption] = useState([]);
  const [suplierNameOption, setSuplierNameOption] = useState([]);
  const [selectedSuplierName, setSelectedSuplierName] = useState([]);
  const [selectedItemNameOption, setSelectedItemNameOption] = useState('');
  const [itemNameOptionList, setItemNameOptionList] = useState([]);
  const [itemGroupOptions, setItemGroupOptions] = useState([]);
  const [selectedItemGroupOption, setSelectedItemGroupOption] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [selectedBillingOption, setSelectedBillingOption] = useState('');
  const [selectedShippingOption, setSelectedShippingOption] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [billingOptions, setBillingOptions] = useState([]);
  const [itemGroupName, setItemGroupName] = useState('');
  const [purchaseItemName, setPurchaseItemName] = useState('');
  const [columnsName, setColumnsName] = useState();
  const [openItemdialog, setOpenItemdialog] = useState(false);
  // const [receiveItemsData, setReceiveItemsData] = useState([]);
  const [receiveItems, setReceiveItems] = useState([]);

  const { allCommon } = useSelector(({ common }) => common);
  const { filterToggle } = allCommon.purchaseReceive;

  const {
    receivePurchaseData,
    purchaseItemIdList,
    receiveItemsData,
    purchaseOrderLoading,
    receivePurchaseViewData,
    // supplierList,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);

  // const isView =
  //   (state?.isView ||
  //     location?.pathname?.split('/')[1] === 'purchase-receive-details') &&
  //   true;

  const {
    // settingLoading,
    loading,
    // companyDetails: company_res,
    // activeItemGroupList,
  } = useSelector(({ settings }) => settings);

  const {
    miscMasterLoading,
    // activeWarehouseList
  } = useSelector(({ miscMaster }) => miscMaster);

  useEffect(() => {
    loadRequiredData();
  }, [id]);

  const loadRequiredData = async () => {
    if (id) {
      let response;
      if (Object.keys(purchaseItemIdList)?.length === 0) {
        response = await dispatch(getPurchaseItemIdList(id));
      } else {
        response = purchaseItemIdList;
      }
      // const response = await dispatch(getPurchaseItemIdList(id));
      dispatch(getActiveLaminationTypeList());
      loadOrderInfoData(response);
    }
  };

  useEffect(() => {
    const items = [];
    const itemGroup = purchaseItemIdList?.item_group_name?.toLowerCase();
    const itemName = purchaseItemIdList?.item_name?.toLowerCase();
    setItemGroupName(itemGroup);
    setPurchaseItemName(itemName);

    if (itemGroup === 'roll') {
      setColumnsName(rollColumns);
    } else if (itemGroup === 'ink') {
      setColumnsName(InkColumns);
    } else if (itemGroup === 'carton') {
      setColumnsName(cartonColumns);
    } else if (itemGroup === 'sellotape') {
      setColumnsName(sellotapeColumns);
    }

    if (
      Object.keys(purchaseItemIdList).length > 0 &&
      !receivePurchaseData?.length
    ) {
      purchaseItemIdList?.purchase_order_item?.items?.forEach((item, i) => {
        let Obj = {
          // ...receivePurchaseColumn,
          purchase_item_id: item.id,
          qty: item.qty,
          unit: purchaseItemIdList?.unit,
        };

        const rollObj = {
          color: item.color,
          gsm: item.gsm,
          width: item.width,
          is_mm: item.is_mm === 1 ? true : false,
          design_name: item.design_name,
          texture: item.texture,
          lamination: item.lamination || '',
          material: item.material,
          ...(itemName === 'nonwoven laminated pre-printed' && {
            cylinder_charge: item?.cylinder_charge,
          }),
        };

        const cartonObj = {
          width: item.width,
          is_mm: item.is_mm === 1 ? true : false,
          height: item.height,
          ply: item.ply,
        };

        const inkObj = {
          ink_type: item.ink_type,
          color: item.color,
        };

        const sellotapeObj = {
          name: item.name,
          color: item.color,
        };

        let commonObj =
          itemGroup === 'roll'
            ? rollObj
            : itemGroup === 'ink'
            ? inkObj
            : itemGroup === 'carton'
            ? cartonObj
            : sellotapeObj;

        if (item?.received_item?.length > 0) {
          item.received_item.forEach(data => {
            // items.push({
            //   ...Obj,
            //   // id: idCounter++,
            //   color: item.color,
            //   gsm: item.gsm,
            //   width: item.width,
            //   is_mm: item.is_mm === 1 ? true : false,
            //   design_name: item.design_name,
            //   texture: item.texture,
            //   unique_id: generateUniqueId(),
            //   id_number: data.id,
            //   length: data.length,
            //   weight: data.net_weight,
            //   rate: data.rate,
            //   oldObject: true,
            //   lamination: item.lamination || '',
            //   material: item.material,
            //   unit: purchaseItemIdList?.unit,
            // });

            let rollReceiveObj = {
              id_number: data.id,
              length: data.length,
              weight: data.net_weight,
              rate: data.rate,
            };

            let cartonReceiveObj = {
              length: data.length,
              weight: data.net_weight,
              rate: data.rate,
            };

            let inkReceiveObj = {
              weight: data.net_weight,
              rate: data.rate,
            };

            let receiveObj =
              itemGroup === 'roll'
                ? rollReceiveObj
                : itemGroup === 'ink' || itemGroup === 'sellotape'
                ? inkReceiveObj
                : cartonReceiveObj;

            items.push({
              ...Obj,
              ...receiveObj,
              ...commonObj,
              unique_id: generateUniqueId(),
              oldObject: true,
            });
          });
        }
      });

      // setReceivePurchaseData(items);
      dispatch(setReceivePurchaseData(items));
      dispatch(setReceivePurchaseViewData(items));
    }
  }, [dispatch, purchaseItemIdList]);

  const loadOrderInfoData = async response => {
    // let response;
    // dispatch(getActiveLaminationTypeList());
    // if (Object.keys(purchaseItemIdList).length === 0) {
    //   response = await dispatch(getPurchaseItemIdList(id));
    // }

    const supplier_res = await dispatch(getSupplierList());
    const company_res = await dispatch(getCompanyDetails());
    const warehouse_res = await dispatch(getActiveWarehouseList());
    const itemGroup_res = await dispatch(getActiveItemGroupList());

    if (response) {
      // For itemName Options:
      const itemNameList_res = await dispatch(
        getActiveRawItemListByGroup(response?.item_group),
      );
      const selectedItemName = itemNameList_res.find(
        item => item.name === response.item_name,
      );
      setSelectedItemNameOption(selectedItemName?.value);
      setItemNameOptionList(itemNameList_res);

      //For purchase Option:
      // const purchaseOptionList = response.purchase_order_item_id.map(item => {
      //   return { label: item, value: item };
      // });
      // setPurchaseOption(purchaseOptionList);

      setReceiveOrderData({
        ...response,
        due_date: covertDMYIntoLocalFormat(response.due_date),
        purchase_date: covertDMYIntoLocalFormat(response.purchase_date),
      });
    }
    if (response && supplier_res) {
      // For Supplier Name:
      const supplier = supplier_res.find(
        item => item._id === response.supplier,
      );
      setSuplierNameOption([supplier]);
      setSelectedSuplierName(supplier._id);
    }
    if (response && company_res) {
      // For Company Details:
      const results = company_res.company_address.reduce(function (
        results,
        org,
      ) {
        (results[org.address_type_name.toLowerCase()] =
          results[org.address_type_name.toLowerCase()] || []).push(org);
        return results;
      },
      {});

      setCompanyDetails({
        ...results,
        companyData: company_res,
      });

      const selectedBillingAddress = results?.billing.find(
        bill => bill.address_type === response.bill_to,
      );
      const selectedShippingAddress = results?.shipping.find(
        item => item.address_type === response.ship_to,
      );

      const billingAllOptions = results.billing.map(item => {
        return {
          label: item.location_name,
          value: item.address_type,
          address: item.address,
        };
      });
      const shippingAllOptions = results.shipping.map(item => {
        return {
          label: item.location_name,
          value: item.address_type,
          address: item.address,
        };
      });

      setSelectedBillingOption(selectedBillingAddress?.address_type);
      setBillingOptions(billingAllOptions);
      setSelectedShippingOption(selectedShippingAddress?.address_type);
      setShippingOptions(shippingAllOptions);
    }
    if (response && itemGroup_res) {
      const itemGroupData = itemGroup_res
        .map(item => {
          const b = item.items.find(
            values => values.value === response.item_group,
          );
          return { selectedOption: b, itemGroupOptions: item.items };
        })
        .find(data => data);
      setSelectedItemGroupOption(itemGroupData?.selectedOption?.value);
      setItemGroupOptions(itemGroupData.itemGroupOptions);
    }
    if (response && warehouse_res) {
      // warehouse_res.filter(())
      setWarehouseName(response.warehouse_name);
    }
  };

  // const purchaseItemIDTemplate = data => {
  //   return (
  //     <div className="item_input_Wrap">
  //       <div className="form_group">
  //         <ReactSelectSingle
  //           filter
  //           name="purchase_item_id"
  //           value={data.purchase_item_id}
  //           options={purchaseOption}
  //           onChange={e => {
  //             handlefieldChange(e, e.value, data);
  //           }}
  //           placeholder="Select Purchase Id"
  //           disabled={data?.oldObject || state?.isView}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  const idNoTemplate = data => {
    return (
      <div className="item_input_Wrap">
        <div className="form_group">
          <InputText
            id="idNo"
            name="id_number"
            value={data?.id_number}
            placeholder="Enter Id"
            onChange={e => handlefieldChange(e, e.target.value, data)}
            disabled={data?.oldObject || state?.isView || data?.oldObject}
          />
        </div>
      </div>
    );
  };

  const lengthTemplate = data => {
    return (
      <div className="item_input_Wrap">
        <div className="form_group">
          <InputText
            id="length"
            name="length"
            placeholder="Enter Length"
            value={data?.length}
            onChange={e => handlefieldChange(e, e.target.value, data)}
            disabled={state?.isView || data?.oldObject}
          />
        </div>
      </div>
    );
  };

  const weightTemplate = data => {
    return (
      <div className="item_input_Wrap">
        <div className="form_group">
          <InputText
            id="weight"
            placeholder="Enter Weight"
            name="weight"
            value={data?.weight}
            onChange={e => handlefieldChange(e, e.target.value, data)}
            disabled={state?.isView || data?.oldObject}
          />
          <span className="ms-2">{data?.unit}</span>
        </div>
      </div>
    );
  };

  const rateTemplate = data => {
    return (
      <div className="item_input_Wrap">
        <div className="form_group">
          <InputText
            id="rate"
            placeholder="Enter Rate"
            name="rate"
            value={data?.rate}
            onChange={e => handlefieldChange(e, e.target.value, data)}
            disabled={state?.isView || data?.oldObject}
          />
        </div>
      </div>
    );
  };

  const coulmnsTemplate = (data, row) => {
    const headerName = row?.column?.props?.header;
    const fieldName = row?.column?.props?.field;

    return headerName?.toLowerCase() === 'is mm' ? (
      <Checkbox
        name={fieldName}
        checked={data[fieldName]}
        onChange={e => handlefieldChange(e, e.target.checked, data)}
        disabled
      />
    ) : (
      // : sortedInputFied ? (
      //   <div className="item_input_Wrap">
      //     <div className="form_group">
      //       <InputText
      //         name={fieldName}
      //         value={data[fieldName]}
      //         placeholder={`Enter ${headerName}`}
      //         onChange={e => handlefieldChange(e, e.target.value, data)}
      //         disabled={data?.oldObject}
      //       />
      //     </div>
      //   </div>
      // )
      <span>{data[fieldName] ? data[fieldName] : '-'}</span>
    );
    // headerName?.toLowerCase() === 'is mm' ? (
    //   <Checkbox
    //     name={fieldName}
    //     checked={data[fieldName]}
    //     onChange={e => handlefieldChange(e, e.target.checked, data)}
    //     disabled={data?.oldObject}
    //   />
    // ) : sortedInputFied ? (

    // ) : (
    //   <div className="item_input_Wrap">
    //     <div className="form_group">
    //       <ReactSelectSingle
    //         filter
    //         name={fieldName}
    //         value={data[fieldName]}
    //         options={data[`${fieldName}_option`]}
    //         onChange={e => {
    //           handlefieldChange(e, e.value, data);
    //           // handlefieldChange(e, data);
    //         }}
    //         placeholder={`Select ${headerName}`}
    //         disabled={data?.oldObject}
    //       />
    //     </div>
    //   </div>
    // );
  };

  const handleDelete = data => {
    const removeItem = receivePurchaseData?.filter(
      item => item?.unique_id !== data?.unique_id,
    );

    if (itemGroupName === 'roll') {
      let updatedList = [...receiveItemsData];
      const index = updatedList?.findIndex(
        list => data?.purchase_item_id === list?.purchase_item_id,
      );

      if (index !== -1) {
        const oldObj = updatedList[index];
        const updatedObj = {
          ...oldObj,
          ...(!data.oldObject && {
            receive_qty:
              Number(oldObj?.receive_qty) === 1
                ? ''
                : String(Number(oldObj?.receive_qty) - 1),
          }),
          ...(data.oldObject && {
            already_receive_qty:
              Number(oldObj?.already_receive_qty) === 1
                ? 0
                : String(Number(oldObj?.already_receive_qty) - 1),
          }),
        };
        updatedList[index] = updatedObj;
        // setReceiveItemsData(updatedList);
        dispatch(setReceiveItemsData(updatedList));
      }
    }

    // else {
    //   const newArray = receiveItems?.filter(i => i?.id !== data?.id);
    //   setReceiveItems(newArray);
    // }
    // setReceivePurchaseData(removeItem);
    dispatch(setReceivePurchaseData(removeItem));
  };

  const companyAction = item => {
    return (
      <div className="action_btn_img cursor-pointer">
        <ul>
          <li className="me-2">
            <img
              src={TranchIcon}
              alt="TranchIcon"
              onClick={() => !state?.isView && handleDelete(item)}
              disabled={state?.isView}
            />
          </li>
        </ul>
      </div>
    );
  };

  const handleSubmit = async () => {
    // if (receivePurchaseData?.length > 0) {
    let groupedItems = [];

    // const aa = receiveItemsData.filter(data => {
    //   return !receivePurchaseData.some(
    //     data1 => data1.purchase_item_id === data.purchase_item_id,
    //   );
    // });

    const checkValidations = receivePurchaseData.some(item => {
      if (
        itemGroupName === 'roll' &&
        (!item?.rate || !item?.length || !item?.weight || !item?.id_number)
      ) {
        return true;
      } else if (
        (itemGroupName === 'carton' ||
          itemGroupName === 'ink' ||
          itemGroupName === 'sellotape') &&
        (!item?.rate || !item?.weight)
      ) {
        return true;
      } else {
        return false;
      }
    });

    if (checkValidations) {
      // Check for required Fields:
      toast.error('Please fill the reqired filed.');
    } else {
      const removableData = receiveItemsData.filter(data1 => {
        return !receivePurchaseData.some(
          data2 => data2.purchase_item_id === data1.purchase_item_id,
        );
      });

      if (removableData?.length > 0) {
        removableData.map(removeItem => {
          let removableItem;

          if (itemGroupName === 'roll') {
            removableItem = {
              // id: index,
              color: removeItem.color,
              gsm: removeItem.gsm,
              width: removeItem.width,
              is_mm: removeItem.is_mm || 0,
              material: removeItem.material || '',
              design_name: removeItem.design_name,
              texture: removeItem.texture || '',
              lamination: removeItem.lamination || '',
              ...(purchaseItemName === 'nonwoven laminated pre-printed' && {
                cylinder_charge: Number(removeItem?.cylinder_charge),
              }),
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'carton') {
            removableItem = {
              width: removeItem.width,
              is_mm: removeItem.is_mm || 0,
              length: removeItem.length,
              height: removeItem.height,
              ply: removeItem.ply || '',
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'ink') {
            removableItem = {
              color: removeItem.color,
              ink_type: removeItem.ink_type,
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'sellotape') {
            removableItem = {
              color: removeItem.color,
              name: removeItem.name,
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          }
          groupedItems.push(removableItem);
        });
      }

      receivePurchaseData.map((data, index) => {
        const receivedObj = {
          ...(itemGroupName === 'roll' && { id: data?.id_number || '' }),
          ...((itemGroupName === 'roll' || itemGroupName === 'carton') && {
            length: Number(data?.length),
          }),
          // length: Number(data?.length),
          net_weight: String(data?.weight) || '',
          rate: Number(data?.rate),
          date: getFormattedDate(receiveDate),
        };

        const findedgsmObj = groupedItems.find(list => {
          if (itemGroupName === 'roll') {
            return (
              list.lamination === (data.lamination || '') &&
              list.color?.toLowerCase() === data.color?.toLowerCase() &&
              list.gsm === data.gsm &&
              list.width === data.width &&
              list.is_mm === (data.is_mm || 0) &&
              list.design_name === data.design_name &&
              list.texture === (data.texture || '')
            );
          } else if (itemGroupName === 'carton') {
            return (
              list.length === data.length &&
              list.height === data.height &&
              list.width === data.width &&
              list.is_mm === (data.is_mm || 0) &&
              list.ply === data.ply
            );
          } else if (itemGroupName === 'ink') {
            return (
              list.color?.toLowerCase() === data.color?.toLowerCase() &&
              list.ink_type === data.ink_type
            );
          } else if (itemGroupName === 'sellotape') {
            return (
              list.color?.toLowerCase() === data.color?.toLowerCase() &&
              list.name === data.name
            );
          }
        });

        if (groupedItems.length > 0 && findedgsmObj) {
          const index = groupedItems.findIndex(x => {
            if (itemGroupName === 'roll') {
              return (
                x.lamination === (data.lamination || '') &&
                x.color?.toLowerCase() === data.color?.toLowerCase() &&
                x.gsm === data.gsm &&
                x.width === data.width &&
                x.is_mm === (data.is_mm || 0) &&
                x.design_name === data.design_name &&
                x.texture === (data.texture || '')
              );
            } else if (itemGroupName === 'carton') {
              return (
                x.length === data.length &&
                x.height === data.height &&
                x.width === data.width &&
                x.is_mm === (data.is_mm || 0) &&
                x.ply === data.ply
              );
            } else if (itemGroupName === 'ink') {
              return (
                x.color?.toLowerCase() === data.color?.toLowerCase() &&
                x.ink_type === data.ink_type
              );
            } else if (itemGroupName === 'sellotape') {
              return (
                x.color?.toLowerCase() === data.color?.toLowerCase() &&
                x.name === data.name
              );
            }
          });

          if (index !== -1) {
            const existingItem = groupedItems[index];
            if (data?.oldObject) {
              existingItem.old_received_item.push(receivedObj);
              existingItem.qty += 1;
            } else {
              existingItem.received_item.push(receivedObj);
              existingItem.qty += 1;
            }

            groupedItems[index] = existingItem;
          }
        } else {
          let newItem;

          if (itemGroupName === 'roll') {
            newItem = {
              // id: index,
              color: data.color,
              gsm: data.gsm,
              width: data.width,
              is_mm: data.is_mm || 0,
              material: data.material,
              design_name: data.design_name,
              texture: data.texture || '',
              lamination: data.lamination || '',
              ...(purchaseItemName === 'nonwoven laminated pre-printed' && {
                cylinder_charge: Number(data?.cylinder_charge),
              }),
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'carton') {
            newItem = {
              width: data.width,
              is_mm: data.is_mm || 0,
              length: data.length,
              height: data.height,
              ply: data.ply || '',
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'ink') {
            newItem = {
              color: data.color,
              ink_type: data.ink_type,
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          } else if (itemGroupName === 'sellotape') {
            newItem = {
              color: data.color,
              name: data.name,
              qty: 0,
              received_item: [],
              old_received_item: [],
            };
          }

          if (data?.oldObject) {
            newItem.old_received_item.push(receivedObj);
            newItem.qty += 1;
          } else {
            newItem.received_item.push(receivedObj);
            newItem.qty += 1;
          }
          groupedItems.push(newItem);
        }

        // const payload = {
        //   purchase_id: id,
        //   items: groupedItems,
        // };

        // // const response = await dispatch(purchaseOrderReceived(payload));
        // // if (response) {
        // //   navigate('/purchase-receive');
        // // }
      });

      const payload = {
        purchase_id: id,
        items: groupedItems,
      };

      const response = await dispatch(purchaseOrderReceived(payload));
      if (response) {
        navigate('/purchase-receive');
      }
    }
  };

  const handlefieldChange = (e, eventValue, rowData) => {
    const value = eventValue;
    const name = e.target.name;

    let updatedList = [...receivePurchaseData];
    const index = updatedList?.findIndex(
      x => x?.unique_id === rowData?.unique_id,
    );

    if (index !== -1) {
      const oldObj = updatedList[index];
      const updatedObj = {
        ...oldObj,
        [name]: value,
      };
      updatedList[index] = updatedObj;
      // setReceivePurchaseData(updatedList);
      dispatch(setReceivePurchaseData(updatedList));
    }
  };

  return (
    <>
      {(purchaseOrderLoading || miscMasterLoading || loading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_purchase_order_wrap">
          <div className="border rounded-3 bg_white p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3>Order Information</h3>
            </div>
            <Row>
              <Col xl={3} lg={4} sm={6}>
                <div className="form_group mb-3">
                  <label>Supplier Name</label>
                  <ReactSelectSingle
                    filter
                    value={selectedSuplierName}
                    options={suplierNameOption}
                    onChange={e => {
                      setSelectedSuplierName(e.value);
                    }}
                    placeholder="Select Supplier Name"
                    disabled
                  />
                </div>
              </Col>
              <Col xl={3} lg={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="PONumber">P.O. Number.</label>
                  <InputText
                    id="PONumber"
                    placeholder="P.O. Number"
                    value={receiveOrderData?.po_number}
                    disabled
                  />
                </div>
              </Col>
              <Col xl={2} lg={4} sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="PurchaseDate">Purchase Date</label>
                  <Calendar
                    id="PurchaseDate"
                    placeholder="dd/mm/yyyy"
                    showIcon
                    dateFormat="dd-mm-yy"
                    value={receiveOrderData?.purchase_date}
                    disabled
                  />
                </div>
              </Col>
              <Col xl={2} lg={4} sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="DueDate">Due Date</label>
                  <Calendar
                    id="DueDate"
                    placeholder="dd/mm/yyyy"
                    showIcon
                    dateFormat="dd-mm-yy"
                    value={receiveOrderData?.due_date}
                    disabled
                  />
                </div>
              </Col>
              <Col xl={2} lg={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="SupplierQuote">Supplier Quote No.</label>
                  <InputText
                    id="SupplierQuote"
                    placeholder="Supplier Quote Number"
                    value={receiveOrderData?.supplier_quote_no}
                    disabled
                  />
                </div>
              </Col>
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-2">
                        Bill To<span className="text-danger fs-4">*</span>
                      </h5>
                      <div className="form_group mb-3">
                        <label>
                          {companyDetails?.companyData?.company_name}
                        </label>
                        <div className="address_select_wrap">
                          <ReactSelectSingle
                            options={billingOptions}
                            value={selectedBillingOption}
                            onChange={e => setSelectedBillingOption(e.value)}
                            placeholder="Billing"
                            disabled
                          />
                          {companyDetails?.billing?.[0].address && (
                            <div className="address_wrap">
                              {companyDetails?.billing?.[0]?.address},<br />
                              {companyDetails?.billing?.[0]?.city_name},
                              {companyDetails?.billing?.[0]?.state_name},
                              {companyDetails?.billing?.[0]?.pincode},
                              <br />
                              {companyDetails?.billing?.[0]?.country_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <h5 className="mb-2">Ship To</h5>
                      <div className="form_group mb-3">
                        <label>
                          {companyDetails?.companyData?.company_name}
                        </label>
                        <div className="address_select_wrap">
                          <ReactSelectSingle
                            options={shippingOptions}
                            value={selectedShippingOption}
                            onChange={e => {
                              setSelectedShippingOption(e.value);
                            }}
                            placeholder="Sipping"
                            disabled
                          />
                          {companyDetails?.shipping?.[0].address && (
                            <div className="address_wrap">
                              {companyDetails?.shipping?.[0]?.address},<br />
                              {companyDetails?.shipping?.[0]?.city_name},
                              {companyDetails?.shipping?.[0]?.state_name},
                              {companyDetails?.shipping?.[0]?.pincode},
                              <br />
                              {companyDetails?.shipping?.[0]?.country_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col xl={6} lg={6} sm={6}>
                      <h5 className="mb-2 d-xl-block d-none">&nbsp;</h5>
                      <div className="form_group mb-3">
                        <label>Item Group</label>
                        <ReactSelectSingle
                          filter
                          value={selectedItemGroupOption}
                          options={itemGroupOptions}
                          onChange={e => {
                            setSelectedItemGroupOption(e.value);
                          }}
                          placeholder="Select Item Name"
                          disabled
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} sm={6}>
                      <h5 className="mb-2 d-xl-block d-none">&nbsp;</h5>
                      <div className="form_group mb-3">
                        <label>Item Name</label>
                        <ReactSelectSingle
                          filter
                          value={selectedItemNameOption}
                          options={itemNameOptionList}
                          onChange={e => {
                            setSelectedItemNameOption(e.value);
                          }}
                          placeholder="Select Item Name"
                          disabled
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="Warehouse">Warehouse</label>
                        <InputText
                          id="Warehouse"
                          placeholder="Enter Warehouse"
                          value={warehouseName}
                          onChange={e => setWarehouseName(e.target.value)}
                          disabled
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </div>
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col lg={2}>
                  <div className="page_title">
                    <h3 className="m-0">Receive Purchase Order </h3>
                  </div>
                </Col>
                <Col lg={10}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li className="me-3">
                        <div className="form_group date_select_wrapper d-flex align-items-center">
                          <label
                            htmlFor="ReceiveDate"
                            className="mb-0 me-2 white_space_nowrap"
                          >
                            Receive Date
                          </label>
                          <Calendar
                            id="ReceiveDate"
                            placeholder="15/04/2023"
                            showIcon
                            dateFormat="dd-mm-yy"
                            value={receiveDate}
                            onChange={e => setReceiveDate(e.value)}
                            disabled={state?.isView}
                          />
                        </div>
                      </li>
                      {/* <li className="search_input_wrap me-2">
                        <div className="form_group d-flex align-items-center">
                          <label
                            htmlFor="ItemsNumber"
                            className="mb-0 me-2 white_space_nowrap"
                          >
                            Items Number
                          </label>
                          <InputText
                            type="number"
                            id="ItemsNumber"
                            className="input_wrap"
                            value={itemsNumber}
                            onChange={e => setItemsNumber(e.target.value)}
                            placeholder="Enter Item Number"
                            disabled={state?.isView}
                          />
                        </div>
                      </li> */}
                      <li>
                        <Button
                          className="btn_primary"
                          onClick={() => setOpenItemdialog(true)}
                          disabled={state?.isView}
                        >
                          <img src={PlusIcon} alt="" />
                          Add Items
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="data_table_wrapper cell_padding_large vertical_top">
              <DataTable
                value={
                  state?.isView ? receivePurchaseViewData : receivePurchaseData
                }
                sortMode="single"
                sortField="name"
                sortOrder={1}
                dataKey="unique_id"
              >
                {columnsName?.map((item, index) => {
                  return (
                    <Column
                      key={index}
                      field={item?.label}
                      header={item?.value}
                      sortable
                      body={coulmnsTemplate}
                    ></Column>
                  );
                })}
                {/* <Column
                  field="PurchaseItemID"
                  header="Purchase Item ID"
                  sortable
                  body={purchaseItemIDTemplate}
                ></Column> */}

                {itemGroupName === 'roll' && (
                  <Column
                    field="IDNo"
                    header="ID No."
                    sortable
                    body={idNoTemplate}
                  ></Column>
                )}
                {itemGroupName === 'roll' && (
                  <Column
                    field="Length"
                    header="Length"
                    sortable
                    body={lengthTemplate}
                  ></Column>
                )}
                <Column
                  field="Weight"
                  header="Weight"
                  sortable
                  body={weightTemplate}
                ></Column>
                <Column
                  field="Rate"
                  header="Rate"
                  sortable
                  body={rateTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={companyAction}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
        <div className="button_group d-flex justify-content-end mt-3">
          <Button className="btn_border" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            className="btn_primary ms-3"
            onClick={handleSubmit}
            disabled={state?.isView}
          >
            Save
          </Button>
        </div>
      </div>
      <ReceiveItemsDialog
        setOpenItemdialog={setOpenItemdialog}
        openItemdialog={openItemdialog}
        // setReceivePurchaseData={setReceivePurchaseData}
        // receivePurchaseData={receivePurchaseData}
        // receiveItemsData={receiveItemsData}
        // setReceiveItemsData={setReceiveItemsData}
        receiveItems={receiveItems}
        setReceiveItems={setReceiveItems}
      />
    </>
  );
}
