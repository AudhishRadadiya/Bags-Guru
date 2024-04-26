import { TabView, TabPanel } from 'primereact/tabview';
import RollConsumption from './RollConsumption';
import InkConsumption from './InkConsumption';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { memo } from 'react';

const ConsumptionDashboard = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const { allCommon } = useSelector(({ common }) => common);
  const { activeIndex } = allCommon?.consumptionDashboard;
  return (
    <div className="main_Wrapper">
      <div className="tab_main_wrapper ">
        <TabView
          activeIndex={activeIndex}
          onTabChange={e => {
            dispatch(
              setAllCommon({
                ...allCommon,
                consumptionDashboard: {
                  ...allCommon?.consumptionDashboard,
                  activeIndex: e.index,
                },
              }),
            );
          }}
        >
          <TabPanel header="Roll Consumption">
            <RollConsumption accessPermission={hasAccess} />
          </TabPanel>
          <TabPanel header="Ink Consumption">
            <InkConsumption accessPermission={hasAccess} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};
export default memo(ConsumptionDashboard);
