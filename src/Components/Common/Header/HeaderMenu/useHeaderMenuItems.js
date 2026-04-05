import { useMemo } from 'react';
import {
  getHeaderAndSideMenuItems,
  getOperatorHeaderMenuItems,
} from '../Constant/menu.config';
import { useLocation } from 'react-router-dom';

const useHeaderMenuItems = () => {
  const { pathname } = useLocation();

  const headerMenuItems = useMemo(() => {
    const operatorMenu = getOperatorHeaderMenuItems(pathname);

    const headerMenu = getHeaderAndSideMenuItems(pathname);

    return { operatorMenu, headerMenu };
  }, [pathname]);

  return {
    operatorHeaderMenuItems: headerMenuItems.operatorMenu,
    headerAndSideMenuItems: headerMenuItems.headerMenu,
  };
};

export default useHeaderMenuItems;
