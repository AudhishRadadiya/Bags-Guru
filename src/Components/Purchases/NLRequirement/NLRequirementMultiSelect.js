import React, { memo, useCallback } from 'react';
import {
  getNlRollRequirement,
  getRollStockWithoutOrderList,
} from 'Services/Purchase/purchaseOrderService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import { setAllCommon } from 'Store/Reducers/Common';
import { MultiSelect } from 'primereact/multiselect';
import {
  setRollRequirementCount,
  setRollStockWithoutOrderCount,
} from 'Store/Reducers/Purchase/PurchaseOrderSlice';

const NLRequirementMultiSelect = ({
  setRollStockWithoutData,
  setRollRequirementData,
}) => {
  const dispatch = useDispatch();

  const { fabricColorListMenu } = useSelector(({ miscMaster }) => miscMaster);
  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const { searchQuery, field_filter, isStockWithoutOrder } =
    allCommon?.nlRequirement;
  const {
    dates,
    applied,
    pageLimit,
    currentPage,
    isStockWithoutOrderPageLimit,
    isStockWithoutOrderCurrentPage,
  } = allFilters?.nlRequirement;

  const handleFilterData = useCallback(() => {
    const filters = {
      ...applied,
      ...(field_filter.fabric_color.length > 0 && field_filter),
    };

    if (isStockWithoutOrder) {
      setRollStockWithoutData([]);
      dispatch(setRollStockWithoutOrderCount(0));

      dispatch(
        getRollStockWithoutOrderList(
          isStockWithoutOrderPageLimit,
          isStockWithoutOrderCurrentPage,
          searchQuery,
          filters,
          dates,
        ),
      );
    } else {
      setRollRequirementData([]);
      dispatch(setRollRequirementCount(0));

      dispatch(
        getNlRollRequirement(
          pageLimit,
          currentPage,
          searchQuery,
          filters,
          dates,
        ),
      );
    }
  }, [
    applied,
    dates,
    dispatch,
    pageLimit,
    currentPage,
    searchQuery,
    field_filter,
    isStockWithoutOrder,
    isStockWithoutOrderCurrentPage,
    isStockWithoutOrderPageLimit,
  ]);

  return (
    <div className="mfg_filter_wrrap p-2">
      <Row className="g-2">
        <Col xs="auto" className="flex-grow-1">
          <div className="form_group">
            <MultiSelect
              filter
              maxSelectedLabels={1}
              placeholder="Fabric color"
              className="w-100"
              options={fabricColorListMenu}
              value={field_filter?.fabric_color}
              onChange={e => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    nlRequirement: {
                      ...allCommon?.nlRequirement,
                      field_filter: {
                        fabric_color: e.target.value,
                      },
                    },
                  }),
                );
              }}
            />
          </div>
        </Col>

        <Col xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button className="btn_primary" onClick={handleFilterData}>
              Apply
            </Button>
          </div>
        </Col>

        <Col xs="auto" className="flex-grow-0">
          <div className="text-end">
            <Button
              className="btn_primary"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    nlRequirement: {
                      ...allCommon?.nlRequirement,
                      field_filter: {
                        ...allCommon?.nlRequirement?.balnk_field_filter,
                      },
                    },
                  }),
                );
              }}
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(NLRequirementMultiSelect);
