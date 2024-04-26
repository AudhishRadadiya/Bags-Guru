import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Button, Col, Row, Nav, NavItem, NavLink } from 'react-bootstrap';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { useSelector, useDispatch } from 'react-redux';
import { changePasswordSchema } from 'Schemas/AllSchemas';
import { changePassword, logout } from 'Services/authService';
import { setChangePassword } from 'Store/Reducers/Auth/auth.slice';
import { clearToken } from 'Helper/AuthTokenHelper';
import GenerateNavTabs, { rightsSessionList } from './Header/GenerateNavTabs';
import Logo from '../../Assets/Images/logo.svg';
import BusinessDev from '../../Assets/Images/business-dev.svg';
import Parties from '../../Assets/Images/parties.svg';
import Inventory from '../../Assets/Images/inventory.svg';
import Products from '../../Assets/Images/products.svg';
import Purchases from '../../Assets/Images/purchase.svg';
import Sales from '../../Assets/Images/sales.svg';
import Production from '../../Assets/Images/production.svg';
import Financials from '../../Assets/Images/financial.svg';
import Reports from '../../Assets/Images/reports.svg';
import Settings from '../../Assets/Images/settings.svg';
import PandingJob from '../../Assets/Images/panding-job.svg';
import AdminDashboard from '../../Assets/Images/admin-dashboard.svg';
import Consumption from '../../Assets/Images/consumption.svg';
import StockConsumption from '../../Assets/Images/stock-consumption.svg';
import StockTransfer from '../../Assets/Images/stock-transfer.svg';
import MobileApp from '../../Assets/Images/mobile-app-price-list.svg';
import TrendingProducts from '../../Assets/Images/trending-products.svg';
import PurchaseOrder from '../../Assets/Images/purchase-order.svg';
import PurchaseEntry from '../../Assets/Images/purchase-entry.svg';
import PrePrintedStatus from '../../Assets/Images/pre-printed-status.svg';
import PriceHistory from '../../Assets/Images/price-history.svg';
import NLRequirement from '../../Assets/Images/nl-requirement.svg';
import Bags from '../../Assets/Images/bags.svg';
import Product from '../../Assets/Images/product.svg';
import ProformaInvoice from '../../Assets/Images/proforma-invoice.svg';
import MfgLive from '../../Assets/Images/mfg-live.svg';
import MachineJob from '../../Assets/Images/machine-job.svg';
import Calculator from '../../Assets/Images/calculator.svg';
import Company from '../../Assets/Images/company.svg';
import UserLogins from '../../Assets/Images/user-login.svg';
import GeneralConfiguration from '../../Assets/Images/general-configuration.svg';
import ItemsIcon from '../../Assets/Images/items.svg';
import MiscMasters from '../../Assets/Images/misc-masters.svg';
import CloseIcon from '../../Assets/Images/close.svg';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import {
  setIsGetInitialValuesForAddBag,
  setIsGetInitialValuesForDuplicateBag,
  setIsGetInitialValuesForEditBag,
} from 'Store/Reducers/Products/BagsSlice';
import { checkIsEmpty } from './routeConfig';

// const NavTab = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   let { pathname } = location;
//   const locationPath = pathname?.split('/');

//   const { currentUser } = useSelector(({ auth }) => auth);
//   const { allFilters, allCommon } = useSelector(({ common }) => common);
//   const UserPreferencesData = getCurrentUserFromLocal();

//   const [state, setState] = useState({
//     tabs: [
//       {
//         name: locationPath[1],
//         largePath: locationPath?.length > 2 ? pathname : null,
//       },
//     ],
//     currentTab: {
//       name: locationPath[1],
//       largePath: locationPath?.length > 2 ? pathname : null,
//     },
//   });

//   const createTabs = () => {
//     const { tabs, currentTab } = state;
//     let tabView = [];

//     tabs?.forEach(item => {
//       let obj = rightsSessionList?.find(item2 => item2?.includes(item?.name));
//       if (obj) {
//         tabView?.push(item);
//       }
//     });

//     const allTabs =
//       !checkIsEmpty(tabView) &&
//       tabView?.map((tab, i) => {
//         return (
//           <NavItem key={i}>
//             <NavLink
//               className={currentTab?.name === tab?.name ? 'active' : ''}
//               onClick={e => handleSelectTab(e, tab)}
//             >
//               <span className="d-inline-flex align-items-center justify-content-between w-100">
//                 <span className="link_text">
//                   {!checkIsEmpty(tab) && tab?.name === ''
//                     ? currentUser?.operator
//                       ? 'Order Operator'
//                       : 'Parties'
//                     : // : tab?.name && tab?.name?.replaceAll('-', ' ')}
//                       tab?.name && tab?.name?.split('-')?.join(' ')}
//                 </span>
//                 <span className="close_icon">
//                   <img
//                     src={CloseIcon}
//                     alt=""
//                     onClick={e => handleDeleteTab(e, tab)}
//                     width={20}
//                     height={20}
//                   />
//                 </span>
//               </span>
//             </NavLink>
//           </NavItem>
//         );
//       });

//     return (
//       <Nav pills={'true'} className={'gy-2 nav-scrollable'}>
//         {allTabs}
//       </Nav>
//     );
//   };

//   const handleAddTab = () => {
//     let { tabs } = state;
//     const newTabObject = {
//       name: locationPath?.[1],
//       content: `This is Tab ${tabs?.length + 1}`,
//       largePath: locationPath?.length > 2 ? pathname : null,
//     };

