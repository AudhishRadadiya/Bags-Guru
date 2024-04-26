import { useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import MonthlyTurnoverValuation from './MonthlyTurnoverValuation';
import MonthlyTurnoverPercentage from './MonthlyTurnoverPercentage';
import { useDispatch } from 'react-redux';
import {
  getSalesTurnOverPercentage,
  getSalesTurnOverValuation,
} from 'Services/Report/SalesTurnoverService';

export default function MonthlyTurnover() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSalesTurnOverValuation());
    dispatch(getSalesTurnOverPercentage());
  }, []);

  return (
    <div className="main_Wrapper">
      <div className="tab_main_wrapper ">
        <TabView>
          <TabPanel header="Monthly Turnover Valuation">
            <MonthlyTurnoverValuation />
          </TabPanel>
          <TabPanel header="Monthly Turnover Percentage">
            <MonthlyTurnoverPercentage />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
