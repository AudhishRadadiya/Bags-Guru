import { thousandSeparator } from 'Helper/Common';
import { useCallback } from 'react';
export const useWhatsAppOptions = (whatsAppData = {}) => {
  const {
    party_name,
    tripta_total_due,
    tripta_above_90_amount,
    tripta_46_to_90_amount,
    tripta_31_to_45_amount,
  } = whatsAppData;

  const amountAddition = useCallback(
    (amount1 = 0, amount2 = 0, amount3 = 0) => {
      const amountCalculation = amount1 + amount2 + amount3;
      return amountCalculation;
    },
    [],
  );

  const above45Amount = amountAddition(
    tripta_above_90_amount,
    tripta_46_to_90_amount,
  );

  const totalAbove30 = amountAddition(
    tripta_above_90_amount,
    tripta_46_to_90_amount,
    tripta_31_to_45_amount,
  );

  const renderType =
    (totalAbove30 === 0 && 'NO_DUE') ||
    (above45Amount > 0 && 'ABOVE_45') ||
    (tripta_31_to_45_amount > 0 && 'ABOVE_30') ||
    'NONE';

  return {
    renderType,
    data: {
      party_name,
      tripta_total_due,
      tripta_31_to_45_amount,
      above45Formatted: thousandSeparator(above45Amount),
    },
  };
};
