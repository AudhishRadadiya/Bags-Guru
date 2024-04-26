import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import PlusIcon from '../../Assets/Images/plus.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ActionBtn from '../../Assets/Images/action.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { Tag } from 'primereact/tag';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import {
  deleteRawItem,
  getActiveItemGroupList,
  getActiveUnitList,
  getRawItemsList,
} from 'Services/Settings/MiscMasterService';
import FilterOverlay from 'Components/Common/FilterOverlay';
import {
  attributes,
  setIsGetInitialValuesItem,
  setSelectedRawItem,
} from 'Store/Reducers/Settings/RawItemSlice';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { statusObj } from 'Helper/Common';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

const filterDetails = [
  { label: 'Name', value: 'name', type: 'inputBox' },
  { label: 'Group', value: 'group', type: 'dropDown' },
  { label: 'Primary Unit', value: 'primary_unit', type: 'dropDown' },
  { label: 'Secondary Unit', value: 'secondary_unit', type: 'dropDown' },
  { label: 'Status', value: 'is_active', type: 'dropDown' },
];

const content = (data, index, handleFilterEdit, handleFilterDelete) => {
  return (
    <>
      <span className="edit_icon" onClick={e => handleFilterEdit(data, index)}>
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

const getSeverity = status => {
  switch (status) {
    case 'Inactive':
      return 'danger';
    case 'Active':
      return 'success';
    case 'renewal':
      return null;
    default:
      return;
  }
};

const statusBodyTemplate = rowData => {
  return (
    <Tag
      value={rowData?.status}
      severity={getSeverity(rowData?.is_active ? 'Active' : 'Inactive')}
    />
  );
};

export default function Items({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const op = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [searchQuery, setSearchQuery] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageLimit, setPageLimit] = useState(10);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  // const [filters, setFilters] = useState([]);
  // const [applyFilter, setapplyFilter] = useState({});
  // const [filterToggle, setFilterToggle] = useState(false);

  const {
    rawItemLoading,
    rawItemsList,
    rawItemsCount,
    isGetInitialValuesItem,
  } = useSelector(({ rawitem }) => rawitem);

  const { listFilter, partiesLoading } = useSelector(({ parties }) => parties);
  const {
    loading: settingLoading,
    activeUnitList,
    activeItemGroupList,
    settingsCRUDLoading,
  } = useSelector(({ settings }) => settings);

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, itemFilters, searchQuery } =
    allCommon?.itemRawMaterials;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.itemRawMaterials;

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'item',
      }),
    );
    dispatch(getActiveItemGroupList());
    dispatch(getActiveUnitList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      dispatch(getRawItemsList(pageLimit, currentPage, searchQuery, applied));
    }, 700);
    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit, applied]);

  const handleSaveFilter = useCallback(async () => {
    setSaveFilterModal(false);

    const filterConvertToString = filters?.map(item => {
      if (Array.isArray(item?.value)) {
        let updated = item?.value?.join(', ');
        return { ...item, value: updated };
      } else {
        return item;
      }
    });

    let res;
    if (isEdit) {
      let editPayload = {
        filter_id: filterId,
        module_name: 'item',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'item',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      loadRequiredData();
      dispatch(getRawItemsList(pageLimit, 1, searchQuery, applied));
      dispatch(
        setAllFilters({
          ...allFilters,
          itemRawMaterials: { ...allFilters?.itemRawMaterials, currentPage: 1 },
        }),
      );
    }
    dispatch(
      setAllFilters({
        ...allFilters,
        itemRawMaterials: { ...allFilters?.itemRawMaterials, currentPage: 1 },
      }),
    );
    // setFilters([]);
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [
    dispatch,
    filterId,
    filters,
    isEdit,
    loadRequiredData,
    nameFilter,
    applied,
    allFilters,
    pageLimit,
    searchQuery,
  ]);

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
      group: activeItemGroupList[0]?.items,
      primary_unit: activeUnitList[0]?.items,
      secondary_unit: activeUnitList[0]?.items,
      is_active: statusObj,
    };
  }, [activeItemGroupList, activeUnitList]);

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
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            filters: updatedFilters,
          },
        }),
      );
    },
    [allFilters, dispatch, filters],
  );

  const handleAddFilter = useCallback(() => {
    // setFilters([...filters, { filter: '', value: '' }]);
    dispatch(
      setAllFilters({
        ...allFilters,
        itemRawMaterials: {
          ...allFilters?.itemRawMaterials,
          filters: [
            ...allFilters?.itemRawMaterials?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  }, [dispatch, allFilters]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);
      // setFilters(updatedFilters);
      dispatch(
        setAllFilters({
          ...allFilters,
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.itemRawMaterials?.applied)?.length >
                0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.itemRawMaterials.selectedItemIndex !== ''
                ? ''
                : allFilters.itemRawMaterials.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
      // if (updatedFilters?.length === 0) setapplyFilter([]);
    },
    [filters, dispatch, allFilters, isEdit],
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
      // setFilters(data?.filter_list);

      const updatedFilterData = {
        ...data,
        filter_list: data?.filter_list?.map(item => {
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
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        }),
      );
      setIsEdit(true);
      setNameFilter(
        data?.filter_name === 'role_name' ? 'role' : data?.filter_name,
      );

      setFilterId(data?._id);
    },
    [allFilters, dispatch],
  );

  const handleFilterDelete = useCallback(
    async (e, data, index) => {
      const res = await dispatch(
        deleteFilter({
          filter_id: data?._id,
          module_name: 'item',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            itemRawMaterials: {
              ...allFilters?.itemRawMaterials,
              currentPage: 1,
              filters: [],
              selectedItemIndex: '',
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'item',
          }),
        );
        dispatch(getRawItemsList(pageLimit, 1, searchQuery, applied));
        setNameFilter('');
      }
    },
    [dispatch, pageLimit, allFilters, searchQuery, applied],
  );

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
      // setapplyFilter(filterObj);
      dispatch(
        setAllFilters({
          ...allFilters,
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            applied: filterObj,
          },
        }),
      );
    }
  }, [filters, allFilters, dispatch]);

  const clearAppliedFilter = useCallback(
    index => {
      // setapplyFilter({});
      // setFilters([]);
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          setAllFilters({
            ...allFilters,
            itemRawMaterials: {
              ...allFilters?.itemRawMaterials,
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
            itemRawMaterials: {
              ...allFilters?.itemRawMaterials,
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
    [allFilters, dispatch, isEdit, applied],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      // setCurrentPage(pageIndex);
      dispatch(
        setAllFilters({
          ...allFilters,
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, dispatch, allFilters],
  );

  const onPageRowsChange = useCallback(
    page => {
      // setPageLimit(page);
      // setCurrentPage(page === 0 ? 0 : 1);
      dispatch(
        setAllFilters({
          ...allFilters,
          itemRawMaterials: {
            ...allFilters?.itemRawMaterials,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const itemNameTemplate = data => {
    return (
      <span
        onClick={() => {
          // dispatch(
          //   setIsGetInitialValuesItem({
          //     ...isGetInitialValuesItem,
          //     view: false,
          //   }),
          // );
          navigate(`/item-details/${data._id}`, {
            state: { isView: true },
          });
        }}
      >
        {data?.name}
      </span>
    );
  };

  const handleEdit = useCallback(
    item_id => {
      let item = { ...rawItemsList?.find(x => x?._id === item_id) };
      if (item) {
        if (item.item_attribute?.length < 1) item.item_attribute = attributes;
        dispatch(setSelectedRawItem(item));
        navigate(`/update-item/${item_id}`);
        dispatch(
          setIsGetInitialValuesItem({
            ...isGetInitialValuesItem,
            update: false,
          }),
        );
      }
    },
    [dispatch, navigate, rawItemsList],
  );

  const handleDelete = useCallback(
    async item_id => {
      if (item_id) {
        const result = await dispatch(deleteRawItem(item_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getRawItemsList(pageLimit, 1, searchQuery, applied));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageLimit],
  );

  const itemAction = item => {
    return !item?.is_default ? (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item onClick={() => handleEdit(item?._id)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeletePopup(item?._id);
                }}
              >
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    ) : (
      ''
    );
  };

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        itemRawMaterials: {
          ...allFilters?.itemRawMaterials,
          currentPage: 1,
        },
      }),
    );
    dispatch(getRawItemsList(pageLimit, currentPage, e.target.value, applied));
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {(settingLoading || settingsCRUDLoading) && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Items</h3>
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
                          className="input_wrap small search_wrap"
                          onChange={e => {
                            debounceHandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                itemRawMaterials: {
                                  ...allCommon?.itemRawMaterials,
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
                        <img src={FilterIcon} alt="" /> Filter
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(
                              setIsGetInitialValuesItem({
                                ...isGetInitialValuesItem,
                                add: false,
                              }),
                            );
                            navigate('/add-items');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" />
                        Add New Item
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
            <button
              type="button"
              className="table_filter_btn"
              // onClick={() => setFilterToggle(!filterToggle)}
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    itemRawMaterials: {
                      ...allCommon?.itemRawMaterials,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={rawItemsList}
              sortMode="multiple"
              sortField="name"
              sortOrder={1}
              dataKey="_id"
              filterDisplay="row"
              filters={itemFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    itemRawMaterials: {
                      ...allCommon?.itemRawMaterials,
                      itemFilters: event?.filters,
                    },
                  }),
                );
              }}
              emptyMessage={
                (settingLoading ||
                  settingsCRUDLoading ||
                  rawItemLoading ||
                  partiesLoading) && <Skeleton count={10} />
              }
            >
              <Column
                field="name"
                header="Item Name"
                sortable
                filter={filterToggle}
                className="view_detail"
                body={itemNameTemplate}
              ></Column>
              <Column
                field="group_name"
                header="Item Group "
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="primary_unit_name"
                header="Primary Unit Of Measure"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="secondary_unit_name"
                header="Secondary Unit Of Measure"
                sortable
                filter={filterToggle}
              ></Column>

              <Column
                field="status"
                header="Active"
                sortable
                filter={filterToggle}
                body={statusBodyTemplate}
              ></Column>
              <Column field="action" header="Action" body={itemAction}></Column>
            </DataTable>
            <CustomPaginator
              dataList={rawItemsList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={rawItemsCount}
            />
          </div>
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
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
}
