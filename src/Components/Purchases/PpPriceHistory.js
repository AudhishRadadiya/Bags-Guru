import React, { useCallback, useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Skeleton from 'react-loading-skeleton';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import {
  addPrice,
  deletePriceHistoryItem,
  getExportPpPriceHistoryFile,
  getPpPriceHistoryList,
  updatePriceHistory,
} from 'Services/Purchase/PpPriceHistoryService';
import Loader from 'Components/Common/Loader';
import { getFormattedDate } from 'Helper/Common';
import PlusIcon from '../../Assets/Images/plus.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';

export default function PpPriceHistory({ hasAccess }) {
  const dispatch = useDispatch();
  const { is_create_access, is_export_access } = hasAccess;

  const [addPriceModal, setAddPriceModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [price, setPrice] = useState({
    value: '',
    errorMessage: '',
  });
  const [date, setDate] = useState({
    value: new Date(),
    errorMessage: '',
  });

  const {
    ppPriceHistoryLoading,
    ppPriceHistoryListLoading,
    ppPriceHistoryList,
    ppPriceHistoryCount,
  } = useSelector(({ ppPriceHistory }) => ppPriceHistory);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { currentPage, pageLimit } = allFilters?.ppPriceHistory;
  const { filterToggle, ppPriceHistoryFilters } = allCommon?.ppPriceHistory;

  useEffect(() => {
    dispatch(getPpPriceHistoryList(pageLimit, currentPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageLimit]);

  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          ppPriceHistory: {
            ...allFilters?.ppPriceHistory,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
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
          ppPriceHistory: {
            ...allFilters?.ppPriceHistory,
            currentPage: pageIndex,
          },
        }),
      );
    },
    [currentPage, dispatch, allFilters],
  );

  const onExport = useCallback(
    async key => {
      dispatch(getExportPpPriceHistoryFile(key));
    },
    [dispatch],
  );

  const handleAddPrice = useCallback(async () => {
    if (price?.value === '' && (date?.value === '' || date?.value === null)) {
      setPrice({ ...price, errorMessage: 'Price is required' });
      setDate({ ...date, errorMessage: 'Date is required' });
      return;
    } else if (price?.value === '') {
      setPrice({ ...price, errorMessage: 'Price is required' });
      return;
    } else if (date?.value === '' || date?.value === null) {
      setDate({ ...date, errorMessage: 'Date is required' });
      return;
    }

    let res;
    let payload = {
      price: parseFloat(price?.value),
      date: getFormattedDate(date?.value),
    };

    if (editData?._id) {
      payload = {
        ...payload,
        ppPriceHistoryId: editData?._id,
      };
      res = await dispatch(updatePriceHistory(payload));
    } else {
      res = await dispatch(addPrice(payload));
    }

    if (res) {
      dispatch(getPpPriceHistoryList(pageLimit, currentPage));
    }
    setAddPriceModal(false);
    setEditData({});
  }, [price, date, editData, dispatch, pageLimit, currentPage]);

  const handleAction = item => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            // disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {/* {is_edit_access && ( */}
            <Dropdown.Item onClick={() => handleEdit(item)}>
              <img src={EditIcon} alt="" /> Edit
            </Dropdown.Item>
            {/* )} */}
            {/* {is_delete_access && ( */}
            <Dropdown.Item
              onClick={() => {
                setDeletePopup(item);
              }}
            >
              <img src={TrashIcon} alt="" /> Delete
            </Dropdown.Item>
            {/* )} */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const handleEdit = useCallback(
    item => {
      const findPriceObj = ppPriceHistoryList?.find(x => x?._id === item?._id);
      if (findPriceObj) {
        setPrice({ ...price, value: findPriceObj?.price });
        setDate({ ...date, value: new Date(findPriceObj?.created_at) });
        setEditData(findPriceObj);
        setAddPriceModal(true);
      }
    },
    [ppPriceHistoryList, price, date],
  );

  const handleDelete = useCallback(
    async item => {
      if (item) {
        const result = await dispatch(deletePriceHistoryItem(item?._id));
        if (result) {
          setDeletePopup(false);
          dispatch(getPpPriceHistoryList(pageLimit, currentPage));
        }
      }
    },
    [dispatch, pageLimit, currentPage],
  );

  return (
    <div className="main_Wrapper">
      {ppPriceHistoryLoading && <Loader />}
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page_title">
                <h3 className="m-0">PP Price History</h3>
              </div>
            </Col>
            <Col sm={6}>
              <div className="button_filter_wrap">
                <ul className="d-flex align-items-end justify-content-end">
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
                  <li>
                    <Button
                      className="btn_primary mx-2"
                      onClick={e => {
                        setAddPriceModal(true);
                      }}
                      disabled={!is_create_access}
                    >
                      <img src={PlusIcon} alt="" />
                      Add Price
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper cell_padding_large is_filter">
          <button
            type="button"
            className="table_filter_btn"
            onClick={() => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  ppPriceHistory: {
                    ...allCommon?.ppPriceHistory,
                    filterToggle: !filterToggle,
                  },
                }),
              );
            }}
          >
            <img src={SearchIcon} alt="" />
          </button>
          <DataTable
            value={ppPriceHistoryList}
            sortMode="single"
            sortField="name"
            filterDisplay="row"
            sortOrder={1}
            rows={10}
            dataKey="_id"
            filters={ppPriceHistoryFilters}
            onFilter={event => {
              dispatch(
                setAllCommon({
                  ...allCommon,
                  ppPriceHistory: {
                    ...allCommon?.ppPriceHistory,
                    ppPriceHistoryFilters: event?.filters,
                  },
                }),
              );
            }}
            emptyMessage={ppPriceHistoryListLoading && <Skeleton count={11} />}
          >
            <Column
              field="date"
              header="Date"
              sortable
              filter={filterToggle}
            ></Column>
            <Column
              field="price"
              header="Price"
              sortable
              filter={filterToggle}
            ></Column>
            <Column field="action" header="Action" body={handleAction}></Column>
          </DataTable>
          <CustomPaginator
            dataList={ppPriceHistoryList}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={ppPriceHistoryCount}
          />
        </div>
      </div>
      <Dialog
        header="Add Price"
        visible={addPriceModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setAddPriceModal(false)}
      >
        <div className="printing_content_wrap">
          <div className="form_group date_select_wrapper mb-3">
            <label htmlFor="OrderDate">
              Date
              <span className="text-danger fs-4">*</span>
            </label>
            <Calendar
              placeholder="SelectDate"
              showIcon
              showButtonBar
              name="date"
              value={date?.value}
              dateFormat="dd-mm-yy"
              onChange={e => {
                setDate({
                  ...date,
                  errorMessage: '',
                  value: e.target.value,
                });
              }}
            />
            {date?.errorMessage ? (
              <span className="text-danger">{date?.errorMessage}</span>
            ) : (
              ''
            )}
          </div>
          <div className="printing_content_top">
            <div className="form_group mb-3">
              <label>
                Price
                <span className="text-danger fs-4">*</span>
              </label>
              <InputText
                id="price"
                placeholder="Price"
                type="number"
                value={price?.value}
                className="input_wrap small"
                onChange={e => {
                  setPrice({
                    ...price,
                    errorMessage: '',
                    value: e.target.value,
                  });
                }}
              />
              {price?.errorMessage ? (
                <span className="text-danger">{price?.errorMessage}</span>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              className="btn_border me-2"
              onClick={() => setAddPriceModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary"
              onClick={() => {
                handleAddPrice();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
