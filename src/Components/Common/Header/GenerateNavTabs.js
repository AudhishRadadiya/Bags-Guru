import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { checkIsEmpty } from '../routeConfig';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import CloseIcon from '../../../Assets/Images/close.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import {
  setIsGetInitialValuesForAddBag,
  setIsGetInitialValuesForDuplicateBag,
  setIsGetInitialValuesForEditBag,
} from 'Store/Reducers/Products/BagsSlice';
import { setSelectedRollsData } from 'Store/Reducers/Purchase/PrePrintedStatusSlice';

export const rightsSessionList = [
  '/parties',
  '/update-parties',
  '/add-parties',
  '/parties-details',
  '/import-parties',
  '/import-parties-steptwo',
  '/import-parties-import-three',
  '/trending-products-and-bag-consumption',
  '/bags',
  '/add-bags',
  '/update-bag',
  '/duplicate-bag',
  '/bag-details',
  '/product',
  '/product-details',
  '/add-product',
  '/update-product',
  '/duplicate-product',
  '/product-transfer',
  '/mobile-app-price-list',
  '/order',
  '/add-new-order',
  '/update-order',
  '/order-details',
  '/job-details',
  '/jobs',
  '/add-job',
  '/update-job',
  '/order-operator',
  '/proforma-invoice',
  '/proforma-details',
  '/sales-invoice-details',
  '/add-proforma-invoice',
  '/update-proforma-invoice',
  '/sales-invoice',
  '/add-sales-invoice',
  '/update-sales-invoice',
  '/consumption-dashboard',
  '/stock-raw-material',
  '/stock-consumption',
  '/stock-transfer',
  '/old-customer',
  '/company',
  '/users',
  '/user-details',
  '/add-user',
  '/update-user',
  '/items',
  '/item-details',
  '/add-items',
  '/update-item',
  '/misc-master',
  '/role-and-permissions',
  '/add-role-and-permissions',
  '/update-role-and-permissions',
  '/role-and-permissions-details',
  '/my-profile',
  '/machine-job-queue',
  '/machine-job-queue-operator',
  '/general-configuration',
  '/purchase-order',
  '/purchase-order-operator',
  '/purchase-receive',
  '/import-received-stepone',
  '/import-received-steptwo',
  '/pre-printed-rolls',
  '/pp-price-history',
  '/nl-requirement',
  '/mfg-live-admin',
  '/mfg-live-operator',
  '/admin-dashboard',
  '/add-purchase-order',
  '/update-purchase-order',
  '/purchase-order-details',
  '/receive-purchase-order',
  '/purchase-receive-details',
  '/profit-analysis',
  '/broker-margin',
  '/sales-dashboard',
  '/raw-material',
  '/finished-goods',
  '/pending-jobs',
  '/finance',
  '/sales',
  '/purchase',
  '/monthly-turnover',
];

