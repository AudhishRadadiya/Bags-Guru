import { memo } from 'react';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import Skeleton from 'react-loading-skeleton';
import { DataTable } from 'primereact/datatable';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const severityMap = {
  high: { label: 'High', severity: 'danger' },
  medium: { label: 'Medium', severity: 'warning' },
  low: { label: 'Low', severity: 'info' },
};

const getSeverityConfig = severity => {
  const key = severity?.toLowerCase();
  return severityMap[key];
};

const AiComparedImageReviewDialog = ({ visible, onHide, reviewData }) => {
  const { productLoading } = useSelector(({ product }) => product);

  const severityBody = row => {
    const config = getSeverityConfig(row?.severity);
    return <Tag value={config.label} severity={config.severity} />;
  };

  const descriptionBody = row => {
    return (
      <OverlayTrigger
        overlay={props => <Tooltip {...props}>{row?.description}</Tooltip>}
        placement="top"
      >
        <span>{row?.description}</span>
      </OverlayTrigger>
    );
  };

  return (
    <Dialog
      header="AI Compared Image Review"
      className="modal_Wrapper modal_large"
      visible={visible}
      draggable={false}
      onHide={onHide}
    >
      <DataTable
        value={reviewData?.issues}
        scrollable
        emptyMessage={productLoading && <Skeleton count={1} />}
      >
        <Column field="category" header="Category" />
        <Column field="title" header="Title" />
        <Column field="severity" header="Severity" body={severityBody} />
        <Column field="found" header="Found" />
        <Column field="expected" header="Expected" />
        <Column
          field="description"
          header="Description"
          body={descriptionBody}
          style={{ minWidth: '260px' }}
        />
      </DataTable>
    </Dialog>
  );
};

export default memo(AiComparedImageReviewDialog);
