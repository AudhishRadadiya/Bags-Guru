import React, { memo } from 'react';

function Purchase() {
  return (
    <div className="main_Wrapper">
      <div className="border rounded-3 bg_white h-100">
        <div className="p-3 py-4 d-flex align-items-center justify-content-between border-bottom">
          <h3 class="mb-0">Purchase</h3>
        </div>
        <div className="report_list_wrapper p-3"></div>
      </div>
    </div>
  );
}

export default memo(Purchase);
