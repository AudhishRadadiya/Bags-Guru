import React, { memo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { useSelector } from 'react-redux';
import { convertIntoNumber } from 'Helper/Common';

const PurchaseEntryProgress = () => {
  const [progressVisible, setProgressVisible] = useState();

  const { purchaseEntryList } = useSelector(
    ({ PurchaseEntryProgress }) => PurchaseEntryProgress,
  );

  return (
    <div>
      <Button
        className="progress_button"
        label=""
        icon="pi pi-spin pi-spinner"
        onClick={() => setProgressVisible(true)}
      />
      <Dialog
        header="Uploading..."
        visible={progressVisible}
        onHide={() => setProgressVisible(false)}
        className="modal_Wrapper modal_medium"
        draggable={false}
      >
        {purchaseEntryList?.map((d, i) => {
          return (
            <div className="progressbar_wrapper mb-3">
              <h5>Process {i + 1}</h5>
              <ProgressBar value={convertIntoNumber(d?.count)}></ProgressBar>
            </div>
          );
        })}
        <br />
      </Dialog>
    </div>
  );
};

export default memo(PurchaseEntryProgress);
