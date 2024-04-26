import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setIsGetInitialValuesReceivePurchaseOrder,
  setViewSelectedReceivePurchaseOrderData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import {
  getActiveItemGroupList,
  getActiveLaminationTypeList,
  getActiveRawItemListByGroup,
  getActiveWarehouseList,
} from 'Services/Settings/MiscMasterService';
import {
  getPurchaseItemIdList,
  getSupplierList,
} from 'Services/Purchase/purchaseOrderService';
import { getCompanyDetails } from 'Services/Settings/companyService';
import { useParams } from 'react-router-dom';
import { covertDMYIntoLocalFormat, generateUniqueId } from 'Helper/Common';
import ReceivePurchaseOrderDetail from './ReceivePurchaseOrderDetail';

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

const sellotapeColumns = [
  { label: 'color', value: 'Color' },
  { label: 'name', value: 'Name' },
];

const ViewReceivePurchaseOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  // const {
  //   isGetInitialValuesReceivePurchaseOrder,
  //   viewSelectedReceivePurchaseOrderData,
  // } = useSelector(({ purchaseOrder }) => purchaseOrder);

  const handleColumnsName = receiveData => {
    const item_group_name = receiveData?.item_group_name?.toLowerCase();
    let columns = [];

    if (item_group_name === 'roll') {
      columns = rollColumns;
    } else if (item_group_name === 'ink') {
      columns = InkColumns;
    } else if (item_group_name === 'carton') {
      columns = cartonColumns;
    } else if (item_group_name === 'sellotape') {
      columns = sellotapeColumns;
    }
    return columns;
  };

  const handleReceivePurchaseOrderItem = async () => {
    let updatedData = {};
    // dispatch(
    //   setIsGetInitialValuesReceivePurchaseOrder({
    //     ...isGetInitialValuesReceivePurchaseOrder,
    //     view: true,
    //   }),
    // );

    const purchaseItem_res = await dispatch(getPurchaseItemIdList(id));
    dispatch(getActiveLaminationTypeList());
    const supplier_res = await dispatch(getSupplierList());
    const company_res = await dispatch(getCompanyDetails());
    const warehouse_res = await dispatch(getActiveWarehouseList());
    const itemGroup_res = await dispatch(getActiveItemGroupList());

    if (purchaseItem_res) {
      const items = [];
      const itemGroup = purchaseItem_res?.item_group_name?.toLowerCase();
      const itemName = purchaseItem_res?.item_name?.toLowerCase();
      const columns = handleColumnsName(purchaseItem_res);

      const itemNameList_res = await dispatch(
        getActiveRawItemListByGroup(purchaseItem_res?.item_group),
      );
      const selectedItemName = itemNameList_res.find(
        item => item.name === purchaseItem_res?.item_name,
      );

      updatedData = {
        ...updatedData,
        item_name: selectedItemName?.value,
        itemName_options: itemNameList_res,
        receive_order_data: {
          ...purchaseItem_res,
          due_date: covertDMYIntoLocalFormat(purchaseItem_res?.due_date),
          purchase_date: covertDMYIntoLocalFormat(
            purchaseItem_res?.purchase_date,
          ),
        },
      };

      //   setSelectedItemNameOption(selectedItemName?.value);
      //   setItemNameOptionList(itemNameList_res);

      //   setReceiveOrderData({
      //     ...purchaseItem_res,
      //     due_date: covertDMYIntoLocalFormat(purchaseItem_res.due_date),
      //     purchase_date: covertDMYIntoLocalFormat(purchaseItem_res.purchase_date),
      //   });

      if (purchaseItem_res && supplier_res) {
        // For Supplier Name:
        const supplier = supplier_res.filter(
          item => item._id === purchaseItem_res?.supplier,
        );
        // setSuplierNameOption([supplier]);
        // setSelectedSuplierName(supplier._id);

        updatedData = {
          ...updatedData,
          supplier_name: supplier._id,
          suplierName_options: supplier,
        };
      }

      if (purchaseItem_res && company_res) {
        // For Company Details:
        const results = company_res?.company_address?.reduce(function (
          results,
          org,
        ) {
          (results[org.address_type_name.toLowerCase()] =
            results[org.address_type_name.toLowerCase()] || []).push(org);
          return results;
        },
        {});

        // setCompanyDetails({
        //   ...results,
        //   companyData: company_res,
        // });

        const selectedBillingAddress = results?.billing?.find(
          bill => bill.address_type === purchaseItem_res?.bill_to,
        );
        const selectedShippingAddress = results?.shipping?.find(
          item => item.address_type === purchaseItem_res?.ship_to,
        );

        const billingAllOptions = results?.billing?.map(item => {
          return {
            label: item.location_name,
            value: item.address_type,
            address: item.address,
          };
        });
        const shippingAllOptions = results?.shipping?.map(item => {
          return {
            label: item.location_name,
            value: item.address_type,
            address: item.address,
          };
        });

        updatedData = {
          ...updatedData,
          billing: selectedBillingAddress?.address_type,
          billing_options: billingAllOptions,
          shipping: selectedShippingAddress?.address_type,
          shipping_options: shippingAllOptions,
          company_details: {
            ...results,
            companyData: company_res,
          },
        };

        //     setSelectedBillingOption(selectedBillingAddress?.address_type);
        //     setBillingOptions(billingAllOptions);
        //     setSelectedShippingOption(selectedShippingAddress?.address_type);
        //     setShippingOptions(shippingAllOptions);
      }

      if (purchaseItem_res && itemGroup_res) {
        const itemGroupData = itemGroup_res
          .map(item => {
            const b = item.items.find(
              values => values.value === purchaseItem_res?.item_group,
            );
            return { selectedOption: b, itemGroupOptions: item.items };
          })
          .find(data => data);

        updatedData = {
          ...updatedData,
          item_group: itemGroupData?.selectedOption?.value,
          itemGroup_options: itemGroupData.itemGroupOptions,
        };

        // setSelectedItemGroupOption(itemGroupData?.selectedOption?.value);
        // setItemGroupOptions(itemGroupData.itemGroupOptions);
      }

      if (purchaseItem_res && warehouse_res) {
        // setWarehouseName(purchaseItem_res.warehouse_name);
        updatedData = {
          ...updatedData,
          warehouse_name: purchaseItem_res?.warehouse_name,
        };
      }

      //   setItemGroupName(itemGroup);
      //   setPurchaseItemName(itemName);

      purchaseItem_res?.purchase_order_item?.items?.forEach((item, i) => {
        let Obj = {
          // ...receivePurchaseColumn,
          purchase_item_id: item.id,
          qty: item.qty,
          unit: purchaseItem_res?.unit,
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

        const commonObj =
          itemGroup === 'roll'
            ? rollObj
            : itemGroup === 'ink'
            ? inkObj
            : itemGroup === 'carton'
            ? cartonObj
            : sellotapeObj;

        if (item?.received_item?.length > 0) {
          item.received_item.forEach(data => {
            const rollReceiveObj = {
              id_number: data.id,
              length: data.length,
              weight: data.net_weight,
              rate: data.rate,
            };

            const cartonReceiveObj = {
              length: data.length,
              weight: data.net_weight,
              rate: data.rate,
            };

            const inkReceiveObj = {
              weight: data.net_weight,
              rate: data.rate,
            };

            const receiveObj =
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

      //   dispatch(setReceivePurchaseData(items));
      //   dispatch(setReceivePurchaseViewData(items));

      updatedData = {
        ...updatedData,
        columns_name: columns,
        item_group_name: itemGroup,
        purchase_item_name: itemName,
        receive_purchase_data: items,
      };
    }

    setInitialData(updatedData);
    // dispatch(setViewSelectedReceivePurchaseOrderData(updatedData));
  };

  useEffect(() => {
    // if (isGetInitialValuesReceivePurchaseOrder?.view === true) {
    //   setInitialData(viewSelectedReceivePurchaseOrderData);
    // } else {
    handleReceivePurchaseOrderItem();
    // }
  }, []);

  return <ReceivePurchaseOrderDetail initialValues={initialData} />;
};
export default memo(ViewReceivePurchaseOrder);