//     if (tabs?.[0]?.name === 'login') {
//       setState({
//         tabs: [newTabObject],
//         currentTab: newTabObject,
//       });
//     } else {
//       if (state?.tabs?.length <= 100) {
//         setState({
//           tabs: [...tabs, newTabObject],
//           currentTab: newTabObject,
//         });
//       } else {
//         tabs?.splice(0, 1);
//         setState({
//           tabs: [...tabs, newTabObject],
//           currentTab: newTabObject,
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     if (
//       state?.tabs?.filter(item => item?.name === locationPath?.[1])?.length <= 0
//     ) {
//       handleAddTab();
//     } else {
//       let selectBySidebare = {
//         name: locationPath?.[1],
//         largePath: locationPath?.length > 2 ? pathname : null,
//       };
//       let index = state?.tabs?.findIndex(x => x?.name === locationPath?.[1]);
//       let cloneTabs = { ...JSON.parse(JSON.stringify(state)) };
//       if (index >= 0)
//         cloneTabs.tabs[index].largePath =
//           locationPath?.length > 2 ? pathname : null;

//       setState({ ...cloneTabs, currentTab: selectBySidebare });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname, locationPath?.length, state?.tabs?.length]);

//   const handleDeleteTab = (e, tabToDelete) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const { tabs, currentTab } = state;
//     if (tabs?.length <= 1) {
//       if (currentUser?.operator) {
//         if (currentTab.name !== 'order-operator') {
//           setState({
//             tabs: [],
//             currentTab: { name: '', largePath: null },
//           });

//           UserPreferencesData?.flexo_print
//             ? navigate('/order-operator')
//             : navigate('/mfg-live-operator');
//         }
//       } else {
//         // find permission when allowing view permission to user data:
//         const findPermissionObj = currentUser?.permission
//           ?.map(x => x.sub_module.map(y => y))
//           ?.flat()
//           ?.find(k => k.permission.view === true);

//         if (currentTab.name !== findPermissionObj?.path) {
//           setState({
//             tabs: [],
//             currentTab: { name: '', largePath: null },
//           });

//           if (findPermissionObj?.path) {
//             navigate(findPermissionObj?.path);
//           } else {
//             navigate('/parties');
//           }
//         }
//       }
//       dispatch(
//         setAllFilters({
//           ...allFilters,
//           [currentTab?.name]: { applied: {}, filters: [], currentPage: 1 },
//         }),
//       );
//       dispatch(
//         setAllCommon({
//           ...allCommon,
//           [currentTab?.name]: {
//             filterToggle: false,
//             tableFilters: [],
//             searchQuery: '',
//             showMobileChecked: false,
//           },
//         }),
//       );
//     } else {
//       const tabToDeleteIndex = tabs?.findIndex(
//         tab => tab.name === tabToDelete.name,
//       );
//       const updatedTabs = tabs?.filter((tab, index) => {
//         return index !== tabToDeleteIndex;
//       });
//       const previousTab =
//         tabs?.[tabToDeleteIndex - 1] || tabs?.[tabToDeleteIndex + 1] || {};
//       if (currentTab?.name === tabToDelete?.name) {
//         if (tabToDelete?.name === 'update-bag') {
//           dispatch(setIsGetInitialValuesForEditBag(false));
//         } else if (tabToDelete?.name === 'update-bag') {
//           dispatch(setIsGetInitialValuesForDuplicateBag(false));
//         } else if (tabToDelete?.name === 'add-bags') {
//           dispatch(setIsGetInitialValuesForAddBag(false));
//         }
//         setState({
//           tabs: updatedTabs,
//           currentTab: previousTab,
//         });
//         if (previousTab?.largePath !== null) {
//           navigate(`${previousTab?.largePath}`);
//         } else {
//           navigate(`/${previousTab?.name}`);
//         }
//       } else {
//         setState({
//           ...state,
//           tabs: updatedTabs,
//         });
//         if (currentTab?.largePath !== null) {
//           navigate(`${currentTab?.largePath}`);
//         } else {
//           navigate(`/${currentTab?.name}`);
//         }
//       }
//       dispatch(
//         setAllFilters({
//           ...allFilters,
//           [tabToDelete?.name]: { applied: {}, filters: [], currentPage: 1 },
//         }),
//       );
//       dispatch(
//         setAllCommon({
//           ...allCommon,
//           [tabToDelete?.name]: {
//             filterToggle: false,
//             tableFilters: [],
//             searchQuery: '',
//             showMobileChecked: false,
//           },
//         }),
//       );
//     }
//   };

//   const handleSelectTab = (e, tab) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const checkViewPage = tab?.name?.includes('details');

//     setState({
//       ...state,
//       currentTab: tab,
//     });

//     if (checkViewPage && tab?.largePath) {
//       navigate(tab?.largePath, {
//         state: { isView: true },
//       });
//     } else {
//       if (tab?.largePath !== null) {
//         if (tab.name === 'update-purchase-order') {
//           navigate(`${tab?.largePath}`, { state: { isView: false } });
//         } else {
//           navigate(`${tab?.largePath}`);
//         }
//       } else {
//         if (tab.name === 'add-purchase-order') {
//           navigate(`${tab?.name}`, { state: { isView: false } });
//         } else {
//           navigate(`/${tab?.name}`);
//         }
//       }
//     }
//   };

//   return <>{createTabs()}</>;
// };

const Header = () => {
  const op = useRef(null);
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [profileLogo, setProfileLogo] = useState('');

  const { selectedUser } = useSelector(({ user }) => user);
  const { changePasswordValues, currentUser } = useSelector(({ auth }) => auth);
  const { userPermissionList } = useSelector(({ settings }) => settings);
  const UserPreferencesData = getCurrentUserFromLocal();
  const profile_logo = UserPreferencesData?.profile_logo;

  const hideMEnuRight = useCallback(() => {
    menuRight?.current?.hide();
  }, []);

  // const UserPreferences = getCurrentUserFromLocal();
  // const profile_logo = UserPreferences?.profile_logo;

  useEffect(() => {
    if (currentUser?.profile_logo) {
      setProfileLogo(currentUser?.profile_logo);
    } else {
      setProfileLogo(profile_logo);
    }
  }, [profile_logo, selectedUser, currentUser]);

  useEffect(() => {
    return () => hideMEnuRight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuRight]);

  const handleOptionClickEvent = (e, options) => {
    options?.onClick(e);
  };

  const debounceHandleClickEvent = useCallback(
    _.debounce(handleOptionClickEvent, 100),
    [],
  );

  // Old flow :
  //  const menuItems = useMemo(
  //   () => [
  //     {
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={BusinessDev} />
  //               <span>Business Development</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           template: (item, options) => {
  //             return (
  //               <>
  //                 <span
  //                   className="menu_item_wrap"
  //                   onClick={e => debounceHandleClickEvent(e, options)}
  //                 >
  //                   <Avatar image={AdminDashboard} />
  //                   <span>Admin Dashboard</span>
  //                 </span>
  //               </>
  //             );
  //           },
  //           command: () => {
  //             navigate('/admin-dashboard');
  //           },
  //         },
  //         {
  //           template: (item, options) => {
  //             return (
  //               <>
  //                 <span
  //                   className="menu_item_wrap"
  //                   onClick={e => debounceHandleClickEvent(e, options)}
  //                 >
  //                   <Avatar image={BusinessDev} />
  //                   <span>Sales Dashboard</span>
  //                 </span>
  //               </>
  //             );
  //           },
  //           command: () => {
  //             navigate('/sales-dashboard');
  //           },
  //         },
  //         {
  //           template: (item, options) => {
  //             return (
  //               <>
  //                 <span
  //                   className="menu_item_wrap"
  //                   onClick={e => debounceHandleClickEvent(e, options)}
  //                 >
  //                   <Avatar image={BusinessDev} />
  //                   <span>Old Customer Follow Ups</span>
  //                 </span>
  //               </>
  //             );
  //           },
  //           command: () => {
  //             navigate('/old-customer');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/parties' ||
  //         pathname === '/add-parties' ||
  //         pathname === '/import-parties' ||
  //         pathname.includes('/parties-details')
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Parties} />
  //               <span>Parties</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       command: () => {
  //         navigate('/parties');
  //       },
  //     },
  //     {
  //       className: `${
  //         pathname === '/consumption-dashboard' ||
  //         pathname === '/stock-raw-material' ||
  //         pathname === '/stock-consumption' ||
  //         pathname === '/stock-transfer'
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => {
  //                 debounceHandleClickEvent(e, options);
  //               }}
  //             >
  //               <Avatar image={Inventory} />
  //               <span>Inventory</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${
  //             pathname === '/consumption-dashboard' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Consumption} />
  //                 <span>Consumption Dashboard </span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/consumption-dashboard');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/stock-raw-material' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Production} />
  //                 <span>Stock(Raw Material)</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/stock-raw-material');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/stock-consumption' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={StockConsumption} />
  //                 <span>Stock Consumption(Raw Material)</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/stock-consumption');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/stock-transfer' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={StockTransfer} />
  //                 <span>Stock Transfer</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/stock-transfer');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/trending-products-and-bag-consumption' ||
  //         pathname === '/bags' ||
  //         pathname === '/add-bags' ||
  //         pathname === '/product' ||
  //         pathname === '/add-product' ||
  //         pathname === '/product-transfer' ||
  //         pathname === '/mobile-app-price-list' ||
  //         pathname.includes('/bag-details') ||
  //         pathname.includes('/product-details')
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <span
  //             className="menu_item_wrap parent_menu"
  //             onClick={e => debounceHandleClickEvent(e, options)}
  //           >
  //             <Avatar image={Products} />
  //             <span>Products</span>
  //           </span>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${
  //             pathname === '/trending-products-and-bag-consumption'
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={TrendingProducts} />
  //                 <span>Trending Products & Bag Consumption</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/trending-products-and-bag-consumption');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/bags' ||
  //             pathname === '/add-bags' ||
  //             pathname.includes('/bag-details')
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Bags} />
  //                 <span>Bags</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/bags');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/product' ||
  //             pathname === '/add-product' ||
  //             pathname.includes('/product-details')
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Product} />
  //                 <span>Product</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/product');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/product-transfer' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={StockTransfer} />
  //                 <span>Product Transfer</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/product-transfer');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/mobile-app-price-list' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MobileApp} />
  //                 <span>Mobile App Price List</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/mobile-app-price-list');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/purchase-entry' ||
  //         pathname === '/purchase-order' ||
  //         pathname === '/pre-printed-rolls' ||
  //         pathname === '/pp-price-history'
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Purchases} />
  //               <span>Purchases</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={BusinessDev} />
  //                 <span>Purchase Dashboard</span>
  //               </span>
  //             );
  //           },
  //         },
  //         {
  //           className: `${pathname === '/purchase-order' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PurchaseOrder} />
  //                 <span>Purchase Order</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/purchase-order');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/purchase-entry' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PurchaseEntry} />
  //                 <span>Purchase Entry</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/purchase-entry');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/pre-printed-rolls' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PrePrintedStatus} />
  //                 <span>Pre-Printed P.O. Status</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/pre-printed-rolls');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/pp-price-history' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PriceHistory} />
  //                 <span>PP Price History</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/pp-price-history');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/nl-requirement' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={NLRequirement} />
  //                 <span>NL Requirement</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/nl-requirement');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/order' ||
  //         pathname === '/add-new-order' ||
  //         pathname === '/proforma-invoice' ||
  //         pathname === '/add-proforma-invoice' ||
  //         pathname === '/sales-invoice' ||
  //         pathname === '/add-sales-invoice' ||
  //         pathname?.includes('/order-details') ||
  //         pathname?.includes('/add-job') ||
  //         pathname?.includes('/update-proforma-invoice') ||
  //         pathname?.includes('/update-sales-invoice') ||
  //         pathname?.includes('/proforma-details') ||
  //         pathname?.includes('/sales-invoice-details')
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Sales} />
  //               <span>Sales</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${
  //             pathname === '/order' ||
  //             pathname === '/add-new-order' ||
  //             pathname?.includes('/order-details') ||
  //             pathname?.includes('/add-job')
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PurchaseOrder} />
  //                 <span>Orders</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/order');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/proforma-invoice' ||
  //             pathname === '/add-proforma-invoice' ||
  //             pathname?.includes('/update-proforma-invoice') ||
  //             pathname?.includes('/update-sales-invoice') ||
  //             pathname?.includes('/proforma-details') ||
  //             pathname?.includes('/sales-invoice-details')
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={ProformaInvoice} />
  //                 <span>Proforma Invoice</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             // navigate('/perfoma-invoice');
  //             navigate('/proforma-invoice');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/sales-invoice' || pathname === '/add-sales-invoice'
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PurchaseEntry} />
  //                 <span>Sales invoice</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/sales-invoice');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Production} />
  //               <span>Production</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MfgLive} />
  //                 <span>MFG Live</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/mfg-live-admin');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/machine-job-queue' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MachineJob} />
  //                 <span>Machine Job Queue</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/machine-job-queue');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Financials} />
  //               <span>Financials</span>
  //             </span>
  //           </>
  //         );
  //       },

  //       items: [
  //         {
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={TrendingProducts} />
  //                 <span>Profit Analysis</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/profit-analysis');
  //           },
  //         },
  //         {
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Chat} />
  //                 <span>Collection SMS</span>
  //               </span>
  //             );
  //           },
  //         },
  //         {
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Calculator} />
  //                 <span>Broker Margin Calculator</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/broker-margin');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${pathname === '/reports' ? 'active' : ''}`,
  //       template: (item, options) => {
  //         return (
  //           <span
  //             className="menu_item_wrap "
  //             onClick={e => debounceHandleClickEvent(e, options)}
  //           >
  //             <Avatar image={Reports} />
  //             <span>Reports</span>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       className: `${
  //         pathname === '/company' ||
  //         pathname === '/users' ||
  //         pathname === '/items' ||
  //         pathname === '/role-and-permissions' ||
  //         pathname === '/misc-master' ||
  //         pathname === '/add-items' ||
  //         pathname === '/add-role-and-permissions' ||
  //         pathname === '/add-user' ||
  //         pathname === '/general-configuration'
  //           ? 'setting_menu active'
  //           : 'setting_menu'
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Settings} />
  //               <span>Settings</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${pathname === '/company' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Company} />
  //                 <span>Company</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/company');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/users' || pathname === '/add-user' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={UserLogins} />
  //                 <span>User</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/users');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/items' || pathname === '/add-items' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={ItemsIcon} />
  //                 <span>Items(Raw Materials)</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/items');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/misc-master' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MiscMasters} />
  //                 <span>Misc Masters</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/misc-master');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/role-and-permissions' ||
  //             pathname === '/add-role-and-permissions'
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={UserLogins} />
  //                 <span>Role & Permissions</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/role-and-permissions');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/general-configuration' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={GeneralConfiguration} />
  //                 <span>General Configuration</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/general-configuration');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/raw-material' ||
  //         pathname === '/finished-goods' ||
  //         pathname === '/panding-jobs' ||
  //         pathname === '/finance' ||
  //         pathname === '/sales' ||
  //         pathname === '/purchase'
  //           ? 'setting_menu active'
  //           : 'setting_menu'
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Reports} />
  //               <span>Reports</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${pathname === '/raw-material' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={Company} />
  //                 <span>Raw Material</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/raw-material');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/users' || pathname === '/finished-goods'
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={UserLogins} />
  //                 <span>Finished Goods</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/finished-goods');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/items' || pathname === '/panding-jobs'
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={ItemsIcon} />
  //                 <span>Pending Jobs</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/panding-jobs');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/finance' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MiscMasters} />
  //                 <span>Finance</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/finance');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/sales' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={UserLogins} />
  //                 <span>Sales</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/sales');
  //           },
  //         },
  //         {
  //           className: `${pathname === '/purchase' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={GeneralConfiguration} />
  //                 <span>Purchase</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/purchase');
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   [navigate, pathname],
  // );

  // const operatorItems = useMemo(
  //   () => [
  //     // {
  //     //   className: `${pathname === '/purchase-order-operator' ? 'active' : ''}`,
  //     //   template: (item, options) => {
  //     //     return (
  //     //       <>
  //     //         <span
  //     //           className="menu_item_wrap parent_menu"
  //     //           onClick={e => debounceHandleClickEvent(e, options)}
  //     //         >
  //     //           <Avatar image={Purchases} />
  //     //           <span>Purchases</span>
  //     //         </span>
  //     //       </>
  //     //     );
  //     //   },
  //     //   items: [
  //     //     {
  //     //       className: `${
  //     //         pathname === '/purchase-order-operator' ? 'active' : ''
  //     //       }`,
  //     //       template: (item, options) => {
  //     //         return (
  //     //           <span
  //     //             className="menu_item_wrap"
  //     //             onClick={e => debounceHandleClickEvent(e, options)}
  //     //           >
  //     //             <Avatar image={PurchaseOrder} />
  //     //             <span>Purchase Order Operator</span>
  //     //           </span>
  //     //         );
  //     //       },
  //     //       command: () => {
  //     //         navigate('/purchase-order-operator');
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //     {
  //       className: `${
  //         pathname === '/order-operator' ||
  //         pathname === '/add-new-order' ||
  //         pathname?.includes('/order-details')
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Sales} />
  //               <span>Sales</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${
  //             pathname === '/order-operator' ||
  //             pathname === '/add-new-order' ||
  //             pathname?.includes('/order-details')
  //               ? 'active'
  //               : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={PurchaseOrder} />
  //                 <span>Orders Operator</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/order-operator');
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       className: `${
  //         pathname === '/mfg-live-operator' ||
  //         pathname === '/machine-job-queue-operator'
  //           ? 'active'
  //           : ''
  //       }`,
  //       template: (item, options) => {
  //         return (
  //           <>
  //             <span
  //               className="menu_item_wrap parent_menu"
  //               onClick={e => debounceHandleClickEvent(e, options)}
  //             >
  //               <Avatar image={Production} />
  //               <span>Production</span>
  //             </span>
  //           </>
  //         );
  //       },
  //       items: [
  //         {
  //           className: `${pathname === '/mfg-live-operator' ? 'active' : ''}`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MfgLive} />
  //                 <span>MFG Live Operator</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/mfg-live-operator');
  //           },
  //         },
  //         {
  //           className: `${
  //             pathname === '/machine-job-queue-operator' ? 'active' : ''
  //           }`,
  //           template: (item, options) => {
  //             return (
  //               <span
  //                 className="menu_item_wrap"
  //                 onClick={e => debounceHandleClickEvent(e, options)}
  //               >
  //                 <Avatar image={MachineJob} />
  //                 <span>Machine Job Queue Operator</span>
  //               </span>
  //             );
  //           },
  //           command: () => {
  //             navigate('/machine-job-queue-operator');
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   [navigate, pathname],
  // );

  const headerAndSideMenuItems = useMemo(() => {
    return [
      {
        className: `${
          pathname === '/admin-dashboard' ||
          pathname === '/sales-dashboard' ||
          pathname === '/old-customer'
            ? 'active'
            : ''
        }`,
        itemName: 'Business Development',
        icon: BusinessDev,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/admin-dashboard' ? 'active' : ''}`,
            itemName: 'Admin Dashboard',
            resName: 'Admin Dashboard',
            icon: AdminDashboard,
            navigateTo: '/admin-dashboard',
          },
          {
            className: `${pathname === '/sales-dashboard' ? 'active' : ''}`,
            itemName: 'Sales Dashboard',
            resName: 'Sales Dashboard',
            icon: BusinessDev,
            navigateTo: '/sales-dashboard',
          },
          {
            className: `${pathname === '/old-customer' ? 'active' : ''}`,
            itemName: 'Old Customer Follow Ups',
            resName: 'Old Customer Follow-Ups',
            icon: BusinessDev,
            navigateTo: '/old-customer',
          },
        ],
      },
      {
        className: `${
          pathname === '/parties' ||
          pathname === '/add-parties' ||
          pathname === '/import-parties' ||
          pathname.includes('/parties-details')
            ? 'active'
            : ''
        }`,
        itemName: 'Parties',
        icon: Parties,
        navigateTo: '/parties',
        subItems: [],
      },
      {
        className: `${
          pathname === '/consumption-dashboard' ||
          pathname === '/stock-raw-material' ||
          pathname === '/stock-consumption' ||
          pathname === '/stock-transfer'
            ? 'active'
            : ''
        }`,
        itemName: 'Inventory',
        icon: Inventory,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/consumption-dashboard' ? 'active' : ''
            }`,
            itemName: 'Consumption Dashboard ',
            resName: 'Consumption Dashboard',
            icon: Consumption,
            navigateTo: '/consumption-dashboard',
          },
          {
            className: `${pathname === '/stock-raw-material' ? 'active' : ''}`,
            itemName: 'Stock(Raw Material)',
            resName: 'Stock(Raw Material)',
            icon: Production,
            navigateTo: '/stock-raw-material',
          },
          {
            className: `${pathname === '/stock-consumption' ? 'active' : ''}`,
            itemName: 'Stock Consumption(Raw Material)',
            resName: 'Stock Consumption(Raw Material)',
            icon: StockConsumption,
            navigateTo: '/stock-consumption',
          },

          {
            className: `${pathname === '/stock-transfer' ? 'active' : ''}`,
            itemName: 'Stock Transfer',
            resName: 'Stock Transfer(Raw Material)',
            icon: StockTransfer,
            navigateTo: '/stock-transfer',
          },
        ],
      },
      {
        className: `${
          pathname === '/trending-products-and-bag-consumption' ||
          pathname === '/bags' ||
          pathname === '/add-bags' ||
          pathname === '/product' ||
          pathname === '/add-product' ||
          pathname === '/product-transfer' ||
          pathname === '/mobile-app-price-list' ||
          pathname.includes('bag-details') ||
          pathname.includes('product-details') ||
          pathname.includes('update-bag') ||
          pathname.includes('duplicate-bag') ||
          pathname.includes('duplicate-product') ||
          pathname.includes('update-product')
            ? 'active'
            : ''
        }`,
        itemName: 'Products',
        icon: Products,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/trending-products-and-bag-consumption'
                ? 'active'
                : ''
            }`,
            itemName: 'Trending Products & Bag Consumption',
            resName: 'Trending Products & Bag Tag Consumption',
            icon: TrendingProducts,
            navigateTo: '/trending-products-and-bag-consumption',
          },
          {
            className: `${
              pathname === '/bags' || pathname === '/add-bags' ? 'active' : ''
            }`,
            itemName: 'Bags',
            resName: 'Bags',
            icon: Bags,
            navigateTo: '/bags',
          },
          {
            className: `${
              pathname === '/product' || pathname === '/add-product'
                ? 'active'
                : ''
            }`,
            itemName: 'Product',
            resName: 'Products',
            icon: Product,
            navigateTo: '/product',
          },
          {
            className: `${pathname === '/product-transfer' ? 'active' : ''}`,
            itemName: 'Product Transfer',
            resName: 'Product Transfer',
            icon: StockTransfer,
            navigateTo: '/product-transfer',
          },
          {
            className: `${
              pathname === '/mobile-app-price-list' ? 'active' : ''
            }`,
            itemName: 'Mobile App Price List',
            resName: 'Mobile App Rate List',
            icon: MobileApp,
            navigateTo: '/mobile-app-price-list',
          },
        ],
      },
      {
        className: `${
          pathname === '/purchase-receive' ||
          pathname === '/purchase-order' ||
          pathname === '/pre-printed-rolls' ||
          pathname === '/pp-price-history' ||
          pathname === '/add-purchase-order' ||
          pathname === '/nl-requirement' ||
          pathname.includes('/update-purchase-order') ||
          pathname.includes('/purchase-order-details') ||
          pathname.includes('/receive-purchase-order') ||
          pathname.includes('/purchase-receive-details')
            ? 'active'
            : ''
        }`,
        itemName: 'Purchases',
        icon: Purchases,
        navigateTo: '',
        subItems: [
          // {
          //   className: '',
          //   itemName: 'Purchase Dashboard',
          //   resName: 'Purchase Dashboard',
          //   icon: BusinessDev,
          //   // navigateTo: '',
          // },
          {
            className: `${
              pathname === '/purchase-order' ||
              pathname === '/add-purchase-order' ||
              pathname.includes('/update-purchase-order') ||
              pathname.includes('/purchase-order-details') ||
              pathname.includes('/receive-purchase-order')
                ? 'active'
                : ''
            }`,
            itemName: 'Purchase Order',
            resName: 'Purchase Order',
            icon: PurchaseOrder,
            navigateTo: '/purchase-order',
          },

          {
            className: `${pathname === '/purchase-receive' ? 'active' : ''}`,
            itemName: 'Purchase Receive',
            resName: 'Purchase Entry',
            icon: PurchaseEntry,
            navigateTo: '/purchase-receive',
          },

          {
            className: `${pathname === '/pre-printed-rolls' ? 'active' : ''}`,
            itemName: 'Pre-Printed P.O. Status',
            resName: 'Pre-Printed P.O. Status',
            icon: PrePrintedStatus,
            navigateTo: '/pre-printed-rolls',
          },

          {
            className: `${pathname === '/pp-price-history' ? 'active' : ''}`,
            itemName: 'PP Price History',
            resName: 'PP Price History',
            icon: PriceHistory,
            navigateTo: '/pp-price-history',
          },

          {
            className: `${pathname === '/nl-requirement' ? 'active' : ''}`,
            itemName: 'NL Requirement',
            resName: 'NL Requirement',
            icon: NLRequirement,
            navigateTo: '/nl-requirement',
          },
        ],
      },
      {
        className: `${
          pathname === '/order' ||
          pathname === '/add-new-order' ||
          pathname === '/proforma-invoice' ||
          pathname === '/add-proforma-invoice' ||
          pathname === '/sales-invoice' ||
          pathname === '/add-sales-invoice' ||
          pathname === '/order-operator' ||
          pathname?.includes('/order-details') ||
          pathname?.includes('/add-job') ||
          pathname?.includes('/job-details') ||
          pathname?.includes('/update-proforma-invoice') ||
          pathname?.includes('/update-sales-invoice') ||
          pathname?.includes('/proforma-details') ||
          pathname?.includes('/sales-invoice-details') ||
          pathname?.includes('update-order') ||
          pathname?.includes('update-job')
            ? 'active'
            : ''
        }`,
        itemName: 'Sales',
        icon: Sales,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/order' ||
              pathname === '/add-new-order' ||
              pathname?.includes('/order-details') ||
              pathname?.includes('/add-job')
                ? 'active'
                : ''
            }`,
            itemName: 'Orders',
            resName: 'Orders',
            icon: PurchaseOrder,
            navigateTo: '/order',
          },
          {
            className: `${pathname === '/order-operator' ? 'active' : ''}`,
            itemName: 'Order Operator',
            resName: 'Order Operator',
            icon: PurchaseOrder,
            navigateTo: '/order-operator',
          },
          {
            className: `${
              pathname === '/proforma-invoice' ||
              pathname === '/add-proforma-invoice' ||
              pathname?.includes('/update-proforma-invoice') ||
              pathname?.includes('/update-sales-invoice') ||
              pathname?.includes('/proforma-details') ||
              pathname?.includes('/sales-invoice-details')
                ? 'active'
                : ''
            }`,
            itemName: 'Proforma Invoice',
            resName: 'Pro-forma Invoice',
            icon: ProformaInvoice,
            navigateTo: '/proforma-invoice',
          },
          {
            className: `${
              pathname === '/sales-invoice' || pathname === '/add-sales-invoice'
                ? 'active'
                : ''
            }`,
            itemName: 'Sales invoice',
            resName: 'Tax Invoice',
            icon: PurchaseEntry,
            navigateTo: '/sales-invoice',
          },
        ],
      },
      {
        className: `${
          pathname === '/machine-job-queue' || pathname === '/mfg-live-admin'
            ? 'active'
            : ''
        }`,
        itemName: 'Production',
        icon: Production,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/mfg-live-admin' ? 'active' : ''}`,
            itemName: 'MFG Live',
            resName: 'MFG Live',
            icon: MfgLive,
            navigateTo: '/mfg-live-admin',
          },
          {
            className: `${pathname === '/machine-job-queue' ? 'active' : ''}`,
            itemName: 'Machine Job Queue',
            resName: 'Machine Job Queue',
            icon: MachineJob,
            navigateTo: '/machine-job-queue',
          },
        ],
      },
      {
        className: `${
          pathname === '/profit-analysis' || pathname === '/broker-margin'
            ? 'active'
            : ''
        }`,
        itemName: 'Financials',
        icon: Financials,
        navigateTo: '',
        subItems: [
          {
            className: '',
            itemName: 'Profit Analysis',
            resName: 'Profit Analysis',
            icon: TrendingProducts,
            navigateTo: '/profit-analysis',
          },
          // {
          //   className: '',
          //   itemName: 'Collection SMS',
          //   resName: 'Collection SMS',
          //   icon: Chat,
          //   navigateTo: '',
          // },
          {
            className: '',
            itemName: 'Broker Margin Calculator',
            resName: 'Broker margin',
            icon: Calculator,
            navigateTo: '/broker-margin',
          },
        ],
      },
      {
        className: `${
          pathname === '/raw-material' ||
          pathname === '/finished-goods' ||
          pathname === '/pending-jobs' ||
          pathname === '/finance' ||
          pathname === '/sales' ||
          pathname === '/purchase'
            ? 'setting_menu active'
            : 'setting_menu'
        }`,
        itemName: 'Report',
        icon: Reports,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/raw-material' ? 'active' : ''}`,
            itemName: 'Raw Material',
            resName: 'Raw Material',
            icon: ItemsIcon,
            navigateTo: '/raw-material',
          },
          {
            className: `${pathname === '/finished-goods' ? 'active' : ''}`,
            itemName: 'Finished Goods',
            resName: 'Finished Goods',
            icon: Products,
            navigateTo: '/finished-goods',
          },
          {
            className: `${pathname === '/pending-jobs' ? 'active' : ''}`,
            itemName: 'Pending Jobs',
            resName: 'Pending Jobs',
            icon: PandingJob,
            navigateTo: '/pending-jobs',
          },
          {
            className: `${pathname === '/finance' ? 'active' : ''}`,
            itemName: 'Finance',
            resName: 'Finance',
            icon: Financials,
            navigateTo: '/finance',
          },
          {
            className: `${pathname === '/sales' ? 'active' : ''}`,
            itemName: 'Sales',
            resName: 'Sales',
            icon: Sales,
            navigateTo: '/sales',
          },
          // {
          //   className: `${pathname === '/purchase' ? 'active' : ''}`,
          //   itemName: 'Purchase',
          //   resName: 'Purchase',
          //   icon: Purchases,
          //   navigateTo: '/purchase',
          // },
          {
            className: `${pathname === '/monthly-turnover' ? 'active' : ''}`,
            itemName: 'Monthly Turnover',
            resName: 'Monthly Turnover',
            icon: Purchases,
            navigateTo: '/monthly-turnover',
          },
        ],
      },
      {
        className: `${
          pathname === '/company' ||
          pathname === '/users' ||
          pathname === '/items' ||
          pathname === '/role-and-permissions' ||
          pathname === '/misc-master' ||
          pathname === '/add-items' ||
          pathname === '/add-role-and-permissions' ||
          pathname === '/add-user' ||
          pathname === '/general-configuration' ||
          pathname.includes('/user-details') ||
          pathname.includes('update-user') ||
          pathname.includes('role-and-permissions-details') ||
          pathname.includes('update-role-and-permissions') ||
          pathname.includes('item-details') ||
          pathname.includes('update-item')
            ? 'setting_menu active'
            : 'setting_menu'
        }`,
        itemName: 'Settings',
        icon: Settings,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/company' ? 'active' : ''}`,
            itemName: 'Company',
            resName: 'Company',
            icon: Company,
            navigateTo: '/company',
          },
          {
            className: `${
              pathname === '/users' || pathname === '/add-user' ? 'active' : ''
            }`,
            itemName: 'User',
            resName: 'Users',
            icon: UserLogins,
            navigateTo: '/users',
          },
          {
            className: `${
              pathname === '/items' || pathname === '/add-items' ? 'active' : ''
            }`,
            itemName: 'Items(Raw Materials)',
            resName: 'Items(Raw Materials)',
            icon: ItemsIcon,
            navigateTo: '/items',
          },
          {
            className: `${pathname === '/misc-master' ? 'active' : ''}`,
            itemName: 'Misc Masters',
            resName: 'Misc Masters',
            icon: MiscMasters,
            navigateTo: '/misc-master',
          },
          {
            className: `${
              pathname === '/role-and-permissions' ||
              pathname === '/add-role-and-permissions'
                ? 'active'
                : ''
            }`,
            itemName: 'Role & Permissions',
            resName: 'Roles & Permissions',
            icon: UserLogins,
            navigateTo: '/role-and-permissions',
          },
          {
            className: `${
              pathname === '/general-configuration' ? 'active' : ''
            }`,
            itemName: 'General Configuration',
            resName: 'General Configuration',
            icon: GeneralConfiguration,
            navigateTo: '/general-configuration',
          },
        ],
      },
    ];
  }, [pathname]);

  const operatorHeaderMenuItems = useMemo(() => {
    return [
      {
        className: `${
          pathname === '/consumption-dashboard' ||
          pathname === '/stock-raw-material' ||
          pathname === '/stock-consumption' ||
          pathname === '/stock-transfer'
            ? 'active'
            : ''
        }`,
        itemName: 'Inventory',
        icon: Inventory,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/stock-raw-material' ? 'active' : ''}`,
            itemName: 'Stock(Raw Material)',
            resName: 'Stock(Raw Material)',
            icon: Production,
            navigateTo: '/stock-raw-material',
          },
        ],
      },
      {
        className: `${
          pathname === '/order-operator' ||
          pathname === '/add-new-order' ||
          pathname?.includes('/order-details')
            ? 'active'
            : ''
        }`,
        itemName: 'Sales',
        icon: Sales,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/order-operator' ||
              pathname === '/add-new-order' ||
              pathname?.includes('/order-details')
                ? 'active'
                : ''
            }`,
            itemName: 'Orders Operator',
            // resName: 'Orders Operator',
            icon: PurchaseOrder,
            navigateTo: '/order-operator',
          },
        ],
      },
      {
        className: `${
          pathname === '/mfg-live-operator' ||
          pathname === '/machine-job-queue-operator'
            ? 'active'
            : ''
        }`,
        itemName: 'Production',
        icon: Production,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/mfg-live-operator' ? 'active' : ''}`,
            itemName: 'MFG Live Operator',
            icon: MfgLive,
            navigateTo: '/mfg-live-operator',
          },
          {
            className: `${
              pathname === '/machine-job-queue-operator' ? 'active' : ''
            }`,
            itemName: 'Machine Job Queue Operator',
            icon: MachineJob,
            navigateTo: '/machine-job-queue-operator',
          },
        ],
      },
      {
        className: `${
          pathname === '/raw-material' ||
          pathname === '/finished-goods' ||
          pathname === '/pending-jobs' ||
          pathname === '/finance' ||
          pathname === '/sales' ||
          pathname === '/purchase'
            ? 'setting_menu active'
            : 'setting_menu'
        }`,
        itemName: 'Report',
        icon: Reports,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/pending-jobs' ? 'active' : ''}`,
            itemName: 'Pending Jobs',
            resName: 'Pending Jobs',
            icon: PandingJob,
            navigateTo: '/pending-jobs',
          },
        ],
      },
    ];
  }, [pathname]);

  const userMenu = [
    {
      items: [
        {
          label: 'My Profile',
          command: () => {
            navigate('/my-profile');
          },
        },
        {
          label: 'Change Password',
          command: () => {
            setChangePasswordModal(true);
          },
        },
        {
          label: 'Logout',
          command: () => {
            dispatch(logout());
            navigate('/');
            clearToken();
          },
        },
      ],
    },
  ];

  const updatedOperatorMenuItem = useMemo(() => {
    const navLinks = [];

    const checkFlexoPrintForOperator = operatorHeaderMenuItems?.filter(i =>
      !UserPreferencesData?.flexo_print
        ? !['sales', 'inventory']?.includes(i?.itemName?.toLowerCase())
        : true,
    );

    checkFlexoPrintForOperator?.forEach(x => {
      const childItem = [];
      x?.subItems?.forEach(y => {
        childItem?.push({
          className: y?.className,
          template: (item, options) => {
            return (
              <>
                <span
                  className="menu_item_wrap"
                  onClick={e => debounceHandleClickEvent(e, options)}
                >
                  <Avatar image={y?.icon} />
                  <span>{y?.itemName}</span>
                </span>
              </>
            );
          },
          command: () => navigate(y?.navigateTo),
        });
      });

      navLinks?.push({
        className: x.className,
        template: (item, options) => {
          return (
            <>
              <span
                className={`${
                  x?.subItems?.length > 0
                    ? 'menu_item_wrap parent_menu'
                    : 'menu_item_wrap'
                }`}
                onClick={e => debounceHandleClickEvent(e, options)}
              >
                <Avatar image={x?.icon} />
                <span>{x?.itemName}</span>
              </span>
            </>
          );
        },
        ...(childItem?.length && { items: childItem }),
        command: () => {
          if (x?.navigateTo) navigate(x?.navigateTo);
        },
      });
    });
    return navLinks;
  }, [
    UserPreferencesData,
    debounceHandleClickEvent,
    navigate,
    operatorHeaderMenuItems,
  ]);

  const updatePermissionItemName = item => {
    let permissionItem = { ...item };
    let permissionItemName = permissionItem?.name;

    switch (permissionItemName?.toLowerCase()) {
      case 'dashboard':
        permissionItem = { ...permissionItem, name: 'Business Development' };
        break;
      case 'product':
        permissionItem = { ...permissionItem, name: 'Products' };
        break;
      default:
        return permissionItem;
    }
    return permissionItem;
  };

  const filteredPermissionData = useMemo(() => {
    const updatedPermissionData = [];
    userPermissionList?.forEach(item => {
      item?.sub_module.forEach(data => {
        const hasPermission = Object.keys(data.permission).some(
          key => key !== '_id' && data.permission[key] === true,
        );

        if (data.name !== 'Other' && hasPermission) {
          const updatedItem = updatePermissionItemName(item);
          const existingItemIndex = updatedPermissionData.findIndex(
            i => i._id === item._id,
          );

          if (existingItemIndex !== -1) {
            // filteredPermissionData[findIndex].sub_module =
            //   filteredPermissionData[findIndex].sub_module || [];
            updatedPermissionData[existingItemIndex].sub_module.push(data);
          } else {
            updatedPermissionData.push({
              ...updatedItem,
              sub_module: [data],
            });
          }
        }
      });
    });
    return updatedPermissionData;
  }, [userPermissionList]);

  const filteredMenuItems = useMemo(() => {
    return headerAndSideMenuItems
      ?.map(dataItem => {
        const itemNameLowerCase = dataItem.itemName?.toLowerCase();

        const match = filteredPermissionData.find(headerItem => {
          const headerItemNameLowerCase = headerItem.name?.toLowerCase();
          return itemNameLowerCase === headerItemNameLowerCase;
          // || itemNameLowerCase === 'reports'
        });

        if (match) {
          const setHeaderMenuItem = match?.sub_module
            ?.map(subModule => {
              return dataItem.subItems.find(
                item => item.resName === subModule.name,
              );
            })
            ?.filter(item => item);

          return {
            ...dataItem,
            subItems: setHeaderMenuItem || [],
          };
        }
      })
      ?.filter(filteredItem => filteredItem);
  }, [filteredPermissionData, headerAndSideMenuItems]);

  const updatedMenuItems = useMemo(() => {
    const navLinks = [];
    // const filteredPermissionData = [];
    // remove this static after it's cretae in a dynamic
    // const reportsModule = headerAndSideMenuItems?.find(
    //   item => item?.itemName === 'Report',
    // );

    // To set a permission item in the FilterData array as per permission
    // userPermissionList?.forEach(item => {
    //   item?.sub_module.forEach(data => {
    //     const hasPermission = Object.keys(data.permission).some(
    //       key => key !== '_id' && data.permission[key] === true,
    //     );

    //     if (data.name !== 'Other' && hasPermission) {
    //       const updatedItem = updatePermissionItemName(item);
    //       const existingItemIndex = filteredPermissionData.findIndex(
    //         i => i._id === item._id,
    //       );

    //       if (existingItemIndex !== -1) {
    //         // filteredPermissionData[findIndex].sub_module =
    //         //   filteredPermissionData[findIndex].sub_module || [];
    //         filteredPermissionData[existingItemIndex].sub_module.push(data);
    //       } else {
    //         filteredPermissionData.push({
    //           ...updatedItem,
    //           sub_module: [data],
    //         });
    //       }
    //     }
    //   });
    // });

    // To set filtered header-menu items according to permissions
    // const filteredMenuItems = headerAndSideMenuItems
    //   ?.map(dataItem => {
    //     const itemNameLowerCase = dataItem.itemName?.toLowerCase();

    //     const match = filteredPermissionData.find(headerItem => {
    //       const headerItemNameLowerCase = headerItem.name?.toLowerCase();
    //       return itemNameLowerCase === headerItemNameLowerCase;
    //       // || itemNameLowerCase === 'reports'
    //     });

    //     if (match) {
    //       const setHeaderMenuItem = match?.sub_module
    //         ?.map(subModule => {
    //           return dataItem.subItems.find(
    //             item => item.resName === subModule.name,
    //           );
    //         })
    //         ?.filter(item => item);

    //       return {
    //         ...dataItem,
    //         subItems: setHeaderMenuItem || [],
    //       };
    //     }
    //   })
    //   ?.filter(filteredItem => filteredItem);

    const finalHeaderList = filteredMenuItems?.map(x => {
      // const childItem = [];
      const childItem = x?.subItems?.map(y => {
        return {
          className: y?.className,
          template: (item, options) => {
            return (
              <>
                <span
                  className="menu_item_wrap"
                  onClick={e => debounceHandleClickEvent(e, options)}
                >
                  <Avatar image={y?.icon} />
                  <span>{y?.itemName}</span>
                </span>
              </>
            );
          },
          command: () => {
            if (y?.navigateTo) navigate(y?.navigateTo);
          },
        };
      });

      return {
        className: x.className,
        template: (item, options) => {
          return (
            <>
              <span
                className={`${
                  x?.subItems?.length > 0
                    ? 'menu_item_wrap parent_menu'
                    : 'menu_item_wrap'
                }`}
                onClick={e => debounceHandleClickEvent(e, options)}
              >
                <Avatar image={x?.icon} />
                <span>{x?.itemName}</span>
              </span>
            </>
          );
        },
        ...(childItem?.length && { items: childItem }),
        command: () => {
          if (x?.navigateTo) navigate(x?.navigateTo);
        },
      };
    });

    return finalHeaderList;
  }, [filteredMenuItems, debounceHandleClickEvent, navigate]);

  const start = <img alt="logo" src={Logo} />;
  const end = (
    <ul className="right_header">
      <li>
        {/* <img src={Search} alt="" /> */}
        {/* <SpeedDial model={items} direction="right" /> */}
      </li>
      {/* <li className="notification_wrapper">
        <Button
          className="btn_transperant notification_btn"
          onClick={e => op?.current?.toggle(e)}
        >
          <img src={Notifiaction} alt="" width={24} height={24} />
          <span></span>
        </Button> */}
      {/* Notification popup */}
      {/* <OverlayPanel ref={op} showCloseIcon className="notification_overlay">
          <div className="overlay_top_wrap">
            <h3>Notifications </h3>
          </div>
          <div className="notification_main_wrapper">
            <div className="notification_top">
              <Row>
                <Col>
                  <h5>
                    All <span>1</span>
                  </h5>
                </Col>
                <Col className="text-end">
                  <span>Mark all as read</span>
                </Col>
              </Row>
            </div>
            <div className="notification_body">
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="notification_footer d-flex justify-content-between align-items-center">
              <Button className="btn_transperant text_primary">
                Clear all notifications
              </Button>
              <Button
                className="btn_primary"
                onClick={e => {
                  setVisibleRight(true);
                  op.current?.toggle(e);
                }}
              >
                View all notifications
              </Button>
            </div>
          </div>
        </OverlayPanel> */}
      {/* </li> */}
      <li>
        <Menu
          model={userMenu}
          ref={menuRight}
          popup
          id="popup_menu_right"
          popupAlignment="right"
        />
        <Button
          label="Show Right"
          icon="pi pi-align-right"
          className="user_dropdown"
          onClick={e => menuRight?.current?.toggle(e)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          {profileLogo ? (
            <img src={profileLogo || ''} alt={''} />
          ) : (
            <div
              style={{
                color: 'black',
              }}
            >
              {UserPreferencesData?.first_name && UserPreferencesData?.last_name
                ? `${UserPreferencesData?.first_name?.charAt(0)?.toUpperCase()}
            ${UserPreferencesData?.last_name?.charAt(0)?.toUpperCase()}`
                : 'UN'}
            </div>
          )}
        </Button>
      </li>
    </ul>
  );

  const submitHandle = useCallback(
    async values => {
      let result;
      const payload = {
        ...values,
      };
      result = await dispatch(changePassword(payload));
      if (result) {
        dispatch(
          setChangePassword({
            new_password: '',
            password: '',
            old_password: '',
          }),
        );
        setChangePasswordModal(false);
      }
    },
    [dispatch],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: changePasswordValues,
      validationSchema: changePasswordSchema,
      onSubmit: submitHandle,
    });

  return (
    <>
      <header>
        <div className="main_header">
          <div className="menu_wrapper">
            <Menubar
              model={
                currentUser?.operator
                  ? updatedOperatorMenuItem
                  : updatedMenuItems
              }
              start={start}
              end={end}
            />
          </div>
        </div>
        <div className="page_tab_wrapper">
          {/* <NavTab /> */}
          <GenerateNavTabs />
        </div>
        {/* Profile pic popup */}
        <Dialog
          header="Change Password"
          visible={changePasswordModal}
          draggable={false}
          className="modal_Wrapper modal_small modal_no_padding"
          onHide={() => {
            setChangePasswordModal(false);
            dispatch(
              setChangePassword({
                new_password: '',
                password: '',
                old_password: '',
              }),
            );
          }}
        >
          <div className="stock_transfer_modal_wrapper">
            <div className="stock_transfer_top_wrap px-3">
              <div className="form_group mb-3">
                <label htmlFor="OldPassword">
                  Old Password <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  type="password"
                  placeholder="Old Password"
                  name="old_password"
                  value={values?.old_password || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.old_password && errors?.old_password && (
                  <p className="text-danger">{errors?.old_password}</p>
                )}
              </div>
              <div className="form_group mb-3">
                <label htmlFor="NewPassword">
                  New Password <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  type="password"
                  placeholder="New Password"
                  name="password"
                  value={values?.password || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.password && errors?.password && (
                  <p className="text-danger">{errors?.password}</p>
                )}
              </div>
              <div className="form_group mb-3">
                <label htmlFor="ConfirmPassword">
                  Confirm Password <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  type="password"
                  placeholder="Confirm Password*"
                  name="new_password"
                  value={values?.new_password || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched?.new_password && errors?.new_password && (
                  <p className="text-danger">{errors?.new_password}</p>
                )}
              </div>
            </div>
          </div>
          <div className="button_group d-flex justify-content-end px-3">
            <Button
              className="btn_primary ms-3"
              onClick={() => handleSubmit(values)}
            >
              Change Password
            </Button>
          </div>
        </Dialog>
        {/* / Notification Modal / */}
        <Sidebar
          visible={visibleRight}
          position="right"
          onHide={() => setVisibleRight(false)}
          className="notification_sidebar"
        >
          <div className="notification_main_wrapper">
            <h3 className="sidebar_title">Notification</h3>
            <div className="notification_top">
              <Row>
                <Col>
                  <h5>
                    All <span>1</span>
                  </h5>
                </Col>
                <Col className="text-end">
                  <span>Mark all as read</span>
                </Col>
              </Row>
            </div>
            <div className="notification_body">
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="notification_footer d-flex justify-content-between align-items-center">
              <Button className="btn_transperant text_primary">
                Clear all notifications
              </Button>
            </div>
          </div>
        </Sidebar>
      </header>
      <OverlayPanel ref={op} showCloseIcon className="notification_overlay">
        <div className="overlay_top_wrap">
          <h3>Notifications </h3>
        </div>
        <div className="notification_main_wrapper">
          <div className="notification_top">
            <Row>
              <Col>
                <h5>
                  All <span>1</span>
                </h5>
              </Col>
              <Col className="text-end">
                <span>Mark all as read</span>
              </Col>
            </Row>
          </div>
          <div className="notification_body">
            <div className="notification_box unread">
              <div className="notification_icon orange">
                <span>KK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon green">
                <span>BR</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon blue">
                <span>KK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon yellow">
                <span>RK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="notification_footer d-flex justify-content-between align-items-center">
            <Button className="btn_transperant text_primary">
              Clear all notifications
            </Button>
            <Button
              className="btn_primary"
              onClick={e => {
                setVisibleRight(true);
                op.current?.toggle(e);
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};
export default Header;
