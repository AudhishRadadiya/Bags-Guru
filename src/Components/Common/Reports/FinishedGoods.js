import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { memo, useEffect, useMemo, useState } from 'react';
import ReportIcon from '../../../Assets/Images/reports.svg';
import Download from '../../../Assets/Images/download.svg';
import { Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../ReactSelectSingle';
import {
  getActiveFormList,
  getActiveWarehouseList,
} from 'Services/Settings/MiscMasterService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  finishedGoodsPrintExportExcel,
  finishedGoodsPrintedPrintExportExcel,
} from 'Services/Report/FinishedGoodService';
import Loader from '../Loader';

const FinishedGoods = () => {
  const dispatch = useDispatch();

  const [finishedGoodsModal, setFinishedGoodsModal] = useState({
    modal: false,
    modalName: '',
  });
  const [warehouseValue, setWarehouseValue] = useState('');
  const [formValue, setFormValue] = useState('');

  const { activeFormList, activeWarehouseList } = useSelector(
    ({ miscMaster }) => miscMaster,
  );

  const { finishedGoodsLoading } = useSelector(
    ({ salesTurnover }) => salesTurnover,
  );

  const warehouse = useMemo(() => {
    const updateOptions = activeWarehouseList.map(item => {
      return {
        label: item?.label,
        value: item.value,
      };
    });
    return [{ label: 'All', value: '' }, ...updateOptions];
  }, [activeWarehouseList]);

  useEffect(() => {
    if (activeFormList?.length) {
      setFormValue(activeFormList[0]?._id);
    }
  }, [activeFormList]);

  useEffect(() => {
    dispatch(getActiveWarehouseList());
    dispatch(getActiveFormList());
  }, [dispatch]);

  const handlePrintXLSFile = reportName => {
    if (reportName?.toLowerCase() === 'finished goods (common print)') {
      dispatch(finishedGoodsPrintExportExcel(formValue, warehouseValue));
    } else {
      dispatch(finishedGoodsPrintedPrintExportExcel(formValue, warehouseValue));
    }
    setFinishedGoodsModal({
      modal: false,
      modalName: '',
    });
  };

  return (
    <>
      {finishedGoodsLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white h-100">
          <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
            <h3 class="mb-0">Finished Goods</h3>
          </div>
          <div className="report_list_wrapper p-3">
            <div className="row g-4">
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() =>
                    setFinishedGoodsModal({
                      modal: true,
                      modalName: 'Finished Goods (Common Print)',
                    })
                  }
                >
                  <img src={ReportIcon} alt="" /> Finished Goods (Common Print)
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn_border"
                  onClick={() =>
                    setFinishedGoodsModal({
                      modal: true,
                      modalName: 'Finished Goods (Printed)',
                    })
                  }
                >
                  <img src={ReportIcon} alt="" /> Finished Goods (Printed)
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header={finishedGoodsModal?.modalName}
          className="modal_Wrapper modal_small"
          visible={finishedGoodsModal?.modal}
          draggable={false}
          onHide={() => {
            setFinishedGoodsModal({
              modal: false,
              modakName: '',
            });
            setWarehouseValue('');
            setFormValue(activeFormList[0]?._id);
          }}
        >
          <Row>
            <Col lg={6} md={6} sm={6}>
              <div className="form_group mb-3">
                <label>
                  Form <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name="form"
                  value={formValue}
                  options={activeFormList}
                  onChange={e => {
                    setFormValue(e.target.value);
                  }}
                  placeholder="Select Form"
                />
              </div>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <div className="form_group mb-3">
                <label>
                  Warehouse Name <span className="text-danger fs-4">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name="warehouse"
                  value={warehouseValue}
                  options={warehouse}
                  onChange={e => {
                    setWarehouseValue(e.target.value);
                  }}
                  placeholder="Select Warehouse"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button
                className="btn_border w-100"
                onClick={() =>
                  handlePrintXLSFile(finishedGoodsModal?.modalName)
                }
              >
                <img src={Download} alt="" />
                Download XLS
              </Button>
            </Col>
          </Row>
        </Dialog>
      </div>
    </>
  );
};

export default memo(FinishedGoods);
