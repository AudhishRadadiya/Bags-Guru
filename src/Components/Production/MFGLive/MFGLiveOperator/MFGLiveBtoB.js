import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import PlusIcon from '../../../../Assets/Images/plus.svg';
import SearchIcon from '../../../../Assets/Images/search.svg';
import DummyImage from '../../../../Assets/Images/gusset-bag.png';
import Camera from '../../../../Assets/Images/camera.svg';
import ReactSelectSingle from '../../../../Components/Common/ReactSelectSingle';
import { Checkbox } from 'primereact/checkbox';
import { Image } from 'primereact/image';
import CommonHeader from './CommonHeader';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import { MFGfProcessLists } from 'Services/Production/mfgLiveOperatorServices';
import {
  getActiveBagTypeList,
  getFactoryLocationList,
} from 'Services/Settings/MiscMasterService';
import {
  getSuggestedProductList,
  updatePrintStatus,
  viewMfgProcessPrintingById,
} from 'Services/Production/mfgLiveServices';
import { getProductDetailById } from 'Services/Products/ProductService';
import { setBagToBagData } from 'Store/Reducers/Production/mfgLiveSlice';
import FilterOverlay from 'Components/Common/FilterOverlay';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { isMobileDevice, statusObj } from 'Helper/Common';
import ImageCapture from 'Components/Common/ImageCapture/ImageCapture';
import { setViewProductDetailData } from 'Store/Reducers/Products/ProductSlice';

const MFGLiveFlexoFilterDetails = [
  { label: 'Date', value: 'job_date', type: 'inputBox' },
  { label: 'Day', value: 'days', type: 'inputBox' },
  { label: 'Design Name', value: 'design', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  {
    label: 'Background Design',
    value: 'background_design_name',
    type: 'inputBox',
  },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Bag Type', value: 'bag_type_id', type: 'dropDown' },
  { label: 'Stereo', value: 'old_stereo', type: 'dropDown' },
  { label: 'Operator Name', value: 'created_by_name', type: 'inputBox' },
  { label: 'Comment', value: 'comment', type: 'inputBox' },
];

const commonStatusObj = [
  { label: 'Old', value: true },
  { label: 'New', value: false },
];

const intialPrintingData = {
  print_technology_id: '',
  process_id: '',
  product_id: '',
  in_stock: '',
  qty_used: '',
  wastage: '',
  bag_printed: '',
  suggested_product_id: '',
  warehouse: '',
  completed: 0,
  partial: 1,
};
const bedgeBodyTemplate = val => {
  return (
    <span className={`bedge_${getSeverity(val)}`}>
      {val === true ? 'Old' : 'New'}
    </span>
  );
};

export const getSeverity = val => {
  switch (val) {
    case true:
      return 'success';
    case false:
      return 'danger';
    default:
      return null;
  }
};

const imageTemplate = data => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={data?.main_image}
        zoomSrc={data?.main_image}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};
const mainTableSizeTemplate = x => {
  return x?.gusset !== 0
    ? `W ${x?.width} × H ${x?.height} × G ${x?.gusset}`
    : `W ${x?.width} × H ${x?.height} `;
};

const mainTableRollWidthTemplate = rowData => {
  return <span>{rowData?.roll_width ? `${rowData?.roll_width}”` : ''}</span>;
};

const bg_bolor = data => {
  return {
    bg_yellow: data.color === 1,
    bg_green: data.color === 2,
  };
};

