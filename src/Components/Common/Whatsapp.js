import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ClipboardIcon from '../../Assets/Images/clipboard.svg';
import whatsapp from '../../Assets/Images/whatsapp.svg';
import download from '../../Assets/Images/download.svg';
import { memo, useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { toastCongig } from 'Components/Products/AddProduct';
import {
  convertThousandToNumeric,
  handleWhatsAppShare,
  isMobileDevice,
  thousandSeparator,
} from 'Helper/Common';

const WhatsAppShare = ({
  whatsappPopup,
  setWhatsappPopup,
  data,
  isBagDetail,
}) => {
  let img = data?.product_detail ? data?.product_detail?.main_image : '';
  let oldStereo = data?.old_stereo
    ? data?.old_stereo === true
      ? '*OLD BLOCK*'
      : '*NEW BLOCK*'
    : '';
  let productTitle = data?.product_detail?.design
    ? data?.product_detail?.design?.toUpperCase()
    : '-';
  let productType = data?.bag_detail?.bag_type
    ? data?.bag_detail?.bag_type
    : '';
  let productDescription = data?.bag_detail
    ? `${data?.bag_detail?.width ? 'W ' + data?.bag_detail?.width + '”' : ''} ${
        data?.bag_detail?.height ? 'x  H ' + data?.bag_detail?.height + '”' : ''
      } ${
        data?.bag_detail?.gusset ? 'x G ' + data?.bag_detail?.gusset + '”' : ''
      } ${data?.bag_detail?.gsm ? '(' + data?.bag_detail?.gsm + ' GSM)' : ''}`
    : '-';

  let qty = data?.qty ? data?.qty : '-';
  let fabric = data?.product_detail ? data?.product_detail?.fabric_color : '-';
  let handle_color = data?.product_detail?.handle_color
    ? data?.product_detail?.handle_color
    : 'NA';
  let rate = data?.rate ? data?.rate : '₹0';
  let block = data?.stereo_charge
    ? convertThousandToNumeric(data?.stereo_charge, 'rupees')
    : '-';
  // let etd = data?.due_date ? data?.due_date : '-';
  let unit_pc = data?.unit_pc ? 'BAG' : 'KG';

  let productDetails = `${qty} Bags\nFabric: *${fabric}*`;

  if (['D - CUT', 'D - CUT WITH UF'].includes(productType)) {
    // Exclude "Handle Color" for product_type "D-CUT" or "D-cut with Underfold".
    productDetails += `\nRate: ${rate} /${unit_pc}\nStereo Charge: ₹${block}`;
  } else {
    // Include "Handle Color" for other product types
    productDetails += `\nHandle Color: ${handle_color}\nRate: ${rate} /${unit_pc}\nStereo Charge: ₹${block}`;
  }

  // let productDetails = `${qty} Bags\nFabric: *${fabric}*\nHandle Color: ${handle_color}\nRate: ${rate} /${unit_pc}\nStereo Charge: ₹${block}`;
  //\nETD: ${etd};

  const onCopyText = useCallback(
    key => {
      let text;
      if (isBagDetail) {
        if (isMobileDevice()) {
          text = `${img}\n\n---------------------------------\n${productTitle}\n${productType}\n${productDescription}\n---------------------------------\n${productDetails}\n\n${oldStereo}`;
        } else {
          text = `${productTitle}\n${productType}\n${productDescription}\n---------------------------------\n${productDetails}\n\n${oldStereo}`;
        }
      } else {
        if (isMobileDevice()) {
          text = `${img}\n\n---------------------------------\n${productTitle}\n${productType}\n${productDescription}\n\n${oldStereo}`;
        } else {
          text = `${productTitle}\n${productType}\n${productDescription}\n\n${oldStereo}`;
        }
      }

      if (key === 'whatsapp') {
        let data;
        if (isBagDetail) {
          data = {
            img,
            oldStereo,
            productTitle,
            productType,
            productDescription,
            productDetails,
          };
        } else {
          data = {
            img,
            oldStereo,
            productTitle,
            productType,
            productDescription,
          };
        }
        handleWhatsAppShare(data, isBagDetail);
        setWhatsappPopup(false);
      } else {
        const res = copy(text, {
          debug: false,
          message: 'Tap to copy',
        });
        if (res) {
          // toast('Text copied to clipboard', toastCongig);
          setWhatsappPopup(false);
        } else toast.error('Failed to copy Text', toastCongig);
      }
    },
    [
      isBagDetail,
      img,
      productTitle,
      productType,
      productDescription,
      productDetails,
      oldStereo,
      setWhatsappPopup,
    ],
  );

  const onDownload = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <Dialog
        header=""
        visible={!!whatsappPopup}
        draggable={false}
        className="modal_Wrapper modal_small whatsapp_modal"
        onHide={() => setWhatsappPopup(false)}
      >
        <div className="whatsapp_popup_wrapper">
          <div className="img_wrapper">
            <img src={img} alt="" />
            <Button className="dowanload_img btn_primary">
              <a href={img} download="image.jpg" onClick={onDownload}>
                <img src={download} alt="download" className="me-0" />
              </a>
            </Button>
          </div>
          <div className="whatsapp_pro_title">
            <h4>{productTitle}</h4>
            <h5>{productType}</h5>
            <p className="m-0">{productDescription}</p>
          </div>
          <div className="whatsapp_pro_detail">
            {isBagDetail && (
              <>
                <h4>{qty} Bags</h4>
                <ul>
                  <li>Fabric: {fabric}</li>
                  {!['D - CUT', 'D - CUT WITH UF'].includes(productType) && (
                    <li>Handle Color: {handle_color}</li>
                  )}
                  <li>
                    Rate: {rate} /{unit_pc}
                  </li>
                  <li>Stereo Charge: ₹{thousandSeparator(block)}</li>
                  {/* <li>ETD: {etd}</li> */}
                </ul>
                <h4 className="mb-3">
                  {data?.old_stereo
                    ? data?.old_stereo === true
                      ? 'OLD BLOCK'
                      : 'NEW BLOCK'
                    : ''}
                </h4>
              </>
            )}
            <div className="text-center mb-2">
              <Button
                className="btn_border me-2"
                onClick={() => onCopyText('copy')}
              >
                <img src={ClipboardIcon} className="me-2" alt="" />
                Copy
              </Button>
              <Button
                className="btn_border"
                onClick={() => onCopyText('whatsapp')}
                // data-action="share/whatsapp/share"
              >
                <img src={whatsapp} alt="whatsapp" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default memo(WhatsAppShare);
