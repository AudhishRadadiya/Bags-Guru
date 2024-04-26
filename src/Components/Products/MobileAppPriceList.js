import React, { useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Skeleton from 'react-loading-skeleton';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import {
  getExportProductRate,
  getProductRateList,
  saveProductRate,
} from 'Services/Products/ProductService';
import SearchIcon from '../../Assets/Images/search.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { setProductRateList } from 'Store/Reducers/Products/ProductSlice';

export const getMFGSeverity = lamination => {
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

const laminationTemplate = item => {
  const lamination = [...(item?.lamination_type_name || [])]?.sort();

  return (
    <div>
      {lamination?.length > 0 ? (
        lamination?.map(value => {
          const lamination_name = value?.name?.toLowerCase();
          return (
            <Tag
              value={value?.name}
              severity={getMFGSeverity(lamination_name)}
              className="me-2"
            />
          );
        })
      ) : (
        <Tag
          value={'Non Laminated'}
          severity={getMFGSeverity('Non Laminated')}
        />
      )}
    </div>
  );
};

const checkboxTemplate = (val, data, index, handleChange, key) => {
  return (
    <div className="form_group mb-0">
      <Checkbox
        onChange={e => handleChange(key, e.target.value, data, index)}
        value={val}
        checked={val}
      />
    </div>
  );
};

const imageTemplate = val => {
  return (
    <div className="image_zoom_Wrapper">
      <Image
        src={val || ''}
        zoomSrc={val || ''}
        alt="Image"
        preview
        downloadable
      />
    </div>
  );
};

const pcInputTemplate = (val, data, index, handleChange, key) => {
  return (
    <div className="form_group mb-0">
      <InputText
        placeholder="0"
        className="w-100"
        type="number"
        min={0}
        value={val?.pc_price}
        disabled={val?.is_kg_price === true}
        onChange={e => handleChange(key, e.target.value, data, index)}
      />
    </div>
  );
};

const kgInputTemplate = (val, data, index, handleChange, key) => {
  return (
    <div className="form_group mb-0">
      <InputText
        placeholder="0"
        type="number"
        min={0}
        className="w-100"
        value={val?.kg_price}
        disabled={val?.is_kg_price === false}
        onChange={e => handleChange(key, e.target.value, data, index)}
      />
    </div>
  );
};

export default function MobileAppPriceList({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_edit_access, is_export_access } = hasAccess;

  const {
    productLoading,
    productCRUDLoading,
    productRateList,
    productRateCount,
  } = useSelector(({ product }) => product);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { currentPage, pageLimit } = allFilters?.mobileAppPriceList;
  const { filterToggle, searchQuery, mobileAppFilters } =
    allCommon?.mobileAppPriceList;

  useEffect(() => {
    dispatch(getProductRateList(pageLimit, currentPage, searchQuery));
  }, [currentPage, dispatch, pageLimit]);

  const handleFilterUpdate = () => {
    dispatch(
      setAllCommon({
        ...allCommon,
        mobileAppPriceList: {
          ...allCommon?.mobileAppPriceList,
          filterToggle: !filterToggle,
        },
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
          mobileAppPriceList: {
            ...allFilters?.mobileAppPriceList,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, allFilters, dispatch],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          mobileAppPriceList: {
            ...allFilters?.mobileAppPriceList,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const handleChange = useCallback(
    (key, val, data, index) => {
      let list = productRateList?.length && [
        ...JSON.parse(JSON.stringify(productRateList)),
      ];
      const productIndex = list?.findIndex(x => x?._id === data?._id);
      if (productIndex >= 0) {
        list[productIndex].product_rate_list[index][key] =
          key === 'is_kg_price' ? !val : val;
        dispatch(setProductRateList(list));
      }
    },
    [dispatch, productRateList],
  );

  const handleCustomChange = useCallback(
    (key, val, data) => {
      let list = productRateList?.length && [
        ...JSON.parse(JSON.stringify(productRateList)),
      ];
      const productIndex = list?.findIndex(x => x?._id === data?._id);
      if (productIndex >= 0) {
        if (key === 'out_of_stock') list[productIndex][key] = val ? 0 : 1;
        else list[productIndex][key] = val;
        dispatch(setProductRateList(list));
      }
    },
    [dispatch, productRateList],
  );

  const sortingOrderTemplate = data => {
    return (
      <div className="form_group mb-0">
        <InputText
          placeholder="0"
          className="w-100"
          type="number"
          min={0}
          value={data?.sort_order}
          onChange={e => handleCustomChange('sort_order', e.target.value, data)}
        />
      </div>
    );
  };

  const outOfStockTemplate = data => {
    return (
      <div className="form_group mb-0">
        <Checkbox
          onChange={e =>
            handleCustomChange('out_of_stock', e.target.value, data)
          }
          value={data?.out_of_stock}
          checked={data?.out_of_stock === 1}
        />
      </div>
    );
  };

  const renderProductrateList = useMemo(() => {
    let maxTotalRateList = 0;
    productRateList?.forEach(x => {
      maxTotalRateList = Math.max(
        maxTotalRateList,
        x?.product_rate_list?.length,
      );
    });

    let rateList = [];
    for (let i = 0; i < maxTotalRateList; i++) {
      rateList.push(
        <Column
          key={`kg_price-${i}`}
          field="product_rate_list.kg_price"
          header="Rate(Per KG)"
          sortable
          body={e =>
            kgInputTemplate(
              e.product_rate_list[i],
              e,
              i,
              handleChange,
              'kg_price',
            )
          }
          className="with_input_field column_group border_left"
        ></Column>,
      );
      rateList.push(
        <Column
          key={`pc_price-${i}`}
          field="product_rate_list.pc_price"
          header="Rate(Per Pc)"
          sortable
          body={e =>
            pcInputTemplate(
              e.product_rate_list[i],
              e,
              i,
              handleChange,
              'pc_price',
            )
          }
          className="with_input_field column_group with_before"
          data-before-content={`Rate List 1`}
        ></Column>,
      );
      rateList.push(
        <Column
          key={`is_kg_price-${i}`}
          field="product_rate_list.is_kg_price"
          header="KG Rate"
          className="column_group border_right"
          sortable
          body={e =>
            checkboxTemplate(
              e.product_rate_list[i].is_kg_price,
              e,
              i,
              handleChange,
              'is_kg_price',
            )
          }
        ></Column>,
      );
    }
    return rateList;
  }, [handleChange, productRateList]);

  const onExport = useCallback(
    async key => {
      await dispatch(getExportProductRate(key));
    },
    [dispatch],
  );

  const onSaveProductRate = useCallback(async () => {
    const payload = productRateList?.map(x => {
      return {
        product_id: x?._id,
        sort_order: Number(x?.sort_order),
        out_of_stock: x?.out_of_stock,
        price_list: x?.product_rate_list?.map(x => ({
          ...x,
          kg_price: Number(x?.kg_price),
          pc_price: Number(x?.pc_price),
        })),
      };
    });
    dispatch(saveProductRate(payload));
  }, [dispatch, productRateList]);

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        mobileAppPriceList: {
          ...allFilters?.mobileAppPriceList,
          currentPage: 1,
        },
      }),
    );
    dispatch(getProductRateList(pageLimit, currentPage, e.target.value));
  };

  const debouncehandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {productLoading && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={4}>
                <div className="page_title">
                  <h3 className="m-0">Mobile App Price List</h3>
                </div>
              </Col>
              <Col md={8}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debouncehandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                mobileAppPriceList: {
                                  ...allCommon?.mobileAppPriceList,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
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
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={is_edit_access && onSaveProductRate}
                        disabled={
                          productCRUDLoading || (is_edit_access ? false : true)
                        }
                      >
                        Save Product Rate
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper cell_padding_small is_filter break_header">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => handleFilterUpdate()}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={productRateList}
              sortMode="single"
              sortField="name"
              filterDisplay="row"
              sortOrder={1}
              dataKey="_id"
              filters={mobileAppFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mobileAppPriceList: {
                      ...allCommon?.mobileAppPriceList,
                      mobileAppFilters: event?.filters,
                    },
                  }),
                );
              }}
              className="rate_list_wrapper"
              emptyMessage={productLoading ? <Skeleton count={11} /> : false}
            >
              <Column
                field="main_image_str"
                header="Image"
                filter={filterToggle}
                body={e => imageTemplate(e?.main_image)}
              ></Column>
              <Column
                field="design_name"
                header="Design Name"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="size"
                header="Size"
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
                field="display_name"
                header="Display Name"
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
                sortable
                filter={filterToggle}
                body={laminationTemplate}
              ></Column>
              <Column
                field="fabric_color_name"
                header="Fabric Color"
                filter={filterToggle}
                sortable
              ></Column>
              <Column
                field="sort_order"
                header="Sorting Order"
                filter={filterToggle}
                body={sortingOrderTemplate}
                sortable
              ></Column>
              <Column
                field="out_of_stock"
                header="Out Of Stock"
                filter={filterToggle}
                sortable
                body={outOfStockTemplate}
              ></Column>
              {renderProductrateList.map(x => {
                return x;
              })}
            </DataTable>
            <CustomPaginator
              dataList={productRateList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={productRateCount}
            />
          </div>
        </div>
      </div>
    </>
  );
}
