import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { getSuggestedRollList } from 'Services/Production/mfgLiveServices';
import { Button } from 'react-bootstrap';

function MFGOperatorPrintingFilter(props) {
  const dispatch = useDispatch();
  const { jobId, printTechnologyId } = props;

  const { allCommon } = useSelector(({ common }) => common);
  const { mfgLivePrintingFilterList } = useSelector(({ mfgLive }) => mfgLive);
  const { print_field_filter } = allCommon?.mfgLive;

  const handlePrintFilterChange = (e, filterName) => {
    const updatedFilterPayload = {
      ...allCommon,
      mfgLive: {
        ...allCommon?.mfgLive,
        print_field_filter: {
          ...allCommon?.mfgLive?.print_field_filter,
          [filterName]: e.target.value,
        },
      },
    };

    dispatch(setAllCommon(updatedFilterPayload));
  };

  const handlePrintFilterData = () => {
    const checkPrintFilterValues = Object.values(print_field_filter).some(
      arr => Array.isArray(arr) && arr.length > 0,
    );

    dispatch(
      getSuggestedRollList(
        jobId?.job_id,
        printTechnologyId,
        print_field_filter,
        // checkPrintFilterValues,
      ),
    );
  };

  return (
    <div className="printing_custom_filter mb-2">
      <ul>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.color}
              placeholder="Color Name"
              value={print_field_filter.color}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'color');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.design_name}
              placeholder="Design Name"
              value={print_field_filter.design_name}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'design_name');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.gsm}
              placeholder="GSM"
              value={print_field_filter.gsm}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'gsm');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.lamination}
              placeholder="Lamination"
              value={print_field_filter.lamination}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'lamination');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.material}
              placeholder="Material"
              value={print_field_filter.material}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'material');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.warehouse_name}
              placeholder="Warehouse Name"
              value={print_field_filter.warehouse_name}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'warehouse_name');
              }}
            />
          </div>
        </li>
        <li>
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={3}
              options={mfgLivePrintingFilterList.width}
              placeholder="Width"
              value={print_field_filter.width}
              className="w-100"
              onChange={e => {
                handlePrintFilterChange(e, 'width');
              }}
            />
          </div>
        </li>
        <li className="flex-grow-0">
          <Button className="btn_primary" onClick={handlePrintFilterData}>
            Apply
          </Button>
        </li>
        <li className="flex-grow-0">
          <Button
            className="btn_primary"
            onClick={() => {
              const updatedFilterPayload = {
                ...allCommon,
                mfgLive: {
                  ...allCommon?.mfgLive,
                  print_field_filter: {},
                },
              };

              dispatch(setAllCommon(updatedFilterPayload));
            }}
          >
            Reset
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default MFGOperatorPrintingFilter;
