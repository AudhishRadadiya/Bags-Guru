import React, { useCallback, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import ReactSelectSingle from '../../../../Components/Common/ReactSelectSingle';
import { Calendar } from 'primereact/calendar';
import FilterIcon from '../../../../Assets/Images/filter.svg';
import ExportIcon from '../../../../Assets/Images/export.svg';
import { setAllFilters } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import {
  MFGfProcessLists,
  getExportMfgProcess,
} from 'Services/Production/mfgLiveOperatorServices';
import MFGLiveOperatorExport from './MFGLiveOperatorExport';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import DateRangeCalender from 'Components/Common/DateRangeCalender';
import { setListMFGProcess } from 'Store/Reducers/Production/mfgLiveOperatorSlice';

function CommonHeader(props) {
  const {
    op,
    headerName,
    FactoryLocationHandleChange,
    dateHandleChange,
    loadTableData,
    searchQuery,
    searchSateName,
    searchInnerSateName,
    factoryLocationList,
    factory,
    dates,
    completed,
    tableRef,
    handleCompletedChange,
    debouncehandleSearchInput,
    mfgListParam,
    applied,
  } = props;

  const dateRef = useRef(null);
  const dispatch = useDispatch();

  const { allFilters } = useSelector(({ common }) => common);
  const { print_technology, machine, print } = allFilters?.mfgLiveFlexo;

  const onExport = useCallback(
    async key => {
      await dispatch(
        getExportMfgProcess(
          key,
          mfgListParam,
          searchQuery,
          print_technology,
          machine,
          print,
        ),
      );
    },
    [dispatch, mfgListParam, searchQuery, print_technology, machine, print],
  );

  return (
    <>
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col sm={2}>
            <div className="page_title">
              <h3 className="m-0">{headerName}</h3>
            </div>
          </Col>
          <Col sm={10}>
            <div className="right_filter_wrapper">
              <ul>
                <li>
                  <div className="form_group checkbox_wrap">
                    <Checkbox
                      inputId="ShowTransportersonly"
                      name="completed"
                      value={completed === 1 ? true : false}
                      onChange={e => {
                        dispatch(setListMFGProcess([]));
                        handleCompletedChange(e.checked);
                        tableRef.current?.reset();
                      }}
                      checked={completed === 1}
                    />
                    <label className="mb-0 me-2" htmlFor="ShowTransportersonly">
                      Completed
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form_group">
                    <InputText
                      id="search"
                      placeholder="Search"
                      type="search"
                      value={searchQuery}
                      className="input_wrap small search_wrap"
                      onChange={e => {
                        debouncehandleSearchInput(
                          e,
                          mfgListParam,
                          print_technology,
                          machine,
                          print,
                        );
                        dispatch(
                          setAllFilters({
                            ...allFilters,
                            [searchSateName]: {
                              ...allFilters?.[searchSateName],
                              [searchInnerSateName]: {
                                ...allFilters?.[searchSateName][
                                  searchInnerSateName
                                ],
                                searchQuery: e.target.value,
                                currentPage: 1,
                              },
                            },
                          }),
                        );
                        // dispatch(
                        //   MFGfProcessLists({
                        //     ...mfgListParam,
                        //     searchQuery: e.target.value,
                        //   }),
                        // );
                      }}
                    />
                  </div>
                </li>
                <li>
                  <Button
                    // className="btn_border filter_btn"
                    className={
                      Object.keys(applied)?.length > 0
                        ? 'btn_border filter_btn applied'
                        : 'btn_border filter_btn'
                    }
                    onClick={e => op?.current?.toggle(e)}
                  >
                    <img src={FilterIcon} alt="" /> Filter
                  </Button>

                  {/* <OverlayPanel ref={op} showCloseIcon>
                    <div className="overlay_top_wrap">
                      <h3>Filters</h3>
                    </div>
                    <div className="overlay_body">
                      <div className="overlay_select_filter_row mb-3">
                        <div className="filter_row">
                          <Row>
                            <Col sm={6}>
                              <div className="form_group">
                                <ReactSelectSingle
                                  filter
                                  value={filterSelect}
                                  options={filter}
                                  onChange={e => {
                                    filterHandleChange(e);
                                  }}
                                  placeholder="Select Filter"
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="form_group">
                                <ReactSelectSingle
                                  filter
                                  value={vanueSelect}
                                  options={vanue}
                                  onChange={e => {
                                    vanueHandleChange(e);
                                  }}
                                  placeholder="Select"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="remove_row">
                          <Button className="btn_transperant">
                            <img src={TrashIcon} alt="" />
                          </Button>
                        </div>
                      </div>
                      <div className="overlay_select_filter_row">
                        <div className="filter_row">
                          <Row>
                            <Col sm={6}>
                              <div className="form_group">
                                <ReactSelectSingle
                                  filter
                                  value={filterSelect}
                                  options={filter}
                                  onChange={e => {
                                    filterHandleChange(e);
                                  }}
                                  placeholder="Select Filter"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="button_filter_wrap d-flex align-items-center justify-content-between mt-3">
                        <Button className="btn_border">
                          <img src={PlusIcon} alt="" /> Add Filter
                        </Button>
                        <Button
                          className="btn_primary"
                          onClick={e => {
                            setSaveFilterModal(true);
                            op.current.toggle(e);
                          }}
                        >
                          Save Filter
                        </Button>
                      </div>
                    </div>
                    <div className="overlay_bottom_wrap">
                      <div className="saved_filter_wrap">
                        <h3 className="mb-2">Saved Filter</h3>
                        <ul>
                          <li>
                            <Chip template={content} />
                          </li>
                          <li>
                            <Chip template={content} />
                          </li>
                          <li>
                            <Chip template={content} />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </OverlayPanel> */}
                </li>
                <li>
                  <div className="form_group">
                    <Dropdown
                      TakeAction
                      value={factory}
                      options={factoryLocationList}
                      showClear={factory}
                      onChange={e => {
                        FactoryLocationHandleChange(e);
                      }}
                      placeholder="Factory Location"
                    />
                  </div>
                </li>
                <li>
                  {/* <div className="form_group date_select_wrapper">
                    <Calendar
                      id="SelectDate"
                      value={dates}
                      placeholder="Select Date Range"
                      showIcon
                      showButtonBar
                      dateFormat="dd-mm-yy"
                      selectionMode="range"
                      readOnlyInput
                      onChange={e => dateHandleChange(e)}
                    />
                  </div> */}
                  <div className="form_group date_range_wrapper">
                    <div
                      className="date_range_select"
                      onClick={e => {
                        dateRef.current.toggle(e);
                      }}
                    >
                      <span>
                        {dates?.startDate
                          ? moment(dates.startDate).format('DD-MM-yyyy')
                          : ''}{' '}
                        {dates?.startDate && dates?.endDate && '-'}{' '}
                        {dates?.endDate
                          ? moment(dates.endDate).format('DD-MM-yyyy')
                          : 'Select Date Range'}
                      </span>
                    </div>
                    <OverlayPanel ref={dateRef}>
                      <div className="date_range_wrap">
                        <DateRangeCalender
                          ranges={[dates]}
                          onChange={e => dateHandleChange(e)}
                        />
                        <Button
                          className="btn_transperant"
                          onClick={e => {
                            dateRef.current.toggle(e);
                            dispatch(
                              setAllFilters({
                                ...allFilters,
                                [searchSateName]: {
                                  ...allFilters?.[searchSateName],
                                  [searchInnerSateName]: {
                                    ...allFilters?.[searchSateName][
                                      searchInnerSateName
                                    ],
                                    dates: {
                                      startDate: '',
                                      endDate: '',
                                      key: 'selection',
                                    },
                                  },
                                },
                              }),
                            );

                            loadTableData({
                              startDate: '',
                              endDate: '',
                              key: 'selection',
                            });
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </OverlayPanel>
                  </div>
                </li>
                {/* <li>
                  <Dropdown className="dropdown_common export_dropdown position-static">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="btn_border icon_btn"
                    >
                      <img src={ExportIcon} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => onExport('pdf')}>
                        PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => onExport('excel')}>
                        XLS
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li> */}
                <MFGLiveOperatorExport onExport={onExport} />
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CommonHeader;
