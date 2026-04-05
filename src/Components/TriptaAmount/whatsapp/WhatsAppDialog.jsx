import { Dialog } from 'primereact/dialog';
import WhatsAppOptions from './WhatsAppOptions';
import { useWhatsAppOptions } from './useWhatsAppOptions';

const WhatsAppDialog = ({ whatsAppContent, setWhatsAppContent }) => {
  const { renderType, data } = useWhatsAppOptions(
    whatsAppContent?.whatsAppData,
  );

  return (
    <Dialog
      header="WhatsApp Text"
      visible={!!whatsAppContent?.whatsAppPopup}
      draggable={false}
      className="modal_Wrapper whatsapp_dialog"
      style={{ width: '50vw' }}
      onHide={() =>
        setWhatsAppContent({
          whatsAppData: {},
          whatsAppPopup: false,
        })
      }
    >
      <div className="d-flex justify-content-between whatsapp_list">
        <WhatsAppOptions type={renderType} data={data} />
      </div>
    </Dialog>
  );
};

export default WhatsAppDialog;
