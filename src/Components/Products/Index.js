import { TabView, TabPanel } from 'primereact/tabview';
import TrendingProducts from './TrendingProducts';
import BagTagConsumption from './BagTagConsumption';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { memo } from 'react';

const TrendingProductsBagConsumption = ({ hasAccess }) => {
  const dispatch = useDispatch();
  const { allCommon } = useSelector(({ common }) => common);
  const { activeIndex } = allCommon?.trendingProductAndBag;
  return (
    <div className="main_Wrapper">
      <div className="tab_main_wrapper ">
        <TabView
          activeIndex={activeIndex}
          onTabChange={e => {
            dispatch(
              setAllCommon({
                ...allCommon,
                trendingProductAndBag: {
                  ...allCommon?.trendingProductAndBag,
                  activeIndex: e.index,
                },
              }),
            );
          }}
        >
          <TabPanel header="Trending Products">
            <TrendingProducts hasAccess={hasAccess} />
          </TabPanel>
          <TabPanel header="Bag Tag Consumption">
            <BagTagConsumption hasAccess={hasAccess} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default memo(TrendingProductsBagConsumption);
