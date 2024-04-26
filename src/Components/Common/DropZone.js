import { memo, useCallback, useRef, useState } from 'react';
import { FileDrop } from 'react-file-drop';
import UploadIcon from '../../Assets/Images/upload.svg';
import Download from '../../Assets/Images/download.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadFile } from 'Services/CommonService';
import { addWaterMarkToImage } from 'Services/Products/ProductService';
import { Button } from 'primereact/button';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  setAddSelectedProductData,
  setDupicateSelectedProductData,
  setUpdateSelectedProductData,
} from 'Store/Reducers/Products/ProductSlice';

const renderToast = () =>
  toast.error('Please try again, something went wrong!');

const DropZone = memo(
  ({
    value,
    module,
    setFieldValue,
    fieldName,
    fieldImgName, // for dynamic change state when fill up data in add module
    fieldImgValue, // for dynamic change state when fill up data in add module
    disabled,
    fileName,
    initialImgValue, // for dynamic change state when fill up data in add module
    setInitialImgValue, // for dynamic change state when fill up data in add module
    initialAddImgValue,
    initialUpdateImgValue,
    // initialDuplicateImgValue,
    setAddInitialImgValue,
    setUpdateInitialImgValue,
    // setDuplicateInitialImgValue,
    handleChangeFieldsdData,
    // values,
  }) => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const locationPath = pathname?.split('/');
    const { id, proformaId, product_id, purchase_id } = useParams();

    const [filename, setName] = useState();
    const [image, setImage] = useState(null);

    const {
      addSelectedProductData,
      updateSelectedProductData,
      dupicateSelectedProductData,
    } = useSelector(({ product }) => product);

    const fileHandler = useCallback(
      async files => {
        if (
          fieldName === 'water_mark_main_image' ||
          fieldName === 'water_mark_real_image'
        )
          return;

        const nameLength = files[0]?.name?.split('.');
        const extension = nameLength[nameLength?.length - 1]?.toLowerCase();

        const uploadedFile = files[0];

        if (
          (extension === 'jpg' ||
            extension === 'jpeg' ||
            extension === 'png') &&
          files[0]
        ) {
          const fileSizeLimit = 1 * 1024 * 1024; // 1MB limit
          if (uploadedFile?.size <= fileSizeLimit) {
            const result = await dispatch(uploadFile(uploadedFile));
            if (result) {
              setImage(result);
              if (['party', 'sales', 'purchase'].includes(module)) {
                setFieldValue(fieldName, result);
                setFieldValue(fieldImgName, uploadedFile?.name);

                if (id || proformaId || purchase_id) {
                  dispatch(
                    setUpdateInitialImgValue({
                      ...initialUpdateImgValue,
                      [fieldName]: result,
                      [fieldImgName]: uploadedFile?.name,
                    }),
                  );
                } else {
                  dispatch(
                    setAddInitialImgValue({
                      ...initialAddImgValue,
                      [fieldName]: result,
                      [fieldImgName]: uploadedFile?.name,
                    }),
                  );
                }
              } else if (module === 'product') {
                // setFieldValue(fieldName, result);
                // if (fieldName === 'main_image') {
                //   const res = await dispatch(addWaterMarkToImage(result));
                //   if (res) setFieldValue('water_mark_main_image', res);
                //   else renderToast();
                // } else if (fieldName === 'real_image') {
                //   const res = await dispatch(addWaterMarkToImage(result));
                //   if (res) setFieldValue('water_mark_real_image', res);
                //   else renderToast();
                // }

                let changeFieldObj = {
                  [fieldName]: result,
                  [fieldImgName]: uploadedFile?.name,
                };
                let mainImageFieldObj = {};
                let realImageFieldObj = {};
                let changedFieldValue = {};

                // Set the Img field value :
                if (fieldName === 'main_image') {
                  const res = await dispatch(addWaterMarkToImage(result));
                  if (res) {
                    mainImageFieldObj = {
                      ...changeFieldObj,
                      water_mark_main_image: res,
                    };
                    changedFieldValue = { ...mainImageFieldObj };
                    setFieldValue('water_mark_main_image', res);
                  } else {
                    renderToast();
                  }
                } else if (fieldName === 'real_image') {
                  const res = await dispatch(addWaterMarkToImage(result));
                  if (res) {
                    realImageFieldObj = {
                      ...changeFieldObj,
                      water_mark_real_image: res,
                    };
                    changedFieldValue = { ...realImageFieldObj };
                    setFieldValue('water_mark_real_image', res);
                  } else {
                    renderToast();
                  }
                } else {
                  changedFieldValue = { ...changeFieldObj };
                }

                setFieldValue(fieldName, result);
                setFieldValue(fieldImgName, uploadedFile?.name);

                if (product_id) {
                  if (locationPath[1] === 'update-product') {
                    dispatch(
                      setUpdateSelectedProductData({
                        ...updateSelectedProductData,
                        ...changedFieldValue,
                      }),
                    );
                  } else {
                    dispatch(
                      setDupicateSelectedProductData({
                        ...dupicateSelectedProductData,
                        ...changedFieldValue,
                      }),
                    );
                  }
                } else {
                  dispatch(
                    setAddSelectedProductData({
                      ...addSelectedProductData,
                      ...changedFieldValue,
                    }),
                  );
                }
              } else if (module === 'addPurchaseItem') {
                // setFieldValue(values => ({ ...values, [fieldName]: result }));
                const obj = {
                  ...initialAddImgValue?.new_item_data,
                  [fieldName]: result,
                  [fieldImgName]: uploadedFile?.name,
                };

                setFieldValue('new_item_data', obj);

                if (purchase_id) {
                  dispatch(
                    setUpdateInitialImgValue({
                      ...initialUpdateImgValue,
                      new_item_data: {
                        ...initialUpdateImgValue?.new_item_data,
                        [fieldName]: result,
                        [fieldImgName]: uploadedFile?.name,
                      },
                    }),
                  );
                } else {
                  dispatch(
                    setAddInitialImgValue({
                      ...initialAddImgValue,
                      new_item_data: {
                        ...initialAddImgValue?.new_item_data,
                        [fieldName]: result,
                        [fieldImgName]: uploadedFile?.name,
                      },
                    }),
                  );
                }
              } else {
                setFieldValue(fieldName, result);
              }
            }
            setName(uploadedFile?.name);
          } else {
            toast.error('Upload image must not be larger than 1mb.');
          }
        }
      },
      // [dispatch, fieldName, module, setFieldValue, addSelectedProductData],
      [
        dispatch,
        addSelectedProductData,
        dupicateSelectedProductData,
        fieldImgName,
        fieldName,
        id,
        purchase_id,
        initialAddImgValue,
        initialUpdateImgValue,
        locationPath,
        module,
        product_id,
        proformaId,
        setAddInitialImgValue,
        setFieldValue,
        setUpdateInitialImgValue,
        updateSelectedProductData,
      ],
    );

    const filePicker = useCallback(() => {
      inputRef?.current?.click();
    }, []);

    const onDownload = useCallback(e => {
      e.stopPropagation();
    }, []);

    const onRemove = e => {
      e.stopPropagation();
      setImage('');
      setName('');

      const changeFieldObj = {
        [fieldName]: '',
        [fieldImgName]: '',
      };

      if (module === 'product') {
        setFieldValue(fieldName, '');
        setFieldValue(fieldImgName, '');

        if (product_id) {
          if (locationPath[1] === 'update-product') {
            dispatch(
              setUpdateSelectedProductData({
                ...updateSelectedProductData,
                ...changeFieldObj,
              }),
            );
          } else {
            dispatch(
              setDupicateSelectedProductData({
                ...dupicateSelectedProductData,
                ...changeFieldObj,
              }),
            );
          }
        } else {
          dispatch(
            setAddSelectedProductData({
              ...addSelectedProductData,
              ...changeFieldObj,
            }),
          );
        }
      } else if (module === 'addPurchaseItem') {
        // setFieldValue(values => ({ ...values, [fieldName]: '' }));

        const obj = {
          ...initialAddImgValue?.new_item_data,
          [fieldName]: '',
          [fieldImgName]: '',
        };

        setFieldValue('new_item_data', obj);

        if (purchase_id) {
          dispatch(
            setUpdateInitialImgValue({
              ...initialUpdateImgValue,
              new_item_data: {
                ...initialUpdateImgValue?.new_item_data,
                ...changeFieldObj,
              },
            }),
          );
        } else {
          dispatch(
            setAddInitialImgValue({
              ...initialAddImgValue,
              new_item_data: {
                ...initialAddImgValue?.new_item_data,
                ...changeFieldObj,
              },
            }),
          );
        }
      } else {
        setFieldValue(fieldImgName, '');
        // setFieldValue(fieldName, '');

        if (id || purchase_id) {
          dispatch(
            setUpdateInitialImgValue({
              ...initialUpdateImgValue,
              [fieldImgName]: '',
              [fieldName]: '',
            }),
          );
        } else {
          dispatch(
            setAddInitialImgValue({
              ...initialAddImgValue,
              [fieldImgName]: '',
              [fieldName]: '',
            }),
          );
        }
      }

      setFieldValue(fieldName, '');
    };

    // [
    //   dispatch,
    //   // setInitialImgValue,
    //   initialImgValue,
    //   fieldImgName,
    //   module,
    //   setFieldValue,
    //   fieldName,
    // ],
    // );

    return (
      <FileDrop
        onTargetClick={filePicker}
        onDrop={f => fileHandler(f)}
        className="image-dropzone"
      >
        <div className="upload_file_custom">
          <input
            // accept=".png"
            accept=".png, .jpg, .jpeg"
            value={''}
            style={{ visibility: 'hidden', opacity: 0 }}
            ref={inputRef}
            type="file"
            onChange={e => fileHandler(e.target.files)}
            disabled={disabled}
          />
          <label htmlFor="UploadFile">
            <img
              src={value || UploadIcon}
              alt=""
              className="img-fluid"
              style={{ height: '75px', width: '100%', objectFit: 'contain' }}
            />
            {!image && !value ? (
              <div className="upload_text">
                "Upload your images"{' '}
                <span className="text_primary">Choose files PNG</span>
              </div>
            ) : null}
            {value ? (
              <div className="mt-2">
                <a
                  href={value || ''}
                  className="btn_border"
                  style={{ width: '35px', height: '35px' }}
                  onClick={onDownload}
                  download={fileName}
                >
                  <img src={Download} alt="" className="mb-0" />
                </a>
                {disabled ? null : (
                  <Button
                    className="btn_border ms-3"
                    onClick={onRemove}
                    style={{ width: '35px', height: '35px' }}
                  >
                    <img src={TrashIcon} alt="" className="mb-0" />
                  </Button>
                )}
              </div>
            ) : null}
          </label>
          <p>{fieldImgValue ? fieldImgValue : filename ? filename : ''}</p>
        </div>
      </FileDrop>
    );
  },
);

export default DropZone;
