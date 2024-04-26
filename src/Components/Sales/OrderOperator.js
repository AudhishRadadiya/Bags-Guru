import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useDispatch } from 'react-redux';
import {
  addBagOrderJob,
  getProductFromBagSizeList,
  getProductSizeList,
  setFilteredListAction,
  setOrderOperatorFilterAction,
} from 'Services/Sales/OrderServices';
import { useSelector } from 'react-redux';
import { setProductFromBagSizeList } from 'Store/Reducers/Sales/SalesOrderSlice';
import { getFormattedDate } from 'Helper/Common';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';
import { setAllCommon } from 'Store/Reducers/Common';

const pendingOrdersTemplate = ({ main_image }) => {
  return (
    <div className="product_img job_detail_img">
      <img src={main_image} alt="" />
    </div>
  );
};

// const bagRateTemplate = (val, data, tableHandleChange) => {
//   return (
//     <div className="form_group">
//       <InputText
//         id="bagRate"
//         type="number"
//         placeholder="Bag Rate"
//         value={val || ''}
//         onChange={e =>
//           tableHandleChange('rate', Number(e.target.value), data?._id)
//         }
//         required
//       />
//     </div>
//   );
// };

const QtyTemplate = (val, data, tableHandleChange) => {
  return (
    <div className="form_group">
      <InputText
        id="qty"
        placeholder="Qty"
        value={val}
        onChange={e =>
          tableHandleChange('qty', Number(e.target.value), data?._id)
        }
        required
      />
    </div>
  );
};