export default function MFGLiveBtoB() {
  const op = useRef(null);
  const dispatch = useDispatch();

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [selectedProductFromSuggested, setSelectedProductFromSuggested] =
    useState({});
  const [screenTableModal, setScreenTableModal] = useState(false);
  const [whatsappData, setWhatsappData] = useState({});
  const [imgCaptureModal, setImgCaptureModal] = useState(false);

  const { factoryLocationList, activeBagTypeList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { viewProductDetailData } = useSelector(({ product }) => product);
  const { bagToBagData, suggestedProductList, mfgProcessPrintingById } =
    useSelector(({ mfgLive }) => mfgLive);

  const { mfgListBToBParam, print_technology, machine, print } =
    allFilters?.mfgLiveFlexo;
  const { mfgLiveBtoBPrinting } = allCommon?.mfgLiveFlexo;
  const { mfgLiveBtoBFilter, tabelFilterToggle } = mfgLiveBtoBPrinting;

  const {
    dates,
    factory,
    completed,
    currentPage,
    pageLimit,
    searchQuery,
    applied,
    filters,
    selectedItemIndex,
  } = mfgListBToBParam;

  const { listMFGProcess, countMFGfProcess, mfgLiveOperatorLoading } =
    useSelector(({ mfgliveOperator }) => mfgliveOperator);

  const { listFilter } = useSelector(({ parties }) => parties);
  const tableRef = useRef();

  const loadRequiredData = useCallback(() => {
    dispatch(getFactoryLocationList());
    dispatch(
      getListFilter({
        module_name: 'mfg_operator_btob',
      }),
    );
    dispatch(getActiveBagTypeList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, [loadRequiredData]);

  useEffect(() => {
    if (
      Object.entries(mfgProcessPrintingById).length > 0 &&
      suggestedProductList?.length > 0
    ) {
      let data = suggestedProductList?.filter(
        d => d?._id === mfgProcessPrintingById?.suggested_product_id,
      );
      let updatedData = data?.map(i => {
        return {
          ...i,
          warehouse: i?.warehouse?.map(d => {
            return {
              ...d,
              label: d?.name,
              value: d?._id,
            };
          }),
        };
      });
      let selectedWarehouse = updatedData[0]?.warehouse.filter(
        d => d?._id === mfgProcessPrintingById?.warehouse,
      );
      setSelectedProductFromSuggested(updatedData[0]);
      dispatch(
        setBagToBagData({
          ...bagToBagData,
          suggested_product_id: mfgProcessPrintingById?.suggested_product_id,
          warehouse: mfgProcessPrintingById?.warehouse,
          qty_used: mfgProcessPrintingById?.qty_used,
          in_stock: selectedWarehouse ? selectedWarehouse[0]?.qty : 0,
          wastage: mfgProcessPrintingById?.wastage,
          bag_printed: mfgProcessPrintingById?.bag_printed,
          ...(mfgProcessPrintingById?.hasOwnProperty('completed') && {
            completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          }),
          ...(mfgProcessPrintingById?.hasOwnProperty('partial') && {
            partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          }),
          // partial: mfgProcessPrintingById?.partial === true ? 1 : 0,
          // completed: mfgProcessPrintingById?.completed === true ? 1 : 0,
          product_id: mfgProcessPrintingById?.product_id,
        }),
      );
    }
  }, [mfgProcessPrintingById, suggestedProductList, dispatch]);

  const FactoryLocationHandleChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...allFilters?.mfgLiveFlexo.mfgListBToBParam,
            factory: e.target.value,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListBToBParam,
        factory: e.target.value,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const loadTableData = selectedDate => {
    dispatch(
      MFGfProcessLists({
        ...mfgListBToBParam,
        dates: selectedDate,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const dateHandleChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...allFilters?.mfgLiveFlexo.mfgListBToBParam,
            dates: e,
          },
        },
      }),
    );

    loadTableData(e);
  };

  const handleCompletedChange = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...allFilters?.mfgLiveFlexo.mfgListBToBParam,
            completed: e === true ? 1 : 0,
          },
        },
      }),
    );
    dispatch(
      MFGfProcessLists({
        ...mfgListBToBParam,
        completed: e === true ? 1 : 0,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListBToBParam: {
              ...mfgListBToBParam,
              currentPage: pageIndex,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListBToBParam,
          print_technology: print_technology,
          print: print,
          machine: machine,
          currentPage: pageIndex,
        }),
      );
    },
    [
      currentPage,
      dispatch,
      allFilters,
      mfgListBToBParam,
      print_technology,
      print,
      machine,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListBToBParam: {
              ...mfgListBToBParam,
              currentPage: page === 0 ? 0 : 1,
              pageLimit: page,
            },
          },
        }),
      );

      dispatch(
        MFGfProcessLists({
          ...mfgListBToBParam,
          print_technology: print_technology,
          print: print,
          machine: machine,
          currentPage: page === 0 ? 0 : 1,
          pageLimit: page,
        }),
      );
    },
    [allFilters, dispatch, machine, mfgListBToBParam, print, print_technology],
  );

  const bagTemplate = data => {
    return (
      <div className="add_package_wrap">
        <span
          className="icon"
          onClick={async e => {
            setScreenTableModal(true);

            dispatch(getProductDetailById(data?.product_id));
            const printing_res = await dispatch(
              viewMfgProcessPrintingById(print_technology, data?._id),
            );

            dispatch(
              setBagToBagData({
                ...bagToBagData,
                print_technology_id: print_technology,
                product_id: data?.product_id,
                process_id: data?._id,
                pending_bag: printing_res.hasOwnProperty('pending_bag')
                  ? printing_res?.pending_bag
                  : data?.quantity,
              }),
            );
            dispatch(getSuggestedProductList(data?.product_id));
          }}
        >
          <img src={PlusIcon} alt="" />
        </span>
        <span>
          {data?.print_detail?.bag_printed
            ? data?.print_detail?.bag_printed
            : 0}
        </span>
      </div>
    );
  };

  // ** // For Photo Capture:
  const captureTemplate = rowItem => {
    return (
      <Button
        className="btn_transperant"
        onClick={() => {
          setWhatsappData(rowItem);
          setImgCaptureModal(true);
        }}
      >
        <img src={Camera} alt="" />
      </Button>
    );
  };

  const content = (data, index, handleFilterEdit, handleFilterDelete) => {
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
  };
  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };
  const onIngredientsChange = e => {
    let _ingredients = [...ingredients];

    if (e.checked) _ingredients.push(e.value);
    else _ingredients.splice(_ingredients.indexOf(e.value), 1);

    setIngredients(_ingredients);
  };
  const handleSaveFilter = useCallback(async () => {
    let res;
    setSaveFilterModal(false);

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
        module_name: 'mfg_operator_btob',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'mfg_operator_btob',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'mfg_operator_btob',
        }),
      );
      op.current?.hide();
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              mfgListBToBParam: {
                ...mfgListBToBParam,
                selectedItemIndex: '',
                applied: {},
                filters: [],
                currentPage: 1,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListBToBParam,
            applied: {},
            filters: [],
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              mfgListBToBParam: {
                ...mfgListBToBParam,
                filters: [],
                selectedItemIndex: '',
                currentPage: 1,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListBToBParam,
            currentPage: 1,
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      }

      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [allFilters, dispatch, isEdit, applied, machine, print_technology, print],
  );

  const handleFilterChange = (index, field, value) => {
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
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...mfgListBToBParam,
            filters: updatedFilters,
          },
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListBToBParam: {
              ...mfgListBToBParam,
              ...(updatedFilters?.length !== 0 &&
                Object.keys(allFilters.mfgLiveFlexo?.mfgListBToBParam?.applied)
                  ?.length !== 0 && {
                  applied: {},
                }),
              filters: [...updatedFilters],
              selectedItemIndex:
                updatedFilters?.length === 0 &&
                allFilters.mfgLiveFlexo?.mfgListBToBParam?.selectedItemIndex !==
                  ''
                  ? ''
                  : allFilters.mfgLiveFlexo?.mfgListBToBParam
                      ?.selectedItemIndex,
            },
          },
        }),
      );

      if (
        updatedFilters?.length === 0 &&
        Object.keys(allFilters.mfgLiveFlexo?.mfgListBToBParam?.applied)
          ?.length > 0
      ) {
        dispatch(
          MFGfProcessLists({
            ...mfgListBToBParam,
            searchQuery,
            currentPage: 1,
            applied: {},
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        );
      }

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [
      filters,
      dispatch,
      allFilters,
      mfgListBToBParam,
      isEdit,
      searchQuery,
      print_technology,
      print,
      machine,
    ],
  );

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...mfgListBToBParam,
            filters: [
              ...allFilters?.mfgLiveFlexo?.mfgListBToBParam?.filters,
              { filter: '', value: '' },
            ],
          },
        },
      }),
    );
  };

  const handleFilterEdit = (data, index) => {
    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = MFGLiveFlexoFilterDetails?.find(
          obj => obj?.value === item?.filter && obj?.type === 'dropDown',
        );

        const checkDropDownList = ['old_stereo']?.includes(findObj?.value);

        if (findObj) {
          if (checkDropDownList) {
            const updatedValues = item?.value?.split(', ')?.map(value1 => {
              let values = value1;
              switch (value1) {
                case 'true':
                  values = true;
                  break;
                default:
                  values = false;
              }
              return values;
            });
            return { ...item, value: updatedValues };
          } else {
            return { ...item, value: item.value.split(', ') };
          }
        } else {
          return { ...item };
        }
      }),
    };

    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          mfgListBToBParam: {
            ...mfgListBToBParam,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'mfg_operator_btob',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListBToBParam: {
              ...mfgListBToBParam,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'mfg_operator_btob',
        }),
      );

      setNameFilter('');
      op.current?.hide();
      // }
    }
  };

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    filters.forEach(item => {
      if (item.value) {
        filterArray.push(item);
      }
    });
    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = { ...filterObj, ...{ [item.filter]: item.value } };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          mfgLiveFlexo: {
            ...allFilters?.mfgLiveFlexo,
            mfgListBToBParam: {
              ...mfgListBToBParam,
              applied: filterObj,
              currentPage: 1,
            },
          },
        }),
        dispatch(
          MFGfProcessLists({
            ...mfgListBToBParam,
            currentPage: 1,
            applied: filterObj,
            print_technology: print_technology,
            print: print,
            machine: machine,
          }),
        ),
      );
    }
  }, [
    filters,
    dispatch,
    allFilters,
    mfgListBToBParam,
    print,
    print_technology,
    machine,
  ]);
  const selectedFilters = filters?.map(filter => {
    const filterDetail = MFGLiveFlexoFilterDetails?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });
  const filterOption = useMemo(() => {
    let flterOptionArray = [...MFGLiveFlexoFilterDetails];

    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray?.map(item => {
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
      bag_type_id: activeBagTypeList,
      old_stereo: commonStatusObj,
    };
  }, [activeBagTypeList]);

  const handleSearchInput = (
    e,
    mfgListBToBParam,
    print_technology,
    machine,
    print,
  ) => {
    dispatch(
      MFGfProcessLists({
        ...mfgListBToBParam,
        currentPage: 1,
        searchQuery: e.target.value,
        print_technology: print_technology,
        print: print,
        machine: machine,
      }),
    );
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );
  return (
    <>
      <div className="flexo_printing_wrap mb-3">
        <div className="table_main_Wrapper bg-white">
          <CommonHeader
            headerName="MFG Live"
            searchSateName="mfgLiveFlexo"
            searchInnerSateName="mfgListBToBParam"
            op={op}
            dates={dates}
            searchQuery={searchQuery}
            factory={factory}
            factoryLocationList={factoryLocationList}
            dateHandleChange={dateHandleChange}
            loadTableData={loadTableData}
            FactoryLocationHandleChange={FactoryLocationHandleChange}
            tableRef={tableRef}
            completed={completed}
            handleCompletedChange={handleCompletedChange}
            mfgListParam={mfgListBToBParam}
            applied={applied}
            debouncehandleSearchInput={debouncehandleSearchInput}
          />

          <div className="data_table_wrapper with_colspan_head cell_padding_small is_filter break_header">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgLiveBtoBPrinting: {
                        ...allCommon?.mfgLiveFlexo?.mfgLiveBtoBPrinting,
                        tabelFilterToggle: !tabelFilterToggle,
                      },
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={listMFGProcess}
              sortMode="single"
              sortField="name"
              sortOrder={1}
              rows={10}
              filterDisplay="row"
              dataKey="_id"
              selection={selectedProducts}
              onSelectionChange={e => setSelectedProducts(e.value)}
              rowClassName={bg_bolor}
              filters={mfgLiveBtoBFilter}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLiveFlexo: {
                      ...allCommon?.mfgLiveFlexo,
                      mfgLiveBtoBPrinting: {
                        ...allCommon?.mfgLiveFlexo.mfgLiveBtoBPrinting,
                        mfgLiveBtoBFilter: event?.filters,
                      },
                    },
                  }),
                );
              }}
              emptyMessage={mfgLiveOperatorLoading && <Skeleton count={9} />}
            >
              <Column
                field="sr_no"
                header="Sr No"
                sortable
                filter={tabelFilterToggle}
                // body={customNoColumn}
              ></Column>
              <Column
                field="due_date"
                header="Date"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="days"
                header="Day"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="main_image"
                header="Image"
                body={imageTemplate}
              ></Column>
              <Column
                field="design"
                header="Design Name"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="background_design_name"
                header="Background Design"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="size"
                header="Size"
                sortable
                filter={tabelFilterToggle}
                body={mainTableSizeTemplate}
              ></Column>
              <Column
                field="roll_width"
                header="Roll Width"
                sortable
                filter={tabelFilterToggle}
                body={mainTableRollWidthTemplate}
              ></Column>
              <Column
                field="gsm"
                header="GSM"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="bag_type"
                header="Bag Type"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              <Column
                field="stereo"
                header="Stereo"
                sortable
                filter={tabelFilterToggle}
                body={e => bedgeBodyTemplate(e.old_stereo)}
              ></Column>
              <Column
                field="addBags"
                header="Add Bags"
                filter={tabelFilterToggle}
                body={bagTemplate}
              ></Column>
              <Column
                field="created_by_name"
                header="Operator Name"
                sortable
                filter={tabelFilterToggle}
              ></Column>
              {/* For Photo Capture */}
              {isMobileDevice() && (
                <Column
                  field="capture"
                  header="Capture"
                  sortable
                  filter={tabelFilterToggle}
                  body={captureTemplate}
                ></Column>
              )}
              <Column
                field="comment"
                header="Comment"
                filter={tabelFilterToggle}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={listMFGProcess}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={countMFGfProcess}
            />
          </div>
        </div>
        <Dialog
          header={`${isEdit ? 'Update' : 'Save'}  Personal Filters`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setSaveFilterModal(false)}
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
          header="SCREEN PRINTING (BAG TO BAG)"
          visible={screenTableModal}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => {
            dispatch(setViewProductDetailData({}));
            setScreenTableModal(false);
            setSelectedProductFromSuggested({});
            dispatch(setBagToBagData(intialPrintingData));
          }}
        >
          <div className="printing_content_wrap">
            <div className="printing_content_top">
              <Row>
                <Col lg={3} md={4}>
                  <h5 className="mb-3">Is Printed?</h5>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient1"
                        name="complete"
                        value={bagToBagData?.completed}
                        onChange={e => {
                          dispatch(
                            setBagToBagData({
                              ...bagToBagData,
                              completed: e.target.checked ? 1 : 0,
                              partial: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={bagToBagData?.completed === 1}
                      />
                      <label htmlFor="ingredient1" className="mx-2">
                        Complete
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        inputId="ingredient2"
                        name="partial"
                        value={bagToBagData?.partial}
                        onChange={e => {
                          dispatch(
                            setBagToBagData({
                              ...bagToBagData,
                              partial: e.target.checked ? 1 : 0,
                              completed: e.target.checked ? 0 : 1,
                            }),
                          );
                        }}
                        checked={bagToBagData?.partial === 1}
                      />
                      <label htmlFor="ingredient2" className="mx-2">
                        Partial
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg={9} md={8}>
                  <div className="form_group mb-3">
                    <ReactSelectSingle
                      filter
                      name="suggested_product_id"
                      value={bagToBagData?.suggested_product_id || ''}
                      options={suggestedProductList}
                      onChange={e => {
                        dispatch(
                          setBagToBagData({
                            ...bagToBagData,
                            suggested_product_id: e.target.value,
                            warehouse: '',
                            in_stock: '',
                          }),
                        );
                        let data = suggestedProductList?.filter(
                          d => d?._id === e.target.value,
                        );
                        let updatedData = data?.map(i => {
                          return {
                            ...i,
                            warehouse: i?.warehouse?.map(d => {
                              return {
                                ...d,
                                label: d?.name,
                                value: d?._id,
                              };
                            }),
                          };
                        });
                        setSelectedProductFromSuggested(updatedData[0]);
                      }}
                      placeholder="Select Product"
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className="printing_content_middle">
              <Row className="g-3">
                <Col md={5}>
                  <div className="product_details_left border rounded-3 bg_white p-3 h-100 mb-3">
                    <div className="product_detail_wrap">
                      <h3 className="mb-2">Product Details</h3>
                      <img
                        src={
                          viewProductDetailData?.main_image
                            ? viewProductDetailData?.main_image
                            : DummyImage
                        }
                        alt="ProductImg"
                        className="w-100"
                      />
                      <h4>Bag Size</h4>
                      <h5>{viewProductDetailData?.product_code}</h5>
                      <ul className="rounded_ul">
                        <li>
                          Bag Type: {viewProductDetailData?.bag_type_name}
                        </li>
                        <li>
                          Bag Printing: {viewProductDetailData.print_type_name}
                        </li>
                        <li>
                          Design Name: {viewProductDetailData?.design_name}
                        </li>
                        <li>
                          Bag Weight: {viewProductDetailData?.bag_weight}{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col md={7}>
                  <div className="screen_printing_right">
                    <div className="bag_box_wrap">
                      <div className="bag_type_box">
                        <div className="bag_img">
                          <img
                            src={
                              selectedProductFromSuggested?.main_image
                                ? selectedProductFromSuggested?.main_image
                                : DummyImage
                            }
                            alt="BagIcon"
                          ></img>
                        </div>
                        <div className="bag_title_wrap">
                          <h5 className="m-0">
                            {selectedProductFromSuggested?.design_name
                              ? selectedProductFromSuggested?.design_name
                              : 'Selected Product Image'}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="stock_list_Wrap">
                      <ul>
                        <li>
                          <label>Warehouse</label>
                          <ReactSelectSingle
                            filter
                            name="suggested_product_id"
                            value={bagToBagData?.warehouse || ''}
                            options={selectedProductFromSuggested?.warehouse}
                            onChange={e => {
                              let data =
                                selectedProductFromSuggested?.warehouse?.filter(
                                  d => d?._id === e.target.value,
                                );
                              dispatch(
                                setBagToBagData({
                                  ...bagToBagData,
                                  warehouse: e.target.value,
                                  in_stock: data[0]?.qty,
                                }),
                              );
                            }}
                            placeholder="Select Product"
                          />
                        </li>
                        <li>
                          <label>In Stock</label>
                          <div className="input_wrap">
                            <InputText
                              placeholder="In Stock"
                              value={bagToBagData?.in_stock}
                              disabled
                            />
                          </div>
                        </li>
                        <li>
                          <label>Qty used for this job</label>
                          <div className="input_wrap">
                            <InputText
                              placeholder="Qty used for this job"
                              type="number"
                              name="bagToBagData.qty_used"
                              value={bagToBagData.qty_used}
                              onChange={e => {
                                dispatch(
                                  setBagToBagData({
                                    ...bagToBagData,
                                    qty_used: Number(e.target.value),
                                  }),
                                );
                              }}
                            />
                          </div>
                        </li>
                        <li>
                          <label>Wastage</label>
                          <div className="input_wrap">
                            <InputText
                              placeholder="Wastage"
                              type="number"
                              value={bagToBagData.wastage}
                              onChange={e => {
                                dispatch(
                                  setBagToBagData({
                                    ...bagToBagData,
                                    wastage: Number(e.target.value),
                                  }),
                                );
                              }}
                            />
                          </div>
                        </li>
                        <li>
                          <label>Qty of bags printed</label>
                          <div className="input_wrap">
                            <InputText
                              placeholder="Qty of bags printed"
                              type="number"
                              value={bagToBagData.bag_printed}
                              onChange={e => {
                                dispatch(
                                  setBagToBagData({
                                    ...bagToBagData,
                                    bag_printed: Number(e.target.value),
                                  }),
                                );
                              }}
                            />
                          </div>
                        </li>
                        <li>
                          <label>Pending qty of bags to print</label>
                          <div className="input_wrap">
                            <InputText
                              placeholder="Pending qty of bags"
                              type="number"
                              value={bagToBagData.pending_bag}
                              onChange={e => {
                                dispatch(
                                  setBagToBagData({
                                    ...bagToBagData,
                                    pending_bag: e.target.value,
                                  }),
                                );
                              }}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                className="btn_border me-2"
                onClick={() => {
                  setScreenTableModal(false);
                  dispatch(setViewProductDetailData({}));
                  dispatch(setBagToBagData(intialPrintingData));
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary"
                onClick={async e => {
                  let data = {
                    ...bagToBagData,
                    pending_bag: Number(bagToBagData?.pending_bag),
                  };
                  let res = await dispatch(updatePrintStatus(data));
                  if (res) {
                    dispatch(
                      MFGfProcessLists({
                        ...mfgListBToBParam,
                        print_technology: print_technology,
                        print: print,
                        machine: machine,
                      }),
                    );
                    setScreenTableModal(false);
                    dispatch(setViewProductDetailData({}));
                    dispatch(setBagToBagData(intialPrintingData));
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Dialog>

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
      </div>

      {/* For Photo Capture */}
      <Dialog
        header="Capture"
        visible={imgCaptureModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => {
          setImgCaptureModal(false);
        }}
      >
        <ImageCapture whatsappData={whatsappData} />
      </Dialog>
    </>
  );
}
