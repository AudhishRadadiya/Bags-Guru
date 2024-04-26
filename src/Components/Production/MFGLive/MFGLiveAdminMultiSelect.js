import React, { memo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch } from 'react-redux';
import ReactSelectSingle from 'Components/Common/ReactSelectSingle';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { getmfgLiveList } from 'Services/Production/mfgLiveServices';

function MFGLiveAdminMultiSelect() {
  const dispatch = useDispatch();
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { mfgLiveFilterList } = useSelector(({ mfgLive }) => mfgLive);
  const { searchQuery, field_filter } = allCommon?.mfgLive;
  const { applied, currentPage, pageLimit, dates } = allFilters?.mfgLive;

  const handleFilterData = () => {
    dispatch(
      getmfgLiveList(
        pageLimit,
        currentPage,
        searchQuery,
        applied,
        dates,
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
              options={mfgLiveFilterList?.partyList}
              placeholder="Party Name"
              value={field_filter?.party_name}
              className="w-100"
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
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
              options={mfgLiveFilterList?.productDesignList}
              placeholder="Design Name"
              className="w-100"
              value={field_filter?.design}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        design: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Advisor Name"
              className="w-100"
              options={mfgLiveFilterList?.advisorList}
              value={field_filter?.present_advisor_name}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        present_advisor_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Bag Type"
              className="w-100"
              options={mfgLiveFilterList?.bagTypeList}
              value={field_filter?.bag_type}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        bag_type: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Lamination"
              className="w-100"
              options={mfgLiveFilterList?.laminationTypeList}
              value={field_filter?.lamination_type}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        lamination_type: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Print"
              className="w-100"
              options={mfgLiveFilterList?.printTypeList}
              value={field_filter?.print_type_name}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        print_type_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Fabric color"
              className="w-100"
              options={mfgLiveFilterList?.fabricColorList}
              value={field_filter?.fabric_color}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        fabric_color: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              name="gsm"
              placeholder="GSM"
              className="w-100"
              options={mfgLiveFilterList?.gsmList}
              value={field_filter?.gsm}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        gsm: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <ReactSelectSingle
              filter
              name="suggested_product_id"
              maxSelectedLabels={1}
              placeholder="Screen Print"
              className="w-100"
              options={mfgLiveFilterList?.screenPrintList}
              value={field_filter?.screen_print}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.field_filter,
                        screen_print: e.target.value,
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
            <Button className="btn_primary" onClick={handleFilterData}>
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
                    mfgLive: {
                      ...allCommon?.mfgLive,
                      field_filter: {
                        ...allCommon?.mfgLive?.balnk_field_filter,
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
}

export default memo(MFGLiveAdminMultiSelect);
