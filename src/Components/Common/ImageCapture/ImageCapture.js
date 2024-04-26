import React, { useRef, useCallback, useState, memo } from 'react';
import { Button } from 'react-bootstrap';
import Webcam from 'react-webcam';
import ShareIcon from '../../../Assets/Images/share.svg';
import { useDispatch } from 'react-redux';
import { whatsappUploadFile } from 'Services/CommonService';

const ImageCapture = props => {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const { whatsappData } = props;

  const [capturedImage, setCapturedImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [changeCameraMode, setChangeCameraMode] = useState(true);

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setCapturedImage(imageSrc);
    setUploadedImage('');
    const tracks = webcamRef?.current?.video?.srcObject?.getTracks();
    tracks?.forEach(track => track?.stop());
  }, [webcamRef]);

  const videoConstraints = {
    // width: 220,
    // height: 200,
    width: 1920, // 1280
    height: 1080, // 720
    facingMode: changeCameraMode ? 'environment' : 'user',
  };

  const reset = () => {
    setChangeCameraMode(true);
    setCapturedImage('');
    setUploadedImage('');
  };

  const handleCapturedData = useCallback(
    uploadImg => {
      const img = uploadImg;
      const productTitle = whatsappData?.design
        ? whatsappData?.design?.toUpperCase()
        : '';
      const productType = whatsappData?.bag_type ? whatsappData?.bag_type : '';
      // const qty = whatsappData?.qty ? whatsappData?.qty : '';
      const fabric = whatsappData?.fabric_color
        ? `*${whatsappData?.fabric_color}*`
        : '-';
      // const handle_color = whatsappData?.handle_color
      //   ? whatsappData?.handle_color
      //   : 'NA';
      // const rate = whatsappData?.rate ? whatsappData?.rate : '₹0';
      // const unit_pc = whatsappData?.unit_pc ? 'BAG' : 'KG';
      // const block = whatsappData?.stereo_charge
      //   ? convertThousandToNumeric(whatsappData?.stereo_charge, 'rupees')
      //   : '-';
      // const etd = whatsappData?.due_date ? whatsappData?.due_date : '';

      // let productDescription = whatsappData?.width
      //   ? `${whatsappData?.width}” x ${whatsappData?.height} x ${whatsappData?.gusset}” (${whatsappData?.gsm}GSM)`
      //   : '-';
      const productDescription = whatsappData
        ? `${whatsappData?.width ? 'W ' + whatsappData?.width + '”' : ''} ${
            whatsappData?.height ? 'x  H ' + whatsappData?.height + '”' : ''
          } ${
            whatsappData?.gusset ? 'x G ' + whatsappData?.gusset + '”' : ''
          } ${whatsappData?.gsm ? '(' + whatsappData?.gsm + ' GSM)' : ''}`
        : '-';
      // const productDetails = `Bags: ${qty} Bags\nFabric: ${fabric}\nHandle Color: ${handle_color}\nRate: ${rate}/${unit_pc}\nStereo Charge: ₹${block}\nETD: ${etd}`;

      const data = {
        img,
        productTitle,
        productType,
        productDescription,
        // productDetails,
        fabric,
      };
      handleWhatsAppShare(data);
    },
    [whatsappData],
  );

  const handleWhatsAppShare = data => {
    if (!data) return;

    // const productDetail = data?.productDetails?.split('\n');
    // const updatedProductDetailsObj = {};

    // // Extract Product Details:
    // if (productDetail?.length > 0) {
    //   productDetail?.forEach((line, index) => {
    //     // if (index === 0 && line?.includes('Bags')) {
    //     //   updatedProductDetailsObj['Bags'] = line;
    //     // } else {
    //     const [key, value] = line?.split(':');
    //     updatedProductDetailsObj[key.trim()] = value ? value.trim() : '';
    //     // }
    //   });
    // }

    const jsonObject = {
      // ...updatedProductDetailsObj,
      img: data?.img,
      Fabric: data?.fabric,
      oldStereo: '',
      // size: data?.productDescription,
      // bagType: data?.productType,
      // designName: data?.productTitle,
      productType: data?.productType,
      productTitle: data?.productTitle,
      productDescription: data?.productDescription,
    };

    // Converting the object to JSON format
    const jsonFormattedText = JSON.stringify(jsonObject);
    const base_url = 'http://cloud-dev.bagsguru.in?';
    const encodedDetails = encodeURIComponent(jsonFormattedText);

    // For WhatsApp app (mobile devices)
    // New Flow :(first of open bags-guru app then after open whatsapp in mobile view)
    const whatsappAppLink = base_url + 'details=' + encodedDetails;

    // Redirect to WhatsApp app
    window.location.href = whatsappAppLink;
  };

  const handleUploadFile = async () => {
    // Convert URL base-64 to File :
    // const base64Str = capturedImage;
    // const countTime = new Date()?.getTime() + '.jpg';
    // const file = new File(
    //   [Uint8Array.from(base64Str, m => m.codePointAt(0))],
    //   countTime,
    //   { type: 'image/jpg' },
    // );

    // const res = await dispatch(whatsappUploadFile(file));
    // if (res) {
    //   setUploadedImage(res);
    // }

    // Create a Blob from the data URL
    const blob = await fetch(capturedImage).then(res => res.blob());

    // Create a File from the Blob
    const countTime = new Date().getTime() + '.jpg';
    const file = new File([blob], countTime, { type: 'image/jpg' });

    const res = await dispatch(whatsappUploadFile(file));
    if (res) {
      // setUploadedImage(res);
      handleCapturedData(res);
    }
  };

  return (
    <div className={`webcam_Wrapper ${changeCameraMode ? 'webcam_wrap' : ''}`}>
      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-100 mb-3"
          />
          <div className="d-flex justify-content-center">
            <Button className="btn_primary mx-2" onClick={capture}>
              Capture photo
            </Button>
            <Button
              className="btn_border  mx-2"
              onClick={() => setChangeCameraMode(!changeCameraMode)}
            >
              Change Mode
            </Button>
          </div>
        </>
      ) : (
        <>
          <img src={capturedImage} className="mb-3 capture_img" alt="" />
          <div className="d-flex justify-content-center">
            <Button className="btn_primary mx-2" onClick={reset}>
              Reset
            </Button>
            {/* {uploadedImage ? (
              <Button className="btn_border mx-2" onClick={handleCapturedData}>
                <img src={ShareIcon} alt="share" className="m-0" />
              </Button>
            ) : ( */}
            <Button className="btn_primary mx-2" onClick={handleUploadFile}>
              Save & Share
            </Button>
            {/* )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ImageCapture);
