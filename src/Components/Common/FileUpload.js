import { memo, useCallback, useRef } from 'react';
import { FileDrop } from 'react-file-drop';
import Progress from 'Components/Common/FileProgress';
import UploadIcon from '../../Assets/Images/upload.svg';
import Download from '../../Assets/Images/download.svg';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import partyExcel from '../../Assets/Party Demo.xlsx';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FileUpload = ({ fileAccept, accepttedFiles, setAccepttedFiles }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { purchaseOrderImportData } = useSelector(
    ({ purchaseOrder }) => purchaseOrder,
  );

  const { purchaseOrderImportExcel } = purchaseOrderImportData;

  const fileHandler = useCallback(
    files => {
      const nameLength = files[0].name.split('.');

      const extension = nameLength[nameLength?.length - 1]?.toLowerCase();
      if (extension === 'xlsx' && extension !== undefined) {
        const fNames = Object.keys(files).map(name => {
          return {
            file: files[0],
            name: files[name].name,
            icon: files[name].name.split('.')[1]?.toUpperCase().trim(),
          };
        });
        dispatch(setAccepttedFiles(fNames));
      } else {
        toast.error('file type not supported');
      }
    },
    [dispatch, setAccepttedFiles],
  );

  const filePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onDownloadSample = useCallback(
    async e => {
      const url =
        pathname === '/import-received-stepone'
          ? // ? purchaseReceiveExcel
            purchaseOrderImportExcel
          : partyExcel;
      e.stopPropagation();
      const newWindow = window.open(url, '_blank');
      newWindow.location.href = url;
    },
    [pathname, purchaseOrderImportExcel],
  );

  return (
    <div className="file_upload_wrapper">
      <FileDrop onTargetClick={filePicker} onDrop={f => fileHandler(f)}>
        <img src={UploadIcon} alt="" />
        <p>
          Drag & Drop or <span>Choose files XISX</span>
        </p>
        <input
          accept={fileAccept} //".xls, .png, .psd, .doc, .docx, .ai, .pdf, .jpg, .jpeg"
          value=""
          style={{ visibility: 'hidden', opacity: 0 }}
          ref={inputRef}
          type="file"
          onChange={e => fileHandler(e.target.files)}
        />
        <Button
          className="btn_border"
          onClick={onDownloadSample}
          disabled={
            pathname === '/import-received-stepone' && !purchaseOrderImportExcel
          }
        >
          <img src={Download} alt="" />
          Download Sample File
        </Button>
      </FileDrop>
      <div className="progressContainer">
        {accepttedFiles &&
          accepttedFiles?.map((file, i) => (
            <Progress key={i} name={file.name} icon={file.icon} />
          ))}
      </div>
    </div>
  );
};
export default memo(FileUpload);