const GenerateNavTabs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let { pathname } = location;
  const locationPath = pathname?.split('/');

  const UserPreferencesData = getCurrentUserFromLocal();
  const { currentUser } = useSelector(({ auth }) => auth);
  const { allFilters, allCommon } = useSelector(({ common }) => common);

  const [state, setState] = useState({
    tabs: [
      {
        name: locationPath[1],
        largePath: locationPath?.length > 2 ? pathname : null,
      },
    ],
    currentTab: {
      name: locationPath[1],
      largePath: locationPath?.length > 2 ? pathname : null,
    },
  });

  useEffect(() => {
    if (
      state?.tabs?.filter(item => item?.name === locationPath?.[1])?.length <= 0
    ) {
      handleAddTab();
    } else {
      let selectBySidebare = {
        name: locationPath?.[1],
        largePath: locationPath?.length > 2 ? pathname : null,
      };
      let index = state?.tabs?.findIndex(x => x?.name === locationPath?.[1]);
      let cloneTabs = { ...JSON.parse(JSON.stringify(state)) };
      if (index >= 0)
        cloneTabs.tabs[index].largePath =
          locationPath?.length > 2 ? pathname : null;

      setState({ ...cloneTabs, currentTab: selectBySidebare });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locationPath?.length, state?.tabs?.length]);

  const handleAddTab = () => {
    let { tabs } = state;
    const newTabObject = {
      name: locationPath?.[1],
      content: `This is Tab ${tabs?.length + 1}`,
      largePath: locationPath?.length > 2 ? pathname : null,
    };

    if (tabs?.[0]?.name === 'login') {
      setState({
        tabs: [newTabObject],
        currentTab: newTabObject,
      });
    } else {
      if (state?.tabs?.length <= 100) {
        setState({
          tabs: [...tabs, newTabObject],
          currentTab: newTabObject,
        });
      } else {
        tabs?.splice(0, 1);
        setState({
          tabs: [...tabs, newTabObject],
          currentTab: newTabObject,
        });
      }
    }
  };

  const handleDeleteTab = useCallback(
    (e, tabToDelete) => {
      e.preventDefault();
      e.stopPropagation();
      const { tabs, currentTab } = state;

      if (tabs?.length <= 1) {
        if (currentUser?.operator) {
          if (currentTab.name !== 'order-operator') {
            setState({
              tabs: [],
              currentTab: { name: '', largePath: null },
            });

            UserPreferencesData?.flexo_print
              ? navigate('/order-operator')
              : navigate('/mfg-live-operator');
          }
        } else {
          // find permission when allowing view permission to user data:
          const findPermissionObj = currentUser?.permission
            ?.map(x => x.sub_module.map(y => y))
            ?.flat()
            ?.find(k => k.permission.view === true);

          if (currentTab.name !== findPermissionObj?.path) {
            setState({
              tabs: [],
              currentTab: { name: '', largePath: null },
            });

            if (findPermissionObj?.path) {
              navigate(findPermissionObj?.path);
            } else {
              navigate('/parties');
            }
          }
        }
        dispatch(
          setAllFilters({
            ...allFilters,
            [currentTab?.name]: { applied: {}, filters: [], currentPage: 1 },
          }),
        );
        dispatch(
          setAllCommon({
            ...allCommon,
            [currentTab?.name]: {
              filterToggle: false,
              tableFilters: [],
              searchQuery: '',
              showMobileChecked: false,
            },
          }),
        );
      } else {
        const tabToDeleteIndex = tabs?.findIndex(
          tab => tab.name === tabToDelete.name,
        );
        const updatedTabs = tabs?.filter((tab, index) => {
          return index !== tabToDeleteIndex;
        });
        const previousTab =
          tabs?.[tabToDeleteIndex - 1] || tabs?.[tabToDeleteIndex + 1] || {};
        if (currentTab?.name === tabToDelete?.name) {
          if (tabToDelete?.name === 'update-bag') {
            dispatch(setIsGetInitialValuesForEditBag(false));
          } else if (tabToDelete?.name === 'update-bag') {
            dispatch(setIsGetInitialValuesForDuplicateBag(false));
          } else if (tabToDelete?.name === 'add-bags') {
            dispatch(setIsGetInitialValuesForAddBag(false));
          }
          setState({
            tabs: updatedTabs,
            currentTab: previousTab,
          });
          if (previousTab?.largePath !== null) {
            navigate(`${previousTab?.largePath}`);
          } else {
            navigate(`/${previousTab?.name}`);
          }
        } else {
          setState({
            ...state,
            tabs: updatedTabs,
          });
          if (currentTab?.largePath !== null) {
            navigate(`${currentTab?.largePath}`);
          } else {
            navigate(`/${currentTab?.name}`);
          }
        }
        dispatch(
          setAllFilters({
            ...allFilters,
            [tabToDelete?.name]: { applied: {}, filters: [], currentPage: 1 },
          }),
        );
        dispatch(
          setAllCommon({
            ...allCommon,
            [tabToDelete?.name]: {
              filterToggle: false,
              tableFilters: [],
              searchQuery: '',
              showMobileChecked: false,
            },
          }),
        );
      }

      // For clear selected Pre-Printed-Rolls data when first time enter that tab:
      if (tabToDelete?.name === 'pre-printed-rolls') {
        dispatch(setSelectedRollsData([]));
      }
    },
    [
      UserPreferencesData,
      allCommon,
      allFilters,
      currentUser,
      dispatch,
      navigate,
      state,
    ],
  );

  const handleSelectTab = useCallback(
    (e, tab) => {
      e.preventDefault();
      e.stopPropagation();
      const checkViewPage = tab?.name?.includes('details');

      setState({
        ...state,
        currentTab: tab,
      });

      if (checkViewPage && tab?.largePath) {
        navigate(tab?.largePath, {
          state: { isView: true },
        });
      } else {
        if (tab?.largePath !== null) {
          if (tab.name === 'update-purchase-order') {
            navigate(`${tab?.largePath}`, { state: { isView: false } });
          } else {
            navigate(`${tab?.largePath}`);
          }
        } else {
          if (tab.name === 'add-purchase-order') {
            navigate(`${tab?.name}`, { state: { isView: false } });
          } else {
            navigate(`/${tab?.name}`);
          }
        }
      }
    },
    [navigate, state],
  );

  const createTabs = () => {
    const { tabs, currentTab } = state;
    let tabView = [];

    tabs?.forEach(item => {
      let obj = rightsSessionList?.find(item2 => item2?.includes(item?.name));
      if (obj) {
        tabView?.push(item);
      }
    });

    const allTabs =
      !checkIsEmpty(tabView) &&
      tabView?.map((tab, i) => {
        return (
          <NavItem key={i}>
            <NavLink
              className={currentTab?.name === tab?.name ? 'active' : ''}
              onClick={e => handleSelectTab(e, tab)}
            >
              <span className="d-inline-flex align-items-center justify-content-between w-100">
                <span className="link_text">
                  {!checkIsEmpty(tab) && tab?.name === ''
                    ? currentUser?.operator
                      ? 'Order Operator'
                      : 'Parties'
                    : // : tab?.name && tab?.name?.replaceAll('-', ' ')}
                      tab?.name && tab?.name?.split('-')?.join(' ')}
                </span>
                <span className="close_icon">
                  <img
                    src={CloseIcon}
                    alt=""
                    onClick={e => handleDeleteTab(e, tab)}
                    width={20}
                    height={20}
                  />
                </span>
              </span>
            </NavLink>
          </NavItem>
        );
      });

    return (
      <Nav pills={'true'} className={'gy-2 nav-scrollable'}>
        {allTabs}
      </Nav>
    );
  };

  return (
    <Nav pills={'true'} className={'gy-2 nav-scrollable'}>
      {createTabs()}
    </Nav>
  );
};

export default memo(GenerateNavTabs);
