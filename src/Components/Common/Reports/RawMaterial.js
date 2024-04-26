import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { memo, useEffect, useState } from 'react';
import ReportIcon from '../../../Assets/Images/reports.svg';
import Download from '../../../Assets/Images/download.svg';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getActiveMaterialList } from 'Services/Settings/MiscMasterService';
import { useDispatch } from 'react-redux';
import ReactSelectSingle from '../ReactSelectSingle';
import {
  fabrickStockByColorExportExcel,
  fabrickStockByColorExportPDF,
  fabrickStockByGSMExportExcel,
  fabrickStockByGSMExportPDF,
  laminatedRollStockExportExcel,
  laminatedRollStockExportPDF,
  rollAgeingReportExportExcel,
} from 'Services/Report/RawMaterialService';
import Loader from '../Loader';

const RawMaterial = () => {
  const dispatch = useDispatch();

  const [material, setMaterial] = useState('');
  const [reportData, setReportData] = useState('');
  const [reportModal, setReportModal] = useState(false);

  const { activeMaterialList, miscMasterLoading } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  const { rawMaterialLoading } = useSelector(
    ({ salesTurnover }) => salesTurnover,
  );

  const checkReport = [
    'non laminated rolls (gsm wise)',
    'non laminated rolls (colour wise)',
  ].includes(reportData?.toLowerCase());

  useEffect(() => {
    dispatch(getActiveMaterialList());
  }, []);

  const handleXLSReport = report => {
    if (report?.toLowerCase() === 'non laminated rolls (gsm wise)') {
      const findObj = activeMaterialList?.find(item => item?._id === material);
      dispatch(fabrickStockByGSMExportExcel(findObj?.name));
    } else if (report?.toLowerCase() === 'non laminated rolls (colour wise)') {
      const findObj = activeMaterialList?.find(item => item?._id === material);
      dispatch(fabrickStockByColorExportExcel(findObj?.name));
    } else if (report?.toLowerCase() === 'laminated rolls') {
      dispatch(laminatedRollStockExportExcel());
    } else if (report?.toLowerCase() === 'roll ageing report') {
      dispatch(rollAgeingReportExportExcel());
    }
    setMaterial('');
    setReportData('');
    setReportModal(false);
  };

  const handlePDFReport = report => {
    if (report?.toLowerCase() === 'non laminated rolls (gsm wise)') {
      const findObj = activeMaterialList?.find(item => item?._id === material);
      dispatch(fabrickStockByGSMExportPDF(findObj?.name));
    } else if (report?.toLowerCase() === 'non laminated rolls (colour wise)') {
      const findObj = activeMaterialList?.find(item => item?._id === material);
      dispatch(fabrickStockByColorExportPDF(findObj?.name));
    } else if (report?.toLowerCase() === 'laminated rolls') {
      dispatch(laminatedRollStockExportPDF());
    }
    setMaterial('');
    setReportData('');
    setReportModal(false);
  };

  return (
    <>
      {(rawMaterialLoading || miscMasterLoading) && <Loader />}

      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white h-100">
          <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
            <h3 class="mb-0">Raw Material</h3>
          </div>
          <div className="report_list_wrapper p-3">
            <div className="row g-4">
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Non Laminated Rolls (GSM Wise)');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Non Laminated Rolls (GSM Wise)
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Non Laminated Rolls (Colour Wise)');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Non Laminated Rolls (Colour
                  Wise)
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Laminated Rolls');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Laminated Rolls
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() => {
                    setReportModal(true);
                    setReportData('Roll Ageing Report');
                  }}
                >
                  <img src={ReportIcon} alt="" /> Roll Ageing Report
                </Button>
              </div>
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
            setMaterial('');
          }}
        >
          {reportData?.toLowerCase() === 'roll ageing report' ? (
            <Row>
              <Col xs={12}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handleXLSReport(reportData)}
                >
                  <img src={Download} alt="" />
                  Download Report
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              {checkReport && (
                <Col md={12} xs={12}>
                  <div className="form_group mb-3">
                    <label htmlFor="Material">Material</label>
                    <ReactSelectSingle
                      filter
                      name="material"
                      value={material}
                      options={activeMaterialList}
                      onChange={e => {
                        setMaterial(e.target.value);
                      }}
                      placeholder="Select Material"
                    />
                  </div>
                </Col>
              )}
              <Col xs={6}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handleXLSReport(reportData)}
                  disabled={checkReport && !material}
                >
                  <img src={Download} alt="" />
                  Download XLS
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  className="btn_border w-100"
                  onClick={() => handlePDFReport(reportData)}
                  disabled={checkReport && !material}
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

export default memo(RawMaterial);
