import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import ThumbnailMultiSelect from './ThumbnailMultiSelect';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { getThumbnailList } from 'Services/Thumbnail/ThumbnailService';
import {
  getPartiesCitiesWithoutState,
  getPartiesStateWithoutCountry,
} from 'Services/partiesService';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';

const Thumbnail = () => {
  const dispatch = useDispatch();

  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { currentPage, pageLimit } = allFilters?.thumbnail;
  const { searchQuery, field_filter } = allCommon?.thumbnail;

  const { thumbnailList, thumbnailLoading, thumbnailListCount } = useSelector(
    ({ thumbnail }) => thumbnail,
  );

  const loadRequiredData = useCallback(() => {
    dispatch(
      getThumbnailList(pageLimit, currentPage, searchQuery, field_filter),
    );
  }, [currentPage, dispatch, field_filter, pageLimit, searchQuery]);

  useEffect(() => {
    dispatch(getPartiesStateWithoutCountry());
    dispatch(getPartiesCitiesWithoutState());
    loadRequiredData();
  }, []);

  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          thumbnail: {
            ...allFilters?.thumbnail,
            currentPage: updatedCurrentPage,
            pageLimit: page,
          },
        }),
      );

      dispatch(
        getThumbnailList(page, updatedCurrentPage, searchQuery, field_filter),
      );
    },
    [dispatch, allFilters, field_filter, searchQuery],
  );

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          thumbnail: { ...allFilters?.thumbnail, currentPage: pageIndex },
        }),
      );

      dispatch(
        getThumbnailList(pageLimit, pageIndex, searchQuery, field_filter),
      );
    },
    [dispatch, currentPage, allFilters, pageLimit, searchQuery, field_filter],
  );

  const onImageDownload = async (waterMarkImage, designName) => {
    try {
      const response = await fetch(waterMarkImage, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${designName}-image`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  const handleSearchInput = (e, limit, filter) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        thumbnail: {
          ...allFilters?.thumbnail,
          currentPage: 1,
        },
      }),
    );

    dispatch(getThumbnailList(limit, 1, e.target.value, filter));
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {thumbnailLoading && <Loader />}

      <div className="main_Wrapper thumbnail_main">
        <div className="table_main_Wrapper bg-white h-100">
          <div className="top_filter_wrap ">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Thumbnail</h3>
                </div>
              </Col>
              <Col md={9}>
                <div className="right_filter_wrapper table_header_search">
                  <ul>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debounceHandleSearchInput(
                              e,
                              pageLimit,
                              field_filter,
                            );
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                thumbnail: {
                                  ...allCommon?.thumbnail,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

          <ThumbnailMultiSelect />

          <div className="data_table_wrapper">
            <Row className="p-datatable-wrapper p-2 m-0">
              {thumbnailList?.map((item, index) => {
                const {
                  party_name,
                  design_name,
                  city,
                  state,
                  product_code,
                  order_date,
                  water_mark_main_image,
                } = item;

                return (
                  <Col key={index} xl={3} lg={4} md={6} sm={12}>
                    <div className="thumbnail-card">
                      <div className="thumbnail-img">
                        <img src={water_mark_main_image} alt="" />
                      </div>
                      <div className="thumbnail-details">
                        <div>
                          <p>
                            <strong>Party Name:</strong> {party_name}
                          </p>
                          <p>
                            {' '}
                            <strong>Design Name:</strong> {design_name}
                          </p>
                          <p>
                            {' '}
                            <strong>City:</strong> {city}
                          </p>
                          <p>
                            {' '}
                            <strong>State:</strong> {state}
                          </p>
                          <p>
                            {' '}
                            <strong>Product Code:</strong> {product_code}
                          </p>
                          <p>
                            <strong>Order Date:</strong> {order_date}
                          </p>
                        </div>
                        <button
                          className="btn_primary btn btn-primary w-100 mt-2"
                          onClick={() => {
                            onImageDownload(water_mark_main_image, design_name);
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            <CustomPaginator
              dataList={thumbnailList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={thumbnailListCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Thumbnail;
