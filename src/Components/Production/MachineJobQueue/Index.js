import React, { memo, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import {
  getMachineByMachineTypeList,
  getMachineQueueTypeList,
  mfgProcessByMachineTypeList,
} from 'Services/Production/machineJobQueueServices';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setActiveTabData,
  setActiveTabIndex,
} from 'Store/Reducers/Production/machineJobQueueSlice';
import Loader from 'Components/Common/Loader';
import JobMachines from './JobMachines';

const Index = ({ hasAccess }) => {
  const dispatch = useDispatch();
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  // const [activeTabName, setActiveTabName] = useState({});
  const {
    machineQueueTypes,
    activeTabData,
    activeTabIndex,
    machineJobQueueLoading,
    machineJobQueueListLoading,
  } = useSelector(({ machineJobQueueSlice }) => machineJobQueueSlice);

  useEffect(() => {
    if (!machineQueueTypes?.length) {
      dispatch(getMachineQueueTypeList());
    }
  }, [dispatch]);

  useEffect(() => {
    if (
      Object.keys(activeTabData)?.length === 0 &&
      machineQueueTypes?.length > 0
    ) {
      // setActiveTabName(machineQueueTypes[0])
      dispatch(setActiveTabData(machineQueueTypes[0]));
    }
  }, [dispatch, machineQueueTypes]);

  useEffect(() => {
    if (Object.keys(activeTabData)?.length > 0) {
      dispatch(getMachineByMachineTypeList(activeTabData?._id));
      dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
    }
  }, [dispatch, activeTabData]);

  const handleTabChange = machineQueueName => {
    // machineByMachineTypeList
    // dispatch(setMfgProcessByMachineList({}));
    const selectedTabObj = machineQueueTypes?.find(
      data => data.name === machineQueueName,
    );
    // setActiveTabName(selectedTabObj);
    dispatch(setActiveTabData(selectedTabObj));
  };

  return (
    <>
      {(machineJobQueueLoading || machineJobQueueListLoading) && <Loader />}
      <div className="operator_tab_wrap mb-3">
        <TabView
          activeIndex={activeTabIndex}
          onTabChange={e => {
            // setActiveTabIndex(e.index);
            // for clear previous data:
            // dispatch(setMfgProcessByMachineList({}));
            // dispatch(setMachineByMachineTypeList([]));
            dispatch(setActiveTabIndex(e.index));
            handleTabChange(e.originalEvent.target.textContent);
          }}
        >
          {machineQueueTypes?.length > 0 &&
            machineQueueTypes?.map((item, index) => {
              return (
                <TabPanel header={item?.name} key={index}>
                  {/* <MachineFlexoPrinting
                    activeTabName={activeTabData}
                    hasAccess={hasAccess}
                  /> */}
                  <JobMachines hasAccess={hasAccess} />
                </TabPanel>
              );
            })}
        </TabView>
      </div>
      <div className="tab_inner"></div>
    </>
  );
};
export default memo(Index);
