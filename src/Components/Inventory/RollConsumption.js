import { memo, useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  Button,
  Col,
  Dropdown,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import PendingJobTable from './PendingJobTable';
import PastJobTable from './PastJobTable';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { useDispatch } from 'react-redux';
import {
  getExportRollConsumptionFile,
  getRollConsumptionList,
} from 'Services/Inventory/StockRowMaterial';
import { useSelector } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import Loader from 'Components/Common/Loader';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

const RollConsumption = ({ accessPermission }) => {
  const dispatch = useDispatch();
  const { is_export_access } = accessPermission;

  const [pendingJobsModal, setPendingJobsModal] = useState(false);
  const [pastJobsModal, setPastJobsModal] = useState(false);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { filterToggle, rollFilters } = allCommon?.rollConsumption;
  const { currentPage, pageLimit } = allFilters?.rollConsumption;

  const {
    stockRawLoading,
    stockRawExportLoading,
    rollConsumptionList,
    rollConsumptionCount,
  } = useSelector(({ stockRaw }) => stockRaw);

  useEffect(() => {
    dispatch(getRollConsumptionList(pageLimit, currentPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  // const desingFilterTemplate = options => {
  //   return (
  //     <div className="form_group">
  //       <div className="mb-3 font-bold">Filter by Design</div>
  //       <MultiSelect
  //         value={options.value}
  //         options={designFilter}
  //         itemTemplate={designItemsTemplate}
  //         onChange={e => options.filterCallback(e.value)}
  //         optionLabel="name"
  //         placeholder="Select"
  //         className="p-column-filter"
  //         maxSelectedLabels={2}
  //       />
  //     </div>
  //   );
  // };
  // const designItemsTemplate = option => {
  //   return (
  //     <div className="flex align-items-center gap-2">
  //       <span>{option.name}</span>
  //     </div>
  //   );
  // };

  // const pendingOrdersTemplate = () => {
  //   return (
  //     <Button
  //       className="btn_transperant modal_btn_table"
  //       onClick={e => {
  //         setPendingJobsModal(true);
  //       }}
  //     >
  //       4
  //     </Button>
  //   );
  // };
  // const pastJobTemplate = () => {
  //   return (
  //     <Button
  //       className="btn_transperant modal_btn_table"
  //       onClick={e => {
  //         setPastJobsModal(true);
  //       }}
  //     >
  //       4
  //     </Button>
  //   );
  // };

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          rollConsumption: {
            ...allFilters?.rollConsumption,
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
          rollConsumption: {
            ...allFilters?.rollConsumption,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const onExport = useCallback(
    async key => {
      await dispatch(getExportRollConsumptionFile(key));
    },
    [dispatch],
  );

  return (
    <>
      {stockRawExportLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col xs={8}>
              <div className="page_title">
                <h3 className="m-0 p-0">Roll Consumption </h3>
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
        <div className="data_table_wrapper tab_wrapper_table with_colspan_head cell_padding_large is_filter">
          <button
            type="button"
            className="table_filter_btn"
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  rollConsumption: {
                    ...allCommon?.rollConsumption,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={rollConsumptionList}
            filterDisplay="row"
            dataKey="_id"
            filters={rollFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  rollConsumption: {
                    ...allCommon?.rollConsumption,
                    rollFilters: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={stockRawLoading ? <Skeleton count={9} /> : false}
          >
            <Column
              field="lamination_type_name"
              header="Lamination Type"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="color"
              header="Colour"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="design_name"
              header="Design"
              sortable
              filter={filterToggle}
              className="column_group with_before specifications"
            />
            <Column
              field="width"
              header="Width"
              sortable
              filter={filterToggle}
              className="column_group "
            />
            <Column
              field="length"
              header="Length"
              sortable
              filter={filterToggle}
              className="column_group"
            />
            <Column
              field="gsm"
              header="GSM"
              sortable
              filter={filterToggle}
              className="column_group border_right"
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
              className="column_group border_right"
              filter={filterToggle}
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
              className="column_group with_before rolls_used_in"
            />
            <Column
              field="six_month"
              header="6 month"
              sortable
              filter={filterToggle}
              className="column_group"
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
            dataList={rollConsumptionList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={rollConsumptionCount}
          />
        </div>

        <Dialog
          header="Pending jobs"
          visible={pendingJobsModal}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => setPendingJobsModal(false)}
        >
          <div className="job_modal_wrapper">
            <PendingJobTable />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="btn_border"
              onClick={() => setPendingJobsModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => setPendingJobsModal(false)}
            >
              Save
            </Button>
          </div>
        </Dialog>
        <Dialog
          header="Past 1 Month Jobs"
          visible={pastJobsModal}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => setPastJobsModal(false)}
        >
          <div className="job_modal_wrapper">
            <PastJobTable />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="btn_border"
              onClick={() => setPastJobsModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary ms-3"
              onClick={() => setPastJobsModal(false)}
            >
              Save
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default memo(RollConsumption);
