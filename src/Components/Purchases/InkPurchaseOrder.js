import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import ReactSelectSingle from '../../Components/Common/ReactSelectSingle';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import pdf from '../../Assets/Images/pdf.svg';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Link } from 'react-router-dom';

export default function InkPurchaseOrder() {
  const [machineNameSelct, setMachineNameSelct] = useState([]);
  const [value, setValue] = useState(25);
  const machineNameHandleChange = e => {
    setMachineNameSelct(e.value);
  };
  const machineName = [
    { label: 'Flexo', value: 'Flexo' },
    { label: 'Screen (Bag to Bag)', value: 'Screen (Bag to Bag)' },
    { label: 'Screen (Roll to Roll)', value: 'Screen (Roll to Roll)' },
  ];
  return (
    <div className="main_Wrapper">
      <div className="ink_purchase_top_wrap position-relative">
        <div className="border rounded-3 bg_white p-3 mb-3">
          <Button className="btn_transperant ink_pdf_btn">
            <img src={pdf} alt="" />
          </Button>
          <Row>
            <Col xl={2} lg={3} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="PONumber">P.O. Number</label>
                <InputText id="PONumber" placeholder="2491839" />
              </div>
            </Col>
            <Col xl={2} lg={3} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="InvoiceDate">Invoice Date</label>
                <Calendar
                  id="InvoiceDate"
                  placeholder="14/04/2023"
                  showIcon
                  showButtonBar
                  dateFormat="dd-mm-yy"
                />
              </div>
            </Col>
            <Col xl={2} lg={3} sm={6}>
              <div className="form_group mb-3">
                <label>Machine Name</label>
                <ReactSelectSingle
                  filter
                  value={machineNameSelct}
                  options={machineName}
                  onChange={e => {
                    machineNameHandleChange(e);
                  }}
                  placeholder="Select Machine Name"
                />
              </div>
            </Col>
          </Row>
          <div className="color_line_wrap">
            <ul>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
              <li>
                <span className="color_round"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ink_purchase_bottom_wrap">
        <div className="border rounded-3 bg_white p-3 mb-3">
          <div className="top_filter_wrap d-flex justify-content-between align-items-center mb-3">
            <div className="page_title">
              <h3 className="m-0">Ink Purchase Order</h3>
            </div>
            <div className="form_group">
              <InputText
                id="search"
                placeholder="Search"
                type="search"
                className="input_wrap small search_wrap"
              />
            </div>
          </div>
          <div className="color_box_wrapper">
            <ul>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill yellow_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill green_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill lightpink_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill peach_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill purple_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill yellow_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill green_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill lightpink_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill yellow_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill green_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill lightpink_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill peach_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill purple_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill yellow_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill green_bg"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="color_box_wrap">
                  <div className="color_box_top">
                    <div className="d-flex justify-content-between mb-1">
                      <h5>PMS Yellow C</h5>
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="Rememberme"
                          name="remember_me"
                          required
                        />
                      </div>
                    </div>
                    <div className="color_plus_wrap">
                      <InputNumber
                        value={value}
                        onValueChange={e => setValue(e.value)}
                        showButtons
                        buttonLayout="horizontal"
                        style={{ width: '4rem' }}
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus-circle"
                        decrementButtonIcon="pi pi-minus-circle"
                      />
                    </div>
                  </div>
                  <div className="color_box_bottom">
                    <span className="bg_fill lightpink_bg"></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="button_group d-flex justify-content-end">
        <Link to="" className="btn_border">
          Cancel
        </Link>
        <Link to="" className="btn_primary ms-3">
          Save
        </Link>
      </div>
    </div>
  );
}
