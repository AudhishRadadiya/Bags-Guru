import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import { Button } from 'primereact/button';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import {
  deleteBag,
  getBagList,
  getExportBagFile,
} from 'Services/Products/BagService';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  setBagDetailForDuplicate,
  setBagDetailForEdit,
  setIsGetInitialValuesForDuplicateBag,
  setIsGetInitialValuesForEditBag,
  setSelectedBagForDuplicate,
  setSelectedBagForEdit,
} from 'Store/Reducers/Products/BagsSlice';
import {
  getActiveBagCapacityList,
  getActiveBagTypeList,
  getActiveFormList,
  getActiveLaminationTypeList,
  getActiveMaterialList,
  getActivePrintTechnologyList,
  getActivePrintTypeList,
} from 'Services/Settings/MiscMasterService';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PlusIcon from '../../Assets/Images/plus.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import FilterOverlay from 'Components/Common/FilterOverlay';
import DuplicateIcon from '../../Assets/Images/duplicate.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

// Created for filter list:
const filterDetails = [
  { label: 'Material', value: 'material', type: 'dropDown' },
  { label: 'Form', value: 'form', type: 'dropDown' },
  { label: 'Bag Type', value: 'bag_type', type: 'dropDown' },
  { label: 'Printing Type', value: 'print_type', type: 'dropDown' },
  { label: 'Printing Technology', value: 'print_technology', type: 'dropDown' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Repeat Length', value: 'repeatlength', type: 'inputBox' },
  { label: 'Roll Width', value: 'rollwidth', type: 'inputBox' },
  { label: 'Circum', value: 'circum', type: 'inputBox' },
  { label: 'Lamination Type', value: 'lamination_typename', type: 'dropDown' },
];

export const getSeverity = status => {
  switch (status) {
    case false:
      return 'danger';
    case true:
      return 'success';
    default:
      return;
  }
};

export const getBagSeverity = lamination => {
  switch (lamination) {
    case 'glossy':
      return 'glossy';
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

export default function Bags(props) {
  const op = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hasAccess } = props;
  const {
    is_create_access,
    is_edit_access,
    is_export_access,
    is_delete_access,
  } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { bagLoading, bagList, bagCount } = useSelector(({ bag }) => bag);
  const {
    activeMaterialList,
    activeFormList,
    activeBagTypeList,
    activeLaminationTypeList,
    activePrintTypeList,
    activePrintTechnologyList,
  } = useSelector(({ miscMaster }) => miscMaster);

  const { filterToggle, bagFilters, searchQuery } = allCommon?.bags;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.bags;

  // useEffect(() => {
  //   dispatch(getBagList(pageLimit, currentPage, searchQuery, applied));
  // }, [currentPage, pageLimit, searchQuery, applied, dispatch]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'bag',
      }),
    );
    dispatch(getBagList(pageLimit, currentPage, searchQuery, applied));
    dispatch(getActiveMaterialList());
    dispatch(getActiveFormList());
    dispatch(getActiveBagTypeList());
    dispatch(getActiveLaminationTypeList());
    dispatch(getActivePrintTypeList());
    dispatch(getActivePrintTechnologyList());
    dispatch(getActiveBagCapacityList());
  }, [applied, currentPage, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

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
      form: activeFormList,
      // is_laminated: commonOption,
      bag_type: activeBagTypeList,
      material: activeMaterialList,
      print_type: activePrintTypeList,
      lamination_typename: laminationOptions,
      print_technology: activePrintTechnologyList,
    };
  }, [
    activeFormList,
    activeBagTypeList,
    activeMaterialList,
    activePrintTypeList,
    laminationOptions,
    activePrintTechnologyList,
  ]);

  const selectedFilters = useMemo(() => {
    let filter = filters?.map(filter => {
      let filterDetail = filterDetails?.find(
        detail => detail.value === filter.filter,
      );
      return filterDetail ? filterDetail : null;
    });
    return filter;
  }, [filters]);

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

      dispatch(
        setAllFilters({
          ...allFilters,
          bags: { ...allFilters?.bags, filters: updatedFilters },
        }),
      );
    },
    [allFilters, dispatch, filters],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        bags: {
          ...allFilters?.bags,
          filters: [...allFilters?.bags?.filters, { filter: '', value: '' }],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const checkAppliedFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.bags?.applied)?.length > 0;

      if (checkAppliedFilters) {
        dispatch(getBagList(pageLimit, currentPage, searchQuery, {}));
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          bags: {
            ...allFilters?.bags,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.bags?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.bags.selectedItemIndex !== ''
                ? ''
                : allFilters.bags.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [
      filters,
      allFilters,
      dispatch,
      isEdit,
      pageLimit,
      currentPage,
      searchQuery,
    ],
  );

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
          bags: {
            ...allFilters?.bags,
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
          module_name: 'bag',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            bags: {
              ...allFilters?.bags,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'bag',
          }),
        );
        dispatch(getBagList(pageLimit, 1, searchQuery, {}));
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
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
              item.filter === 'gsm'
                ? Number(item.value)
                : item.value,
          },
        };
      });
      dispatch(
        setAllFilters({
          ...allFilters,
          bags: { ...allFilters?.bags, applied: filterObj },
        }),
      );
      dispatch(getBagList(pageLimit, currentPage, searchQuery, filterObj));
    }
  }, [filters, dispatch, allFilters, pageLimit, currentPage, searchQuery]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(getBagList(pageLimit, currentPage, searchQuery, {}));
        dispatch(
          setAllFilters({
            ...allFilters,
            bags: {
              ...allFilters?.bags,
              applied: {},
              filters: [],
              selectedItemIndex: '',
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            bags: {
              ...allFilters?.bags,
              filters: [],
              selectedItemIndex: '',
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
      pageLimit,
      currentPage,
      searchQuery,
      allFilters,
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
        module_name: 'bag',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'bag',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      dispatch(
        getListFilter({
          module_name: 'bag',
        }),
      );
      setSaveFilterModal(false);
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const onExport = useCallback(
    async key => {
      await dispatch(getExportBagFile(key));
    },
    [dispatch],
  );

  const isActiveDetail = row => {
    return (
      <Tag
        value={row?.is_active === true ? 'Yes' : 'No'}
        severity={getSeverity(row?.is_active)}
      />
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
          bags: { ...allFilters?.bags, currentPage: pageIndex },
        }),
      );
      dispatch(getBagList(pageLimit, pageIndex, searchQuery, applied));
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updateCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          bags: {
            ...allFilters?.bags,
            currentPage: updateCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(getBagList(page, updateCurrentPage, searchQuery, applied));
    },
    [dispatch, allFilters, searchQuery, applied],
  );

  const handleEdit = useCallback(
    async bag_id => {
      dispatch(setBagDetailForEdit({}));
      dispatch(setSelectedBagForEdit({}));
      dispatch(setIsGetInitialValuesForEditBag(false));
      if (bag_id) navigate(`/update-bag/${bag_id}`);
    },
    [dispatch, navigate],
  );

  const handleDuplicate = useCallback(
    bag_id => {
      dispatch(setBagDetailForDuplicate({}));
      dispatch(setSelectedBagForDuplicate({}));
      dispatch(setIsGetInitialValuesForDuplicateBag(false));
      if (bag_id) navigate(`/duplicate-bag/${bag_id}`);
    },
    [dispatch, navigate],
  );

  const handleDelete = useCallback(
    async bag_id => {
      if (bag_id) {
        const result = await dispatch(deleteBag(bag_id));
        if (result) {
          setDeletePopup(false);

          dispatch(getBagList(pageLimit, 1, ''));
          dispatch(
            setAllFilters({
              ...allFilters,
              bags: { ...allFilters?.bags, currentPage: 1 },
            }),
          );
        }
      }
    },
    [dispatch, pageLimit, allFilters],
  );

  const bagTagTemplate = (
    { bag_tag, lamination_type_name, print_technology_name, is_laminated, _id },
    navigate,
  ) => {
    return (
      <div
        className="tag_wrapper view_detail"
        onClick={() => {
          navigate(`/bag-details/${_id}`);
        }}
      >
        <span className="d-block">{bag_tag}</span>
        {is_laminated ? (
          lamination_type_name?.map((x, i) => {
            return (
              <Tag
                key={i}
                value={x?.code}
                severity={getBagSeverity(x?.name?.toLowerCase())}
                className="bagLamTag me-1"
              />
            );
          })
        ) : (
          <Tag value={'NL'} severity={2} className="bagLamTag me-1" />
        )}
        {print_technology_name?.map((x, i) => {
          return (
            <Tag
              key={i}
              value={x?.code}
              severity={2}
              className="bagLamTag me-1"
            />
          );
        })}
      </div>
    );
  };

  const laminationTemplate = item => {
    const lamination = [...(item?.lamination_type_name || [])]?.sort();
    return (
      <div>
        {lamination?.length > 0 ? (
          lamination?.map((value, i) => {
            const lamination_name = value?.name?.toLowerCase();
            return (
              <Tag
                key={i}
                value={value?.name}
                severity={getBagSeverity(lamination_name)}
                className="me-2"
              />
            );
          })
        ) : (
          <Tag
            value={'Non Laminated'}
            severity={getBagSeverity('Non Laminated')}
          />
        )}
      </div>
    );
  };

  const rollWidthTemplete = rowItem => {
    return (
      <span>
        {rowItem?.is_mm
          ? `${rowItem?.roll_width_mm} mm`
          : `${rowItem?.roll_width}”`}
      </span>
    );
  };

  const circumTemplete = rowItem => {
    return (
      <span>
        {rowItem?.is_mm
          ? `${rowItem?.cylinder_mm} mm`
          : `${rowItem?.cylinder}”`}
      </span>
    );
  };

  const repeatLengthTemplete = rowItem => {
    return (
      <span>
        {rowItem?.is_mm
          ? `${rowItem?.repeat_length_mm} mm`
          : `${rowItem?.repeat_length}”`}
      </span>
    );
  };

  const stockConsumptionAction = useCallback(
    bag => {
      return (
        <div className="edit_row">
          <Dropdown className="dropdown_common position-static">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="ection_btn"
              disabled={is_edit_access || is_delete_access ? false : true}
            >
              <img src={ActionBtn} alt="" width={24} height={24} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {is_edit_access && (
                <Dropdown.Item onClick={() => handleEdit(bag?._id)}>
                  <img src={EditIcon} alt="" /> Edit
                </Dropdown.Item>
              )}
              {is_delete_access && (
                <Dropdown.Item
                  onClick={() => {
                    setDeletePopup(bag?._id);
                  }}
                >
                  <img src={TrashIcon} alt="" width={20} height={20} /> Delete
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={() => handleDuplicate(bag?._id)}>
                <img src={DuplicateIcon} alt="" width={20} height={20} />{' '}
                Duplicate
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    },
    [handleDuplicate, handleEdit, is_edit_access, is_delete_access],
  );

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

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        bags: {
          ...allFilters?.bags,
          currentPage: 1,
        },
      }),
    );
    dispatch(getBagList(pageLimit, 1, e.target.value, applied));
  };

  const debouncehandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {(miscMasterLoading || bagExportLoading || bagLoading) && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Bag Details</h3>
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
                          value={searchQuery}
                          className="input_wrap small search_wrap"
                          onChange={e => {
                            debouncehandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                bags: {
                                  ...allCommon?.bags,
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
                        onClick={e => op.current?.toggle(e)}
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
                          <Dropdown.Item onClick={() => onExport('pdf')}>
                            PDF
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => onExport('xls')}>
                            XLS
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(setBagDetailForEdit({}));
                            dispatch(setSelectedBagForEdit({}));
                            dispatch(setIsGetInitialValuesForEditBag(false));
                            navigate('/add-bags');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" width={20} height={20} /> Add
                        Bag
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper cell_padding_medium is_filter bags_data_table">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() =>
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    bags: {
                      ...allCommon?.bags,
                      filterToggle: !filterToggle,
                    },
                  }),
                )
              }
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={bagList}
              filterDisplay="row"
              sortMode="multiple"
              sortField="name"
              sortOrder={1}
              filters={bagFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    bags: {
                      ...allCommon?.bags,
                      bagFilters: event?.filters,
                    },
                  }),
                );
              }}
              dataKey="_id"
              emptyMessage={bagLoading ? <Skeleton count={10} /> : false}
            >
              <Column
                field="bag_tag"
                header="Bag Tag"
                filter={filterToggle}
                sortable
                className="product_code_page"
                body={e => bagTagTemplate(e, navigate)}
              ></Column>
              <Column
                field="material_name"
                header="Material"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="form_name"
                header="Form"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="bag_type_name"
                header="Bag Type"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="lamination_types"
                header="Lamination Type"
                filter={filterToggle}
                body={laminationTemplate}
                sortable
              ></Column>
              <Column
                field="print_type_name"
                header="Printing Type"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="width"
                header="Width"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="height"
                header="Height"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="gusset"
                header="Gusset"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="gsm"
                header="GSM"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="roll_width"
                header="Roll Width"
                filter={filterToggle}
                sortable
                body={rollWidthTemplete}
              ></Column>
              <Column
                field="circum"
                header="Circum"
                filter={filterToggle}
                sortable
                body={circumTemplete}
              ></Column>
              <Column
                field="repeat_length"
                header="Repeat Length"
                filter={filterToggle}
                sortable
                body={repeatLengthTemplete}
              ></Column>
              <Column
                field="printing_techonogy_str"
                header="Printing Technology"
                sortable
                filter={filterToggle}
                className="product_code"
              ></Column>
              <Column
                field="is_active"
                header="Active"
                sortable
                body={isActiveDetail}
                filter={filterToggle}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={stockConsumptionAction}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={bagList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={bagCount}
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
              name="nameFilter"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
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
