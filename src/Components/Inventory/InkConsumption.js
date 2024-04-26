import { memo, useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getExportInkConsumptionFile,
  getInkConsumptionList,
} from 'Services/Inventory/StockRowMaterial';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

const InkConsumption = ({ accessPermission }) => {
  const dispatch = useDispatch();
  const { is_export_access } = accessPermission;

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, inkFilters } = allCommon?.inkConsumption;
  const { currentPage, pageLimit } = allFilters?.inkConsumption;
  const {
    stockRawLoading,
    stockRawExportLoading,
    inkConsumptionList,
    inkConsumptionCount,
  } = useSelector(({ stockRaw }) => stockRaw);

  useEffect(() => {
    dispatch(getInkConsumptionList(pageLimit, currentPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const onExport = useCallback(
    async key => {
      await dispatch(getExportInkConsumptionFile(key));
    },
    [dispatch],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          inkConsumption: {
            ...allFilters?.inkConsumption,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, dispatch, allFilters],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          inkConsumption: {
            ...allFilters?.inkConsumption,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  return (
    <>
      {stockRawExportLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col xs={8}>
              <div className="page_title">
                <h3 className="m-0">Ink Consumption </h3>
              </div>
            </Col>
            <Col xs={4}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <Dropdown className="dropdown_common export_dropdown position-static">
                      <OverlayTrigger
                        overlay={props => <Tooltip {...props}>Export</Tooltip>}
                        placement="bottom"
                      >
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="btn_border icon_btn"
                          disabled={!is_export_access}
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
        <div className="data_table_wrapper tab_wrapper_table cell_padding_large is_filter">
          <button
            type="button"
            className="table_filter_btn"
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  inkConsumption: {
                    ...allCommon?.inkConsumption,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={inkConsumptionList}
            filterDisplay="row"
            dataKey="id"
            filters={inkFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  inkConsumption: {
                    ...allCommon?.inkConsumption,
                    inkFilters: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={stockRawLoading ? <Skeleton count={9} /> : false}
          >
            <Column
              field="machine_name"
              header="Machine"
              filter={filterToggle}
              className="column_group with_before specifications"
              sortable
            />
            <Column
              field="color"
              header="Colour"
              filter={filterToggle}
              className="column_group border_right"
              sortable
            />
            <Column
              field="in_stock"
              header="In Stock"
              filter={filterToggle}
              className="column_group border_left border_right"
              sortable
            />
            <Column
              field="one_month"
              header="1 month"
              filter={filterToggle}
              className="column_group"
              sortable
            />
            <Column
              field="three_month"
              header="3 month"
              filter={filterToggle}
              className="column_group with_before weight_ink_usedin"
              sortable
            />
            <Column
              field="six_month"
              header="6 month"
              filter={filterToggle}
              className="column_group"
              sortable
            />
            <Column
              field="twelve_month"
              header="12 month"
              filter={filterToggle}
              className="column_group"
              sortable
            />
          </DataTable>
          <CustomPaginator
            dataList={inkConsumptionList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={inkConsumptionCount}
          />
        </div>
      </div>
    </>
  );
};
export default memo(InkConsumption);
