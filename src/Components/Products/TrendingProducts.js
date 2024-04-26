import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import ExportIcon from '../../Assets/Images/export.svg';
import { InputText } from 'primereact/inputtext';
import FilterIcon from '../../Assets/Images/filter.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProduct,
  getExportTrendingProductFile,
  getTrendingProductList,
} from 'Services/Products/TrendingProductService';
import CustomPaginator from 'Components/Common/CustomPaginator';
import FilterOverlay from 'Components/Common/FilterOverlay';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import {
  addFilter,
  deleteFilter,
  getListFilter,
  updateFilter,
} from 'Services/partiesService';
import {
  getActiveCustomerPartyList,
  getActiveFabricColorList,
  getActiveLaminationTypeList,
  getActivePrintTypeList,
} from 'Services/Settings/MiscMasterService';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { Button } from 'primereact/button';

const filterDetails = [
  { label: 'Design Name', value: 'design_name', type: 'inputBox' },
  { label: 'Height', value: 'height', type: 'inputBox' },
  { label: 'Width', value: 'width', type: 'inputBox' },
  { label: 'Gusset', value: 'gusset', type: 'inputBox' },
  { label: 'GSM', value: 'gsm', type: 'inputBox' },
  { label: 'Printing Type', value: 'print_type', type: 'dropDown' },
  { label: 'Lamination Type', value: 'lamination_type_name', type: 'dropDown' },
  { label: 'Colour', value: 'fabric_color', type: 'dropDown' },
  { label: 'Customer Group', value: 'customer_group', type: 'dropDown' },
  { label: 'In Stock', value: 'in_stock', type: 'inputBox' },
  { label: 'Pending Orders', value: 'pending_order', type: 'inputBox' },
  { label: '1 Month', value: 'one_month', type: 'inputBox' },
  { label: '3 Month', value: 'three_month', type: 'inputBox' },
  { label: '6 Month', value: 'six_month', type: 'inputBox' },
  { label: '12 Month', value: 'twelve_month', type: 'inputBox' },
];

