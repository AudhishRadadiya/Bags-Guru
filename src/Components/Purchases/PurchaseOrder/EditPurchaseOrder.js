import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setIsGetInitialValuesPurchaseOrder,
  setUpdateSelectedPurchaseOrderData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import {
  getJobForPurchaseOrderList,
  getPurchaseOrderById,
} from 'Services/Purchase/purchaseOrderService';
import { getCompanyDetails } from 'Services/Settings/companyService';
import {
  getActiveRawItemListByGroup,
  getRawItemListById,
} from 'Services/Settings/MiscMasterService';
import { covertDMYIntoLocalFormat, generateUniqueId } from 'Helper/Common';
import _ from 'lodash';

function EditPurchaseOrder() {
  const dispatch = useDispatch();
  const { purchase_id } = useParams();
  const [initialData, setInitialData] = useState({});

  const { updateSelectedPurchaseOrderData, isGetInitialValuesPurchaseOrder } =
    useSelector(({ purchaseOrder }) => purchaseOrder);

  const formatString = inputString => {
    // Remove spaces, replace with underscores, and convert to lowercase
    const formattedString = inputString.replace(/ /g, '_').toLowerCase();
    return formattedString;
  };

  const handleCompanyDetails = async () => {
    const company_res = await dispatch(getCompanyDetails());
    const from_job_res = await dispatch(getJobForPurchaseOrderList());

    let companyData = {
      job_for_POList: from_job_res,
    };

    if (company_res?.company_address?.length > 0) {
      const newAddress = company_res?.company_address?.map(x => {
        return {
          ...x,
          label: x?.location_name,
          value: x?._id,
        };
      });
      const billingList = newAddress?.filter(
        x => x?.address_type_name?.toLowerCase() === 'billing',
      );
      const shippingList = newAddress?.filter(
        x => x?.address_type_name?.toLowerCase() === 'shipping',
      );

      companyData = {
        ...companyData,
        company_address: newAddress,
        billing_list: billingList,
        shipping_list: shippingList,
        company_name: company_res?.company_name,
      };
    }

    return companyData;
  };

  const handleSalesPurchaseOrderItemFirstPhase = async () => {
    dispatch(
      setIsGetInitialValuesPurchaseOrder({
        ...isGetInitialValuesPurchaseOrder,
        update: true,
      }),
    );

    const companyEditDetails = await handleCompanyDetails();
    const res = await dispatch(getPurchaseOrderById(purchase_id));

    let purchaseEditData = {
      ...companyEditDetails,
      new_item_data: {},
      dummy_newItem_data: {},
    };

    // if (companyEditDetails?.company_address?.length > 0) {
    // const newAddress = company_res?.company_address?.map(x => {
    //   return {
    //     ...x,
    //     label: x?.location_name,
    //     value: x?._id,
    //   };
    // });

    // // setCompanyAddress(newAddress);
    // const billingList = newAddress?.filter(
    //   x => x?.address_type_name?.toLowerCase() === 'billing',
    // );
    // const shippingList = newAddress?.filter(
    //   x => x?.address_type_name?.toLowerCase() === 'shipping',
    // );

    // purchaseEditData = {
    //   ...purchaseEditData,
    //   company_address: newAddress,
    //   billing_list: billingList,
    //   shipping_list: shippingList,
    //   company_name: company_res?.company_name,
    // };

    // setBillingList(billingList);
    // setShippingList(shippingList);
    // setCompanyName(company_res?.company_name);

    if (res) {
      const newBillingList = companyEditDetails?.billing_list?.filter(
        x => res?.bill_to === x?._id,
      );
      const newShippingList = companyEditDetails?.shipping_list?.filter(
        x => res?.ship_to === x?._id,
      );

      const activeItemList = await dispatch(
        getActiveRawItemListByGroup(res?.item_group),
      );

      if (activeItemList?.length > 0) {
        let data = activeItemList?.find(
          i => i?.name?.toLowerCase() === res?.item_name?.toLowerCase(),
        );
        if (data) {
          // setSelectedItem(data);
          purchaseEditData = {
            ...purchaseEditData,
            selected_item: data,
          };

          const success = await dispatch(
            getRawItemListById(res?.item_group, res?.item),
          );
          if (success) {
            const updatedItemData = res?.purchase_order_item?.items.map(obj => {
              const { ...rest } = obj;
              const amount_calculation =
                rest?.rate_in?.toLowerCase() === 'kg'
                  ? rest?.qty * rest?.rate * rest?.net_weight
                  : rest?.qty * rest?.rate;

              let taxAmount = (amount_calculation * rest?.tax) / 100;

              const newItemDataKeys = Object.keys(rest)?.reduce((acc, key) => {
                let modifiedKey = key;

                switch (key) {
                  case 'total':
                    modifiedKey = 'total_amount';
                    break;
                  default:
                    modifiedKey = key;
                }

                // acc[modifiedKey] = value === 1 ? true : false;
                acc[modifiedKey] = obj[key];
                return acc;
              }, {});
              return {
                ...newItemDataKeys,
                ...(!newItemDataKeys?.id && {
                  id: generateUniqueId(),
                }),
                tax_amount: taxAmount,
                marked_as_received: newItemDataKeys?.marked_as_received,
              };
            });

            if (data?.name?.toLowerCase() === 'nonwoven non laminated') {
              const matchingObject = res?.purchase_order_item?.items?.filter(
                obj1 => obj1?.marked_as_received === 1,
              );
              // setGsmTableViewList(res?.purchase_order_item?.items);

              // setGsmTableViewList(updatedItemData);
              // setItemData([]);
              // setPrePrintedTableViewList([]);
              // setPrePrintedTableHeader({});
              // setSelectedItemList(matchingObject);

              purchaseEditData = {
                ...purchaseEditData,
                gsmTable_viewList: updatedItemData,
                selected_itemList: matchingObject,
                // itemData: [],
                item_data: [],
                prePrintedTable_viewList: [],
                prePrintedTable_headerList: {},
              };
            } else if (
              data?.name?.toLowerCase() === 'nonwoven laminated pre-printed'
            ) {
              const from_job_res = await dispatch(getJobForPurchaseOrderList());
              const matchingObject = res?.purchase_order_item?.items?.filter(
                obj1 => obj1?.marked_as_received === 1,
              );
              // const firstDataObject = getObjectWithMaxLength(
              //   res?.purchase_order_item?.items,
              // );
              // let filterColumn = _.omit(firstDataObject, ['job_id', 'id']);
              // setPrePrintedTableHeader(filterColumn);

              const resultObject = success?.item_attribute?.reduce(
                (result, item) => {
                  let data = formatString(item.name);
                  result[data] = '';
                  return result;
                },
                {},
              );
              let newObj = { ...resultObject };
              let finalObj = {
                ...newObj,
                amount: 0,
                // total_amount: 0, // This colum is not showing on display but passed to API.
                new_white_cylinder_amount: 0,
                // new_white_cylinder_total_amount: 0, // This colum is not showing on display but passed to API.
                new_coloured_cylinder_amount: 0,
                // new_coloured_cylinder_total_amount: 0, // This colum is not showing on display but passed to API.
                reengraved_cylinder_amount: 0,
                // reengraved_cylinder_total_amount: 0, // This colum is not showing on display but passed to API.
              };
              // setPrePrintedTableHeader(finalObj);

              // // setPrePrintedTableViewList(res?.purchase_order_item?.items);
              // setPrePrintedTableViewList(updatedItemData);
              // setGsmTableViewList([]);
              // setItemData([]);
              // setSelectedItemList(matchingObject);

              purchaseEditData = {
                ...purchaseEditData,
                prePrintedTable_viewList: updatedItemData,
                prePrintedTable_headerList: finalObj,
                selected_itemList: matchingObject,
                job_for_POList: from_job_res,
                gsmTable_viewList: [],
                item_data: [],
              };
            } else {
              const matchingObject = res?.purchase_order_item?.items?.filter(
                obj1 => obj1?.marked_as_received === 1,
              );

              purchaseEditData = {
                ...purchaseEditData,
                selected_itemList: matchingObject,
                item_data: updatedItemData,
                gsmTable_viewList: [],
                prePrintedTable_viewList: [],
                prePrintedTable_headerList: {},
              };

              // setSelectedItemList(matchingObject);
              // setItemData(updatedItemData);
              // setGsmTableViewList([]);
              // setPrePrintedTableViewList([]);
              // setPrePrintedTableHeader({});
            }
          }
        }
      }

      // setFieldValue('bill_to_address', newBillingList);
      // setFieldValue('ship_to_address', newShippingList);
      // setFieldValue(
      //   'purchase_date',
      //   covertDMYIntoLocalFormat(res?.purchase_date),
      // );
      // setFieldValue('due_date', covertDMYIntoLocalFormat(res?.due_date));
      // setFieldValue('po_number', res?.po_number);

      //Old Flow

      const colorList = res?.partition[0]?.partition?.map(item => {
        let itemData = _.omit(item?.gsm_partition[0], [
          'shaft',
          'parts',
          'total',
          'width',
          'rate',
        ]);
        const colorName = item?.color;
        const code = item?.code;
        let gsmList = item?.gsm_partition?.map(d => {
          const gsmPartitionList = {
            gsm: 0,
            total: 0,
            length: 0,
            shaft: 0,
            rate: 0,
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
            p5: 0,
            p6: 0,
            p7: 0,
            p8: 0,
          };
          const { gsm, total, length, shaft, rate, ...newObj } =
            gsmPartitionList;

          const filteredData = Object.keys(newObj).map((item, i) => ({
            [item]: d?.parts[i] ? d?.parts[i] : 0,
          }));

          let modifiedNewObj = { ...newObj }; // Create a copy to avoid mutating the original object

          // Modify modifiedNewObj based on filteredData
          filteredData.forEach(item => {
            const key = Object.keys(item)[0];
            const value = item[key];

            // Update modifiedNewObj only if the key exists
            if (modifiedNewObj.hasOwnProperty(key)) {
              modifiedNewObj[key] = value;
            }
          });

          return {
            ...modifiedNewObj,
            shaft: d?.shaft,
            rate: d?.rate,
            total: d?.total,
            length: d?.length,
            gsm: d?.gsm,
          };
        });
        // setNewItemData(itemData);
        // setDummyNewItemData(itemData);

        purchaseEditData = {
          ...purchaseEditData,
          new_item_data: itemData ? itemData : {},
          dummy_newItem_data: itemData ? itemData : {},
        };

        return { gsmList: gsmList, code: code, colorName: colorName };
      });
      // setColorGsmList(colorList);
      // setDummyColorGsmList(colorList);

      purchaseEditData = {
        ...purchaseEditData,
        color_gsmList: colorList || [],
        dummyColor_gsmList: colorList || [],
        bill_to_address: newBillingList,
        ship_to_address: newShippingList,
        purchase_date: covertDMYIntoLocalFormat(res?.purchase_date),
        due_date: covertDMYIntoLocalFormat(res?.due_date),
        po_number: res?.po_number,
        rawItem_optionList: activeItemList,
        // gsmTable_viewList: [],
        // prePrintedTable_viewList: [],
        // prePrintedTable_headerList: {},
      };

      // setFieldValue('bill_to_address', newBillingList);
      // setFieldValue('ship_to_address', newShippingList);
      // setFieldValue(
      //   'purchase_date',
      //   covertDMYIntoLocalFormat(res?.purchase_date),
      // );
      // setFieldValue('due_date', covertDMYIntoLocalFormat(res?.due_date));
      // setFieldValue('po_number', res?.po_number);
    }
    // }

    const updatedData = {
      ...res,
      ...purchaseEditData,
    };

    setInitialData(updatedData);
    dispatch(setUpdateSelectedPurchaseOrderData(updatedData));
  };

  const handleSalesPurchaseOrderItemSecondPhase = async () => {
    const companyEditDetails = await handleCompanyDetails();

    const newBillingList = companyEditDetails?.billing_list?.filter(
      x => updateSelectedPurchaseOrderData?.bill_to === x?._id,
    );
    const newShippingList = companyEditDetails?.shipping_list?.filter(
      x => updateSelectedPurchaseOrderData?.ship_to === x?._id,
    );

    const updatedData = {
      ...updateSelectedPurchaseOrderData,
      ...companyEditDetails,
      bill_to_address: newBillingList,
      ship_to_address: newShippingList,
    };
    setInitialData(updatedData);
  };

  useEffect(() => {
    if (isGetInitialValuesPurchaseOrder?.update === true) {
      handleSalesPurchaseOrderItemSecondPhase();
    } else {
      handleSalesPurchaseOrderItemFirstPhase();
    }
  }, []);

  // setCompanyAddress : company_address = []
  // setBillingList : billing_list = []
  // setShippingList : shipping_list = []
  // setCompanyName : company_name = ''
  // setSelectedItem : selected_item = ''

  // setItemData : item_data = []
  // setGsmTableViewList : gsmTable_viewList = [];
  // setPrePrintedTableViewList : prePrintedTable_viewList = []
  // setPrePrintedTableHeader : prePrintedTable_headerList = {}
  // setSelectedItemList : selected_itemList = []

  // setColorGsmList: color_gsmList = []
  // setDummyColorGsmList: dummyColor_gsmList = []
  // setNewItemData: new_item_data = {},
  // setDummyNewItemData: dummy_newItem_data = {}
  // setSearchProduct: search_product = ''
  // setSelectedJobList: selected_job_list = []
  // filterToggle: filter_toggle = false
  // setIsValidate: is_validate = false
  // setJobForPOList: job_for_POList = []

  return <PurchaseOrderDetail initialValues={initialData} />;
}

export default EditPurchaseOrder;
