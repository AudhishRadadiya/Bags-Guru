import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { FileDrop } from 'react-file-drop';
import { InputText } from 'primereact/inputtext';
// import whatsappIcon from '../../Assets/Images/whatsapp.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import UploadIcon from '../../Assets/Images/upload.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import TriptaAmountMultiSelect from './TriptaAmountMultiSelect';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { Button, Col, Row } from 'react-bootstrap';
import {
  getTriptaAmountList,
  uploadTriptaFile,
} from 'Services/TriptaAmount/TriptaAmountService';
import {
  setTriptaAmountList,
  setTriptaAttachmentFile,
} from 'Store/Reducers/TriptaAmount/TriptaAmountSlice';
import { getMfgProcessFilterList } from 'Services/Production/mfgLiveServices';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { getCurrentUserFromLocal } from 'Services/baseService';
import {
  getPartiesAdvisor,
  getPartiesCitiesWithoutState,
  getPartiesStateWithoutCountry,
} from 'Services/partiesService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CollectionTable from './CollectionTable';
import WhatsAppDialog from './whatsapp/WhatsAppDialog';

const fileInitialData = {
  downloadUrl: '',
  fileName: '',
  message: '',
};

const initialValues = {
  last_update_date: '',
  tripta_attachment_file_name: '',
  tripta_attachment_file_data: fileInitialData,
};

const triptaAttachmentFileDataSchema = Yup.object({
  downloadUrl: Yup.string(),
  fileName: Yup.string(),
  message: Yup.string(),
});

const triptsValidationSchema = Yup.object().shape({
  last_update_date: Yup.string().required('Last Update Date is required'),
  tripta_attachment_file_name: Yup.string().notRequired(),
  tripta_attachment_file_data: triptaAttachmentFileDataSchema,
});