export default function OrderOperator({ hasAccess }) {
  const dispatch = useDispatch();
  const { allCommon } = useSelector(({ common }) => common);
  const { searchQuery, orderOperatorFilter } = allCommon?.orderOperator;
  const { filteredList, filterCheckedData, width, height, gusset, gsm } =
    orderOperatorFilter;
  const [selectedList, setSelectedList] = useState([]);
  const [productDetail, setProductDetail] = useState(false);
  const [jobDate, setJobDate] = useState(new Date());

  const {
    salesOrderLoading,
    salesOrderCRUDLoading,
    productSizeList,
    productFromBagSizeList,
  } = useSelector(({ salesOrder }) => salesOrder);

  const loadData = useCallback(async () => {
    if (filteredList.length === 0) {
      const res = await dispatch(getProductSizeList());
      if (res) {
        dispatch(
          setAllCommon({
            ...allCommon,
            orderOperator: {
              ...allCommon?.orderOperator,
              orderOperatorFilter: {
                ...allCommon?.orderOperator?.orderOperatorFilter,
                filteredList:
                  allCommon?.orderOperator?.orderOperatorFilter?.filteredList
                    .length > 0
                    ? allCommon?.orderOperator?.orderOperatorFilter
                        ?.filteredList
                    : res,
              },
            },
          }),
        );
      }
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(
      getProductFromBagSizeList(
        {
          width,
          height,
          gusset,
          gsm,
        },
        filterCheckedData,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, gsm, gusset, filterCheckedData]);

  const handleFilter = useCallback(
    val => {
      const filtered = productSizeList?.filter(x =>
        x?.str?.toLowerCase()?.includes(val?.toLowerCase()),
      );
      dispatch(setFilteredListAction(filtered));
    },
    [productSizeList],
  );

  const onBagSizeChange = useCallback(
    (val, data, index) => {
      if (val) dispatch(setOrderOperatorFilterAction(data));
      else {
        const widthArr = [];
        const heightArr = [];
        const gussetArr = [];
        const gsmArr = [];
        const checkedFilterData = filterCheckedData?.filter(
          x =>
            x.width !== data.width ||
            x.height !== data.height ||
            x.gusset !== data.gusset ||
            x.gsm !== data.gsm,
        );

        checkedFilterData?.forEach(x => {
          widthArr.push(x.width);
          heightArr.push(x.height);
          gussetArr.push(x.gusset);
          gsmArr.push(x.gsm);
        });

        dispatch(
          setAllCommon({
            ...allCommon,
            orderOperator: {
              ...allCommon?.orderOperator,
              orderOperatorFilter: {
                ...allCommon?.orderOperator?.orderOperatorFilter,
                filterCheckedData: checkedFilterData,
                width: widthArr,
                height: heightArr,
                gusset: gussetArr,
                gsm: gsmArr,
              },
            },
          }),
        );
      }
      let list = [...JSON.parse(JSON.stringify(filteredList))];
      list[index].isSelected = val;
      dispatch(setFilteredListAction(list));
    },
    [filteredList, gsm, gusset, height, width, filterCheckedData],
  );

  const onProductChange = useCallback(
    (val, index) => {
      let list = [...JSON.parse(JSON.stringify(productFromBagSizeList))];
      list[index].isSelected = val;
      dispatch(setProductFromBagSizeList(list));
    },
    [dispatch, productFromBagSizeList],
  );

  const tableHandleChange = useCallback(
    (key, val, id) => {
      let list = [...JSON.parse(JSON.stringify(selectedList))];
      const index = list?.findIndex(x => x?._id === id);
      if (index >= 0) list[index][key] = val;
      setSelectedList(list);
    },
    [selectedList],
  );

  const onSubmit = useCallback(async () => {
    const payload = {
      due_date: getFormattedDate(jobDate),
      order_job:
        selectedList?.map(x => ({
          product_id: x?._id,
          qty: x?.qty,
          // rate: x?.rate,
        })) || [],
    };

    const res = await dispatch(addBagOrderJob(payload));
    if (res) {
      setSelectedList([]);
      setJobDate('');
      setProductDetail(false);
    }
  }, [dispatch, jobDate, selectedList]);

  const onCancel = useCallback(() => {
    setSelectedList([]);
    setProductDetail(false);
  }, []);

  const onCancelProduct = useCallback(() => {
    let list = [...JSON.parse(JSON.stringify(productFromBagSizeList))];
    list = list?.map(x => ({
      ...x,
      isSelected: false,
    }));
    dispatch(setProductFromBagSizeList(list));
    setJobDate('');
  }, [dispatch, productFromBagSizeList]);

  return (
    <>
      {(salesOrderLoading || salesOrderCRUDLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="order_operator_wrap border rounded-3 bg_white p-3">
          <h3 className="mb-3">Product Details</h3>
          <div className="order_operator_flex">
            <div className="order_operator_left_wrap">
              <div className="order_operator_left border rounded-3 bg_white p-3 h-100">
                <h3 className="mb-3">Bag Size</h3>
                <div className="size_checkbox_wrap">
                  <div className="mb-3">
                    <InputText
                      id="search"
                      placeholder="Search"
                      type="search"
                      value={searchQuery}
                      className="input_wrap small search_wrap w-100"
                      onChange={e => {
                        dispatch(
                          setAllCommon({
                            ...allCommon,
                            orderOperator: {
                              ...allCommon?.orderOperator,
                              searchQuery: e.target.value,
                            },
                          }),
                        );
                        handleFilter(e.target.value);
                      }}
                    />
                  </div>
                  <ul>
                    {filteredList?.map((x, i) => {
                      return (
                        <li className="grey_border_box" key={i}>
                          <div className="checkbox_wrap">
                            <Checkbox
                              inputId="gsm1"
                              name="gsm1"
                              value={x}
                              onChange={e => onBagSizeChange(e.checked, x, i)}
                              checked={x?.isSelected === true}
                            />
                            <label htmlFor={`gsm-${i}`}>
                              {x?.gusset !== 0
                                ? `W ${x?.width} × H ${x?.height} × G ${x?.gusset} (${x?.gsm} GSM)`
                                : `W ${x?.width} × H ${x?.height} (${x?.gsm} GSM)`}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="order_operator_right_wrap">
              <div className="order_operator_right">
                <ul>
                  {productFromBagSizeList?.map((x, i) => {
                    return (
                      <li key={i}>
                        <div className="product_box">
                          <div className="product_img">
                            <img src={x?.main_image} alt="BagImage" />
                            <Checkbox
                              inputId="productCheck"
                              name="productCheck"
                              value={x?._id}
                              onChange={e => onProductChange(e.checked, i)}
                              checked={x?.isSelected === true}
                            />
                          </div>
                          <div className="product_content">
                            <h5 className="text_light mb-1 fw_600">
                              {x?.gusset !== 0
                                ? `W ${x?.width} × H ${x?.height} × G ${x?.gusset} (${x?.gsm} GSM)`
                                : `W ${x?.width} × H ${x?.height} (${x?.gsm} GSM)`}
                            </h5>
                            <h5 className="m-0">
                              {x?.design_name}:- {x?.fabric_color}
                            </h5>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="button_group d-flex align-items-center justify-content-end pt-3">
                <Button className="btn_border" onClick={onCancelProduct}>
                  Cancel
                </Button>
                <Button
                  disabled={
                    productFromBagSizeList?.find(x => x?.isSelected)
                      ? false
                      : true
                  }
                  onClick={() => {
                    setProductDetail(true);
                    setSelectedList(
                      productFromBagSizeList?.filter(x => x?.isSelected),
                    );
                  }}
                  className="btn_primary ms-3"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header="Job Details"
          visible={productDetail}
          draggable={false}
          className="modal_Wrapper modal_medium"
          onHide={() => setProductDetail(false)}
        >
          <div className="product_detail_content_wrap">
            <Row className="justify-content-end">
              <Col xs={4}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="JobDate">Delivery Date</label>
                  <Calendar
                    id="JobDate"
                    value={jobDate}
                    placeholder="Select a Delivery Date"
                    showIcon
                    dateFormat="dd-mm-yy"
                    minDate={new Date()}
                    readOnlyInput
                    onChange={e => setJobDate(e.value)}
                    required
                    showButtonBar
                  />
                </div>
              </Col>
            </Row>
            <div className="data_table_wrapper with_image_column mb-3 border max_height">
              <DataTable
                value={selectedList}
                // paginator
                // rows={10}
                // rowsPerPageOptions={[5, 10, 25]}
                // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              >
                <Column
                  field="main_image"
                  header="Image"
                  sortable
                  body={pendingOrdersTemplate}
                ></Column>
                <Column
                  field="design_name"
                  header="Design Name"
                  sortable
                ></Column>
                <Column field="size_gsm" header="Size & GSM" sortable></Column>
                {/* <Column
                  field="rate"
                  header="Bag Rate"
                  sortable
                  body={e => bagRateTemplate(e.rate, e, tableHandleChange)}
                ></Column> */}
                <Column
                  field="qty"
                  header="Qty"
                  sortable
                  body={e => QtyTemplate(e.qty, e, tableHandleChange)}
                ></Column>
              </DataTable>
            </div>
            <div className="button_group d-flex align-items-center justify-content-end">
              <Button
                className="btn_border"
                onClick={onCancel}
                disabled={salesOrderCRUDLoading}
              >
                Cancel
              </Button>
              <Button
                className="btn_primary ms-2"
                onClick={onSubmit}
                disabled={selectedList?.length <= 0}
              >
                Save
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}
