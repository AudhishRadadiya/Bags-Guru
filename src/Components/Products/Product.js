import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { Dialog } from 'primereact/dialog';
import EditIcon from '../../Assets/Images/edit.svg';
import StockTransfer from '../../Assets/Images/stock-transfer.svg';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import DuplicateIcon from '../../Assets/Images/duplicate.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FilterOverlay from 'Components/Common/FilterOverlay';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import _ from 'lodash';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  getExportProductFile,
  getProductList,
  getShowMobileProductList,
  sendProductTransfer,
} from 'Services/Products/ProductService';
import {
  setIsGetInitialValuesProduct,
  setMobileProductList,
  setProductList,
} from 'Store/Reducers/Products/ProductSlice';
import { deleteProduct } from 'Services/Products/TrendingProductService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getActiveBagTypeList,
  getActiveFormList,
  getActiveIndustryList,
  getActiveLaminationTypeList,
  getActiveMaterialList,
  getActivePrintTechnologyList,
  getActivePrintTypeList,
  getActiveWarehouseList,
  getDesignerList,
} from 'Services/Settings/MiscMasterService';
import { toast } from 'react-toastify';
import {
  getExtensionFromName,
  getFormattedDate,
  checkModulePermission,
} from '../../Helper/Common';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { Checkbox } from 'primereact/checkbox';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';

const renderMsg = () => {
  toast.error(
    'At a time only those products can be transferred who has same warehouse & Qty is more than 0',
  );
  return false;
};

const filterDetails = [
  { label: 'Material', value: 'material', type: 'dropDown' },
  { label: 'Warehouse', value: 'warehouse_id', type: 'dropDown' },
  { label: 'Form', value: 'form', type: 'dropDown' },
  { label: 'Bag Type', value: 'bag_type', type: 'dropDown' },
  { label: 'Printing Type', value: 'print_type', type: 'dropDown' },
  // { label: 'Printing Technology', value: 'print_technology', type: 'dropDown' },
  { label: 'Industry', value: 'industry', type: 'dropDown' },
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'Designer Name', value: 'designer_name', type: 'dropDown' },
  { label: 'Fabric Color', value: 'fabric_color_name', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Product Code', value: 'product_code', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_typename', type: 'dropDown' },
  // { label: 'Lamination', value: 'is_laminated', type: 'dropDown' },
];

export const getProductSeverity = lamination => {
  switch (lamination) {
    case 'bopp':
      return 'bopp';
    case 'metalic':
      return 'metalic';
    case 'matt':
      return 'matt';
    case 'glitter':
      return 'glitter';
    case 'pp coated':
      return 'pp_coated';
    case 'glitter with metalic':
      return 'glitter_with_metalic';
    default:
      return 'primary';
  }
};

