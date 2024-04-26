import { useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  addAdvisorTaget,
  getListAdvisorTaget,
} from 'Services/Settings/MiscMasterService';

import { setAdvisorTargetMasterData } from 'Store/Reducers/Common';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { getPartiesAdvisor } from 'Services/partiesService';

function getMonthName(monthNumber) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const normalizedMonthNumber = Math.max(1, Math.min(12, monthNumber));
  return monthNames[normalizedMonthNumber - 1];
}

export function generateYearOptions(startYear) {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let year = startYear; year <= currentYear; year++) {
    options.push({ value: year, label: year.toString() });
  }

  return options;
}

export default function TargetMaster({ hasAccess }) {
  const dispatch = useDispatch();
  const { partiesAdvisor } = useSelector(({ parties }) => parties);
  const { advisorTargetMasterData } = useSelector(({ common }) => common);

  const handleInputChange = (month, field, value) => {
    const updatedTargetData = advisorTargetMasterData?.target_data?.map(
      data => {
        if (data.month === month) {
          return {
            ...data,
            [field]: value,
          };
        }
        return data;
      },
    );
    dispatch(
      setAdvisorTargetMasterData({
        ...advisorTargetMasterData,
        target_data: updatedTargetData,
      }),
    );
  };

  const handleSaveClick = () => {
    dispatch(addAdvisorTaget(advisorTargetMasterData));
  };

  const inputFieldTemplate = (rowData, field) => {
    const { month } = rowData;
    return (
      <div className="form_group">
        <InputText
          id={`${field}_${month}`}
          placeholder=""
          type="number"
          className="input_wrap"
          value={
            advisorTargetMasterData?.target_data?.find(
              data => data?.month === month,
            )[field]
          }
          onChange={e => handleInputChange(month, field, e.target.value)}
        />
      </div>
    );
  };

  const loadRequiredData = useCallback(() => {
    dispatch(getPartiesAdvisor());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const getTargetMasterData = useCallback(
    async (advisorId, year) => {
      dispatch(getListAdvisorTaget(advisorId, year));
    },
    [advisorTargetMasterData, dispatch],
  );

  const debouncehandleSearchInput = useCallback(
    _.debounce(getTargetMasterData, 0),
    [],
  );
  return (
    <>
      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Advisor Target</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group">
                      <ReactSelectSingle
                        filter
                        name="advisor_id"
                        value={advisorTargetMasterData?.advisor_id}
                        options={partiesAdvisor}
                        onChange={e => {
                          dispatch(
                            setAdvisorTargetMasterData({
                              ...advisorTargetMasterData,
                              advisor_id: e.value,
                            }),
                          );
                        }}
                        placeholder="Advisor Name"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form_group">
                      <ReactSelectSingle
                        filter
                        name="year"
                        disabled={
                          advisorTargetMasterData?.advisor_id ? false : true
                        }
                        value={advisorTargetMasterData?.year}
                        options={generateYearOptions(2015)}
                        onChange={e => {
                          dispatch(
                            setAdvisorTargetMasterData({
                              ...advisorTargetMasterData,
                              year: e.value,
                            }),
                          );
                          debouncehandleSearchInput(
                            advisorTargetMasterData?.advisor_id,
                            e.value,
                          );
                        }}
                        placeholder="Select Year"
                      />
                    </div>
                  </li>
                  <li>
                    {/* <Button
                      disabled={
                        advisorTargetMasterData?.advisor_id &&
                        advisorTargetMasterData?.year
                          ? false
                          : true
                      }
                      className="btn_primary"
                      onClick={() => {
                        advisorTargetMasterData?.advisor_id &&
                          advisorTargetMasterData?.year &&
                          getTargetMasterData();
                      }}
                    >
                      Apply
                    </Button> */}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper advisor_target_wrapper cell_padding_large">
          <DataTable
            value={advisorTargetMasterData?.target_data}
            sortMode="multiple"
            sortField="name"
            sortOrder={1}
            filterDisplay="row"
            dataKey="_id"
          >
            <Column
              field={data => {
                return getMonthName(data?.month);
              }}
              header="Months"
              sortable
            ></Column>
            <Column
              field="new_target"
              header="New Customer Target"
              sortable
              body={rowData => inputFieldTemplate(rowData, 'new_target')}
            ></Column>
            <Column
              field="repeat_target"
              header="Repeat Customer Target"
              sortable
              body={rowData => inputFieldTemplate(rowData, 'repeat_target')}
            ></Column>
          </DataTable>
        </div>
      </div>
      {advisorTargetMasterData?.target_data?.length > 0 && (
        <div className="button_group d-flex align-items-center justify-content-end pt-3">
          <Button className="btn_primary" onClick={handleSaveClick}>
            {advisorTargetMasterData?.isUpdate ? 'Update' : 'save'}
          </Button>
        </div>
      )}
    </>
  );
}
