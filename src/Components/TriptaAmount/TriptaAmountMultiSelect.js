import { MultiSelect } from 'primereact/multiselect';
import React, { memo, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { getTriptaAmountList } from 'Services/TriptaAmount/TriptaAmountService';
import { setAllCommon } from 'Store/Reducers/Common';
import { setTriptaAmountList } from 'Store/Reducers/TriptaAmount/TriptaAmountSlice';

const TriptaAmountMultiSelect = () => {
  const dispatch = useDispatch();
  const UserPreferencesData = getCurrentUserFromLocal();

  const { partiesAdvisor } = useSelector(({ parties }) => parties);
  const { mfgLiveFilterList } = useSelector(({ mfgLive }) => mfgLive);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { partiesStateWithoutCountry, partiesCitiesWithoutState } = useSelector(
    ({ parties }) => parties,
  );

  const { currentPage, pageLimit } = allFilters?.triptaAmount;
  const { searchQuery, field_filter } = allCommon?.triptaAmount;

  const handleFilterData = () => {
    const updatedCurrentPage =
      UserPreferencesData?.role_name === 'Advisor' ? 0 : currentPage;

    const updatedPageLimit =
      UserPreferencesData?.role_name === 'Advisor' ? 0 : pageLimit;

    dispatch(
      getTriptaAmountList(
        updatedPageLimit,
        updatedCurrentPage,
        searchQuery,
        field_filter,
      ),
    );
  };

  const checkFilterData = useMemo(() => {
    return Object.keys(field_filter).some(key => field_filter[key]?.length > 0);
  }, [field_filter]);

  return (
    <div className="mfg_filter_wrrap p-2">
      <Row className="g-2 d-md-flex justify-content-end">
        <Col xl={2} md={4} xs={12}>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="City"
              className="w-100"
              options={partiesCitiesWithoutState}
              value={field_filter?.city_name}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    triptaAmount: {
                      ...allCommon?.triptaAmount,
                      field_filter: {
                        ...field_filter,
                        city_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xl={2} md={4} xs={12}>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="State"
              className="w-100"
              options={partiesStateWithoutCountry}
              value={field_filter?.state_name}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    triptaAmount: {
                      ...allCommon?.triptaAmount,
                      field_filter: {
                        ...field_filter,
                        state_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xl={2} md={4} xs={12}>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              placeholder="Advisor Name"
              className="w-100"
              options={partiesAdvisor}
              value={field_filter?.present_advisor}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    triptaAmount: {
                      ...allCommon?.triptaAmount,
                      field_filter: {
                        ...field_filter,
                        present_advisor: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xl={2} md={4} xs={12}>
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
                    triptaAmount: {
                      ...allCommon?.triptaAmount,
                      field_filter: {
                        ...field_filter,
                        party_name: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
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
                      triptaAmount: {
                        ...allCommon?.triptaAmount,
                        field_filter: {
                          ...allCommon?.triptaAmount?.blank_field_filter,
                        },
                      },
                    }),
                  );

                  if (checkFilterData) {
                    dispatch(setTriptaAmountList([]));
                    dispatch(
                      getTriptaAmountList(
                        pageLimit,
                        currentPage,
                        searchQuery,
                        allCommon?.triptaAmount?.blank_field_filter,
                      ),
                    );
                  }
                }}
                disabled={!checkFilterData}
              >
                Reset
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default memo(TriptaAmountMultiSelect);