export default function Product({ hasAccess }) {
  const op = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    is_create_access,
    is_edit_access,
    is_delete_access,
    is_export_access,
  } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [sortingOrder, setSortingOrder] = useState(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [productTransferList, setProductTransferList] = useState([]);
  const [stockTransferModal, setStockTransferModal] = useState(false);
  const [transferFilterToggle, setTransferFilterToggle] = useState(false);
  const [productTransferDate, setProductTransferDate] = useState(new Date());
  // const [searchQuery, setSearchQuery] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageLimit, setPageLimit] = useState(10);
  // const [filters, setFilters] = useState([]);
  // const [applyFilter, setapplyFilter] = useState({});
  // const [filterToggle, setFilterToggle] = useState(false);
  // const [list, setList] = useState([]);
  // const [showMobileChecked, setShowMobileChecked] = useState(false);

  const {
    productLoading,
    productList,
    mobileProductList,
    allProductList,
    productCount,
    mobileProductCount,
    productCRUDLoading,
    productExportLoading,
    isGetInitialValuesProduct,
  } = useSelector(({ product }) => product);
  const {
    activeMaterialList,
    activeWarehouseList,
    activeFormList,
    activeBagTypeList,
    activeLaminationTypeList,
    activePrintTypeList,
    activeIndustryList,
    designerList,
  } = useSelector(({ miscMaster }) => miscMaster);
  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { userPermissionList } = useSelector(({ settings }) => settings);

  const { filterToggle, tableFilters, searchQuery, showMobileChecked } =
    allCommon?.product;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    selectedItemIndex,
    mobileCurrentPageLimit,
    mobileCurrentPage,
  } = allFilters?.product;

  const checkProductTransferPermission = checkModulePermission(
    userPermissionList,
    'Product',
    'Product Transfer',
    'create',
  );

  const handleProductListing = useCallback(() => {
    if (showMobileChecked) {
      dispatch(
        getShowMobileProductList(
          mobileCurrentPageLimit,
          mobileCurrentPage,
          searchQuery,
          applied,
        ),
      );
    } else {
      dispatch(getProductList(pageLimit, currentPage, searchQuery, applied));
    }
  }, [
    applied,
    dispatch,
    pageLimit,
    searchQuery,
    currentPage,
    showMobileChecked,
    mobileCurrentPage,
    mobileCurrentPageLimit,
  ]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     if (showMobileChecked) {
  //       dispatch(
  //         getShowMobileProductList(
  //           mobileCurrentPageLimit,
  //           mobileCurrentPage,
  //           searchQuery,
  //           applied,
  //         ),
  //       );
  //     } else {
  //       dispatch(getProductList(pageLimit, currentPage, searchQuery, applied));
  //     }
  //   }, 700);
  //   return () => clearTimeout(getData);
  // }, [currentPage, pageLimit, applied, dispatch, showMobileChecked]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'product',
      }),
    );
    handleProductListing();
    dispatch(getActiveMaterialList());
    dispatch(getActiveFormList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveLaminationTypeList());
    dispatch(getActivePrintTypeList());
    dispatch(getActiveWarehouseList());
    dispatch(getActiveIndustryList());
    dispatch(getActivePrintTechnologyList());
    dispatch(getDesignerList());
  }, [dispatch, handleProductListing]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  // useEffect(() => {
  //   setList(productList);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [productList]);

  useEffect(() => {
    if (sourceWarehouseId) {
      const data = showMobileChecked ? mobileProductList : productList;
      const filtereddf = data
        ?.filter(x => x?.data?.isSelected === true)
        ?.map(y => ({ ...y?.data, transfer_qty: 0 }));
      const filteredChild = data
        ?.filter(x => x?.children)
        ?.map(y => y?.children)
        ?.flat();
      const filtered = filteredChild
        ?.filter(x => x?.data?.isSelected === true)
        ?.map(y => ({ ...y?.data, transfer_qty: 0 }));
      const arr = [...filtered, ...filtereddf];
      setProductTransferList(arr);
    } else {
      setProductTransferList([]);
    }
  }, [productList, mobileProductList, showMobileChecked, sourceWarehouseId]);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  const content = useCallback(
    (data, index, handleFilterEdit, handleFilterDelete) => {
      return (
        <>
          <span
            className="edit_icon"
            onClick={e => handleFilterEdit(data, index)}
          >
            <img src={EditIcon} alt="" />
          </span>
          <InputText
            value={data?.filter_name}
            readOnly
            onClick={e => handleFilterEdit(data, index)}
            style={{ cursor: 'pointer' }}
          />
          <Button
            className="btn_transperant"
            onClick={e => {
              handleFilterDelete(e, data, index);
            }}
          >
            <img src={TrashIcon} alt="" />
          </Button>
        </>
      );
    },
    [],
  );

  const onChangeTransferData = useCallback(
    (e, eventValue, data) => {
      const name = e?.originalEvent?.target?.name;
      let updatedList = [...productTransferList];

      if (updatedList?.length > 0) {
        const index = updatedList?.findIndex(x => x?._id === data?._id);

        if (index !== -1) {
          const oldObj = updatedList[index];
          const updatedObj = {
            ...oldObj,
            [name]: eventValue,
          };
          updatedList[index] = updatedObj;
          setProductTransferList(updatedList);
        }
      }
    },
    [productTransferList],
  );

  const transferDataTemplate = useCallback(
    (data, row) => {
      const fieldName = row?.column?.props?.field;
      const headerName = row?.column?.props?.header;

      return (
        <div className="form_group">
          <InputNumber
            name={fieldName}
            useGrouping={true}
            value={data[fieldName] || ''}
            placeholder={`Enter ${headerName}`}
            onChange={e => onChangeTransferData(e, e.value, data)}
            maxFractionDigits={fieldName === 'transfer_weight' ? 2 : 0}
          />
        </div>
      );
    },
    [onChangeTransferData],
  );

  const imageTemplate = useCallback(item => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          preview
          downloadable
          width="50px"
          height="50px"
          src={item?.data?.main_image}
          zoomSrc={item?.data?.main_image}
          alt={`${item?.data?.product_code}_main_image.${getExtensionFromName(
            item?.data?.main_image,
          )}`}
          title={`${item?.data?.product_code}_main_image.${getExtensionFromName(
            item?.data?.main_image,
          )}`}
        />
      </div>
    );
  }, []);

  const RealImageTemplate = useCallback(item => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          preview
          width="50px"
          height="50px"
          downloadable
          src={item?.data?.real_image}
          zoomSrc={item?.data?.real_image}
          alt={`${item?.data?.product_code}_real_image.${getExtensionFromName(
            item?.data?.real_image,
          )}`}
          title={`${item?.data?.product_code}_real_image.${getExtensionFromName(
            item?.data?.real_image,
          )}`}
        />
      </div>
    );
  }, []);

  const WaterImageTemplate = useCallback(item => {
    return (
      <div className="image_zoom_Wrapper">
        <Image
          preview
          width="50px"
          height="50px"
          downloadable
          src={item?.data?.water_image}
          zoomSrc={item?.data?.water_image}
          alt={`${item?.data?.product_code}_water_image.${getExtensionFromName(
            item?.data?.water_image,
          )}`}
          title={`${
            item?.data?.product_code
          }_water_image.${getExtensionFromName(item?.data?.water_image)}`}
        />
      </div>
    );
  }, []);

  const laminationTemplate = item => {
    const lamination = [...(item?.data?.lamination_type_name || [])]?.sort();
    return (
      <div>
        {lamination?.length > 0 ? (
          lamination?.map(value => {
            const lamination_name = value?.name?.toLowerCase();
            return (
              <Tag
                value={value?.name}
                severity={getProductSeverity(lamination_name)}
                className="me-2"
              />
            );
          })
        ) : (
          <Tag
            value={'Non Laminated'}
            severity={getProductSeverity('Non Laminated')}
          />
        )}
      </div>
    );
  };

  const handleEdit = useCallback(
    product_id => {
      if (product_id) {
        dispatch(
          setIsGetInitialValuesProduct({
            ...isGetInitialValuesProduct,
            update: false,
          }),
        );
        // dispatch(clearUpdateSelectedProductData());
        // dispatch(setSelectedProduct(product));
        navigate(`/update-product/${product_id}`);
      }
    },
    [isGetInitialValuesProduct, dispatch, navigate],
  );

  const handleDuplicate = useCallback(
    async product_id => {
      if (product_id) {
        dispatch(
          setIsGetInitialValuesProduct({
            ...isGetInitialValuesProduct,
            duplicate: false,
          }),
        );
        // dispatch(clearDuplicateSelectedProductData());
        navigate(`/duplicate-product/${product_id}`);
      }
    },
    [navigate, dispatch, isGetInitialValuesProduct],
  );

  const stockConsumptionAction = useCallback(
    product => {
      const checkPermission =
        is_edit_access || is_delete_access || checkProductTransferPermission;

      return (
        !product?.isChild && (
          <div className="edit_row">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="ection_btn"
                disabled={checkPermission ? false : true}
              >
                <img src={ActionBtn} alt="" width={24} height={24} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {product?.data?.can_update === true && is_edit_access && (
                  <Dropdown.Item
                    onClick={() =>
                      handleEdit(product?.data?._id, product, product?.data)
                    }
                  >
                    <img src={EditIcon} alt="" width={20} height={20} /> Edit
                  </Dropdown.Item>
                )}
                {is_delete_access && (
                  <Dropdown.Item
                    onClick={() => setDeletePopup(product?.data?._id)}
                  >
                    <img src={TrashIcon} alt="" width={20} height={20} /> Delete
                  </Dropdown.Item>
                )}
                {checkProductTransferPermission && (
                  <Dropdown.Item
                    onClick={() => handleDuplicate(product?.data?._id)}
                  >
                    <img src={DuplicateIcon} alt="" width={20} height={20} />{' '}
                    Duplicate
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )
      );
    },
    [
      is_edit_access,
      is_delete_access,
      checkProductTransferPermission,
      handleEdit,
      handleDuplicate,
    ],
  );

  const handleDelete = useCallback(
    async product_id => {
      if (product_id) {
        const result = await dispatch(deleteProduct(product_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getProductList(pageLimit, 1, searchQuery, applied));

          dispatch(
            setAllFilters({
              ...allFilters,
              product: {
                ...allFilters?.product,
                ...(showMobileChecked && {
                  mobileCurrentPage: 1,
                }),
                ...(!showMobileChecked && {
                  currentPage: 1,
                }),
              },
            }),
          );
        }
      }
    },
    [allFilters, dispatch, pageLimit, searchQuery, applied, showMobileChecked],
  );

  const filterOption = useMemo(() => {
    let flterOptionArray = [...filterDetails];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters]);

  const filterOptions = useMemo(() => {
    return {
      material: activeMaterialList,
      warehouse_id: activeWarehouseList,
      form: activeFormList,
      bag_type: activeBagTypeList,
      lamination_typename: laminationOptions,
      designer_name: designerList,
      print_type: activePrintTypeList,
      industry: activeIndustryList,
      // print_technology: activePrintTechnologyList,
      // is_laminated: commonOption,
    };
  }, [
    designerList,
    activeBagTypeList,
    activeFormList,
    activeIndustryList,
    laminationOptions,
    activeMaterialList,
    // activePrintTechnologyList,
    activePrintTypeList,
    activeWarehouseList,
  ]);

  const handleFilterChange = useCallback(
    (index, field, value) => {
      const updatedFilters = [...filters];
      if (field === 'filter' && updatedFilters[index]['value'] !== '') {
        updatedFilters[index] = {
          ...updatedFilters[index],
          [field]: value,
          value: '',
        };
      } else {
        updatedFilters[index] = { ...updatedFilters[index], [field]: value };
      }
      // setFilters(updatedFilters);
      dispatch(
        setAllFilters({
          ...allFilters,
          product: { ...allFilters?.product, filters: updatedFilters },
        }),
      );
    },
    [allFilters, dispatch, filters],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        product: {
          ...allFilters?.product,
          filters: [...allFilters?.product?.filters, { filter: '', value: '' }],
        },
      }),
    );
    // setFilters([...filters, { filter: '', value: '' }]);
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters?.splice(index, 1);

      const checkAppliedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.product?.applied)?.length > 0;

      if (checkAppliedFilter) {
        if (showMobileChecked) {
          dispatch(
            getShowMobileProductList(
              mobileCurrentPageLimit,
              mobileCurrentPage,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(getProductList(pageLimit, currentPage, searchQuery, {}));
        }
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          product: {
            ...allFilters?.product,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.product?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.product.selectedItemIndex !== ''
                ? ''
                : allFilters.product.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }

      // dispatch(setAppliedFilters({ ...appliedFilters, product: {} }));
      // if (updatedFilters?.length === 0) setapplyFilter([]);
    },
    [
      isEdit,
      filters,
      dispatch,
      pageLimit,
      allFilters,
      searchQuery,
      currentPage,
      showMobileChecked,
      mobileCurrentPage,
      mobileCurrentPageLimit,
    ],
  );

  const selectedFilters = useMemo(() => {
    let filter = filters?.map(filter => {
      let filterDetail = filterDetails?.find(
        detail => detail.value === filter.filter,
      );
      return filterDetail ? filterDetail : null;
    });
    return filter;
  }, [filters]);

  const handleFilterEdit = useCallback(
    (data, index) => {
      const updatedFilterData = {
        ...data,
        filter_list: data.filter_list.map(item => {
          const findObj = filterDetails?.find(
            obj => obj?.value === item?.filter && obj?.type === 'dropDown',
          );
          if (findObj) {
            return { ...item, value: item.value.split(', ') };
          } else {
            return { ...item };
          }
        }),
      };

      dispatch(
        setAllFilters({
          ...allFilters,
          product: {
            ...allFilters?.product,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        }),
      );
      setIsEdit(true);
      setNameFilter(data?.filter_name);
      setFilterId(data?._id);
    },
    [allFilters, dispatch],
  );

  const handleFilterDelete = useCallback(
    async (e, data, index) => {
      const res = await dispatch(
        deleteFilter({
          filter_id: data?._id,
          module_name: 'product',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            product: {
              ...allFilters?.product,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'product',
          }),
        );

        if (showMobileChecked) {
          dispatch(
            getShowMobileProductList(
              mobileCurrentPageLimit,
              1,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(getProductList(pageLimit, 1, searchQuery, {}));
        }
      }
    },
    [
      dispatch,
      pageLimit,
      allFilters,
      searchQuery,
      showMobileChecked,
      mobileCurrentPageLimit,
    ],
  );

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters.forEach(item => {
      if (String(item.value) !== '0') {
        filterArray.push(item);
      }
    });
    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = {
          ...filterObj,
          ...{
            [item.filter]:
              item.filter === 'width' ||
              item.filter === 'height' ||
              item.filter === 'gusset' ||
              item.filter === 'qty' ||
              item.filter === 'gsm'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          product: {
            ...allFilters?.product,
            applied: filterObj,
            currentPage: showMobileChecked ? currentPage : 1,
            mobileCurrentPage: showMobileChecked ? 1 : mobileCurrentPage,
          },
        }),
      );

      if (showMobileChecked) {
        dispatch(
          getShowMobileProductList(
            mobileCurrentPageLimit,
            1,
            searchQuery,
            filterObj,
          ),
        );
      } else {
        dispatch(getProductList(pageLimit, 1, searchQuery, filterObj));
      }
    }
  }, [
    filters,
    dispatch,
    allFilters,
    currentPage,
    searchQuery,
    pageLimit,
    showMobileChecked,
    mobileCurrentPage,
    mobileCurrentPageLimit,
  ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (showMobileChecked) {
          dispatch(
            getShowMobileProductList(
              mobileCurrentPageLimit,
              1,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(getProductList(pageLimit, 1, searchQuery, {}));
        }

        dispatch(
          setAllFilters({
            ...allFilters,
            product: {
              ...allFilters?.product,
              applied: {},
              filters: [],
              selectedItemIndex: '',
              currentPage: showMobileChecked ? currentPage : 1,
              mobileCurrentPage: showMobileChecked ? 1 : mobileCurrentPage,
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            product: {
              ...allFilters?.product,
              filters: [],
              selectedItemIndex: '',
              currentPage: showMobileChecked ? currentPage : 1,
              mobileCurrentPage: showMobileChecked ? 1 : mobileCurrentPage,
            },
          }),
        );
      }

      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [
      applied,
      isEdit,
      dispatch,
      allFilters,
      currentPage,
      searchQuery,
      pageLimit,
      mobileCurrentPage,
      showMobileChecked,
      mobileCurrentPageLimit,
    ],
  );

  const handleSaveFilter = useCallback(async () => {
    let res;

    const filterConvertToString = filters?.map(item => {
      if (Array.isArray(item?.value)) {
        let updated = item?.value?.join(', ');
        return { ...item, value: updated };
      } else {
        return item;
      }
    });

    if (isEdit) {
      let editPayload = {
        filter_id: filterId,
        module_name: 'product',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'product',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      setSaveFilterModal(false);
      // dispatch(
      //   setAllFilters({
      //     ...allFilters,
      //     product: { ...allFilters?.product, currentPage: 1 },
      //   }),
      // );

      dispatch(
        getListFilter({
          module_name: 'product',
        }),
      );
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          product: { ...allFilters?.product, currentPage: pageIndex },
        }),
      );

      if (showMobileChecked) {
        dispatch(
          getShowMobileProductList(
            mobileCurrentPageLimit,
            pageIndex,
            searchQuery,
            applied,
          ),
        );
      } else {
        dispatch(getProductList(pageLimit, pageIndex, searchQuery, applied));
      }
    },
    [
      applied,
      dispatch,
      pageLimit,
      allFilters,
      currentPage,
      searchQuery,
      showMobileChecked,
      mobileCurrentPageLimit,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      // setPageLimit(page);
      // setCurrentPage(page === 0 ? 0 : 1);
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          product: {
            ...allFilters?.product,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );

      if (showMobileChecked) {
        dispatch(
          getShowMobileProductList(
            page,
            updatedCurrentPage,
            searchQuery,
            applied,
          ),
        );
      } else {
        dispatch(
          getProductList(page, updatedCurrentPage, searchQuery, applied),
        );
      }
    },
    [allFilters, applied, dispatch, searchQuery, showMobileChecked],
  );

  const onExport = useCallback(
    async key => {
      await dispatch(getExportProductFile(key, showMobileChecked));
    },
    [dispatch, showMobileChecked],
  );

  const onProductTransferChange = useCallback((key, val) => {
    if (key === 'transferDate') setProductTransferDate(val);
    else if (key === 'targetWarehouse') setTargetWarehouse(val);
  }, []);

  const customSort = useCallback(
    ({ sortField }) => {
      setSourceWarehouseId('');
      setSortingOrder(sortingOrder === 1 ? -1 : 1);
      const sortedData = [
        ...(showMobileChecked ? mobileProductList : productList),
      ].sort((a, b) => {
        const aValue = a?.data[sortField];
        const bValue = b?.data[sortField];

        if (aValue === bValue) return 0;

        // Compare strings and numbers appropriately
        if (typeof aValue === 'string')
          return sortingOrder * aValue?.localeCompare(bValue);
        else return sortingOrder * (aValue - bValue);
      });
      if (showMobileChecked) {
        dispatch(setMobileProductList(sortedData || []));
      } else {
        // setList(sortedData || [])
        dispatch(setProductList(sortedData || []));
      }
    },
    [dispatch, mobileProductList, productList, showMobileChecked, sortingOrder],
  );

  const onProductTransfer = useCallback(async () => {
    if (!productTransferDate || !sourceWarehouseId || !targetWarehouse) {
      toast.error('Please select required fields to transfer product');
      return;
    }
    if (productTransferList?.filter(x => x?.transfer_qty < 1)?.length > 0) {
      toast.error('Please enter valid qty in transfer qty field');
      return;
    }

    const payload = {
      // transfer_date: getDMYDateFormat(productTransferDate),
      transfer_date: getFormattedDate(productTransferDate),
      source_warehouse: sourceWarehouseId,
      target_warehouse: targetWarehouse,
      transfer:
        productTransferList?.map(x => {
          return {
            product_code: x?.product_code,
            transfer_qty: x?.transfer_qty,
            transfer_weight: x?.transfer_weight,
            available_weight: x?.weight,
            available_qty: x?.qty,
            product: x?._id,
          };
        }) || [],
    };

    const res = await dispatch(sendProductTransfer(payload));

    if (res) {
      setStockTransferModal(false);
      setProductTransferList([]);
      setSourceWarehouseId('');
      dispatch(getProductList(pageLimit, 1, searchQuery, applied));
      dispatch(
        setAllFilters({
          ...allFilters,
          product: { ...allFilters?.product },
        }),
      );
    }
  }, [
    allFilters,
    dispatch,
    pageLimit,
    productTransferDate,
    productTransferList,
    sourceWarehouseId,
    targetWarehouse,
    applied,
    searchQuery,
  ]);

  const onSelectionOfWarehouse = useCallback(
    (val, data, dataList) => {
      const arr = data?.key?.split('-');
      let updated = [...JSON.parse(JSON.stringify(dataList))];
      const index = updated?.findIndex(x => x?.key === arr?.[0]);
      if (arr?.length === 1) {
        if (index >= 0) {
          if (val) {
            if (sourceWarehouseId === '') {
              if (updated?.[index]?.data?.qty > 0) {
                updated[index].data.isSelected = val;
                setSourceWarehouseId(data?.data?.warehouse_id);
              } else renderMsg();
            } else if (sourceWarehouseId === data?.data?.warehouse_id) {
              if (updated?.[index]?.data?.qty > 0)
                updated[index].data.isSelected = val;
              else renderMsg();
            } else {
              const filtered = updated?.filter(
                x => x?.data?.isSelected === true,
              );
              if (filtered?.length === 0) renderMsg();
            }
          } else {
            updated[index].data.isSelected = false;
            const filtered = updated?.filter(x => x?.data?.isSelected === true);
            if (filtered?.length === 0) setSourceWarehouseId('');
          }
        }
      } else if (arr?.length === 2) {
        const j = updated?.[index]?.children?.findIndex(
          x => x?.key === data?.key,
        );
        if (j >= 0) {
          if (val) {
            if (sourceWarehouseId === '') {
              if (updated?.[index]?.children?.[j]?.data?.qty > 0) {
                updated[index].children[j].data.isSelected = val;
                const filteredChild = updated
                  ?.filter(x => x?.children)
                  ?.map(y => y?.children)
                  ?.flat();
                const filtered = filteredChild?.filter(
                  x => x?.data?.isSelected === true,
                );
                if (filtered?.length === 0) setSourceWarehouseId('');
                else
                  setSourceWarehouseId(
                    updated?.[index]?.children[j]?.data?.warehouse_id,
                  );
              } else renderMsg();
            } else if (sourceWarehouseId === data?.data?.warehouse_id) {
              if (updated?.[index]?.children?.[j]?.data?.qty > 0)
                updated[index].children[arr[1] - 1].data.isSelected = val;
              else renderMsg();
            } else {
              if (updated?.[index]?.children?.[j]?.data)
                updated[index].children[j].data.isSelected = false;
              renderMsg();
            }
          } else {
            updated[index].children[j].data.isSelected = false;
            const filteredChild = updated
              ?.filter(x => x?.children)
              ?.map(y => y?.children)
              ?.flat();
            const filtered = filteredChild?.filter(
              x => x?.data?.isSelected === true,
            );
            if (filtered?.length === 0) setSourceWarehouseId('');
          }
        }
      }
      if (showMobileChecked) {
        dispatch(setMobileProductList(updated || []));
      } else {
        // setList(updated)
        dispatch(setProductList(updated || []));
      }
    },
    [dispatch, showMobileChecked, sourceWarehouseId],
  );

  const checkboxTemplate = useCallback(
    (data, dataList) => {
      const newKey = data?.key?.split('-');
      return (
        <Checkbox
          value={data?.data?.isSelected}
          onChange={e =>
            onSelectionOfWarehouse(
              e.checked,
              data,
              showMobileChecked ? mobileProductList : productList,
            )
          }
          checked={data?.data?.isSelected === true}
          className={newKey?.length > 1 ? 'child' : 'parent'}
          disabled={!checkProductTransferPermission}
        />
      );
    },
    [
      productList,
      mobileProductList,
      onSelectionOfWarehouse,
      showMobileChecked,
      checkProductTransferPermission,
    ],
  );

  const productCodeTemplate = useCallback(
    data => {
      return (
        <span
          onClick={() => {
            dispatch(
              setIsGetInitialValuesProduct({
                ...isGetInitialValuesProduct,
                view: false,
              }),
            );
            // dispatch(clearViewSelectedProductData());
            navigate(`/product-details/${data.data?._id}`);
          }}
        >
          {data?.data?.product_code}
        </span>
      );
    },
    [navigate],
  );

  const renderProductTable = useMemo(() => {
    return (
      <div className="data_table_wrapper tree_table_wrapper cell_padding_small vertical_space_medium">
        <button
          type="button"
          className="table_filter_btn"
          onClick={() =>
            dispatch(
              setAllCommon({
                ...allCommon,
                product: { ...allCommon?.product, filterToggle: !filterToggle },
              }),
            )
          }
          // onClick={() => setFilterToggle(!filterToggle)}
        >
          <img src={SearchIcon} alt="" />
        </button>

        <TreeTable
          onFilter={e =>
            dispatch(
              setAllCommon({
                ...allCommon,
                product: { ...allCommon?.product, tableFilters: e?.filters },
              }),
            )
          }
          filters={tableFilters}
          value={productList}
          onSort={customSort}
          emptyMessage={productLoading && <Skeleton count={11} />}
        >
          <Column expander frozen></Column>
          <Column
            selectionMode={'multiple'}
            headerStyle={{ width: '3rem' }}
            field="checked"
            body={e => checkboxTemplate(e, productList)}
          ></Column>
          <Column
            field="main_image_str"
            header="Image"
            filter={filterToggle}
            body={imageTemplate}
          ></Column>
          <Column
            field="real_image_str"
            header="Real Life Image"
            body={RealImageTemplate}
            filter={filterToggle}
          ></Column>
          <Column
            field="water_image_str"
            header="Watermark"
            body={WaterImageTemplate}
            filter={filterToggle}
          ></Column>
          <Column
            field="name"
            header="Warehouse"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="qty"
            header="Qty(Pcs)"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="kg_qty"
            header="Qty(Kgs)"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="product_code"
            header="Product Code"
            className="product_code_page"
            sortable
            filterMatchMode="contains"
            filter={filterToggle}
            body={productCodeTemplate}
          ></Column>
          <Column
            field="material_name"
            header="Material"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="form_name"
            header="Form"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="bag_type_name"
            header="Bag Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="lamination_types"
            header="Lamination Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
            body={laminationTemplate}
          ></Column>
          <Column
            field="print_type_name"
            header="Printing Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="width"
            header="Width"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="height"
            header="Height"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="gusset"
            header="Gusset"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="gsm"
            header="GSM"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="fabric_color_name"
            header="Fabric Color"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="design_name"
            header="Design Name"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="industry_name"
            header="Industry"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="action"
            header="Action"
            body={stockConsumptionAction}
          ></Column>
        </TreeTable>
        <CustomPaginator
          dataList={productList}
          pageLimit={pageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={productCount}
        />
      </div>
    );
  }, [
    RealImageTemplate,
    WaterImageTemplate,
    allCommon,
    checkboxTemplate,
    currentPage,
    customSort,
    dispatch,
    filterToggle,
    imageTemplate,
    onPageChange,
    onPageRowsChange,
    pageLimit,
    productCodeTemplate,
    productCount,
    productList,
    productLoading,
    stockConsumptionAction,
    tableFilters,
  ]);

  const renderMobileProductTable = useMemo(() => {
    return (
      <div className="data_table_wrapper tree_table_wrapper cell_padding_small vertical_space_medium">
        <button
          type="button"
          className="table_filter_btn"
          onClick={() =>
            dispatch(
              setAllCommon({
                ...allCommon,
                product: { ...allCommon?.product, filterToggle: !filterToggle },
              }),
            )
          }
          // onClick={() => setFilterToggle(!filterToggle)}
        >
          <img src={SearchIcon} alt="" />
        </button>
        <TreeTable
          value={mobileProductList || []}
          onSort={customSort}
          emptyMessage={productLoading && <Skeleton count={11} />}
        >
          <Column expander frozen></Column>
          <Column
            selectionMode={'multiple'}
            headerStyle={{ width: '3rem' }}
            field="checked"
            body={e => checkboxTemplate(e, mobileProductList)}
          ></Column>
          <Column
            field="main_image_str"
            header="Image"
            filter={filterToggle}
            body={imageTemplate}
          ></Column>
          <Column
            field="real_image_str"
            header="Real Life Image"
            body={RealImageTemplate}
            filter={filterToggle}
          ></Column>
          <Column
            field="water_image_str"
            header="Watermark"
            body={WaterImageTemplate}
            filter={filterToggle}
          ></Column>
          <Column
            field="name"
            header="Warehouse"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="qty"
            header="Qty(Pcs)"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="kg_qty"
            header="Qty(Kgs)"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="product_code"
            header="Product Code"
            className="product_code_page"
            sortable
            filterMatchMode="contains"
            filter={filterToggle}
            body={productCodeTemplate}
          ></Column>
          <Column
            field="material_name"
            header="Material"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="form_name"
            header="Form"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="bag_type_name"
            header="Bag Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="lamination_types"
            header="Lamination Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
            body={laminationTemplate}
          ></Column>
          <Column
            field="print_type_name"
            header="Printing Type"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="width"
            header="Width"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="height"
            header="Height"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="gusset"
            header="Gusset"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="gsm"
            header="GSM"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="fabric_color_name"
            header="Fabric Color"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="design_name"
            header="Design Name"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="industry_name"
            header="Industry"
            sortable
            filter={filterToggle}
            filterMatchMode="contains"
          ></Column>
          <Column
            field="action"
            header="Action"
            body={stockConsumptionAction}
          ></Column>
        </TreeTable>
        <CustomPaginator
          dataList={mobileProductList}
          pageLimit={mobileCurrentPageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={mobileProductCount}
        />
      </div>
    );
  }, [
    mobileCurrentPageLimit,
    // pageLimit,
    mobileProductList,
    customSort,
    productLoading,
    filterToggle,
    imageTemplate,
    RealImageTemplate,
    WaterImageTemplate,
    productCodeTemplate,
    stockConsumptionAction,
    onPageChange,
    onPageRowsChange,
    currentPage,
    mobileProductCount,
    dispatch,
    allCommon,
    checkboxTemplate,
  ]);

  const handleShowMobileCheckbox = useCallback(
    val => {
      dispatch(
        setAllCommon({
          ...allCommon,
          product: {
            ...allCommon?.product,
            searchQuery: '',
            showMobileChecked: val,
            currentPage: 1,
          },
        }),
      );

      if (val) {
        dispatch(
          getShowMobileProductList(mobileCurrentPageLimit, 1, '', applied),
        );
      } else {
        dispatch(getProductList(pageLimit, 1, '', applied));
      }
      // setSearchQuery('');
      clearAppliedFilter();
      // setShowMobileChecked(val);
      if (!val) {
        const updatedMobileProductList = mobileProductList?.map((x, i) => {
          if (x?.children?.length > 0) {
            return {
              ...x,
              data: {
                ...x?.data,
                isSelected: false,
              },
              children: x?.children?.map(y => {
                return {
                  data: {
                    ...y?.data,
                    isSelected: false,
                  },
                };
              }),
            };
          } else
            return {
              ...x,
              data: {
                ...x?.data,
                isSelected: false,
              },
            };
        });
        dispatch(setMobileProductList(updatedMobileProductList || []));
      }
    },
    [clearAppliedFilter, allCommon, dispatch, mobileProductList],
  );

  const handleSearchInput = (e, mobileChecked) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        product: {
          ...allFilters?.product,
          ...(!mobileChecked && { currentPage: 1 }),
          ...(mobileChecked && { mobileCurrentPage: 1 }),
        },
      }),
    );

    if (mobileChecked) {
      dispatch(
        getShowMobileProductList(
          mobileCurrentPageLimit,
          mobileCurrentPage,
          e.target.value,
          applied,
        ),
      );
    } else {
      dispatch(getProductList(pageLimit, currentPage, e.target.value, applied));
    }
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {productExportLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col xl={2}>
                <div className="page_title">
                  <h3 className="m-0">Product Details</h3>
                </div>
              </Col>
              <Col xl={10}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="order_checkbox_wrap">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="showMobile"
                          name="showMobile"
                          onChange={e => handleShowMobileCheckbox(e.checked)}
                          checked={showMobileChecked}
                        />
                        <label htmlFor="showMobile" className="mb-0">
                          Show in Mobile App Only
                        </label>
                      </div>
                    </li>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debouncehandleSearchInput(e, showMobileChecked);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                product: {
                                  ...allCommon?.product,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        className={
                          Object.keys(applied)?.length > 0
                            ? 'btn_border filter_btn applied'
                            : 'btn_border filter_btn'
                        }
                        onClick={e => op.current.toggle(e)}
                      >
                        <img src={FilterIcon} alt="" width={20} height={20} />{' '}
                        Filter
                      </Button>
                    </li>
                    <li>
                      <Dropdown className="dropdown_common export_dropdown position-static">
                        <OverlayTrigger
                          overlay={props => (
                            <Tooltip {...props}>Export</Tooltip>
                          )}
                          placement="bottom"
                        >
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="btn_border icon_btn"
                            disabled={is_export_access ? false : true}
                            placeholder="Right"
                          >
                            <img
                              src={ExportIcon}
                              alt=""
                              width={20}
                              height={20}
                            />
                          </Dropdown.Toggle>
                        </OverlayTrigger>

                        <Dropdown.Menu>
                          {/* <Dropdown.Item onClick={() => onExport('pdf')}>
                            
                          </Dropdown.Item> */}
                          <Dropdown.Item onClick={() => onExport('xls')}>
                            XLS
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li>
                      <Button
                        className="btn_border"
                        onClick={() => setStockTransferModal(true)}
                        disabled={
                          checkProductTransferPermission
                            ? productTransferList?.length === 0
                            : !checkProductTransferPermission
                        }
                      >
                        <img
                          src={StockTransfer}
                          alt=""
                          width={20}
                          height={20}
                        />{' '}
                        Product Transfer
                      </Button>
                    </li>
                    <li className="add_btn">
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(
                              setIsGetInitialValuesProduct({
                                ...isGetInitialValuesProduct,
                                add: false,
                              }),
                            );
                            // dispatch(clearAddSelectedProductData());
                            navigate('/add-product');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" width={20} height={20} />
                        Add Product
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          {!showMobileChecked && renderProductTable}
          {showMobileChecked && renderMobileProductTable}
        </div>

        <Dialog
          header={`${isEdit ? 'Update' : 'Save'}  Personal Filters`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setSaveFilterModal(false);
            setIsEdit(false);
          }}
        >
          <div className="form_group mb-3">
            <InputText
              placeholder="Name your filter"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
        </Dialog>
        <Dialog
          header="Products Transfer"
          visible={!!stockTransferModal}
          draggable={false}
          className="modal_Wrapper modal_medium modal_no_padding"
          onHide={() => {
            setStockTransferModal(false);
          }}
        >
          <div className="stock_transfer_modal_wrapper">
            <div className="stock_transfer_top_wrap px-3">
              <Row>
                <Col md={6}>
                  <div className="form_group date_select_wrapper mb-3">
                    <label htmlFor="TransferDate">Transfer Date</label>
                    <Calendar
                      id="TransferDate"
                      placeholder="Transfer Date"
                      showIcon
                      maxDate={new Date()}
                      selectionMode="single"
                      dateFormat="dd-mm-yy"
                      readOnlyInput
                      showButtonBar
                      value={productTransferDate}
                      onChange={e =>
                        onProductTransferChange('transferDate', e.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="SourceWarehouse">Source Warehouse</label>
                    <InputText
                      id="SourceWarehouse"
                      placeholder="Source Warehouse"
                      type="text"
                      className="input_wrap small"
                      value={
                        activeWarehouseList?.find(
                          x => x?._id === sourceWarehouseId,
                        )?.name || ''
                      }
                      readOnly
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="TargetWarehouse">Target Warehouse</label>
                    <ReactSelectSingle
                      filter
                      value={targetWarehouse}
                      options={activeWarehouseList?.filter(
                        x => x?.value !== sourceWarehouseId,
                      )}
                      onChange={e => {
                        onProductTransferChange('targetWarehouse', e.value);
                      }}
                      placeholder="Target Warehouse"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="data_table_wrapper cell_padding_small mb-4 max_height">
            <DataTable value={productTransferList} selectionMode="false">
              <Column
                header="Product Code"
                sortable
                field="product_code"
                className="product_code"
                filter={transferFilterToggle}
              />
              <Column
                header="Available Quantity"
                sortable
                field="qty"
                filter={transferFilterToggle}
              />
              <Column
                header="Transfer Quantity"
                sortable
                field="transfer_qty"
                className="with_input_field"
                body={transferDataTemplate}
                filter={transferFilterToggle}
              />
              <Column
                header="Available Weight"
                field="weight"
                sortable
                filter={transferFilterToggle}
              />
              <Column
                header="Transfer Weight"
                sortable
                field="transfer_weight"
                className="with_input_field"
                body={transferDataTemplate}
                filter={transferFilterToggle}
              />
            </DataTable>
          </div>
          <div className="button_group d-flex justify-content-end px-3">
            <Button
              className="btn_border"
              onClick={() => {
                setStockTransferModal(false);
                dispatch(
                  setAllFilters({
                    ...allFilters,
                    product: { ...allFilters?.product },
                  }),
                );
              }}
              disabled={productCRUDLoading}
            >
              Cancel
            </Button>
            <Button className="btn_primary ms-3" onClick={onProductTransfer}>
              Save
            </Button>
          </div>
        </Dialog>
      </div>
      <FilterOverlay
        op={op}
        filters={filters}
        filterOption={filterOption}
        filterOptions={filterOptions}
        setNameFilter={setNameFilter}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleAddFilter={handleAddFilter}
        handleFilterEdit={handleFilterEdit}
        handleFilterDelete={handleFilterDelete}
        applyFilterHandler={applyFilterHandler}
        clearAppliedFilter={clearAppliedFilter}
        selectedFilters={selectedFilters}
        listFilter={listFilter}
        setSaveFilterModal={setSaveFilterModal}
        content={content}
        selectedItemIndex={selectedItemIndex}
      />
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
}