const TrendingProducts = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const op = useRef(null);
  const { is_export_access } = hasAccess;

  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const { listFilter } = useSelector(({ parties }) => parties);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const {
    trendingProductExportLoading,
    trendingProductLoading,
    trendingProductList,
    trendingProductCount,
  } = useSelector(({ trendingProduct }) => trendingProduct);
  const {
    miscMasterLoading,
    activeLaminationTypeList,
    activePrintTypeList,
    activeCustomerGroupList,
    activeFabricColorList,
  } = useSelector(({ miscMaster }) => miscMaster);

  const { filterToggle, searchQuery, trendingProductfilter } =
    allCommon?.trendingProduct;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.trendingProduct;

  const laminationOptions = useMemo(() => {
    const updatedLaminationData = activeLaminationTypeList?.map(item => {
      return { label: item?.label, value: item.label };
    });
    return [
      ...updatedLaminationData,
      { label: 'Non Laminated', value: 'Non Laminated' },
    ];
  }, [activeLaminationTypeList]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     dispatch(
  //       getTrendingProductList(pageLimit, currentPage, searchQuery, applied),
  //     );
  //   }, 700);
  //   return () => clearTimeout(getData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, pageLimit, applied]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'trendingProduct',
      }),
    );
    dispatch(
      getTrendingProductList(pageLimit, currentPage, searchQuery, applied),
    );
    dispatch(getActiveLaminationTypeList());
    dispatch(getActivePrintTypeList());
    dispatch(getActiveCustomerPartyList());
    dispatch(getActiveFabricColorList());
  }, [applied, currentPage, dispatch, pageLimit, searchQuery]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSaveFilter = async () => {
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
        module_name: 'trendingProduct',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'trendingProduct',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }

    if (res) {
      // dispatch(getTrendingProductList(pageLimit, 1, searchQuery, applied));
      dispatch(
        getListFilter({
          module_name: 'trendingProduct',
        }),
      );
    }

    // dispatch(
    //   setAllFilters({
    //     ...allFilters,
    //     trendingProduct: { ...allFilters?.trendingProduct, currentPage: 1 },
    //   }),
    // );
    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
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
          trendingProduct: {
            ...allFilters?.trendingProduct,
            currentPage: pageIndex,
          },
        }),
      );

      dispatch(
        getTrendingProductList(pageLimit, pageIndex, searchQuery, applied),
      );
    },
    [currentPage, dispatch, allFilters, pageLimit, searchQuery, applied],
  );

  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          trendingProduct: {
            ...allFilters?.trendingProduct,
            currentPage: updatedCurrentPage,
            pageLimit: page,
          },
        }),
      );
      dispatch(
        getTrendingProductList(page, updatedCurrentPage, searchQuery, applied),
      );
    },
    [allFilters, applied, dispatch, searchQuery],
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
      fabric_color: activeFabricColorList,
      customer_group: activeCustomerGroupList,
      lamination_type_name: laminationOptions,
      print_type: activePrintTypeList,
    };
  }, [
    activeCustomerGroupList,
    activeFabricColorList,
    laminationOptions,
    activePrintTypeList,
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

      dispatch(
        setAllFilters({
          ...allFilters,
          trendingProduct: {
            ...allFilters?.trendingProduct,
            filters: updatedFilters,
          },
        }),
      );
    },
    [filters, dispatch, allFilters],
  );

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        trendingProduct: {
          ...allFilters?.trendingProduct,
          filters: [
            ...allFilters?.trendingProduct?.filters,
            { filter: '', value: '' },
          ],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updateFilters =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.trendingProduct?.applied)?.length > 0;

      if (updateFilters) {
        dispatch(
          getTrendingProductList(pageLimit, currentPage, searchQuery, {}),
        );
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          trendingProduct: {
            ...allFilters?.trendingProduct,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.trendingProduct?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.trendingProduct.selectedItemIndex !== ''
                ? ''
                : allFilters.trendingProduct.selectedItemIndex,
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
          trendingProduct: {
            ...allFilters?.trendingProduct,
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
          module_name: 'trendingProduct',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            trendingProduct: {
              ...allFilters?.trendingProduct,
              currentPage: 1,
              selectedItemIndex: '',
              filters: [],
              applied: {},
            },
          }),
        );
        dispatch(
          getListFilter({
            module_name: 'trendingProduct',
          }),
        );
        dispatch(getTrendingProductList(pageLimit, 1, searchQuery, {}));
        setNameFilter('');
      }
    },
    [dispatch, pageLimit, searchQuery, allFilters],
  );

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];
    const filter_fields = [
      'width',
      'height',
      'one_month',
      'gusset',
      'in_stock',
      'pending_order',
      'three_month',
      'six_month',
      'twelve_month',
      'gsm',
    ];

    filters.forEach(item => {
      if (item.value) {
        filterArray.push(item);
      }
    });

    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = {
          ...filterObj,
          ...{
            [item.filter]: filter_fields.includes(item.filter)
              ? Number(item.value)
              : item.value,
          },
        };
      });

      dispatch(
        getTrendingProductList(pageLimit, currentPage, searchQuery, filterObj),
      );

      dispatch(
        setAllFilters({
          ...allFilters,
          trendingProduct: {
            ...allFilters?.trendingProduct,
            applied: filterObj,
          },
        }),
      );
    }
  }, [filters, dispatch, pageLimit, currentPage, searchQuery, allFilters]);

  const clearAppliedFilter = useCallback(() => {
    if (Object.keys(applied)?.length > 0) {
      dispatch(getTrendingProductList(pageLimit, currentPage, searchQuery, {}));

      dispatch(
        setAllFilters({
          ...allFilters,
          trendingProduct: {
            ...allFilters?.trendingProduct,
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
          trendingProduct: {
            ...allFilters?.trendingProduct,
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
  }, [
    applied,
    isEdit,
    dispatch,
    pageLimit,
    currentPage,
    searchQuery,
    allFilters,
  ]);

  const handleDelete = useCallback(
    async product_id => {
      if (product_id) {
        const result = await dispatch(deleteProduct(product_id));
        if (result) {
          setDeletePopup(false);
          dispatch(
            getTrendingProductList(
              pageLimit,
              currentPage,
              searchQuery,
              applied,
            ),
          );
        }
      }
    },
    [dispatch, pageLimit, currentPage, searchQuery, applied],
  );
  const onExport = useCallback(
    async key => {
      dispatch(getExportTrendingProductFile(key));
    },
    [dispatch],
  );

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        trendingProduct: {
          ...allFilters?.trendingProduct,
          currentPage: 1,
        },
      }),
    );
    dispatch(
      getTrendingProductList(pageLimit, currentPage, e.target.value, applied),
    );
  };

  const debouncehandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {(trendingProductExportLoading || trendingProductLoading) && <Loader />} */}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Trending Products</h3>
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
                              trendingProduct: {
                                ...allCommon?.trendingProduct,
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
                      <img src={FilterIcon} alt="" /> Filter
                    </Button>
                  </li>
                  <li>
                    <Dropdown className="dropdown_common export_dropdown position-static">
                      <OverlayTrigger
                        overlay={props => <Tooltip {...props}>Export</Tooltip>}
                        placement="bottom"
                      >
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="btn_border icon_btn"
                          disabled={is_export_access ? false : true}
                        >
                          <img src={ExportIcon} alt="" />
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
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter tab_wrapper_table">
          <button
            type="button"
            className="table_filter_btn"
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  trendingProduct: {
                    ...allCommon?.trendingProduct,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            sortMode="multiple"
            value={trendingProductList}
            filterDisplay="row"
            selectionMode="false"
            dataKey="product_detail._id"
            filters={trendingProductfilter}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  trendingProduct: {
                    ...allCommon?.trendingProduct,
                    trendingProductfilter: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={trendingProductLoading && <Skeleton count={10} />}
          >
            <Column
              field="product_detail.design_name"
              header="Design Name"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="product_detail.size_gsm"
              header="Size"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="product_detail.gsm"
              header="GSM"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="product_detail.print_type_name"
              header="Printing Type"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="lamination_type"
              header="Lamination Type"
              sortable
              filter={filterToggle}
              className="column_group with_before specifications"
            />
            <Column
              field="product_detail.fabric_color_name"
              header="Colour"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="product_detail.customer_group_name"
              header="Customer Group"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="in_stock"
              header="In Stock"
              sortable
              filter={filterToggle}
              className="column_group border_left"
            />
            <Column
              field="pending_order"
              header="Pending Orders"
              sortable
              filter={filterToggle}
              className="column_group border_right"
            />
            <Column
              field="one_month"
              header="1 month"
              sortable
              filter={filterToggle}
              className="column_group border_left"
            />
            <Column
              field="three_month"
              header="3 month"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="six_month"
              header="6 month"
              sortable
              filter={filterToggle}
              className="column_group with_before bags_soldin"
            />
            <Column
              field="twelve_month"
              header="12 month"
              sortable
              filter={filterToggle}
              className="column_group"
            />
          </DataTable>
          <CustomPaginator
            dataList={trendingProductList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={trendingProductCount}
          />
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
};
export default memo(TrendingProducts);
