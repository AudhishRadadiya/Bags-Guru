import { setListMFGProcess } from 'Store/Reducers/Production/mfgLiveOperatorSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const Cylinder = ({ handleCylinderChange, cylinderActiveTabIndex }) => {
  const dispatch = useDispatch();

  const { cylinderSizeList } = useSelector(
    ({ mfgliveOperator }) => mfgliveOperator,
  );

  return (
    <>
      <div className="cylinder_wrap mb-3">
        <div className="cylinder_box">
          <label>Cylinder</label>
          <ul>
            {cylinderSizeList?.length > 0 &&
              cylinderSizeList?.map((list, index) => {
                return (
                  <>
                    <li
                      className={index === cylinderActiveTabIndex && 'active'}
                      onClick={e => {
                        dispatch(setListMFGProcess([]));
                        handleCylinderChange(index, list);
                      }}
                    >
                      {list}
                    </li>
                  </>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Cylinder;
