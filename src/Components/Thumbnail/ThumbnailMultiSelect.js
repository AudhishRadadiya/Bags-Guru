import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { setAllCommon } from 'Store/Reducers/Common';
import { getThumbnailList } from 'Services/Thumbnail/ThumbnailService';
import { setThumbnailList } from 'Store/Reducers/Thumbnail/ThumbnailSlice';

const ThumbnailMultiSelect = () => {
  const dispatch = useDispatch();

  const { partiesStateWithoutCountry, partiesCitiesWithoutState } = useSelector(
    ({ parties }) => parties,
  );

  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { searchQuery, field_filter } = allCommon?.thumbnail;
  const { currentPage, pageLimit } = allFilters?.thumbnail;

  const handleFilterData = () => {
    dispatch(
      getThumbnailList(pageLimit, currentPage, searchQuery, field_filter),
    );
  };

  const checkFilterData = useMemo(() => {
    return Object.keys(field_filter).some(key => field_filter[key]?.length > 0);
  }, [field_filter]);

  return (
    <div className="mfg_filter_wrrap p-2 top_filter_wrap ">
      <Row className="g-2 justify-content-end">
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
                    thumbnail: {
                      ...allCommon?.thumbnail,
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
                    thumbnail: {
                      ...allCommon?.thumbnail,
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
                      thumbnail: {
                        ...allCommon?.thumbnail,
                        field_filter: {
                          ...allCommon?.thumbnail?.blank_field_filter,
                        },
                      },
                    }),
                  );

                  if (checkFilterData) {
                    dispatch(setThumbnailList([]));
                    dispatch(
                      getThumbnailList(
                        pageLimit,
                        currentPage,
                        searchQuery,
                        allCommon?.thumbnail?.blank_field_filter,
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

export default memo(ThumbnailMultiSelect);