const TriptaAmount = () => {
  const ref = useRef();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const UserPreferencesData = getCurrentUserFromLocal();

  const [triptaModal, setTriptaModal] = useState(false);
  const [whatsAppContent, setWhatsAppContent] = useState({
    whatsAppData: {},
    whatsAppPopup: false,
  });

  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const { currentPage, pageLimit } = allFilters?.triptaAmount;
  const { searchQuery, filterToggle, field_filter } = allCommon?.triptaAmount;

  const {
    triptaAmountList,
    triptaAmountLoading,
    triptsUploadLoading,
    triptaAttachmentFile,
    sortCollectionField,
    sortCollectionOrder,
    // triptaAttachmentFileName,
    triptaAmountListCommonData,
  } = useSelector(({ triptaAmount }) => triptaAmount);

  const loadRequiredData = useCallback(() => {
    const current =
      UserPreferencesData?.role_name === 'Advisor' ? 0 : currentPage;
    const limit = UserPreferencesData?.role_name === 'Advisor' ? 0 : pageLimit;

    dispatch(getTriptaAmountList(limit, current, searchQuery, field_filter));
  }, [
    currentPage,
    dispatch,
    field_filter,
    pageLimit,
    searchQuery,
    UserPreferencesData,
  ]);

  useEffect(() => {
    dispatch(getMfgProcessFilterList());
    dispatch(getPartiesAdvisor());
    dispatch(getPartiesStateWithoutCountry());
    dispatch(getPartiesCitiesWithoutState());
    loadRequiredData();
  }, []);

  const submitHandle = useCallback(
    async (values, { setFieldValue, resetForm }) => {
      if (triptaAttachmentFile?.name) {
        const fileCollectionDate = values?.last_update_date
          ? moment(values?.last_update_date).format('DD-MM-YYYY')
          : '';

        const payload = {
          file: triptaAttachmentFile,
          date: fileCollectionDate,
        };
        const res = await dispatch(uploadTriptaFile(payload));

        if (res) {
          loadRequiredData();
          dispatch(setTriptaAmountList([]));
          setFieldValue('tripta_attachment_file_data', res);

          if (!res?.downloadUrl) {
            setTriptaModal(false);
            resetForm();
          }
        }
      }
    },
    [dispatch, loadRequiredData, triptaAttachmentFile],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    resetForm,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: triptsValidationSchema,
    onSubmit: submitHandle,
  });

  const onPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          triptaAmount: {
            ...allFilters?.triptaAmount,
            currentPage: updatedCurrentPage,
            pageLimit: page,
          },
        }),
      );

      dispatch(
        getTriptaAmountList(
          page,
          updatedCurrentPage,
          searchQuery,
          field_filter,
        ),
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
          triptaAmount: { ...allFilters?.triptaAmount, currentPage: pageIndex },
        }),
      );

      dispatch(
        getTriptaAmountList(pageLimit, pageIndex, searchQuery, field_filter),
      );
    },
    [dispatch, currentPage, allFilters, pageLimit, searchQuery, field_filter],
  );

  const handleSearchInput = (e, limit, filter) => {
    const updatedCurrentPage =
      UserPreferencesData?.role_name === 'Advisor' ? 0 : 1;

    dispatch(
      setAllFilters({
        ...allFilters,
        triptaAmount: {
          ...allFilters?.triptaAmount,
          currentPage: updatedCurrentPage,
        },
      }),
    );

    dispatch(
      getTriptaAmountList(limit, updatedCurrentPage, e.target.value, filter),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const filePicker = useCallback(() => {
    inputRef?.current?.click();
  }, []);

  const fileHandler = useCallback(
    async files => {
      if (!files || files.length === 0) return;

      const validExtensions = ['xls', 'xlsx'];

      const uploadedFiles = Array.from(files).filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return validExtensions.includes(ext);
      });

      if (uploadedFiles.length === 0) {
        alert('Only Excel files (.xls, .xlsx) are allowed.');
        return;
      }

      for (let i = 0; i < uploadedFiles.length; i++) {
        // dispatch(uploadTriptaFile(uploadedFiles[i]));
        setFieldValue('tripta_attachment_file_name', uploadedFiles[i].name);
        dispatch(setTriptaAttachmentFile(uploadedFiles[i]));
      }
    },
    [dispatch, setFieldValue],
  );

  const onRemove = useCallback(
    e => {
      dispatch(setTriptaAttachmentFile({}));
      setFieldValue('tripta_attachment_file_data', fileInitialData);
      setFieldValue('tripta_attachment_file_name', '');
      e.stopPropagation();
    },
    [dispatch, setFieldValue],
  );

  // const handleUploadFile = useCallback(async () => {
  //   if (triptaAttachmentFile?.name) {
  //     const fileCollectionDate = collectionDate
  //       ? moment(collectionDate).format('DD-MM-YYYY')
  //       : '';

  //     const payload = {
  //       file: triptaAttachmentFile,
  //       date: fileCollectionDate,
  //     };
  //     const res = await dispatch(uploadTriptaFile(payload));

  //     if (res) {
  //       setTriptaModal(false);
  //       loadRequiredData();
  //       dispatch(setTriptaAmountList([]));
  //       // setFieldValue('tripta_attachment_file', {});
  //       setFieldValue('tripta_attachment_file_name', '');
  //       dispatch(setTriptaAttachmentFile({}));
  //       // dispatch(setTriptaAttachmentFileName(''));
  //     }
  //   }
  // }, [
  //   collectionDate,
  //   triptaAttachmentFile,
  //   dispatch,
  //   loadRequiredData,
  //   setFieldValue,
  // ]);

  // const handleWhatsApp = data => {
  //   return (
  //     <span
  //       className="cursor-pointer"
  //       onClick={() =>
  //         setWhatsAppContent({
  //           whatsAppData: data,
  //           whatsAppPopup: true,
  //         })
  //       }
  //     >
  //       <img src={whatsappIcon} alt="" />
  //     </span>
  //   );
  // };

  // const footerGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column footer="Total" colSpan={7} />
  //       <Column footer={triptaAmountListCommonData?.total_tripta_total_due} />
  //       <Column
  //         footer={triptaAmountListCommonData?.total_tripta_0_to_15_amount}
  //       />
  //       <Column
  //         footer={triptaAmountListCommonData?.total_tripta_16_to_30_amount}
  //       />
  //       <Column
  //         footer={triptaAmountListCommonData?.total_tripta_31_to_45_amount}
  //       />
  //       <Column
  //         footer={triptaAmountListCommonData?.total_tripta_46_to_90_amount}
  //       />
  //       <Column
  //         footer={triptaAmountListCommonData?.total_tripta_above_90_amount}
  //       />
  //       <Column colSpan={2} />
  //     </Row>
  //   </ColumnGroup>
  // );

  // const onCopyText = text => {
  //   const res = copy(text, {
  //     debug: false,
  //     message: 'Tap to copy',
  //   });
  //   if (res) {
  //     toast('Text copied to clipboard', toastCongig);
  //   }
  // };

  // const onSort = e => {
  //   const { sortField, sortOrder } = e;

  //   dispatch(setSortCollectionField(sortField));
  //   dispatch(setSortCollectionOrder(sortOrder));
  // };

  // const TotalDuesTemplate = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_total_due)}`}</span>;
  // };

  // const tripta0to15Template = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_0_to_15_amount)}`}</span>;
  // };

  // const tripta16to30Template = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_16_to_30_amount)}`}</span>;
  // };

  // const tripta31to45Template = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_31_to_45_amount)}`}</span>;
  // };

  // const tripta46to90Template = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_46_to_90_amount)}`}</span>;
  // };

  // const triptaAbove90Template = row => {
  //   return <span>{`₹${thousandSeparator(row?.tripta_above_90_amount)}`}</span>;
  // };

  // const amountAddition = useCallback(
  //   (amount1 = 0, amount2 = 0, amount3 = 0) => {
  //     const amountCalculation = amount1 + amount2 + amount3;
  //     return amountCalculation;
  //   },
  //   [],
  // );

  return (
    <>
      {triptsUploadLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap ">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Collection</h3>
                </div>
              </Col>
              <Col md={9}>
                <div className="right_filter_wrapper table_header_search">
                  <ul>
                    {triptaAmountListCommonData?.last_updated_date && (
                      <li className="me-3">
                        <b>Last Updated Date:</b>{' '}
                        {moment(
                          triptaAmountListCommonData.last_updated_date,
                        ).format('DD-MM-YYYY')}
                      </li>
                    )}
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
                              UserPreferencesData?.role_name === 'Advisor'
                                ? 0
                                : pageLimit,
                              field_filter,
                            );
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                triptaAmount: {
                                  ...allCommon?.triptaAmount,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    {(UserPreferencesData?.role_name === 'Admin' ||
                      UserPreferencesData?.role_name === 'Accountant') && (
                      <li>
                        <Button
                          className="btn_border icon_btn"
                          onClick={() => setTriptaModal(true)}
                        >
                          <img src={ExportIcon} alt="" />
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <TriptaAmountMultiSelect />
          <div className="old_customer_wrapper">
            <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
              <button
                type="button"
                className="table_filter_btn"
                onClick={e => {
                  dispatch(
                    setAllCommon({
                      ...allCommon,
                      triptaAmount: {
                        ...allCommon?.triptaAmount,
                        filterToggle: !filterToggle,
                      },
                    }),
                  );
                }}
              >
                <img src={SearchIcon} alt="" />
              </button>

              <CollectionTable setWhatsAppContent={setWhatsAppContent} />

              <CustomPaginator
                dataList={triptaAmountList}
                pageLimit={pageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={currentPage}
                totalCount={triptaAmountListCommonData?.count}
                isRestrictTotalEntries
                isRestrictPagination
              />
            </div>
          </div>
        </div>

        <Dialog
          header="Collection"
          className="modal_Wrapper modal_small"
          visible={triptaModal}
          draggable={false}
          onHide={() => {
            setTriptaModal(false);
            resetForm();
          }}
        >
          <Row>
            <Col md={12} xs={12}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="LastUpdateDate">
                  Last Update Date <span className="text-danger fs-4">*</span>
                </label>
                <Calendar
                  id="LastUpdateDate"
                  name="last_update_date"
                  placeholder="Last Update Date"
                  value={values?.last_update_date}
                  dateFormat="dd-mm-yy"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showIcon
                  showButtonBar
                />
                {touched?.last_update_date && errors?.last_update_date && (
                  <p className="text-danger">{errors?.last_update_date}</p>
                )}
              </div>
            </Col>
            <Col md={12} xs={12}>
              <div className="form_group mb-3">
                <FileDrop
                  ref={ref}
                  onTargetClick={filePicker}
                  onDrop={f => fileHandler(f)}
                  className="image-dropzone"
                >
                  <div className="upload_file_custom">
                    <input
                      accept=".xls, .xlsx"
                      value={''}
                      style={{ visibility: 'hidden', opacity: 0 }}
                      ref={inputRef}
                      type="file"
                      multiple
                      onChange={e => fileHandler(e.target.files)}
                    />
                    <label
                      htmlFor="UploadFile"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={UploadIcon}
                        alt=""
                        className="img-fluid"
                        style={{
                          height: '60px',
                          objectFit: 'contain',
                          margin: '0',
                        }}
                      />
                      <div
                        className="upload_text"
                        style={{
                          margin: '0',
                          marginLeft: '15px',
                          maxWidth: 'auto',
                        }}
                      >
                        Upload your files
                      </div>
                    </label>
                  </div>
                </FileDrop>

                {!!values?.tripta_attachment_file_name && (
                  <div className="d-flex gap-3 mt-3 mb-3 align-items-center">
                    <h5 className="m-0">
                      {values.tripta_attachment_file_name}
                    </h5>
                    <div
                      style={{ height: '15px' }}
                      className="d-flex align-items-center"
                    >
                      <Button
                        className="btn_transperant"
                        onClick={e => {
                          onRemove(e);
                        }}
                      >
                        <img src={TrashIcon} alt="" className="mb-0" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col md={12} xs={12}>
              <Row>
                <Col sm={12} md={9} xs={9}>
                  <Col md={12} xs={12}>
                    {values?.tripta_attachment_file_data?.message && (
                      <>
                        <h6 className="text-danger">
                          {values.tripta_attachment_file_data.message}
                        </h6>
                        <a
                          href={values.tripta_attachment_file_data.downloadUrl}
                          target="_blank"
                          className="text-decoration-underline text-primary"
                          rel="noreferrer"
                        >
                          {values.tripta_attachment_file_data.fileName}
                        </a>
                      </>
                    )}
                  </Col>
                </Col>
                <Col sm={12} md={3} xs={3}>
                  <div className="d-flex justify-content-end">
                    <Button className="btn_primary" onClick={handleSubmit}>
                      Upload
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Dialog>

        <WhatsAppDialog
          whatsAppContent={whatsAppContent}
          setWhatsAppContent={setWhatsAppContent}
        />

        {/* <Dialog
          header="WhatsApp Text"
          visible={!!whatsAppContent?.whatsAppPopup}
          draggable={false}
          className="modal_Wrapper whatsapp_dialog"
          onHide={() =>
            setWhatsAppContent({
              whatsAppData: {},
              whatsAppPopup: false,
            })
          }
          style={{ width: '50vw' }}
        >
          <div className="d-flex justify-content-between whatsapp_list">
            <div>
              {amountAddition(
                whatsAppContent?.whatsAppData?.tripta_above_90_amount,
                whatsAppContent?.whatsAppData?.tripta_46_to_90_amount,
                whatsAppContent?.whatsAppData?.tripta_31_to_45_amount,
              ) === 0 ? (
                <>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 1</span>
                    <p>Hi,</p>
                    <p>
                      The bags have been dispatched to you. Request you to clear
                      the outstanding payment of{' '}
                      <span className="fw-bold">
                        {`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}
                      </span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 2</span>
                    <p>Hello,</p>
                    <p>
                      We have urgent requirement of funds and will be highly
                      obliged if you could clear the outstanding amount of{' '}
                      <span className="fw-bold">
                        {`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}
                      </span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 3</span>
                    <p>Greetings,</p>
                    <p>
                      Request you to look into our outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 4</span>
                    <p>Hi,</p>
                    <p>
                      I understand that you must have been occupied due to the
                      festive sale season. We have supported{' '}
                      <span className="fw-bold">
                        {whatsAppContent?.whatsAppData?.party_name}
                      </span>{' '}
                      in terms of giving extended credit periods. We are now in
                      grave need of funds. Request you to kindly clear the
                      pending dues of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 5</span>
                    <p>Hi,</p>
                    <p>
                      The bags have been supplied at a very nominal rate. It is
                      sustainable for us only if we get fast payment. Kindly
                      clear the pending amount of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>Very humbly asking you - how are we supposed to work?</p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 6</span>
                    <p>Hi,</p>
                    <p>
                      We have put in 110% effort to deliver the top notch
                      quality bags on time. Kindly clear the pending amount of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                </>
              ) : amountAddition(
                  whatsAppContent?.whatsAppData?.tripta_above_90_amount,
                  whatsAppContent?.whatsAppData?.tripta_46_to_90_amount,
                ) > 0 ? (
                <>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 1</span>
                    <p>
                      {`Our association with ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      } is very
                      long. We are grateful that you have trusted us for your
                      branded bags. Through mutual support, we have together
                      progresses and we are highly grateful for this.`}
                    </p>
                    <p>
                      {`I understand that you must have been occupied due to the
                      festive sale season. We have supported ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      } in
                      terms of giving extended credit periods. We are now in
                      grave need of funds.`}
                    </p>
                    <p>
                      <span className="fw-bold">
                        {`Rs. ₹${thousandSeparator(
                          amountAddition(
                            whatsAppContent?.whatsAppData
                              ?.tripta_above_90_amount,
                            whatsAppContent?.whatsAppData
                              ?.tripta_46_to_90_amount,
                          ),
                        )}`}{' '}
                        is due since more than 45 days.{' '}
                      </span>
                      Request you to kindly clear outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      In this competitive business world, very humbly asking you
                      - how are we supposed to work?
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 2</span>
                    <p>
                      I understand that you have lot many outlets to handle and
                      as a result there is always a cash crunch due to a large
                      working capital involved.
                    </p>
                    <p>
                      {`Since quite some time we are going in circles with ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      } orders
                      wherein, we are delivering the goods at regular intervals,
                      but the payments are not being released to us.`}
                    </p>
                    <p>
                      {`We appreciate the continuous business from ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      }, but
                      there is a huge gap between time of supply and time of
                      payment.`}
                    </p>
                    <p>
                      <span className="fw-bold">
                        {`Rs. ₹${thousandSeparator(
                          amountAddition(
                            whatsAppContent?.whatsAppData
                              ?.tripta_above_90_amount,
                            whatsAppContent?.whatsAppData
                              ?.tripta_46_to_90_amount,
                          ),
                        )}`}{' '}
                        is due since more than 45 days.{' '}
                      </span>
                      Request you to kindly clear outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      In this competitive business world, very humbly asking you
                      - how are we supposed to work?
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 3</span>
                    <p>
                      Kindly look into immediate payment of{' '}
                      <span className="fw-bold">
                        {`Rs. ₹${thousandSeparator(
                          amountAddition(
                            whatsAppContent?.whatsAppData
                              ?.tripta_above_90_amount,
                            whatsAppContent?.whatsAppData
                              ?.tripta_46_to_90_amount,
                          ),
                        )}`}{' '}
                        which is due since more than 45 days.{' '}
                      </span>{' '}
                      Request you to kindly clear the total outstanding payment
                      of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      We have huge pending payables to our suppliers, and things
                      are becoming very difficult.
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 4</span>
                    <p>Hello,</p>
                    <p>
                      We have urgent requirement of funds and will be highly
                      obliged if you could clear the outstanding amount of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 5</span>
                    <p>Greetings,</p>
                    <p>
                      Request you to look into our outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                </>
              ) : amountAddition(
                  whatsAppContent?.whatsAppData?.tripta_31_to_45_amount,
                ) > 0 ? (
                <>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 1</span>
                    <p>
                      {`I understand that you must have been occupied due to the
                      festive sale season. We have supported ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      } in
                      terms of giving extended credit period. We are in urgent
                      need of funds.`}
                    </p>
                    <p>
                      Request you to kindly clear outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      Business is highly competitive now - how are we supposed
                      to work?
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 2</span>
                    <p>
                      {`I understand that you have lot many outlets to handle and
                      as a result there is always a cash crunch due to a large
                      working capital involved.We appreciate the continuous
                      business from ${
                        whatsAppContent?.whatsAppData?.party_name ?? ''
                      }.`}
                    </p>
                    <p>
                      <span className="fw-bold">
                        {`Rs. ${whatsAppContent?.whatsAppData?.tripta_31_to_45_amount}`}{' '}
                        is due since more than 30 days.
                      </span>
                      Request you to kindly clear outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      Business is highly competitive now - how are we supposed
                      to work?
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 3</span>
                    <p>
                      Kindly look into immediate payment of{' '}
                      <span className="fw-bold">
                        {`Rs. ₹${thousandSeparator(
                          amountAddition(
                            whatsAppContent?.whatsAppData
                              ?.tripta_above_90_amount,
                            whatsAppContent?.whatsAppData
                              ?.tripta_46_to_90_amount,
                          ),
                        )}`}{' '}
                        which is due since more than 30 days.
                      </span>{' '}
                      Request you to kindly clear the total outstanding payment
                      of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                    <p>
                      We have huge pending payables to our suppliers, and things
                      are becoming very difficult.
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 4</span>
                    <p>Hello,</p>
                    <p>
                      We have urgent requirement of funds and will be highly
                      obliged if you could clear the outstanding amount of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                  <div className="list_item">
                    <span className="fw-bold option_title">OPTION: 5</span>
                    <p>Greetings,</p>
                    <p>
                      Request you to look into our outstanding payment of{' '}
                      <span className="fw-bold">{`Rs. ${whatsAppContent?.whatsAppData?.tripta_total_due}`}</span>
                    </p>
                  </div>
                </>
              ) : (
                'No Content Available'
              )}
            </div>
            // <img
              src={ClipboardIcon}
              className="me-2 cursor-pointer"
              onClick={() => onCopyText('Hello')}
              alt=""
            /> //
          </div>
          <div className="d-flex"></div>
        </Dialog> */}
      </div>
    </>
  );
};

export default memo(TriptaAmount);
