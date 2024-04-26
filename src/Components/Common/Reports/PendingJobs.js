import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { memo, useEffect, useState } from 'react';
import ReportIcon from '../../../Assets/Images/reports.svg';
import Download from '../../../Assets/Images/download.svg';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  pendingJobByBagTypeExportExcel,
  printingJobsExportExcel,
  printingJobsExportPDF,
} from 'Services/Report/PendingJobs';
import { useSelector } from 'react-redux';
import Loader from '../Loader';
import ReactSelectSingle from '../ReactSelectSingle';
import { getActiveMachineTypeList } from 'Services/Settings/MiscMasterService';

const PendingJobs = () => {
  const dispatch = useDispatch();

  const [machine, setMachine] = useState('');
  const [reportData, setReportData] = useState('');
  const [reportModal, setReportModal] = useState(false);

  const { pendingJobsLoading } = useSelector(
    ({ salesTurnover }) => salesTurnover,
  );
  const { activeMachineTypeList, miscMasterLoading } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  useEffect(() => {
    dispatch(getActiveMachineTypeList());
  }, []);

  const handleXLSReport = report => {
    if (report?.toLowerCase() === 'flexo print jobs cylinder wise') {
      dispatch(printingJobsExportExcel());
    }
    setReportData('');
    setReportModal(false);
  };

  const handlePDFReport = report => {
    if (report?.toLowerCase() === 'flexo print jobs cylinder wise') {
      dispatch(printingJobsExportPDF());
    } else if (report?.toLowerCase() === 'pending jobs (bag type)') {
      dispatch(pendingJobByBagTypeExportExcel(machine));
      setMachine('');
    }
    setReportData('');
    setReportModal(false);
  };

  return (
    <>
      {(pendingJobsLoading || miscMasterLoading) && <Loader />}

      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white h-100">
          <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
            <h3 class="mb-0">Pending Jobs</h3>
          </div>
          <div className="report_list_wrapper p-3">
            <div className="row g-4">
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Flexo Print Jobs Cylinder Wise');
                  }}
                >
                  <img src={ReportIcon} alt="" />
                  Flexo Print Jobs Cylinder Wise
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Pending Jobs (Bag Type)');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Pending Jobs (Bag Type)
                </Button>
              </div>
              {/* <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Pending Jobs Summary');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Pending Jobs Summary
                </Button>
              </div> */}
            </div>
          </div>
        </div>
        <Dialog
          header={reportData}
          className="modal_Wrapper modal_small"
          visible={reportModal}
          draggable={false}
          onHide={() => {
            setReportModal(false);
            setReportData('');
            setMachine('');
          }}
        >
          {reportData?.toLowerCase() === 'pending jobs (bag type)' ? (
            <Row>
              <Col md={12} xs={12}>
                <div className="form_group mb-3">
                  <label htmlFor="Machine">Machine</label>
                  <ReactSelectSingle
                    filter
                    name="machine"
                    value={machine}
                    options={activeMachineTypeList}
                    onChange={e => {
                      setMachine(e.target.value);
                    }}
                    placeholder="Select Machine"
                  />
                </div>
              </Col>
              <Col xs={12}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handlePDFReport(reportData)}
                  disabled={!machine}
                >
                  <img src={Download} alt="" />
                  Download Report
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xs={6}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handleXLSReport(reportData)}
                >
                  <img src={Download} alt="" />
                  Download XLS
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handlePDFReport(reportData)}
                >
                  <img src={Download} alt="" />
                  Download PDF
                </Button>
              </Col>
            </Row>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default memo(PendingJobs);
