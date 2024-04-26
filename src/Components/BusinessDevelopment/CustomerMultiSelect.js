import React, { memo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { useSelector } from 'react-redux';
import { getShowCustomerList } from 'Store/Reducers/Customer/CustomerService';

const CustomerMultiSelect = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(({ auth }) => auth);
  const { typeSelect, customerFilterListOptions } = useSelector(
    ({ customer }) => customer,
  );
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, field_filter } = allCommon?.customer;
  const { applied, currentPage, pageLimit } = allFilters?.customer;

  const handleCustomerFieldFilter = () => {
    dispatch(
      getShowCustomerList(
        typeSelect,
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        field_filter,
      ),
    );
  };

  return (
    <div className="mfg_filter_wrrap p-2">
      <Row className="g-2">
        <Col md={2}>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={customerFilterListOptions?.partyList}
              placeholder="Party Name"
              value={field_filter?.party_name}
              className="w-100"
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.field_filter,
                        party_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col md={2}>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={customerFilterListOptions?.partyTypeList}
              placeholder="Party Type"
              className="w-100"
              value={field_filter?.party_type}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.field_filter,
                        party_type: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        {currentUser?.role_name?.toLowerCase() !== 'advisor' && (
          <Col>
            <div className="form_group">
              <MultiSelect
                filter
                maxSelectedLabels={3}
                placeholder="Advisor Name"
                className="w-100"
                options={customerFilterListOptions?.advisorList}
                value={field_filter?.present_advisor_name}
                onChange={e => {
                  dispatch(
                    setAllCommon({
                      ...allCommon,
                      customer: {
                        ...allCommon?.customer,
                        field_filter: {
                          ...allCommon?.customer?.field_filter,
                          present_advisor_name: e.target.value,
                        },
                      },
                    }),
                  );
                }}
              />
            </div>
          </Col>
        )}
        <Col>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="Customer Group"
              className="w-100"
              options={customerFilterListOptions?.customerGroupList}
              value={field_filter?.customer_group}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.field_filter,
                        customer_group: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="State"
              className="w-100"
              options={customerFilterListOptions?.stateList}
              value={field_filter?.state}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.field_filter,
                        state: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="City"
              className="w-100"
              options={customerFilterListOptions?.cityList}
              value={field_filter?.city}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.field_filter,
                        city: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>

        <Col xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button className="btn_primary" onClick={handleCustomerFieldFilter}>
              Apply
            </Button>
          </div>
        </Col>

        <Col xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button
              className="btn_primary"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    customer: {
                      ...allCommon?.customer,
                      field_filter: {
                        ...allCommon?.customer?.balnk_field_filter,
                      },
                    },
                  }),
                );
              }}
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(CustomerMultiSelect);
