import React, { memo, useMemo } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
// import { addDays, subDays, subMonths, format } from 'date-fns';

const DateRangeCalender = ({ onChange, ranges, direction, months }) => {
  // const currentDate = new Date();
  // const defaultStartDate = currentDate;
  // const defaultEndDate = subMonths(currentDate, 12);
  // const [state, setState] = useState([
  //   {
  //     startDate: defaultStartDate,
  //     endDate: defaultEndDate,
  //     key: 'selection',
  //   },
  // ]);

  const handleOnChange = ranges => {
    const { selection } = ranges;

    // const areDatesEqual =
    //   moment(selection?.startDate).format('YYYY-MM-DD') ===
    //   moment(selection?.endDate).format('YYYY-MM-DD');

    // if (areDatesEqual) {
    //   // Treat it as a single date selection
    //   // setState([
    //   //   { startDate: selection?.startDate, endDate: null, key: 'selection' },
    //   // ]);
    //   onChange({
    //     startDate: selection?.startDate,
    //     endDate: null,
    //     key: 'selection',
    //   });
    // } else {
    //   // setState([selection]);
    //   onChange(selection);
    // }
    onChange(selection);
    // setState([selection]);
  };

  const isMobile = useMemo(() => {
    if (window.innerWidth < 767) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <DateRangePicker
      onChange={handleOnChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      ranges={ranges}
      direction={isMobile ? 'vertical' : 'horizontal '}
      months={isMobile ? 1 : 2}
      rangeColors={['#322972', '#3ecf8e', '#fed14c']}
      startDatePlaceholder="StartDate"
      endDatePlaceholder="EndDate"
      dateDisplayFormat="dd-MM-yyyy"
      // direction="vertical"
      // scroll={{ enabled: true }}
    />
  );
};

export default memo(DateRangeCalender);
