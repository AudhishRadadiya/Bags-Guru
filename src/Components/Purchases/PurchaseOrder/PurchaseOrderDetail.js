import { useCallback, useEffect, useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import ReactSelectSingle from '../../../Components/Common/ReactSelectSingle';
import PdfIcon from '../../../Assets/Images/pdf.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import SearchIcon from '../../../Assets/Images/search.svg';
import { InputTextarea } from 'primereact/inputtextarea';
import { Image } from 'primereact/image';
import { RadioButton } from 'primereact/radiobutton';
import {
  addPurchaseOrder,
  exportPartitionPdf,
  generateCommonItemGroupPDF,
  generatePrePrintedRollPDF,
  getJobForPurchaseOrderList,
  getSupplierList,
  updateMarkAsReceiveStatus,
  updatePurchaseOrder,
} from 'Services/Purchase/purchaseOrderService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getActiveGsmList,
  getActiveItemGroupList,
  getActiveRawItemListByGroup,
  getActiveWarehouseList,
  getRawItemListById,
} from 'Services/Settings/MiscMasterService';
import Loader from 'Components/Common/Loader';
import DropZone from 'Components/Common/DropZone';
import { toast } from 'react-toastify';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import _ from 'lodash';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import PDFIcon from '../../../Assets/Images/pdf.svg';
import {
  areArraysOfObjectsEqual,
  areObjectsEqual,
  convertIntoNumber,
  generateUniqueId,
  getObjectWithMaxLength,
  infinityOrNanToZero,
  removeSpecialCharacter,
  roundValueThousandSeparator,
  thousandSeparator,
} from 'Helper/Common';
import {
  clearAddSelectedPurchaseOrderData,
  clearUpdateSelectedPurchaseOrderData,
  setAddSelectedPurchaseOrderData,
  setIsGetInitialValuesPurchaseOrder,
  setUpdateSelectedPurchaseOrderData,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';
import Skeleton from 'react-loading-skeleton';

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

const addPurchaseOrderSchema = Yup.object().shape({
  supplier: Yup.string().required('Supplier Name is required'),
  bill_to_address: Yup.array().required('Billing Address is required'),
  ship_to_address: Yup.array().required('Shipping Address is required'),
  item_group: Yup.string().required('Item Group is required'),
  item: Yup.string().required('Item is required'),
  warehouse: Yup.string().required('warehouse is required'),
});

export default function PurchaseOrderDetail({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { purchase_id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  // const [filterToggle, setFilterToggle] = useState(false);
  // const [companyAddress, setCompanyAddress] = useState([]);
  const [newAttributeModal, setNewAttributeModal] = useState(false);
  const [newItemData, setNewItemData] = useState({});
  // const [dummyNewItemData, setDummyNewItemData] = useState({});

  // const [searchProduct, setSearchProduct] = useState('');
  // const [itemData, setItemData] = useState([]);
  // const [billingList, setBillingList] = useState([]);
  // const [shippingList, setShippingList] = useState([]);
  // const [selectedItem, setSelectedItem] = useState('');
  // const [isValidate, setIsValidate] = useState(false);
  // const [colorGsmList, setColorGsmList] = useState([]);
  // const [dummyColorGsmList, setDummyColorGsmList] = useState([]);
  // const [gsmTableViewList, setGsmTableViewList] = useState([]);
  // const [companyName, setCompanyName] = useState('');
  const [fromJobModal, setFromJobModal] = useState(false);
  // const [selectedJobList, setSelectedJobList] = useState([]);
  // const [prePrintedTableHeader, setPrePrintedTableHeader] = useState({});
  // const [prePrintedTableViewList, setPrePrintedTableViewList] = useState([]);
  // const [selectedItemList, setSelectedItemList] = useState([]);
  const {
    supplierList,
    // purchaseOrderDetail,
    // jobForPOList,
    // viewPurchaseOrderList,
    purchaseOrderLoading,
    purchaseOrderListLoading,
    editPurchaseOrderLoading,
    isGetInitialValuesPurchaseOrder,
    addSelectedPurchaseOrderData,
    updateSelectedPurchaseOrderData,
    // viewSelectedPurchaseOrderData,
  } = useSelector(({ purchaseOrder }) => purchaseOrder);

  const { miscMasterLoading, activeWarehouseList, activeGsmList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  const { settingLoading, activeItemGroupList, companyDetails } = useSelector(
    ({ settings }) => settings,
  );

  const { rawItemLoading, activeRawItemListByGroup, rawItemListById } =
    useSelector(({ rawitem }) => rawitem);

  const loadRequiredData = useCallback(() => {
    dispatch(getSupplierList());
    dispatch(getActiveWarehouseList());
    dispatch(getActiveItemGroupList());
    dispatch(getActiveGsmList());
    // dispatch(getCompanyDetails());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    // return () => {
    //   dispatch(clearPurchaseOrderDetail());
    //   // dispatch(setJobForPOList([]));
    // };
  }, []);

  const submitHandle = useCallback(
    async values => {
      if (values?.color_gsmList?.length > 0) {
        let data = partitionList(values);

        // Update gsm list for change the "total" key instead of "total_amount"
        const updatedgsmTableViewList = values?.gsmTable_viewList?.map(data => {
          const { total_amount, ...rest } = data;
          return {
            ...rest,
            total: total_amount,
          };
        });

        if (purchase_id) {
          const {
            purchase_order_item,
            purchase_order_item_id,
            status,
            ...finalValue
          } = values;

          if (state?.isView) {
            const itemList = values?.gsmTable_viewList?.map(d => {
              return { id: d.id, marked_as_received: d?.marked_as_received };
            });
            const payload = {
              purchase_id: finalValue?._id,
              items: itemList,
            };

            let res = await dispatch(updateMarkAsReceiveStatus(payload));
            if (res) {
              // dispatch(
              //   setIsGetInitialValuesPurchaseOrder({
              //     ...isGetInitialValuesPurchaseOrder,
              //     view: false,
              //   }),
              // );
              // dispatch(clearViewSelectedPurchaseOrderData());
              navigate('/purchase-order');
            }
          } else {
            const payload = {
              ...finalValue,
              purchase_id: finalValue?._id,
              bill_to_address: finalValue?.bill_to_address[0]?.address,
              ship_to_address: finalValue?.ship_to_address[0]?.address,
              items: updatedgsmTableViewList,
              // new_items: filterNewItem,
              partition: data,
            };
            let res = await dispatch(updatePurchaseOrder(payload));
            if (res) {
              dispatch(
                setIsGetInitialValuesPurchaseOrder({
                  ...isGetInitialValuesPurchaseOrder,
                  update: false,
                }),
              );
              dispatch(clearUpdateSelectedPurchaseOrderData());
              navigate('/purchase-order');
            }
          }
        } else {
          const payload = {
            ...values,
            bill_to_address: values?.bill_to_address[0]?.address,
            ship_to_address: values?.ship_to_address[0]?.address,
            bill_to: values?.bill_to_address[0]?._id,
            ship_to: values?.ship_to_address[0]?._id,
            bill_to_location: values?.bill_to_address?.[0]?.location_name,
            ship_to_location: values?.ship_to_address?.[0]?.location_name,
            items: updatedgsmTableViewList,
            partition: data,
          };
          let res = await dispatch(addPurchaseOrder(payload));
          if (res) {
            dispatch(
              setIsGetInitialValuesPurchaseOrder({
                ...isGetInitialValuesPurchaseOrder,
                add: false,
              }),
            );
            dispatch(clearAddSelectedPurchaseOrderData());
            navigate('/purchase-order');
          }
        }
      } else {
        // const finalList =
        //   prePrintedTableViewList?.length > 0
        //     ? prePrintedTableViewList
        //     : itemData;

        const itemName = values?.selected_item?.name?.toLowerCase();

        // NONWOVEN LAMINATED PRE-PRINTED
        // CARTON
        // SELLOTAPE
        // INK

        const finalList =
          // itemName === 'nonwoven non laminated'
          //   ? gsmTableViewList
          // :
          itemName === 'nonwoven laminated pre-printed'
            ? values?.prePrintedTable_viewList
            : values?.item_data;

        const updatedItemData = finalList.map(obj => {
          const { id, tax_amount, ...rest } = obj;

          const newItemDataKeys = Object.keys(rest)?.reduce((acc, key) => {
            let modifiedKey = key;

            switch (key) {
              case 'total_amount':
                modifiedKey = 'total';
                break;
              default:
                modifiedKey = key;
            }

            acc[modifiedKey] = obj[key];
            return acc;
          }, {});

          return {
            ...newItemDataKeys,
            net_weight: newItemDataKeys['net_weight']
              ? newItemDataKeys['net_weight']
              : 1,
          };
        });

        if (purchase_id) {
          const {
            purchase_order_item,
            purchase_order_item_id,
            status,
            ...finalValue
          } = values;
          if (state?.isView) {
            const itemList = finalList?.map(d => {
              return { id: d.id, marked_as_received: d?.marked_as_received };
            });
            const payload = {
              purchase_id: finalValue?._id,
              items: itemList,
            };

            let res = await dispatch(updateMarkAsReceiveStatus(payload));
            if (res) {
              // dispatch(
              //   setIsGetInitialValuesPurchaseOrder({
              //     ...isGetInitialValuesPurchaseOrder,
              //     view: false,
              //   }),
              // );
              // dispatch(clearViewSelectedPurchaseOrderData());
              navigate('/purchase-order');
            }
          } else {
            const payload = {
              ...finalValue,
              purchase_id: finalValue?._id,
              bill_to_address: finalValue?.bill_to_address[0]?.address,
              ship_to_address: finalValue?.ship_to_address[0]?.address,
              bill_to: finalValue?.bill_to_address[0]?._id,
              ship_to: finalValue?.ship_to_address[0]?._id,
              bill_to_location: finalValue?.bill_to_address?.[0]?.location_name,
              ship_to_location: finalValue?.ship_to_address?.[0]?.location_name,
              items: updatedItemData,
            };

            let res = await dispatch(updatePurchaseOrder(payload));
            if (res) {
              dispatch(
                setIsGetInitialValuesPurchaseOrder({
                  ...isGetInitialValuesPurchaseOrder,
                  update: false,
                }),
              );
              dispatch(clearUpdateSelectedPurchaseOrderData());
              navigate('/purchase-order');
            }
          }
        } else {
          const payload = {
            ...values,
            bill_to_address: values?.bill_to_address[0]?.address,
            ship_to_address: values?.ship_to_address[0]?.address,
            bill_to: values?.bill_to_address[0]?._id,
            ship_to: values?.ship_to_address[0]?._id,
            bill_to_location: values?.bill_to_address?.[0]?.location_name,
            ship_to_location: values?.ship_to_address?.[0]?.location_name,
            items: updatedItemData,
          };

          let res = await dispatch(addPurchaseOrder(payload));
          if (res) {
            dispatch(
              setIsGetInitialValuesPurchaseOrder({
                ...isGetInitialValuesPurchaseOrder,
                add: false,
              }),
            );
            dispatch(clearAddSelectedPurchaseOrderData());
            navigate('/purchase-order');
          }
        }
      }
    },
    [
      purchase_id,
      state?.isView,
      dispatch,
      navigate,
      isGetInitialValuesPurchaseOrder,
    ],
  );

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    // initialValues:
    //   purchase_id && state?.isView
    //     ? viewPurchaseOrderList
    //     : purchaseOrderDetail,
    initialValues: initialValues,
    validationSchema: addPurchaseOrderSchema,
    onSubmit: submitHandle,
  });

  // useEffect(() => {
  //   const loadAddress = async () => {
  //     if (companyDetails?.company_address?.length > 0) {
  //       let NewAddress = companyDetails?.company_address?.map(x => {
  //         return {
  //           ...x,
  //           label: x?.location_name,
  //           value: x?._id,
  //         };
  //       });
  //       setCompanyAddress(NewAddress);
  //       const billingList = NewAddress?.filter(
  //         x => x?.address_type_name?.toLowerCase() === 'billing',
  //       );
  //       const shippingList = NewAddress?.filter(
  //         x => x?.address_type_name?.toLowerCase() === 'shipping',
  //       );
  //       setBillingList(billingList);
  //       setShippingList(shippingList);
  //       setCompanyName(companyDetails?.company_name);
  //       if (locationPath?.[1] === 'add-purchase-order') {
  //         setFieldValue('ship_to_address', [{ ...shippingList?.[0] }]);
  //         setFieldValue('bill_to_address', [{ ...billingList?.[0] }]);
  //         setFieldValue('bill_to', billingList?.[0]?.address_type);
  //         setFieldValue('ship_to', shippingList?.[0]?.address_type);
  //         setFieldValue('bill_to_location', shippingList?.[0]?.location_name);
  //         setFieldValue('ship_to_location', shippingList?.[0]?.location_name);

  //         dispatch(clearPurchaseOrderDetail());
  //         // Blank data-table when change the routing tab
  //         setGsmTableViewList([]);
  //         setItemData([]);
  //         setPrePrintedTableViewList([]);
  //         setPrePrintedTableHeader({});
  //         setSelectedItemList([]);
  //       } else {
  //         if (purchase_id) {
  //           let res;
  //           if (state?.isView) {
  //             res = await dispatch(getDetailViewPurchaseOrderById(purchase_id));
  //           } else {
  //             res = await dispatch(getPurchaseOrderById(purchase_id));
  //           }
  //           if (res) {
  //             const newBillingList = billingList?.filter(
  //               x => res?.bill_to === x?.address_type,
  //             );
  //             const newShippingList = shippingList?.filter(
  //               x => res?.ship_to === x?.address_type,
  //             );
  //             let activeItemList = await dispatch(
  //               getActiveRawItemListByGroup(res?.item_group),
  //             );
  //             if (activeItemList?.length > 0) {
  //               let data = activeItemList?.find(
  //                 i => i?.name?.toLowerCase() === res?.item_name?.toLowerCase(),
  //               );
  //               if (data) {
  //                 setSelectedItem(data);

  //                 let success = await dispatch(
  //                   getRawItemListById(res?.item_group, res?.item),
  //                 );
  //                 if (success) {
  //                   const updatedItemData = res?.purchase_order_item?.items.map(
  //                     obj => {
  //                       const { tax_amount, ...rest } = obj;

  //                       const newItemDataKeys = Object.keys(rest)?.reduce(
  //                         (acc, key) => {
  //                           let modifiedKey = key;

  //                           switch (key) {
  //                             case 'total':
  //                               modifiedKey = 'total_amount';
  //                               break;
  //                             default:
  //                               modifiedKey = key;
  //                           }

  //                           // acc[modifiedKey] = value === 1 ? true : false;
  //                           acc[modifiedKey] = obj[key];
  //                           return acc;
  //                         },
  //                         {},
  //                       );
  //                       return {
  //                         ...newItemDataKeys,
  //                         ...(!newItemDataKeys?.id && {
  //                           id: generateUniqueId(),
  //                         }),
  //                         marked_as_received:
  //                           newItemDataKeys?.marked_as_received,
  //                       };
  //                     },
  //                   );

  //                   if (
  //                     data?.name?.toLowerCase() === 'nonwoven non laminated'
  //                   ) {
  //                     const matchingObject =
  //                       res?.purchase_order_item?.items?.filter(
  //                         obj1 => obj1?.marked_as_received === 1,
  //                       );
  //                     // setGsmTableViewList(res?.purchase_order_item?.items);
  //                     setGsmTableViewList(updatedItemData);
  //                     setItemData([]);
  //                     setPrePrintedTableViewList([]);
  //                     setPrePrintedTableHeader({});
  //                     setSelectedItemList(matchingObject);
  //                   } else if (
  //                     data?.name?.toLowerCase() ===
  //                     'nonwoven laminated pre-printed'
  //                   ) {
  //                     const matchingObject =
  //                       res?.purchase_order_item?.items?.filter(
  //                         obj1 => obj1?.marked_as_received === 1,
  //                       );
  //                     // const firstDataObject = getObjectWithMaxLength(
  //                     //   res?.purchase_order_item?.items,
  //                     // );
  //                     // let filterColumn = _.omit(firstDataObject, ['job_id', 'id']);
  //                     // setPrePrintedTableHeader(filterColumn);

  //                     const resultObject = success?.item_attribute?.reduce(
  //                       (result, item) => {
  //                         let data = formatString(item.name);
  //                         result[data] = '';
  //                         return result;
  //                       },
  //                       {},
  //                     );
  //                     let newObj = { ...resultObject };
  //                     let finalObj = {
  //                       ...newObj,
  //                       amount: 0,
  //                       total_amount: 0,
  //                       new_white_cylinder_amount: 0,
  //                       new_white_cylinder_total_amount: 0,
  //                       new_coloured_cylinder_amount: 0,
  //                       new_coloured_cylinder_total_amount: 0,
  //                       reengraved_cylinder_amount: 0,
  //                       reengraved_cylinder_total_amount: 0,
  //                       ...(state?.isView && { orderd_weight: 0 }),
  //                       ...(state?.isView && { recieved_net_weight: 0 }),
  //                       ...(state?.isView && { cylinder_charge: 0 }),
  //                     };
  //                     setPrePrintedTableHeader(finalObj);

  //                     // setPrePrintedTableViewList(res?.purchase_order_item?.items);
  //                     setPrePrintedTableViewList(updatedItemData);
  //                     setGsmTableViewList([]);
  //                     setItemData([]);
  //                     setSelectedItemList(matchingObject);
  //                   } else {
  //                     const matchingObject =
  //                       res?.purchase_order_item?.items?.filter(
  //                         obj1 => obj1?.marked_as_received === 1,
  //                       );
  //                     setSelectedItemList(matchingObject);
  //                     setItemData(updatedItemData);
  //                     setGsmTableViewList([]);
  //                     setPrePrintedTableViewList([]);
  //                     setPrePrintedTableHeader({});
  //                   }
  //                 }
  //               }
  //             }
  //             setFieldValue('bill_to_address', newBillingList);
  //             setFieldValue('ship_to_address', newShippingList);
  //             setFieldValue(
  //               'purchase_date',
  //               covertDMYIntoLocalFormat(res?.purchase_date),
  //             );
  //             setFieldValue(
  //               'due_date',
  //               covertDMYIntoLocalFormat(res?.due_date),
  //             );
  //             setFieldValue('po_number', res?.po_number);

  //             //Old Flow

  //             let colorList = res?.partition[0]?.partition?.map(item => {
  //               let itemData = _.omit(item?.gsm_partition[0], [
  //                 'shaft',
  //                 'parts',
  //                 'total',
  //                 'width',
  //                 'rate',
  //               ]);
  //               const colorName = item?.color;
  //               const code = item?.code;
  //               let gsmList = item?.gsm_partition?.map(d => {
  //                 const gsmPartitionList = {
  //                   gsm: 0,
  //                   total: 0,
  //                   length: 0,
  //                   shaft: 0,
  //                   rate: 0,
  //                   p1: 0,
  //                   p2: 0,
  //                   p3: 0,
  //                   p4: 0,
  //                   p5: 0,
  //                   p6: 0,
  //                   p7: 0,
  //                   p8: 0,
  //                 };
  //                 const { gsm, total, length, shaft, rate, ...newObj } =
  //                   gsmPartitionList;

  //                 const filteredData = Object.keys(newObj).map((item, i) => ({
  //                   [item]: d?.parts[i] ? d?.parts[i] : 0,
  //                 }));

  //                 let modifiedNewObj = { ...newObj }; // Create a copy to avoid mutating the original object

  //                 // Modify modifiedNewObj based on filteredData
  //                 filteredData.forEach(item => {
  //                   const key = Object.keys(item)[0];
  //                   const value = item[key];

  //                   // Update modifiedNewObj only if the key exists
  //                   if (modifiedNewObj.hasOwnProperty(key)) {
  //                     modifiedNewObj[key] = value;
  //                   }
  //                 });

  //                 return {
  //                   ...modifiedNewObj,
  //                   shaft: d?.shaft,
  //                   rate: d?.rate,
  //                   total: d?.total,
  //                   length: d?.length,
  //                   gsm: d?.gsm,
  //                 };
  //               });
  //               setNewItemData(itemData);
  //               setDummyNewItemData(itemData);
  //               return { gsmList: gsmList, code: code, colorName: colorName };
  //             });
  //             setColorGsmList(colorList);
  //             setDummyColorGsmList(colorList);
  //           }
  //         }
  //       }
  //     }
  //   };
  //   loadAddress();
  // }, [dispatch, companyDetails, state?.isView]);

  const partitionList = useCallback(
    values => {
      let FinalArray = [];
      if (values?.color_gsmList?.length > 0) {
        let data = values?.color_gsmList?.map(d => {
          const colorNm = d?.colorName;
          const code = d?.code;

          let gsm_partition = [];
          let gsmObj = d?.gsmList.map(item => {
            let parts = [];
            let filterColumn = _.omit(item, [
              'gsm',
              'length',
              'rate',
              'shaft',
              'total',
            ]);
            Object.entries(filterColumn).forEach((d, i) => {
              if (
                (d[1] > 0 || d[1] === 'null') &&
                (item['shaft'] > 0 || item['shaft'] === 'null') &&
                (item['rate'] > 0 || item['rate'] === 'null')
              ) {
                parts.push(d[1]);
              }
            });

            let newObj = {
              ...values?.new_item_data,
              gsm: item['gsm'],
              length: item['length'],
              shaft: item['shaft'],
              total: item['total'],
              rate: item['rate'],
              parts: parts,
            };
            gsm_partition.push(newObj);
          });
          let newObj = {
            color: colorNm,
            code: code,
            gsm_partition: gsm_partition,
          };
          FinalArray.push(newObj);
          return FinalArray;
        });

        return FinalArray;
      }
    },
    [values?.color_gsmList, values?.new_item_data],
  );

  const formatString = inputString => {
    // Remove spaces, replace with underscores, and convert to lowercase
    const formattedString = inputString.replace(/ /g, '_').toLowerCase();
    return formattedString;
  };

  const formatOption = data => {
    const updated = data?.map(y => {
      return {
        ...y,
        label: y?.value,
        value: y?.value,
      };
    });
    return updated;
  };

  const handleItemChange = (event, value) => {
    const name = event.target.name;
    // setNewItemData(values => ({ ...values, [name]: value }));
    commonUpdateFieldValue('new_item_data', {
      ...values?.new_item_data,
      [name]: value,
    });
  };

  const errorRender = useCallback(value => {
    return <p className="text-danger">{value} is Required!</p>;
  }, []);

  const totalCount = (data, key) => {
    let NewData = data?.length > 0 ? data : [];
    return NewData?.reduce((sum, cuurent) => {
      if (Object.keys(cuurent)?.includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0)?.toFixed(2);
  };

  const handleAddUpdate = () => {
    const isMandatory = rawItemListById?.item_attribute?.filter(
      itemA => itemA.is_mandatory === true,
    );

    const newItemDataKeys =
      values?.new_item_data &&
      Object.keys(values?.new_item_data)?.reduce((acc, key) => {
        const modifiedKey = removeSpecialCharacter(key);
        acc[modifiedKey] = values?.new_item_data[key];
        return acc;
      }, {});

    const checkErrorField = isMandatory
      ?.filter(item => {
        const check1 = newItemDataKeys?.hasOwnProperty(item.name.toLowerCase());
        const check2 = newItemDataKeys[item?.name?.toLowerCase()];

        const validation =
          !check1 || Array.isArray(check2) ? !check2?.length : !check2;

        return validation && item;
        // return (
        //   !newItemDataKeys?.hasOwnProperty(item.name.toLowerCase()) ||
        //   !newItemDataKeys[item?.name?.toLowerCase()]
        // );
      })
      ?.map(item => item);
    if (checkErrorField?.length > 0) {
      // setIsValidate(true);
      commonUpdateFieldValue('is_validate', true);
    } else {
      // isValidate && setIsValidate(false);
      if (values?.is_validate) {
        commonUpdateFieldValue('is_validate', false);
      }
      const newItemDataKeys = Object.keys(values?.new_item_data).reduce(
        (acc, key) => {
          const value = values?.new_item_data[key];
          acc[key] = Array.isArray(value)
            ? value.join(',')
            : // : typeof value === 'boolean'
              // ? value === true
              //   ? 'Yes'
              //   : 'No'
              value;
          return acc;
        },
        {},
      );
      if (values?.color_gsmList?.length > 0) {
        // if (purchase_id && gsmTableViewList?.length > 0) {
        //   setGsmTableViewList([]);
        // }
        let FinalArray = [];
        let changeFieldObj = {};

        let data = values?.color_gsmList?.map(i1 => {
          const colorNm = i1?.colorName;
          let gsmObj = i1?.gsmList.map(item => {
            let filterColumn = _.omit(item, [
              'gsm',
              'length',
              'rate',
              'shaft',
              'total',
            ]);

            // const newItemDataKeys = Object.fromEntries(
            //   Object.entries(newItemData)?.map(([key, value]) => [
            //     key,
            //     Array.isArray(value) ? value?.join(',') : value,
            //   ]),
            // );
            Object.entries(filterColumn).forEach((d, i) => {
              if (d[1] && item['shaft'] && item['rate'] && item['gsm']) {
                let newObj = {};
                let netWeight =
                  (d[1] * 0.0254 * item['length'] * item['gsm']) / 1000;
                let amount =
                  values?.new_item_data?.rate_in?.toLowerCase() === 'kg'
                    ? item['shaft'] * item['rate'] * netWeight
                    : item['shaft'] * item['rate'];
                let taxAmount =
                  (convertIntoNumber(amount) * rawItemListById?.GST_rate) / 100;
                let totalAmount = taxAmount + convertIntoNumber(amount);
                let data = _.omit(
                  item,
                  ['color'],
                  ['p1'],
                  ['p2'],
                  ['p3'],
                  ['p4'],
                  ['p5'],
                  ['p6'],
                  ['p7'],
                  ['p8'],
                  ['shaft'],
                );

                const findedObj = FinalArray.filter(items => {
                  return (
                    items.gsm === item['gsm'] &&
                    items.color === colorNm &&
                    items.width === d[1]
                  );
                });
                if (findedObj?.length > 0) {
                  let updatedList = [...FinalArray];
                  const index = FinalArray.findIndex(items => {
                    return (
                      items.gsm === item['gsm'] &&
                      items.color === colorNm &&
                      items.width === d[1]
                    );
                  });

                  if (index !== -1) {
                    const oldObj = updatedList[index];

                    let mergingNetWeight =
                      (d[1] * 0.0254 * item['length'] * item['gsm']) / 1000;

                    let mergingAmount =
                      (oldObj.qty + item['shaft']) * oldObj?.rate;

                    const netWeight =
                      mergingNetWeight > 0 ? mergingNetWeight?.toFixed(2) : 0;

                    const amount_calculation =
                      values?.new_item_data?.rate_in?.toLowerCase() === 'kg'
                        ? (oldObj.qty + item['shaft']) *
                          oldObj?.rate *
                          netWeight
                        : mergingAmount;

                    let mergingTaxAmount =
                      (convertIntoNumber(amount_calculation) *
                        rawItemListById?.GST_rate) /
                      100;
                    let mergingTotalAmount =
                      mergingTaxAmount + convertIntoNumber(amount_calculation);

                    const updatedObj = {
                      ...newItemDataKeys,
                      ...oldObj,
                      color: colorNm,
                      total: item['total'] + oldObj?.total,
                      amount: convertIntoNumber(amount_calculation),
                      qty: (oldObj.qty += item['shaft']),
                      tax_amount: Math.round(mergingTaxAmount),
                      total_amount:
                        mergingTotalAmount > 0
                          ? mergingTotalAmount?.toFixed(2)
                          : 0,
                      net_weight: netWeight,
                      gross_weight: netWeight,
                    };
                    updatedList[index] = updatedObj;
                    FinalArray = updatedList;
                  }
                } else {
                  newObj = {
                    ...newItemDataKeys,
                    ...data,
                    width: d[1],
                    color: colorNm,
                    gsm: item['gsm'],
                    length: item['length'],
                    tax: rawItemListById?.GST_rate,
                    amount: convertIntoNumber(amount),
                    qty: item['shaft'],
                    tax_amount: Math.round(taxAmount),
                    total_amount: totalAmount > 0 ? totalAmount?.toFixed(2) : 0,
                    net_weight: netWeight > 0 ? netWeight?.toFixed(2) : 0,
                    gross_weight: netWeight > 0 ? netWeight?.toFixed(2) : 0,
                  };
                  FinalArray.push(newObj);
                }
              }
            });
            return item;
          });
        });
        if (FinalArray?.length > 0) {
          if (purchase_id) {
            let FinalList = [...FinalArray];
            // setGsmTableViewList(FinalList);
            let totalOfAmount = totalCount(FinalList, 'amount');
            const sub_total_amount =
              convertIntoNumber(totalOfAmount) -
              convertIntoNumber(values?.discount) +
              convertIntoNumber(values.additional_amount);

            const calculate_tax =
              (convertIntoNumber(sub_total_amount) *
                rawItemListById?.GST_rate) /
              100;
            const calculate_total = sub_total_amount + calculate_tax;

            // Old :
            // let TotalTax = totalCount(FinalList, 'tax_amount');
            // let total =
            //   convertIntoNumber(totalOfAmount) -
            //   values?.discount +
            //   convertIntoNumber(TotalTax) +
            //   values?.additional_amount;
            // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
            // setFieldValue('tax', convertIntoNumber(TotalTax));
            // setFieldValue('total', convertIntoNumber(total));

            changeFieldObj = {
              gsmTable_viewList: FinalList,
              // sub_total: convertIntoNumber(totalOfAmount),
              // tax: convertIntoNumber(TotalTax),
              // total: convertIntoNumber(total),
              sub_total: convertIntoNumber(sub_total_amount),
              tax: convertIntoNumber(calculate_tax),
              total: convertIntoNumber(calculate_total),
            };

            // handleChangeFieldsdData(changeFieldObj);
            setNewAttributeModal(false);
          } else {
            // setGsmTableViewList(FinalArray);
            let totalOfAmount = totalCount(FinalArray, 'amount');
            const sub_total_amount =
              convertIntoNumber(totalOfAmount) -
              convertIntoNumber(values?.discount) +
              convertIntoNumber(values.additional_amount);

            const calculate_tax =
              (convertIntoNumber(sub_total_amount) *
                rawItemListById?.GST_rate) /
              100;
            const calculate_total = sub_total_amount + calculate_tax;

            // Old:
            // let TotalTax = totalCount(FinalArray, 'tax_amount');
            // let total =
            //   convertIntoNumber(totalOfAmount) -
            //   values?.discount +
            //   convertIntoNumber(TotalTax) +
            //   values?.additional_amount;
            // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
            // setFieldValue('tax', convertIntoNumber(TotalTax));
            // setFieldValue('total', convertIntoNumber(total));

            changeFieldObj = {
              gsmTable_viewList: FinalArray,
              // sub_total: convertIntoNumber(totalOfAmount),
              // tax: convertIntoNumber(TotalTax),
              // total: convertIntoNumber(total),
              sub_total: convertIntoNumber(sub_total_amount),
              tax: convertIntoNumber(calculate_tax),
              total: convertIntoNumber(calculate_total),
            };

            // handleChangeFieldsdData(changeFieldObj);
            setNewAttributeModal(false);
          }
        } else {
          toast.error('Please fill all the required fields');
        }
        // setDummyColorGsmList(colorGsmList);
        // setDummyNewItemData(newItemData);

        changeFieldObj = {
          ...changeFieldObj,
          dummyColor_gsmList: values?.color_gsmList,
          dummy_newItem_data: values?.new_item_data,
        };
        handleChangeFieldsdData(changeFieldObj);
      } else {
        let changeFieldObj = {};
        const amount_calculation =
          values?.new_item_data?.rate_in?.toLowerCase() === 'kg'
            ? values?.new_item_data?.qty *
              values?.new_item_data?.rate *
              values?.new_item_data?.net_weight
            : values?.new_item_data?.qty * values?.new_item_data?.rate;

        if (
          values?.selected_item?.name?.toLowerCase() ===
          'nonwoven laminated pre-printed'
        ) {
          let data = [];
          // let amount = newItemData?.qty * newItemData?.rate;
          let amount = amount_calculation;
          let taxAmount = (amount * rawItemListById?.GST_rate) / 100;
          let totalAmount = taxAmount + amount;
          let newWhiteCylinderAmount =
            values?.new_item_data?.new_white_cylinder_qty *
            values?.new_item_data?.new_white_cylinder_rate;
          let newWhiteCylindertaxAmount =
            (newWhiteCylinderAmount * rawItemListById?.GST_rate) / 100;
          let newWhiteCylindertotalAmount =
            newWhiteCylindertaxAmount + newWhiteCylinderAmount;
          let newColouredCylinderAmount =
            values?.new_item_data?.new_coloured_cylinder_qty *
            values?.new_item_data?.new_coloured_cylinder_rate;
          let newColouredCylindertaxAmount =
            (newColouredCylinderAmount * rawItemListById?.GST_rate) / 100;
          let newColouredCylindertotalAmount =
            newColouredCylindertaxAmount + newColouredCylinderAmount;
          let reEngravedCylinderAmount =
            values?.new_item_data?.reengraved_cylinder_qty *
            values?.new_item_data?.reengraved_cylinder_rate;
          let reEngravedCylindertaxAmount =
            (reEngravedCylinderAmount * rawItemListById?.GST_rate) / 100;
          let reEngravedCylindertotalAmount =
            reEngravedCylindertaxAmount + reEngravedCylinderAmount;
          let obj = {
            ...newItemDataKeys,
            ...(!newItemDataKeys?.id && { id: generateUniqueId() }),
            material: newItemDataKeys?.material
              ? newItemDataKeys?.material
              : 'NON WOVEN',
            // net_weight: newItemDataKeys?.required_qty,
            amount: Math.round(amount),
            tax: rawItemListById?.GST_rate,
            tax_amount: infinityOrNanToZero(Math.round(taxAmount)),
            total_amount: infinityOrNanToZero(Math.round(totalAmount)),
            new_white_cylinder_amount: infinityOrNanToZero(
              Math.round(newWhiteCylinderAmount),
            ),
            new_white_cylinder_total_amount: infinityOrNanToZero(
              Math.round(newWhiteCylindertotalAmount),
            ),
            new_coloured_cylinder_amount: infinityOrNanToZero(
              Math.round(newColouredCylinderAmount),
            ),
            new_coloured_cylinder_total_amount: infinityOrNanToZero(
              Math.round(newColouredCylindertotalAmount),
            ),
            reengraved_cylinder_amount: infinityOrNanToZero(
              Math.round(reEngravedCylinderAmount),
            ),
            reengraved_cylinder_total_amount: infinityOrNanToZero(
              Math.round(reEngravedCylindertotalAmount),
            ),
          };
          if (newItemDataKeys?.id) {
            let updatedList = [...values?.prePrintedTable_viewList];
            const index = updatedList.findIndex(
              x => x?.id === newItemDataKeys?.id,
            );

            if (index !== -1) {
              const oldObj = updatedList[index];
              const updatedObj = {
                ...oldObj,
                ...obj,
              };
              updatedList[index] = updatedObj;
              data = updatedList;
            }
          } else {
            const allItemData = [...values?.prePrintedTable_viewList, obj];
            data = allItemData;
          }

          let totalOfAmount = totalCount(data, 'amount');
          let totalWhiteCylinder = totalCount(
            data,
            'new_white_cylinder_amount',
          );
          let totalColouredCylinder = totalCount(
            data,
            'new_coloured_cylinder_amount',
          );
          let totalReengravedCylinder = totalCount(
            data,
            'reengraved_cylinder_amount',
          );

          const sub_total_amount =
            convertIntoNumber(totalOfAmount) +
            convertIntoNumber(totalWhiteCylinder) +
            convertIntoNumber(totalColouredCylinder) +
            convertIntoNumber(totalReengravedCylinder) +
            convertIntoNumber(values.additional_amount) -
            convertIntoNumber(values?.discount);

          const calculate_tax =
            (convertIntoNumber(sub_total_amount) * rawItemListById?.GST_rate) /
            100;
          const calculate_total = sub_total_amount + calculate_tax;

          // Old
          // let TotalTax = totalCount(data, 'tax_amount');
          // let total =
          //   convertIntoNumber(totalOfAmount) -
          //   values?.discount +
          //   convertIntoNumber(TotalTax) +
          //   values?.additional_amount;

          changeFieldObj = {
            prePrintedTable_viewList: data,
            // sub_total: convertIntoNumber(totalOfAmount),
            sub_total: convertIntoNumber(sub_total_amount),
            // tax: convertIntoNumber(TotalTax),
            tax: convertIntoNumber(calculate_tax),
            // total: convertIntoNumber(total),
            total: convertIntoNumber(calculate_total),
          };
          // handleChangeFieldsdData(changeFieldObj);

          // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
          // setFieldValue('tax', convertIntoNumber(TotalTax));
          // setFieldValue('total', convertIntoNumber(total));
          // setPrePrintedTableViewList(data);
        } else {
          let data = [];
          // let amount = newItemData?.qty * newItemData?.rate;
          let amount =
            values?.new_item_data?.rate_in?.toLowerCase() === 'kg'
              ? values?.new_item_data?.qty *
                values?.new_item_data?.rate *
                (values?.new_item_data?.net_weight
                  ? values?.new_item_data?.net_weight
                  : 1)
              : values?.new_item_data?.qty * values?.new_item_data?.rate;

          let taxAmount = (amount * rawItemListById?.GST_rate) / 100;
          let totalAmount = taxAmount + amount;

          let obj = {
            ...newItemDataKeys,
            ...(!newItemDataKeys?.id && { id: generateUniqueId() }),
            ...(values?.item_group?.toLowerCase() === 'sellotape' && {
              material: newItemDataKeys?.material
                ? newItemDataKeys?.material
                : 'NON WOVEN',
            }),
            amount: Math.round(amount),
            tax: rawItemListById?.GST_rate,
            tax_amount: Math.round(taxAmount),
            total_amount: Math.round(totalAmount),
          };
          if (newItemDataKeys?.id) {
            let updatedList = [...values?.item_data];
            const index = updatedList.findIndex(
              x => x?.id === newItemDataKeys?.id,
            );

            if (index !== -1) {
              const oldObj = updatedList[index];
              const updatedObj = {
                ...oldObj,
                ...obj,
              };
              updatedList[index] = updatedObj;
              data = updatedList;
            }
          } else {
            const allItemData = [...values?.item_data, obj];
            data = allItemData;
          }

          let totalOfAmount = totalCount(data, 'amount');
          const sub_total_amount =
            convertIntoNumber(totalOfAmount) -
            convertIntoNumber(values?.discount) +
            convertIntoNumber(values.additional_amount);

          const calculate_tax =
            (convertIntoNumber(sub_total_amount) * rawItemListById?.GST_rate) /
            100;
          const calculate_total = sub_total_amount + calculate_tax;

          // Old:
          // let TotalTax = totalCount(data, 'tax_amount');
          // let total =
          //   convertIntoNumber(totalOfAmount) -
          //   values?.discount +
          //   convertIntoNumber(TotalTax) +
          //   values?.additional_amount;

          changeFieldObj = {
            // sub_total: convertIntoNumber(totalOfAmount),
            // tax: convertIntoNumber(TotalTax),
            // total: convertIntoNumber(total),
            sub_total: convertIntoNumber(sub_total_amount),
            tax: convertIntoNumber(calculate_tax),
            total: convertIntoNumber(calculate_total),
            item_data: data,
          };
          // handleChangeFieldsdData(changeFieldObj);

          // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
          // setFieldValue('tax', convertIntoNumber(TotalTax));
          // setFieldValue('total', convertIntoNumber(total));
          // setItemData(data);
        }

        changeFieldObj = {
          ...changeFieldObj,
          new_item_data: {},
        };

        handleChangeFieldsdData(changeFieldObj);
        // setNewItemData({});
        setNewAttributeModal(false);
      }
    }
  };

  const filteredBillingList = useMemo(() => {
    if (!values?.billing_list) {
      return [];
    }
    const billingAddresses = Array.isArray(values?.bill_to_address)
      ? values?.bill_to_address
      : [values?.bill_to_address];

    const filteredList =
      values?.billing_list?.filter(obj => {
        return !billingAddresses?.some(obj2 => obj?._id === obj2?._id);
      }) || [];

    const foundItem =
      values?.billing_list?.find(
        x =>
          x?._id === billingAddresses?.[0]?.value ||
          x?._id === billingAddresses?.[0]?._id,
      ) || {};

    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [values?.billing_list, values?.bill_to_address]);

  const filteredShippingList = useMemo(() => {
    if (!values?.shipping_list) {
      return [];
    }
    const shippingAddresses = Array.isArray(values?.ship_to_address)
      ? values?.ship_to_address
      : [values?.ship_to_address];
    const filteredList =
      values?.shipping_list.filter(
        obj => !shippingAddresses?.some(obj2 => obj?._id === obj2?._id),
      ) || [];

    const foundItem =
      values?.shipping_list?.find(
        x =>
          x?._id === shippingAddresses?.[0]?.value ||
          x?._id === shippingAddresses?.[0]?._id,
      ) || {};
    return Object.keys(foundItem)?.length > 0
      ? [...filteredList, { ...foundItem }]
      : [...filteredList];
  }, [values?.shipping_list, values?.ship_to_address]);

  const onCustomChange = (key, val) => {
    // let list;
    let changeFieldObj = {};

    // if (key === 'bill_to_address') {
    //   list = [...values?.bill_to_address];
    // } else {
    //   list = [...values?.ship_to_address];
    // }

    const findAddress = values?.company_address?.find(x => x?._id === val);
    // list[0] = findAddress;

    if (key === 'bill_to_address') {
      changeFieldObj = {
        bill_to_address: findAddress
          ? [findAddress]
          : [...values?.bill_to_address],
        bill_to: findAddress?._id ? findAddress?._id : '',
        bill_to_location: findAddress?.location_name
          ? findAddress?.location_name
          : '',
      };
    } else {
      changeFieldObj = {
        ship_to_address: findAddress
          ? [findAddress]
          : [...values?.ship_to_address],
        ship_to: findAddress?._id ? findAddress?._id : '',
        ship_to_location: findAddress?.location_name
          ? findAddress?.location_name
          : '',
      };
    }

    // commonUpdateFieldValue(key, list);
    handleChangeFieldsdData(changeFieldObj);
  };

  const handleAddgsm = color => {
    let colorGsmListData = [...values?.color_gsmList];
    colorGsmListData = colorGsmListData.map(item => {
      if (item.colorName === color) {
        return { ...item, gsmList: [...item.gsmList, { ...gsmPartitionList }] };
      }
      return item;
    });

    commonUpdateFieldValue('color_gsmList', colorGsmListData);
    // setColorGsmList(colorGsmListData);
  };

  const handleGsmChange = (color, key, value, index) => {
    let colorGsmListData = [...values?.color_gsmList];
    colorGsmListData = colorGsmListData.map(item => {
      if (item.colorName === color) {
        let data = item?.gsmList?.map((d, i) => {
          if (i === index) {
            let sum = d['total'];
            let findObj = {};
            let length = d['length'];
            if (key === 'p1') {
              sum =
                value +
                d['p2'] +
                d['p3'] +
                d['p4'] +
                d['p5'] +
                d['p6'] +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p2') {
              sum =
                d['p1'] +
                value +
                d['p3'] +
                d['p4'] +
                d['p5'] +
                d['p6'] +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p3') {
              sum =
                d['p1'] +
                d['p2'] +
                value +
                d['p4'] +
                d['p5'] +
                d['p6'] +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p4') {
              sum =
                d['p1'] +
                d['p2'] +
                d['p3'] +
                value +
                d['p5'] +
                d['p6'] +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p5') {
              sum =
                d['p1'] +
                d['p2'] +
                d['p3'] +
                d['p4'] +
                value +
                d['p6'] +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p6') {
              sum =
                d['p1'] +
                d['p2'] +
                d['p3'] +
                d['p4'] +
                d['p5'] +
                value +
                d['p7'] +
                d['p8'];
            }
            if (key === 'p7') {
              sum =
                d['p1'] +
                d['p2'] +
                d['p3'] +
                d['p4'] +
                d['p5'] +
                d['p6'] +
                value +
                d['p8'];
            }
            if (key === 'p8') {
              sum =
                d['p1'] +
                d['p2'] +
                d['p3'] +
                d['p4'] +
                d['p5'] +
                d['p6'] +
                d['p7'] +
                value;
            }
            if (key === 'length') {
              length = value;
            }
            if (key === 'gsm') {
              findObj = activeGsmList?.find(d => d?.gsm === value);
              length = findObj?.length;
            }
            return { ...d, [key]: value, total: sum, length: length };
          }
          return d;
        });
        return { ...item, gsmList: data };
      }
      return item;
    });

    // setColorGsmList(colorGsmListData);
    commonUpdateFieldValue('color_gsmList', colorGsmListData);
  };

  const handleDeleteGsm = (color, index) => {
    let colorGsmListData = [...values?.color_gsmList];
    let colorList = { ...values?.new_item_data };
    colorGsmListData = colorGsmListData.map(item => {
      if (item.colorName === color) {
        let data = item?.gsmList?.filter((d, i) => i !== index);

        return { ...item, gsmList: data };
      }
      return item;
    });

    let updatedData = colorGsmListData?.filter(d => d?.gsmList?.length > 0);
    Object.keys(colorList).forEach(key => {
      const isCheckColor = updatedData?.find(d => d?.colorName === color);
      if (Array.isArray(colorList[key]) && !isCheckColor) {
        colorList[key] = colorList[key].filter(
          c => c?.toLowerCase() !== color?.toLowerCase(),
        );
      }
    });

    const changeFieldObj = {
      new_item_data: colorList,
      color_gsmList: updatedData,
    };

    handleChangeFieldsdData(changeFieldObj);

    // setNewItemData(colorList);
    // setColorGsmList(updatedData);
  };

  const handleChangeJobListData = useCallback(
    (e, idx, key) => {
      let list = [...values?.job_for_POList];
      list = list.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            [key]: e,
          };
        }
        return item;
      });
      // dispatch(setJobForPOList(list));
      commonUpdateFieldValue('job_for_POList', list);
    },
    [values?.job_for_POList],
  );

  const compareArrays = (array1, array2) => {
    return array1.map(obj1 => {
      const matchingObject = array2.find(obj2 => obj1._id === obj2._id);

      if (matchingObject) {
        return { ...obj1, is_enabled: true };
      } else {
        return { ...obj1, is_enabled: false, required_qty: '' };
      }
    });
  };

  const handleCheckboxTemplate = data => {
    let newList = data?.map((x, i) => {
      return {
        ...x,
        required_qty: '',
      };
    });
    let list = [...values?.job_for_POList];
    let filteredList = [];
    if (data?.length > 0) {
      filteredList = compareArrays(list, newList);
    } else {
      filteredList = list?.map(d => {
        return { ...d, is_enabled: false };
      });
    }

    const chanfeFieldObj = {
      job_for_POList: filteredList,
      selected_job_list: newList,
    };

    handleChangeFieldsdData(chanfeFieldObj);

    // dispatch(setJobForPOList(filteredList));
    // setSelectedJobList(newList);
  };

  const handleMarkAsReceivedCheckboxTemplate = (data, list, name) => {
    let updatedList = [...list];
    // const newList = updatedList?.filter(item => {
    //    selectedItemList.some(data => item._id === data._id);
    // });
    let newList = updatedList?.map((obj1, i) => {
      const matchingObject = data?.find(obj2 => obj1?.id === obj2?.id);
      if (matchingObject) {
        return {
          ...obj1,
          marked_as_received: 1,
        };
      } else {
        return {
          ...obj1,
          marked_as_received: 0,
        };
      }
    });
    // setSelectedItemList(data);
    let changeFieldObj = {
      selected_itemList: data,
    };
    if (name === 'item') {
      // setItemData(newList);
      changeFieldObj = {
        ...changeFieldObj,
        // itemData: newList,
        item_data: newList,
      };
    } else if (name === 'nonWoven_nonLaminated') {
      // setGsmTableViewList(newList);
      changeFieldObj = {
        ...changeFieldObj,
        gsmTable_viewList: newList,
      };
    } else if (name === 'nonWoven_prePrinted') {
      // setPrePrintedTableViewList(newList);
      changeFieldObj = {
        ...changeFieldObj,
        prePrintedTable_viewList: newList,
      };
    }
    handleChangeFieldsdData(changeFieldObj);
  };

  const imageBodyTemplate = useCallback((data, index) => {
    return (
      <div className="image_zoom_Wrapper">
        <Image src={data[index?.field]} alt="Image" />
      </div>
    );
  }, []);

  const amountsTemplete = useCallback((data, index) => {
    if (index?.field === 'tax') {
      return <div>{data[index?.field] ? `${data[index?.field]}%` : ''}</div>;
    } else if (index?.field === 'total_amount') {
      return (
        <div>{thousandSeparator(convertIntoNumber(data[index?.field]))}</div>
      );
    } else {
      return <div>{thousandSeparator(data[index?.field])}</div>;
    }
  }, []);

  const prePrintedNoteTemplate = data => {
    return (
      <div className="note_wraper">
        <p>{data?.note}</p>
      </div>
    );
  };

  const imageJobBodyTemplate = useCallback(data => {
    return (
      <div className="image_zoom_Wrapper">
        <Image src={data?.design_image} alt="Image" />
      </div>
    );
  }, []);

  const laminationJobBodyTemplate = useCallback(data => {
    const lamination = data?.lamination?.join(', ');
    return <div>{lamination}</div>;
  }, []);

  const checkboxBodyTemplate = useCallback((data, index) => {
    return (
      <div className="form_group">
        <Checkbox
          name={data[index?.field]}
          value={data[index?.field]}
          checked={data[index?.field]}
        ></Checkbox>
      </div>
    );
  }, []);

  const qtyBodyTemplate = useCallback(
    (data, index) => {
      return (
        <div className="form_group mb-0 with_input_field">
          <InputNumber
            placeholder="Qty"
            className="w-100"
            useGrouping={false}
            disabled={!data?.is_enabled}
            value={data?.required_qty}
            onChange={e => {
              handleChangeJobListData(e.value, index?.rowIndex, 'required_qty');
            }}
          />
        </div>
      );
    },
    [handleChangeJobListData],
  );

  const renderNonWovenNonLaminatedList = useMemo(() => {
    const firstDataObject = getObjectWithMaxLength(values?.gsmTable_viewList);
    let data = _.omit(firstDataObject, [
      'total',
      'tax_amount',
      'id',
      'marked_as_received',
      'cylinder_charge',
    ]);

    return Object.keys(data).map(key => ({
      field: key,
      header:
        key === 'gsm'
          ? key.toUpperCase()
          : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), // Capitalize the first letter
      body: rawItemListById?.item_attribute?.find(
        item => item?.type === 6 && formatString(item?.name) === key,
      )
        ? 'checkbox'
        : rawItemListById?.item_attribute?.find(
            item => item?.type === 5 && formatString(item?.name) === key,
          )
        ? 'image'
        : '',
    }));
  }, [values?.gsmTable_viewList, rawItemListById?.item_attribute]);

  const renderItemList = useMemo(() => {
    const firstDataObject = getObjectWithMaxLength(values?.item_data);
    let data = _.omit(firstDataObject, [
      'id',
      'total',
      'material',
      'tax_amount',
      'marked_as_received',
      'cylinder_charge',
    ]);

    return Object.keys(data).map(key => ({
      field: key,
      header:
        key === 'gsm'
          ? key?.toUpperCase()
          : key.charAt(0).toUpperCase() + key.slice(1)?.replaceAll('_', ' '), // Capitalize the first letter
      body: rawItemListById?.item_attribute?.find(
        item => item?.type === 6 && formatString(item?.name) === key,
      )
        ? 'checkbox'
        : rawItemListById?.item_attribute?.find(
            item => item?.type === 5 && formatString(item?.name) === key,
          )
        ? 'image'
        : '',
    }));
  }, [values?.item_data, rawItemListById?.item_attribute]);

  const renderPrePrintedItemList = useMemo(() => {
    if (values?.prePrintedTable_headerList) {
      let data = _.omit(values?.prePrintedTable_headerList, [
        'total_amount',
        // new_white_cylinder_amount: 0, // This colum is not showing on display but passed to API.
        'new_white_cylinder_total_amount',
        // new_coloured_cylinder_amount: 0, // This colum is not showing on display but passed to API.
        'new_coloured_cylinder_total_amount',
        // reengraved_cylinder_amount: 0, // This colum is not showing on display but passed to API.
        'reengraved_cylinder_total_amount',
      ]);

      return Object.keys(data).map(key => ({
        field: key,
        header:
          key === 'gsm'
            ? key.toUpperCase()
            : key.charAt(0).toUpperCase() + key.slice(1)?.replaceAll('_', ' '), // Capitalize the first letter
        body: rawItemListById?.item_attribute?.find(
          item => item?.type === 6 && formatString(item?.name) === key,
        )
          ? 'checkbox'
          : rawItemListById?.item_attribute?.find(
              item => item?.type === 5 && formatString(item?.name) === key,
            )
          ? 'image'
          : '',
      }));
    }
  }, [rawItemListById?.item_attribute, values?.prePrintedTable_headerList]);

  const handleDeleteItemTableView = (data, index) => {
    let itemViewListData = [...values?.item_data];
    let filteredData = itemViewListData?.filter((d, i) => d?.id !== data?.id);
    let totalOfAmount = totalCount(filteredData, 'amount');
    let TotalTax = totalCount(filteredData, 'tax_amount');
    let total =
      convertIntoNumber(totalOfAmount) -
      values?.discount +
      convertIntoNumber(TotalTax) +
      values?.additional_amount;

    const changeFieldObj = {
      sub_total: convertIntoNumber(totalOfAmount),
      tax: convertIntoNumber(TotalTax),
      total: convertIntoNumber(total),
      item_data: filteredData,
    };

    handleChangeFieldsdData(changeFieldObj);

    // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
    // setFieldValue('tax', convertIntoNumber(TotalTax));
    // setFieldValue('total', convertIntoNumber(total));
    // setItemData(filteredData);
  };

  const handleDeletePrePrintedItemTableView = (data, index) => {
    let itemViewListData = [...values?.prePrintedTable_viewList];
    let filteredData = itemViewListData?.filter((d, i) => data?.id !== d?.id);
    let updatedList = values?.job_for_POList?.map(d => {
      if (d?._id === data?._id) {
        return { ...d, required_qty: '', is_enabled: false };
      } else {
        return d;
      }
    });
    let filteredSelectedData = values?.selected_job_list?.filter(
      (d, i) => data?._id !== d?._id,
    );
    let totalOfAmount = totalCount(filteredData, 'amount');
    let TotalTax = totalCount(filteredData, 'tax_amount');
    let total =
      convertIntoNumber(totalOfAmount) -
      values?.discount +
      convertIntoNumber(TotalTax) +
      values?.additional_amount;

    const changeFieldObj = {
      sub_total: convertIntoNumber(totalOfAmount),
      tax: convertIntoNumber(TotalTax),
      total: convertIntoNumber(total),
      prePrintedTable_viewList: filteredData,
      selected_job_list: filteredSelectedData,
      job_for_POList: updatedList,
    };

    // setFieldValue('sub_total', convertIntoNumber(totalOfAmount));
    // setFieldValue('tax', convertIntoNumber(TotalTax));
    // setFieldValue('total', convertIntoNumber(total));
    // setPrePrintedTableViewList(filteredData);
    // setSelectedJobList(filteredSelectedData);
    // dispatch(setJobForPOList(updatedList));

    handleChangeFieldsdData(changeFieldObj);
  };

  const ItemListAction = (data, index) => {
    return (
      <>
        <div className="d-flex ">
          <span className="edit_icon">
            <Button
              className="btn_transperant"
              onClick={async () => {
                let updatedItemData = {};
                let Array = [];
                if (Object.keys(rawItemListById)?.length === 0) {
                  let res = await dispatch(
                    getRawItemListById(values?.item_group, values?.item),
                  );

                  if (Object.keys(res)?.length > 0) {
                    Array = res?.item_attribute;
                  }
                } else {
                  Array = rawItemListById?.item_attribute;
                }
                updatedItemData = Object.keys(data)?.reduce((acc, key) => {
                  let modifiedKey = key;
                  let value = data[key];
                  // let value = rest[key];
                  let newObj = Array?.find(
                    item =>
                      item?.type === 3 &&
                      item?.is_multiple_selection === true &&
                      formatString(item?.name) === key,
                  );
                  if (newObj) {
                    const stringArray = value?.split(',');
                    // Generate the desired output array

                    value = stringArray;
                  }

                  acc[modifiedKey] = value;
                  return acc;
                }, {});

                setNewAttributeModal(true);
                // setNewItemData(updatedItemData);
                commonUpdateFieldValue('new_item_data', updatedItemData);
              }}
            >
              <img src={EditIcon} alt="" />
            </Button>
          </span>
          <span className="remove_icon">
            <Button
              className="btn_transperant"
              onClick={() => {
                handleDeleteItemTableView(data, index?.rowIndex);
              }}
            >
              <img src={TrashIcon} alt="" />
            </Button>
          </span>
        </div>
      </>
    );
  };

  const prePrintedListAction = (data, index) => {
    return (
      <div className="d-flex ">
        <span className="edit_icon">
          <Button
            className="btn_transperant"
            onClick={async () => {
              let updatedItemData = {};
              let ArrayData = [];
              if (Object.keys(rawItemListById)?.length === 0) {
                let res = await dispatch(
                  getRawItemListById(values?.item_group, values?.item),
                );

                if (Object.keys(res)?.length > 0) {
                  ArrayData = res?.item_attribute;
                }
              } else {
                ArrayData = rawItemListById?.item_attribute;
              }
              updatedItemData = Object.keys(data)?.reduce((acc, key) => {
                let modifiedKey = key;
                let value = data[key];
                // let value = rest[key];
                let newObj = ArrayData?.find(item => {
                  return (
                    item?.type === 3 &&
                    item?.is_multiple_selection === true &&
                    formatString(item?.name) === key
                  );
                });
                if (newObj) {
                  const stringArray = Array?.isArray(value)
                    ? value
                    : value?.split(',');
                  // Generate the desired output array
                  value = stringArray;
                }

                acc[modifiedKey] = value;
                return acc;
              }, {});

              commonUpdateFieldValue('new_item_data', updatedItemData);
              // setNewItemData(updatedItemData);
              setNewAttributeModal(true);
            }}
          >
            <img src={EditIcon} alt="" />
          </Button>
        </span>
        <span className="remove_icon">
          <Button
            className="btn_transperant"
            onClick={() => {
              handleDeletePrePrintedItemTableView(data, index?.rowIndex);
            }}
          >
            <img src={TrashIcon} alt="" />
          </Button>
        </span>
      </div>
    );
  };

  const handleExportPartition = () => {
    if (values?.color_gsmList?.length > 0) {
      let data = partitionList(values);
      dispatch(exportPartitionPdf({ partition: data }));
    }
  };

  const handleFilterUpdate = () => {
    // setFilterToggle(!filterToggle);
    commonUpdateFieldValue('filter_toggle', !values?.filter_toggle);
  };

  const handleSearchInput = async e => {
    const res = await dispatch(getJobForPurchaseOrderList(e.target.value));
    commonUpdateFieldValue('job_for_POList', res);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (purchase_id) {
      if (locationPath[1] === 'update-purchase-order') {
        dispatch(
          setUpdateSelectedPurchaseOrderData({
            ...updateSelectedPurchaseOrderData,
            [fieldName]: fieldValue,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewSelectedPurchaseOrderData({
      //       ...viewSelectedPurchaseOrderData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedPurchaseOrderData({
          ...addSelectedPurchaseOrderData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (purchase_id) {
      if (locationPath[1] === 'update-purchase-order') {
        dispatch(
          setUpdateSelectedPurchaseOrderData({
            ...updateSelectedPurchaseOrderData,
            ...fieldObject,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewSelectedPurchaseOrderData({
      //       ...viewSelectedPurchaseOrderData,
      //       ...fieldObject,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddSelectedPurchaseOrderData({
          ...addSelectedPurchaseOrderData,
          ...fieldObject,
        }),
      );
    }

    // setFieldValue(fieldName, fieldValue);
    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const handleSavePDF = item => {
    const itemGroup = item?.item_group_name?.toLowerCase() === 'roll';
    const itemName =
      item?.item_name?.toLowerCase() === 'nonwoven laminated pre-printed';

    if (itemName && itemGroup) {
      dispatch(generatePrePrintedRollPDF(item?._id));
    } else {
      dispatch(generateCommonItemGroupPDF(item?._id));
    }
  };

  return (
    <div className="main_Wrapper">
      {(miscMasterLoading ||
        settingLoading ||
        rawItemLoading ||
        purchaseOrderLoading ||
        editPurchaseOrderLoading ||
        purchaseOrderListLoading) && <Loader />}
      <div className="add_purchase_order_wrap">
        <div className="border rounded-3 bg_white p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h3>Order Information</h3>
            {purchase_id && (
              <img
                src={PDFIcon}
                alt="PDFIcon"
                onClick={() => handleSavePDF(initialValues)}
                className="cursor-pointer"
              />
            )}
          </div>
          <Row>
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>
                  Supplier Name<span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  value={values?.supplier}
                  options={supplierList}
                  disabled={state?.isView}
                  onChange={e => {
                    // setFieldValue('supplier', e.value);
                    commonUpdateFieldValue('supplier', e.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Supplier Name"
                />
                {touched?.supplier && errors?.supplier && (
                  <p className="text-danger">{errors?.supplier}</p>
                )}
              </div>
            </Col>
            {values?.po_number && purchase_id ? (
              <Col xl lg={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="PONumber">P.O. Number.</label>
                  <InputText
                    id="PONumber"
                    placeholder="#00001"
                    name="po_number"
                    disabled={state?.isView}
                    value={values?.po_number || ''}
                  />
                </div>
              </Col>
            ) : null}
            <Col xl lg={4} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="PurchaseDate">Purchase Date</label>
                <Calendar
                  id="PurchaseDate"
                  placeholder="dd/mm/yyyy"
                  showIcon
                  showButtonBar
                  name="purchase_date"
                  dateFormat="dd-mm-yy"
                  value={values?.purchase_date || ''}
                  disabled={state?.isView}
                  // onChange={handleChange}
                  onChange={e => {
                    commonUpdateFieldValue('purchase_date', e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </Col>
            <Col xl lg={4} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="DueDate">Due Date</label>
                <Calendar
                  id="DueDate"
                  placeholder="dd/mm/yyyy"
                  showIcon
                  showButtonBar
                  minDate={new Date()}
                  name="due_date"
                  dateFormat="dd-mm-yy"
                  value={values?.due_date || ''}
                  disabled={state?.isView}
                  // onChange={handleChange}
                  onChange={e => {
                    commonUpdateFieldValue('due_date', e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </Col>
            <Col xl lg={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="SupplierQuote">Supplier Quote No.</label>
                <InputText
                  id="SupplierQuote"
                  placeholder="Enter Supplier Quote No."
                  name="supplier_quote_no"
                  disabled={state?.isView}
                  value={values?.supplier_quote_no || ''}
                  // onChange={handleChange}
                  onChange={e => {
                    commonUpdateFieldValue('supplier_quote_no', e.target.value);
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Row>
                <Col md={6}>
                  <h5 className="mb-2">
                    Bill To<span className="text-danger fs-4">*</span>
                  </h5>
                  <div className="form_group mb-3">
                    <label>{values?.company_name}</label>
                    <div className="address_select_wrap">
                      <ReactSelectSingle
                        name={'bill_to_address'}
                        options={filteredBillingList}
                        value={
                          values?.bill_to_address?.[0]?.value ||
                          values?.bill_to_address?.[0]?._id ||
                          ''
                        }
                        disabled={state?.isView}
                        onChange={e =>
                          onCustomChange('bill_to_address', e.value)
                        }
                        onBlur={handleBlur}
                        placeholder="Billing"
                      />
                      {values?.bill_to_address &&
                      values?.bill_to_address?.[0]?.address ? (
                        <div className="address_wrap">
                          {values?.bill_to_address?.[0]?.address},<br />
                          {values?.bill_to_address?.[0]?.city_name},
                          {values?.bill_to_address?.[0]?.state_name},
                          {values?.bill_to_address?.[0]?.pincode},
                          <br />
                          {values?.bill_to_address?.[0]?.country_name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {touched?.bill_to_address && errors?.bill_to_address && (
                    <p className="text-danger">{errors?.bill_to_address}</p>
                  )}
                </Col>
                <Col md={6}>
                  <h5 className="mb-2">
                    Ship To<span className="text-danger fs-4">*</span>
                  </h5>
                  <div className="form_group mb-3">
                    <label>{values?.company_name}</label>
                    <div className="address_select_wrap">
                      <ReactSelectSingle
                        name={'ship_to_address'}
                        disabled={state?.isView}
                        value={
                          values?.ship_to_address?.[0]?.value ||
                          values?.ship_to_address?.[0]?._id ||
                          ''
                        }
                        onChange={e =>
                          onCustomChange('ship_to_address', e.value)
                        }
                        options={filteredShippingList}
                        placeholder="Shipping"
                      />
                      {values?.ship_to_address &&
                      values?.ship_to_address?.[0]?.address ? (
                        <div className="address_wrap">
                          {values?.ship_to_address?.[0]?.address},<br />
                          {values?.ship_to_address?.[0]?.city_name},
                          {values?.ship_to_address?.[0]?.state_name},
                          {values?.ship_to_address?.[0]?.pincode},
                          <br />
                          {values?.ship_to_address?.[0]?.country_name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {touched?.ship_to_address && errors?.ship_to_address && (
                    <p className="text-danger">{errors?.ship_to_address}</p>
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Row>
                <Col xl={6} lg={6} sm={6}>
                  <h5 className="mb-2 d-xl-block d-none">&nbsp;</h5>
                  <div className="form_group mb-3">
                    <label>
                      Item Group<span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      disabled={purchase_id || state?.isView}
                      value={values?.item_group}
                      options={activeItemGroupList[0]?.items}
                      onChange={async e => {
                        const rawItemOptionList = await dispatch(
                          getActiveRawItemListByGroup(e.value),
                        );

                        const changeFieldObj = {
                          rawItem_optionList: rawItemOptionList,
                          item_group: e.value,
                          item_data: [],
                          color_gsmList: [],
                          new_item_data: {},
                          gsmTable_viewList: [],
                          sub_total: 0,
                          tax: 0,
                          additional_amount: 0,
                          discount: 0,
                          total: 0,
                        };

                        handleChangeFieldsdData(changeFieldObj);

                        // setItemData([]);
                        // setColorGsmList([]);
                        // setNewItemData({});
                        // setGsmTableViewList([]);
                        // setFieldValue('item_group', e.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Select Item Group"
                    />
                    {touched?.item_group && errors?.item_group && (
                      <p className="text-danger">{errors?.item_group}</p>
                    )}
                  </div>
                </Col>
                <Col xl={6} lg={6} sm={6}>
                  <h5 className="mb-2 d-xl-block d-none">&nbsp;</h5>
                  <div className="form_group mb-3">
                    <label>
                      Item Name<span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      disabled={purchase_id || state?.isView}
                      value={values?.item}
                      // options={activeRawItemListByGroup}
                      options={values?.rawItem_optionList}
                      onChange={async e => {
                        let changeFieldObj = {
                          item: e.value,
                          item_data: [],
                          color_gsmList: [],
                          new_item_data: {},
                          gsmTable_viewList: [],
                          prePrintedTable_viewList: [],
                          sub_total: 0,
                          tax: 0,
                          additional_amount: 0,
                          discount: 0,
                          total: 0,
                        };

                        // setFieldValue('item', e.value);
                        // setItemData([]);
                        // setColorGsmList([]);
                        // setNewItemData({});
                        // setGsmTableViewList([]);
                        // setPrePrintedTableViewList([]);

                        const findedData = values?.rawItem_optionList?.find(
                          i => i?._id?.toLowerCase() === e.value,
                        );

                        // For set Table Header of Pre-Printed Table (From-Job).
                        if (findedData) {
                          // setSelectedItem(findedData);
                          changeFieldObj = {
                            ...changeFieldObj,
                            selected_item: findedData,
                          };
                        }

                        if (
                          findedData?.name?.toLowerCase() ===
                          'nonwoven laminated pre-printed'
                        ) {
                          const res = await dispatch(
                            getRawItemListById(values?.item_group, e.value),
                          );
                          if (Object.keys(res)?.length > 0) {
                            const resultObject = res?.item_attribute.reduce(
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
                              tax: 0,
                              total_amount: 0,
                              new_white_cylinder_amount: 0,
                              new_white_cylinder_total_amount: 0,
                              new_coloured_cylinder_amount: 0,
                              new_coloured_cylinder_total_amount: 0,
                              reengraved_cylinder_amount: 0,
                              reengraved_cylinder_total_amount: 0,
                            };

                            changeFieldObj = {
                              ...changeFieldObj,
                              prePrintedTable_headerList: finalObj,
                            };
                            // setPrePrintedTableHeader(finalObj);
                          }
                        }
                        handleChangeFieldsdData(changeFieldObj);
                      }}
                      onBlur={handleBlur}
                      placeholder="Select Item Name"
                    />
                    {touched?.item && errors?.item && (
                      <p className="text-danger">{errors?.item}</p>
                    )}
                  </div>
                </Col>
                <Col xl={6} lg={6} sm={6}>
                  <div className="form_group mb-3">
                    <label>
                      Warehouse<span className="text-danger fs-4">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      value={values?.warehouse}
                      namme="warehouse"
                      disabled={state?.isView}
                      options={activeWarehouseList}
                      onChange={e => {
                        // setFieldValue('warehouse', e.value);
                        commonUpdateFieldValue('warehouse', e.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Select Warehouse Name"
                    />
                    {touched?.warehouse && errors?.warehouse && (
                      <p className="text-danger">{errors?.warehouse}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col lg={2}>
                <div className="page_title">
                  <h3 className="m-0">
                    {purchase_id ? 'Update ' : 'New'} Purchase Order
                  </h3>
                </div>
              </Col>
              <Col lg={10}>
                <div className="right_filter_wrapper">
                  <ul>
                    {!state?.isView && (
                      <>
                        {values?.selected_item?.name?.toLowerCase() ===
                          'nonwoven laminated pre-printed' &&
                          locationPath[1] === 'add-purchase-order' && (
                            <li>
                              <Button
                                className="btn_primary"
                                onClick={async e => {
                                  setFromJobModal(true);
                                  // if (values?.job_for_POList?.length === 0) {
                                  // const res = await dispatch(
                                  //   getJobForPurchaseOrderList(),
                                  // );
                                  // commonUpdateFieldValue('job_for_POList', res);
                                  // }
                                }}
                              >
                                <img src={PlusIcon} alt="" />
                                From Job
                              </Button>
                            </li>
                          )}
                        {values?.selected_item?.name?.toLowerCase() ===
                          'nonwoven laminated pre-printed' &&
                        locationPath[1] === 'update-purchase-order' ? (
                          ' '
                        ) : (
                          <li>
                            <Button
                              className="btn_primary"
                              onClick={async e => {
                                if (values?.item && values?.item_group) {
                                  let res = await dispatch(
                                    getRawItemListById(
                                      values?.item_group,
                                      values?.item,
                                    ),
                                  );
                                  if (Object.keys(res)?.length > 0) {
                                    // setNewItemData(); // Already commented in old flow
                                    setNewAttributeModal(true);
                                  }
                                } else {
                                  toast.error(
                                    'Please select Item Group and Item Name',
                                  );
                                }
                              }}
                              disabled={state?.isView}
                            >
                              <img src={PlusIcon} alt="" />
                              {purchase_id ? 'Update' : 'Add'} Item
                            </Button>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

          <div className="data_table_wrapper cell_padding_large vertical_top break_header without_all_select ">
            {values?.gsmTable_viewList?.length > 0 && (
              <DataTable
                value={values?.gsmTable_viewList}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                dataKey="id"
                onSelectionChange={e => {
                  handleMarkAsReceivedCheckboxTemplate(
                    e.value,
                    values?.gsmTable_viewList,
                    'nonWoven_nonLaminated',
                  );
                }}
                selection={values?.selected_itemList}
                // tabIndex={}
              >
                {state?.isView && (
                  <Column
                    header="Mark as received"
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                )}
                {renderNonWovenNonLaminatedList.map((col, i) => (
                  <Column
                    // cellIndex={i}
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={
                      col.body === 'checkbox'
                        ? checkboxBodyTemplate
                        : col.body === 'image'
                        ? imageBodyTemplate
                        : ['rate', 'amount', 'tax', 'total_amount']?.includes(
                            col?.field,
                          )
                        ? amountsTemplete
                        : ''
                    }
                  />
                ))}
              </DataTable>
            )}
            {values?.item_data?.length > 0 && (
              <DataTable
                value={values?.item_data}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                dataKey="id"
                // selectionMode="checkbox"
                onSelectionChange={e => {
                  handleMarkAsReceivedCheckboxTemplate(
                    e.value,
                    values?.item_data,
                    'item',
                  );
                }}
                selection={values?.selected_itemList}
              >
                {state?.isView && (
                  <Column
                    header="Mark as received"
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                )}
                {renderItemList.map(col => (
                  <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={
                      col.body === 'checkbox'
                        ? checkboxBodyTemplate
                        : col.body === 'image'
                        ? imageBodyTemplate
                        : ['rate', 'amount', 'tax', 'total_amount']?.includes(
                            col?.field,
                          )
                        ? amountsTemplete
                        : ''
                    }
                  />
                ))}
                <Column
                  field="action"
                  header="Action"
                  body={ItemListAction}
                  hidden={purchase_id && state?.isView}
                ></Column>
              </DataTable>
            )}

            {values?.prePrintedTable_viewList?.length > 0 && (
              <DataTable
                value={values?.prePrintedTable_viewList}
                sortMode="single"
                sortField="name"
                sortOrder={1}
                rows={10}
                dataKey="id"
                onSelectionChange={e => {
                  handleMarkAsReceivedCheckboxTemplate(
                    e.value,
                    values?.prePrintedTable_viewList,
                    'nonWoven_prePrinted',
                  );
                }}
                selection={values?.selected_itemList}
              >
                {state?.isView && (
                  <Column
                    header="Mark as received"
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                )}
                {renderPrePrintedItemList.map(col => (
                  <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={
                      col.body === 'checkbox'
                        ? checkboxBodyTemplate
                        : col.body === 'image'
                        ? imageBodyTemplate
                        : col.field === 'note'
                        ? prePrintedNoteTemplate
                        : [
                            'rate',
                            'amount',
                            'new_white_cylinder_amount',
                            'new_coloured_cylinder_amount',
                            'reengraved_cylinder_amount',
                          ]?.includes(col?.field)
                        ? amountsTemplete
                        : ''
                    }
                  />
                ))}
                <Column
                  field="action"
                  header="Action"
                  body={prePrintedListAction}
                  hidden={purchase_id && state?.isView}
                ></Column>
              </DataTable>
            )}
          </div>
        </div>
        <div className="add_purchase_bottom_wrap mt-3">
          <Row>
            <Col xl={8} md={6}>
              <Row>
                <Col xxl={4} xl={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Comment">Comment</label>
                    <InputTextarea
                      id="Comment"
                      placeholder="Write Comment"
                      name="comment"
                      value={values?.comment || ''}
                      disabled={state?.isView}
                      // onChange={handleChange}
                      onChange={e => {
                        commonUpdateFieldValue('comment', e.target.value);
                      }}
                      onBlur={handleBlur}
                      rows={3}
                    />
                  </div>
                </Col>
                <Col xxl={4} xl={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="Terms">Terms & Conditions</label>
                    <InputTextarea
                      id="Terms"
                      placeholder="Terms & Conditions"
                      name="term_condition"
                      value={values?.term_condition || ''}
                      disabled={state?.isView}
                      // onChange={handleChange}
                      onChange={e => {
                        commonUpdateFieldValue(
                          'term_condition',
                          e.target.value,
                        );
                      }}
                      onBlur={handleBlur}
                      rows={3}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xxl={4} xl={6}>
                  <DropZone
                    module="purchase"
                    disabled={state?.isView}
                    name="purchase_file"
                    value={values?.purchase_file || ''}
                    setFieldValue={setFieldValue}
                    fieldName={'purchase_file'}
                    initialAddImgValue={addSelectedPurchaseOrderData}
                    initialUpdateImgValue={updateSelectedPurchaseOrderData}
                    setAddInitialImgValue={setAddSelectedPurchaseOrderData}
                    setUpdateInitialImgValue={
                      setUpdateSelectedPurchaseOrderData
                    }
                    fieldImgName={'purchase_file_name'}
                    fieldImgValue={values?.purchase_file_name}
                  />
                </Col>
              </Row>
            </Col>
            <Col xl={4} md={6}>
              <div className="border rounded-3 bg_white p-3 mb-3">
                <ul>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col sm={4}>
                        <label
                          htmlFor="Additional Charge"
                          className="mb-md-0 mb-1"
                        >
                          Additional Charge
                        </label>
                      </Col>
                      <Col sm={8}>
                        <div className="form_group">
                          <InputNumber
                            id="Additional Charge"
                            placeholder="Additional Charge"
                            disabled={state?.isView}
                            min={0}
                            useGrouping={false}
                            maxFractionDigits={2}
                            value={values?.additional_amount}
                            onChange={e => {
                              const table_data =
                                values?.selected_item?.name?.toLowerCase() ===
                                'nonwoven laminated pre-printed'
                                  ? values?.prePrintedTable_viewList
                                  : values?.selected_item?.name?.toLowerCase() ===
                                    'nonwoven non laminated'
                                  ? values?.gsmTable_viewList
                                  : values?.item_data;

                              let totalOfAmount = totalCount(
                                table_data,
                                'amount',
                              );

                              let sub_total_amount =
                                convertIntoNumber(totalOfAmount) -
                                convertIntoNumber(values?.discount) +
                                convertIntoNumber(e.value);

                              if (
                                values?.selected_item?.name?.toLowerCase() ===
                                'nonwoven laminated pre-printed'
                              ) {
                                let totalWhiteCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'new_white_cylinder_amount',
                                );
                                let totalColouredCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'new_coloured_cylinder_amount',
                                );
                                let totalReengravedCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'reengraved_cylinder_amount',
                                );

                                sub_total_amount +=
                                  convertIntoNumber(totalWhiteCylinder) +
                                  convertIntoNumber(totalColouredCylinder) +
                                  convertIntoNumber(totalReengravedCylinder);
                              }

                              const calculate_tax =
                                (sub_total_amount * rawItemListById?.GST_rate) /
                                100;

                              // const subTotal = sub_total_amount
                              // const total =
                              //   values?.sub_total -
                              //   values?.discount +
                              //   values?.tax +
                              //   e.value;

                              const total = sub_total_amount + calculate_tax;

                              const changeFieldObj = {
                                additional_amount: e.value,
                                sub_total: sub_total_amount,
                                tax: calculate_tax,
                                total: total,
                              };
                              handleChangeFieldsdData(changeFieldObj);

                              // setFieldValue('additional_amount', e.value);
                              // setFieldValue('total', total);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col sm={4}>
                        <label htmlFor="Discount" className="mb-md-0 mb-1">
                          Discount ( - )
                        </label>
                      </Col>
                      <Col sm={8}>
                        <div className="form_group">
                          <InputNumber
                            id="Discount"
                            placeholder="Discount"
                            disabled={state?.isView}
                            min={0}
                            useGrouping={false}
                            maxFractionDigits={2}
                            value={values?.discount}
                            onChange={e => {
                              const table_data =
                                values?.selected_item?.name?.toLowerCase() ===
                                'nonwoven laminated pre-printed'
                                  ? values?.prePrintedTable_viewList
                                  : values?.selected_item?.name?.toLowerCase() ===
                                    'nonwoven non laminated'
                                  ? values?.gsmTable_viewList
                                  : values?.item_data;

                              const totalOfAmount = totalCount(
                                table_data,
                                'amount',
                              );

                              let sub_total_amount =
                                convertIntoNumber(totalOfAmount) -
                                convertIntoNumber(e.value) +
                                convertIntoNumber(values?.additional_amount);

                              if (
                                values?.selected_item?.name?.toLowerCase() ===
                                'nonwoven laminated pre-printed'
                              ) {
                                let totalWhiteCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'new_white_cylinder_amount',
                                );
                                let totalColouredCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'new_coloured_cylinder_amount',
                                );
                                let totalReengravedCylinder = totalCount(
                                  values?.prePrintedTable_viewList,
                                  'reengraved_cylinder_amount',
                                );

                                sub_total_amount +=
                                  convertIntoNumber(totalWhiteCylinder) +
                                  convertIntoNumber(totalColouredCylinder) +
                                  convertIntoNumber(totalReengravedCylinder);
                              }

                              const calculate_tax =
                                (sub_total_amount * rawItemListById?.GST_rate) /
                                100;

                              const total = sub_total_amount + calculate_tax;

                              // const total =
                              //   values?.sub_total -
                              //   e.value +
                              //   values?.tax +
                              //   values?.additional_amount;

                              const changeFieldObj = {
                                discount: e.value,
                                sub_total: sub_total_amount,
                                tax: calculate_tax,
                                total: total,
                              };
                              handleChangeFieldsdData(changeFieldObj);

                              // setFieldValue('discount', e.value);
                              // setFieldValue('total', total);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col sm={4}>
                        <label htmlFor="" className="mb-md-0 mb-1">
                          Sub Total
                        </label>
                      </Col>
                      <Col sm={8}>
                        <span>
                          {/* {roundValueThousandSeparator(
                            values?.sub_total || 0,
                            'decimal',
                          )} */}
                          ₹{roundValueThousandSeparator(values?.sub_total || 0)}
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col sm={4}>
                        <label htmlFor="Tax" className="mb-md-0 mb-1">
                          Tax
                        </label>
                      </Col>
                      <Col sm={8}>
                        <span>
                          {/* {roundValueThousandSeparator(
                            values?.tax || 0,
                            'decimal',
                          )} */}
                          ₹{roundValueThousandSeparator(values?.tax || 0)}
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <hr />
                  <li>
                    <Row className="align-items-center mb-3">
                      <Col sm={4}>
                        <label htmlFor="Total" className="mb-md-0 mb-1">
                          Total
                        </label>
                      </Col>
                      <Col sm={8}>
                        <span>
                          {/* {roundValueThousandSeparator(
                            values?.total || 0,
                            'decimal',
                          )} */}
                          ₹{roundValueThousandSeparator(values?.total || 0)}
                        </span>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="button_group d-flex justify-content-end">
            <Button
              className="btn_border"
              onClick={() => {
                dispatch(
                  setIsGetInitialValuesPurchaseOrder({
                    ...isGetInitialValuesPurchaseOrder,
                    ...(purchase_id
                      ? state?.isView ||
                        locationPath[1] === 'purchase-order-details'
                        ? { view: false }
                        : { update: false }
                      : { add: false }),
                  }),
                );

                navigate('/purchase-order');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn_primary ms-3"
              onClick={handleSubmit}
            >
              {purchase_id ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        header={`${values?.selected_item?.name}`}
        visible={newAttributeModal}
        draggable={false}
        className="modal_Wrapper model_extra_large"
        onHide={() => {
          if (
            values?.color_gsmList?.length > values?.dummyColor_gsmList?.length
          ) {
            // setColorGsmList(dummyColorGsmList);
            commonUpdateFieldValue('color_gsmList', values?.dummyColor_gsmList);
          }
          const result =
            values?.new_item_data &&
            values?.dummy_newItem_data &&
            areObjectsEqual(values?.new_item_data, values?.dummy_newItem_data);

          if (!result) {
            // setNewItemData(dummyNewItemData);
            commonUpdateFieldValue('new_item_data', values?.dummy_newItem_data);
          }

          setNewAttributeModal(false);
        }}
      >
        {values?.selected_item?.name?.toLowerCase() ===
          'nonwoven non laminated' && (
          <div className="modal_export_button">
            <Button
              className="btn_transperant"
              onClick={() => {
                handleExportPartition();
              }}
            >
              <img src={PdfIcon} alt="PDFIcon"></img>
            </Button>
          </div>
        )}
        <div className="add_product_content_wrap">
          <Row>
            {rawItemListById?.item_attribute?.length &&
              rawItemListById?.item_attribute?.map(data => {
                return (
                  <>
                    {data?.type === 1 ? (
                      <div className="form_group col-md-3 mb-3">
                        <label htmlFor="DesignName">
                          {data?.name}
                          {data?.is_mandatory && (
                            <span className="text-danger fs-4">*</span>
                          )}
                        </label>
                        <InputText
                          id="DesignName"
                          name={formatString(data?.name)}
                          value={
                            values?.new_item_data
                              ? values?.new_item_data[formatString(data?.name)]
                              : ''
                          }
                          onChange={e => handleItemChange(e, e.target.value)}
                        />
                        {values?.is_validate &&
                          data?.is_mandatory === true &&
                          !values?.new_item_data[formatString(data?.name)] &&
                          errorRender(data?.name)}
                      </div>
                    ) : data?.type === 2 ? (
                      <div className="form_group col-md-3 mb-3">
                        <label htmlFor="DesignName">
                          {data?.name}{' '}
                          {data?.is_mandatory && (
                            <span className="text-danger fs-4">*</span>
                          )}
                        </label>
                        <InputText
                          id="DesignName"
                          type="number"
                          name={formatString(data?.name)}
                          value={
                            values?.new_item_data
                              ? values?.new_item_data[formatString(data?.name)]
                              : ''
                          }
                          onChange={e =>
                            handleItemChange(
                              e,
                              e.target.value ? Number(e.target.value) : '',
                            )
                          }
                        />
                        {values?.is_validate &&
                          data?.is_mandatory === true &&
                          !values?.new_item_data[formatString(data?.name)] &&
                          errorRender(data?.name)}
                      </div>
                    ) : data?.type === 3 ? (
                      <div className="form_group col-md-3 mb-3">
                        <label>
                          {data?.name}{' '}
                          {data?.is_mandatory && (
                            <span className="text-danger fs-4">*</span>
                          )}
                        </label>
                        {data?.is_multiple_selection === true ? (
                          <MultiSelect
                            filter
                            name={formatString(data?.name)}
                            options={formatOption(data?.attribute_value)}
                            placeholder={data?.name}
                            className="w-100"
                            showSelectAll={false}
                            onChange={e => {
                              handleItemChange(e, e.value);
                              if (
                                formatString(data?.name) === 'color' ||
                                formatString(data?.name) === 'fabric_color'
                              ) {
                                const color = e.value[e.value.length - 1];
                                let findObj = data?.attribute_value?.find(
                                  i => i.value === color,
                                );
                                const code = findObj?.icon;
                                if (values?.color_gsmList?.length > 0) {
                                  let data = values?.color_gsmList?.filter(
                                    d => !e.value?.includes(d?.colorName),
                                  );
                                  if (data?.length === 0) {
                                    let newArray = {};
                                    newArray.colorName = color;
                                    newArray.code = code;
                                    newArray.gsmList = [gsmPartitionList];

                                    const updatedColorGSMList = [
                                      ...values?.color_gsmList,
                                      newArray,
                                    ];
                                    commonUpdateFieldValue(
                                      'color_gsmList',
                                      updatedColorGSMList,
                                    );
                                    // setColorGsmList(prev => [...prev, newArray]);
                                  } else {
                                    let updatedList =
                                      values?.color_gsmList?.filter(
                                        i =>
                                          i?.colorName !== data[0]?.colorName,
                                      );

                                    commonUpdateFieldValue(
                                      'color_gsmList',
                                      updatedList,
                                    );
                                    // setColorGsmList(updatedList);
                                  }
                                } else {
                                  let newArray = {};
                                  newArray.colorName = color;
                                  newArray.code = code;
                                  newArray.gsmList = [gsmPartitionList];

                                  const updatedColorGSMList = [
                                    ...values?.color_gsmList,
                                    newArray,
                                  ];
                                  commonUpdateFieldValue(
                                    'color_gsmList',
                                    updatedColorGSMList,
                                  );
                                  // setColorGsmList(prev => [...prev, newArray]);
                                }
                              }
                            }}
                            value={
                              values?.new_item_data
                                ? values?.new_item_data[
                                    formatString(data?.name)
                                  ]
                                : ''
                            }
                          />
                        ) : (
                          <ReactSelectSingle
                            filter
                            name={formatString(data?.name)}
                            options={formatOption(data?.attribute_value)}
                            onChange={e => handleItemChange(e, e.value)}
                            value={
                              values?.new_item_data
                                ? values?.new_item_data[
                                    formatString(data?.name)
                                  ]
                                : ''
                            }
                          />
                        )}
                        {values?.is_validate &&
                          data?.is_mandatory === true &&
                          !values?.new_item_data[formatString(data?.name)]
                            ?.length &&
                          errorRender(data?.name)}
                      </div>
                    ) : data?.type === 4 ? (
                      <div className="col-md-2 gap-3 custom_radio_wrappper mb-3">
                        <label className="mb-2 d-block">
                          {data?.name}{' '}
                          {data?.is_mandatory && (
                            <span className="text-danger fs-4">*</span>
                          )}
                        </label>
                        <div className="d-flex">
                          {data?.attribute_value?.map(item => {
                            return (
                              <div className="d-flex align-items-center me-3">
                                <RadioButton
                                  inputId="SlittingYes"
                                  name={formatString(data?.name)}
                                  onChange={e => handleItemChange(e, e.value)}
                                  value={item?.value}
                                  checked={
                                    values?.new_item_data
                                      ? values?.new_item_data[
                                          formatString(data?.name)
                                        ] === item?.value
                                      : ''
                                  }
                                />
                                <label htmlFor="Laminated" className="ms-2">
                                  {item?.value}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                        {values?.is_validate &&
                          data?.is_mandatory === true &&
                          !values?.new_item_data[formatString(data?.name)] &&
                          errorRender(data?.name)}
                        <div className="d-flex align-items-center ms-2"></div>
                      </div>
                    ) : data?.type === 5 ? (
                      <Col md={2}>
                        <div className="form_group small_dropzone_wrapper">
                          <label>
                            {data?.name}{' '}
                            {data?.is_mandatory && (
                              <span className="text-danger fs-4">*</span>
                            )}
                          </label>
                          <DropZone
                            module="addPurchaseItem"
                            value={
                              values?.new_item_data
                                ? values?.new_item_data[
                                    formatString(data?.name)
                                  ]
                                : ''
                            }
                            // setFieldValue={setNewItemData}
                            setFieldValue={setFieldValue}
                            initialAddImgValue={addSelectedPurchaseOrderData}
                            initialUpdateImgValue={
                              updateSelectedPurchaseOrderData
                            }
                            setAddInitialImgValue={
                              setAddSelectedPurchaseOrderData
                            }
                            setUpdateInitialImgValue={
                              setUpdateSelectedPurchaseOrderData
                            }
                            fieldName={formatString(data?.name)}
                            fieldImgName={`${formatString(data?.name)}_name`}
                            fieldImgValue={
                              values?.new_item_data
                                ? values?.new_item_data[
                                    `${formatString(data?.name)}_name`
                                  ]
                                : ''
                            }
                          />

                          {values?.is_validate &&
                            data?.is_mandatory === true &&
                            !values?.new_item_data[formatString(data?.name)] &&
                            errorRender(data?.name)}
                        </div>
                      </Col>
                    ) : data?.type === 6 ? (
                      <div className="form_group mb-3 col-md-3">
                        <Checkbox
                          onChange={e => {
                            handleItemChange(e, e.checked);
                          }}
                          name={formatString(data?.name)}
                          value={
                            values?.new_item_data
                              ? values?.new_item_data[formatString(data?.name)]
                              : ''
                          }
                          checked={
                            values?.new_item_data
                              ? values?.new_item_data[formatString(data?.name)]
                              : false
                          }
                          disabled={state?.isView}
                        ></Checkbox>
                        <label className="ms-2 mb-1">
                          {data?.name}{' '}
                          {data?.is_mandatory && (
                            <span className="text-danger fs-4 ">*</span>
                          )}
                        </label>

                        {values?.is_validate &&
                          data?.is_mandatory === true &&
                          !values?.new_item_data[formatString(data?.name)] &&
                          errorRender(data?.name)}
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                );
              })}
          </Row>

          {values?.selected_item?.name?.toLowerCase() ===
            'nonwoven non laminated' && (
            <div className="fabric_order_main_wrapper">
              {values?.item === values?.selected_item?._id &&
              (values?.new_item_data['color']?.length > 0 ||
                values?.new_item_data['fabric_color']?.length > 0) &&
              values?.color_gsmList?.length > 0 ? (
                values?.color_gsmList?.map(item => {
                  return (
                    <>
                      <div className="fabric_order_total_wrapper">
                        <div className="form_group">
                          <div className="table-responsive">
                            <table className="w-100">
                              {item?.gsmList?.length > 0 && (
                                <thead>
                                  <tr>
                                    <th colSpan={17}>{item?.colorName}</th>
                                    <th>Total</th>
                                    <th>Length</th>
                                    <th>
                                      Shafts
                                      <span className="text-danger fs-4">
                                        *
                                      </span>
                                    </th>
                                    <th>
                                      Rate
                                      <span className="text-danger fs-4">
                                        *
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                              )}
                              {item?.gsmList?.map((data, index) => {
                                return (
                                  <tbody>
                                    <tr>
                                      <td>
                                        <ReactSelectSingle
                                          filter
                                          value={data?.gsm}
                                          options={activeGsmList}
                                          onChange={e => {
                                            handleGsmChange(
                                              item?.colorName,
                                              'gsm',
                                              e.value,
                                              index,
                                            );
                                          }}
                                          placeholder="GSM"
                                        />
                                      </td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p1}
                                            onChange={e => {
                                              handleGsmChange(
                                                item?.colorName,
                                                'p1',
                                                e.value,
                                                index,
                                              );
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p2}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p2',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p3}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p3',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            useGrouping={false}
                                            maxFractionDigits={2}
                                            value={data?.p4}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p4',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p5}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p5',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p6}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p6',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p7}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p7',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>+</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            useGrouping={false}
                                            value={data?.p8}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'p8',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>=</td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            disabled
                                            useGrouping={false}
                                            value={data?.total}
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            // disabled
                                            useGrouping={false}
                                            value={data?.length}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'length',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            value={data?.shaft}
                                            useGrouping={false}
                                            min={0}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'shaft',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="form_group">
                                          <InputNumber
                                            id="00"
                                            placeholder="00"
                                            min={0}
                                            maxFractionDigits={2}
                                            value={data?.rate}
                                            onChange={e =>
                                              handleGsmChange(
                                                item?.colorName,
                                                'rate',
                                                e.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="remove_icon">
                                          <Button
                                            className="btn_transperant"
                                            onClick={() =>
                                              handleDeleteGsm(
                                                item?.colorName,
                                                index,
                                              )
                                            }
                                          >
                                            <img src={TrashIcon} alt="" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                );
                              })}
                            </table>
                          </div>
                        </div>
                      </div>
                      {item?.gsmList?.length > 0 && (
                        <div className="add_gsm">
                          <Button
                            className="btn_transperant"
                            onClick={e => {
                              handleAddgsm(item?.colorName);
                            }}
                          >
                            + Add GSM
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })
              ) : (
                <p className="no_data">No Data Available</p>
              )}
            </div>
          )}

          <div className="mt-3 d-flex justify-content-end">
            <Button
              className="btn_border me-2"
              onClick={() => {
                setNewAttributeModal(false);
                // if (colorGsmList?.length >= dummyColorGsmList?.length) {
                //   setColorGsmList(dummyColorGsmList);
                // }
                if (values?.color_gsmList?.length > 0) {
                  if (
                    !areArraysOfObjectsEqual(
                      values?.color_gsmList,
                      values?.dummyColor_gsmList,
                    )
                  ) {
                    commonUpdateFieldValue(
                      'color_gsmList',
                      values?.dummyColor_gsmList,
                    );
                    // setColorGsmList(dummyColorGsmList);
                  }
                }

                const result =
                  values?.new_item_data &&
                  values?.dummy_newItem_data &&
                  areObjectsEqual(
                    values?.new_item_data,
                    values?.dummy_newItem_data,
                  );

                if (!result) {
                  commonUpdateFieldValue(
                    'new_item_data',
                    values?.dummy_newItem_data,
                  );
                  // setNewItemData(dummyNewItemData);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary"
              onClick={() => {
                handleAddUpdate();
              }}
            >
              {purchase_id ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Dialog>
      {/* Listing Of From Job Table */}
      <Dialog
        header={`${values?.selected_item?.name}`}
        visible={fromJobModal}
        draggable={false}
        className="modal_Wrapper modal_large"
        onHide={() => {
          setFromJobModal(false);
        }}
      >
        <div className="add_product_content_wrap">
          <div className="table_main_Wrapper bg-white">
            <div className="top_filter_wrap">
              <Row className="align-items-center">
                <Col md={3}>
                  <div className="page_title">
                    <h3 className="m-0">Select Job</h3>
                  </div>
                </Col>
                <Col md={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li className="search_input_wrap">
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            disabled={state?.isView}
                            className="input_wrap small search_wrap"
                            value={values?.search_product}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              // setSearchProduct(e.target.value);
                              commonUpdateFieldValue(
                                'search_product',
                                e.target.value,
                              );
                            }}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper is_filter without_all_select data_table_collapsable">
              <button
                type="button"
                className="table_filter_btn"
                onClick={() => {
                  handleFilterUpdate();
                }}
              >
                <img src={SearchIcon} alt="" />
              </button>
              <DataTable
                value={values?.job_for_POList}
                filterDisplay="row"
                sortMode="single"
                selectionMode="checkbox"
                onSelectionChange={e => {
                  handleCheckboxTemplate(e.value);
                }}
                selection={values?.selected_job_list}
                sortField="name"
                sortOrder={1}
                dataKey="_id"
                emptyMessage={
                  purchaseOrderListLoading ? <Skeleton count={10} /> : false
                }
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                ></Column>
                <Column
                  field="job_no"
                  header="Job No"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="job_date"
                  header="Job Date"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="design_image"
                  header="Image"
                  sortable
                  body={imageJobBodyTemplate}
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="design_name"
                  header="Design Name"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="lamination"
                  header="Laminations Type"
                  sortable
                  body={laminationJobBodyTemplate}
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="size_str"
                  header="Size"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="gsm"
                  header="GSM"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="qty"
                  header="Qty(pcs)"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="suggested_weight_qty"
                  header="Suggested Qty(KG)"
                  sortable
                  filter={values?.filter_toggle}
                ></Column>
                <Column
                  field="qty"
                  header="Required Qty(KG)"
                  sortable
                  filter={values?.filter_toggle}
                  body={qtyBodyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div className="button_group d-flex justify-content-end mt-3">
            <Button
              className="btn_border"
              onClick={() => {
                setFromJobModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => {
                const updatedJobForPOList = values?.job_for_POList?.filter(
                  item => {
                    return values?.selected_job_list.some(
                      data => item.is_enabled && item._id === data._id,
                    );
                  },
                );

                let checkRequireQty = updatedJobForPOList?.filter(d => {
                  return !d?.required_qty;
                });

                let checkRL_RW_RC = updatedJobForPOList?.filter(d => {
                  return !d?.circum || !d?.roll_width || !d?.repeat_length;
                });

                if (checkRequireQty?.length > 0 || checkRL_RW_RC?.length > 0) {
                  if (checkRequireQty?.length > 0) {
                    toast.error('Required Qty value not found');
                  } else if (checkRL_RW_RC?.length > 0) {
                    toast.error(
                      'RL, RW, Cylinder MM value is not found in product',
                    );
                  }
                } else {
                  let updatedList = updatedJobForPOList?.map(item => {
                    const newItem = { ...item };

                    let matchData = values?.prePrintedTable_viewList?.find(
                      d => d?._id === item._id,
                    );

                    if (matchData) {
                      const amount_calculation =
                        matchData?.rate_in?.toLowerCase() === 'kg'
                          ? matchData?.qty *
                            matchData?.rate *
                            newItem['required_qty']
                          : matchData?.qty * matchData?.rate;

                      let amount = amount_calculation;
                      let taxAmount =
                        (amount * rawItemListById?.GST_rate) / 100;
                      let totalAmount = taxAmount + amount;

                      matchData = {
                        ...matchData,
                        amount,
                        tax_amount: infinityOrNanToZero(Math.round(taxAmount)),
                        total_amount: infinityOrNanToZero(
                          Math.round(totalAmount),
                        ),
                      };
                    } else {
                      const matchingRadioKey =
                        rawItemListById?.item_attribute?.filter(
                          obj2 => obj2?.type === 4,
                        );

                      const matchingMultiSelectKey =
                        rawItemListById?.item_attribute?.filter(
                          obj2 =>
                            obj2?.type === 3 &&
                            obj2?.is_multiple_selection === true,
                        );

                      const matchingCheckboxKey =
                        rawItemListById?.item_attribute?.filter(
                          obj2 => obj2?.type === 6,
                        );

                      matchingRadioKey?.forEach(d => {
                        const key = formatString(d.name);
                        const filterdData = d?.attribute_value?.find(
                          i => i?.value?.toLowerCase() === 'no',
                        );
                        newItem[key] = filterdData?.value ?? newItem[key];
                      });

                      matchingMultiSelectKey?.forEach(d => {
                        const key = formatString(d.name);
                        // if (!item?.hasOwnProperty(key)) {
                        //   newItem[key] = newItem[key]
                        //     ? [newItem[key]]
                        //     : newItem[key];
                        // } else {
                        //   newItem[key] = [newItem[key]];
                        // }
                        newItem[key] = newItem[key];
                      });
                      matchingCheckboxKey?.forEach(d => {
                        const key = formatString(d.name);
                        newItem[key] = newItem[key] === 1 ? true : false;
                      });
                    }

                    let data = {
                      qty: '',
                      id: generateUniqueId(),
                      amount: matchData ? matchData?.amount : 0,
                      total_amount: matchData ? matchData?.total_amount : 0,
                      new_white_cylinder_amount: matchData
                        ? matchData?.new_white_cylinder_amount
                        : 0,
                      new_white_cylinder_total_amount: matchData
                        ? matchData?.new_white_cylinder_total_amount
                        : 0,
                      new_coloured_cylinder_amount: matchData
                        ? matchData?.new_coloured_cylinder_amount
                        : 0,
                      new_coloured_cylinder_total_amount: matchData
                        ? matchData?.new_coloured_cylinder_total_amount
                        : 0,
                      reengraved_cylinder_amount: matchData
                        ? matchData?.reengraved_cylinder_amount
                        : 0,
                      reengraved_cylinder_total_amount: matchData
                        ? matchData?.reengraved_cylinder_total_amount
                        : 0,
                      width: convertIntoNumber(item?.roll_width),
                      // length: convertIntoNumber(item?.repeat_length),
                    };

                    return {
                      ...newItem,
                      ...data,
                      ...matchData,
                      design_image: newItem['po_image'],
                      net_weight: newItem['required_qty'],
                    };

                    // return newItem;
                  });

                  let totalOfAmount = totalCount(updatedList, 'amount');
                  let totalWhiteCylinder = totalCount(
                    updatedList,
                    'new_white_cylinder_amount',
                  );
                  let totalColouredCylinder = totalCount(
                    updatedList,
                    'new_coloured_cylinder_amount',
                  );
                  let totalReengravedCylinder = totalCount(
                    updatedList,
                    'reengraved_cylinder_amount',
                  );

                  const sub_total_amount =
                    convertIntoNumber(totalOfAmount) +
                    convertIntoNumber(totalWhiteCylinder) +
                    convertIntoNumber(totalColouredCylinder) +
                    convertIntoNumber(totalReengravedCylinder) +
                    convertIntoNumber(values.additional_amount) -
                    convertIntoNumber(values?.discount);

                  const calculate_tax =
                    (convertIntoNumber(sub_total_amount) *
                      rawItemListById?.GST_rate) /
                    100;
                  const calculate_total = sub_total_amount + calculate_tax;

                  const changeFieldObj = {
                    prePrintedTable_viewList: updatedList,
                    sub_total: convertIntoNumber(sub_total_amount),
                    tax: convertIntoNumber(calculate_tax),
                    total: convertIntoNumber(calculate_total),
                  };

                  handleChangeFieldsdData(changeFieldObj);
                  // setPrePrintedTableViewList(updatedList);
                  setFromJobModal(false);
                }
              }}
              disabled={values?.selected_job_list?.length === 0}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
