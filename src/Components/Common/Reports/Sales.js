import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { memo, useState } from 'react';
import ReportIcon from '../../../Assets/Images/reports.svg';
import Download from '../../../Assets/Images/download.svg';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import {
  generateAdvisorMonthlyTurnoverExcel,
  generateAdvisorMonthlyTurnoverPDF,
} from 'Services/Report/SalesReportService';
import { useDispatch } from 'react-redux';
import Loader from '../Loader';
import { useSelector } from 'react-redux';

const Sales = () => {
  const dispatch = useDispatch();

  const [reportModal, setReportModal] = useState(false);
  const [monthlySalesPerformanceModal, setMonthlySalesPerformanceModal] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState({
    start_date: '',
    end_date: '',
  });

  const { salesReportsLoading } = useSelector(
    ({ salesTurnover }) => salesTurnover,
  );

  const handleGenerateXLS = () => {
    dispatch(generateAdvisorMonthlyTurnoverExcel(selectedDate));
  };

  const handleGeneratePDF = () => {
    dispatch(generateAdvisorMonthlyTurnoverPDF(selectedDate));
  };

  return (
    <>
      {salesReportsLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white h-100">
          <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
            <h3 class="mb-0">Sales</h3>
          </div>
          {/* <div className="report_list_wrapper p-3">
            <div className="row g-4">
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => setReportModal(true)}
                >
                  <img src={ReportIcon} alt="" />
                  Lost Customers (Advisor Wise)
                </Button>
              </div>
            </div>
          </div> */}
          <div className="report_list_wrapper p-3">
            <div className="row g-4">
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => setMonthlySalesPerformanceModal(true)}
                >
                  <img src={ReportIcon} alt="" />
                  Monthly Sales Performance - Advisor
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header="Non Laminated Rolls (GSM Wise)"
          className="modal_Wrapper modal_small"
          visible={reportModal}
          draggable={false}
          onHide={() => setReportModal(false)}
        >
          <Row>
            <Col xs={6}>
              <Button className="btn_border w-100">
                <img src={Download} alt="" />
                Download XLS
              </Button>
            </Col>
            <Col xs={6}>
              <Button className="btn_border w-100">
                <img src={Download} alt="" />
                Download PDF
              </Button>
            </Col>
          </Row>
        </Dialog>

        <Dialog
          header="Monthly Sales Performance - Advisor"
          className="modal_Wrapper modal_small"
          visible={monthlySalesPerformanceModal}
          draggable={false}
          onHide={() => {
            setMonthlySalesPerformanceModal(false);
            setSelectedDate({
              start_date: '',
              end_date: '',
            });
          }}
        >
          <Row>
            <Col lg={6} md={6} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="OrderDate">
                  Start Date
                  <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  id="StartDate"
                  placeholder="Select Start Date"
                  showIcon
                  showButtonBar
                  name="start_date"
                  dateFormat="dd-mm-yy"
                  value={selectedDate?.start_date || ''}
                  onChange={e => {
                    setSelectedDate({
                      ...selectedDate,
                      start_date: e.target.value,
                    });
                  }}
                />
              </div>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="OrderDate">
                  End Date
                  <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  id="EndDate"
                  placeholder="Select End Date"
                  showIcon
                  showButtonBar
                  name="end_date"
                  dateFormat="dd-mm-yy"
                  value={selectedDate?.end_date || ''}
                  onChange={e => {
                    setSelectedDate({
                      ...selectedDate,
                      end_date: e.target.value,
                    });
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Button
                className="btn_border w-100"
                onClick={handleGenerateXLS}
                disabled={!selectedDate?.start_date || !selectedDate?.end_date}
              >
                <img src={Download} alt="" />
                Download XLS
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                className="btn_border w-100"
                onClick={handleGeneratePDF}
                disabled={!selectedDate?.start_date || !selectedDate?.end_date}
              >
                <img src={Download} alt="" />
                Download PDF
              </Button>
            </Col>
          </Row>
        </Dialog>
      </div>
    </>
  );
};

export default memo(Sales);
