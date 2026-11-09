import { useCallback, useState } from 'react';

const useResetImageComparePrompt = () => {
  const [visible, setVisible] = useState(false);

  const openResetPopup = useCallback(() => {
    setVisible(true);
  }, []);

  const closeResetPopup = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    openResetPopup,
    closeResetPopup,
  };
};

export default useResetImageComparePrompt;
