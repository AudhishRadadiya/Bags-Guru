import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'react-bootstrap';
import Logo from '../../Assets/Images/logo.svg';
import Notifiaction from '../../Assets/Images/notification.svg';
import CloseIcon from '../../Assets/Images/close.svg';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { checkIsEmpty } from './routeConfig';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Sidebar } from 'primereact/sidebar';
import { getCurrentUserFromLocal } from 'Services/baseService';
import { useDispatch } from 'react-redux';
import { changePassword } from 'Services/authService';
import { setChangePassword } from 'Store/Reducers/Auth/auth.slice';
import { useFormik } from 'formik';
import { changePasswordSchema } from 'Schemas/AllSchemas';
import { HeaderRoutes } from './HeaderRoutes';
import { DASHBOARD, SETTINGS } from 'Global/Constants';

let rightsSessionList = [
  '/parties',
  '/update-parties',
  '/add-parties',
  '/parties-details',
  '/import-parties',
  '/import-parties-map-columns',
  '/import-parties-import-records',
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
  '/add-proforma-invoice',
  '/update-proforma-invoice',
  '/sales-invoice',
  '/add-sales-invoice',
  '/update-sales-invoice',
  '/consumption-dashboard',
  '/stock-raw-material',
  '/stock-consumption',
  '/stock-transfer',
  '/company',
  '/users',
  '/add-user',
  '/update-user',
  '/items',
  '/add-items',
  '/update-item',
  '/misc-master',
  '/role-and-permissions',
  '/add-role-and-permissions',
  '/update-role-and-permissions',
  '/my-profile',
  '/general-configuration',
];

export const isOperator = list => {
  return list?.filter(x => x?.sub_module?.length > 0)?.length > 0
    ? false
    : true;
};

const NavTab = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const locationPath = pathname?.split('/');

  const { userPermissionList } = useSelector(({ settings }) => settings);

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

  const handleDeleteTab = useCallback(
    (e, tabToDelete) => {
      e.preventDefault();
      e.stopPropagation();
      const { tabs, currentTab } = state;
      if (tabs?.length <= 1) {
        if (currentTab.name !== 'parties') {
          setState({
            tabs: [],
            currentTab: { name: '', largePath: null },
          });
          navigate('/parties');
        }
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
      }
    },
    [navigate, state],
  );

  const handleSelectTab = useCallback(
    (e, tab) => {
      e.preventDefault();
      e.stopPropagation();

      setState({
        ...state,
        currentTab: tab,
      });
      if (tab?.largePath !== null) {
        navigate(`${tab?.largePath}`);
      } else {
        navigate(`/${tab?.name}`);
      }
    },
    [navigate, state],
  );

  const createTabs = useCallback(() => {
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
                    ? isOperator(userPermissionList)
                      ? 'Sales Operator'
                      : 'Parties'
                    : tab?.name && String(tab?.name)?.replaceAll('-', ' ')}
                </span>
                <span className="close_icon">
                  <img
                    src={CloseIcon}
                    alt=""
                    onClick={e => handleDeleteTab(e, tab)}
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
  }, [handleDeleteTab, handleSelectTab, state, userPermissionList]);

  const handleAddTab = useCallback(() => {
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
  }, [locationPath, pathname, state]);

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

  return <>{createTabs()}</>;
};

export default function Header() {
  const op = useRef(null);
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const pathLength = pathname?.split('/');

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [profileLogo, setProfileLogo] = useState('');

  const { selectedUser } = useSelector(({ user }) => user);
  const { changePasswordValues } = useSelector(({ auth }) => auth);

  const { userPermissionList } = useSelector(({ settings }) => settings);

  const UserPreferences = getCurrentUserFromLocal();
  const profile_logo = UserPreferences?.profile_logo;

  const getMatchedModule = useCallback(
    module => {
      return userPermissionList?.filter(x => x?.name === module)?.[0]
        ?.sub_module;
    },
    [userPermissionList],
  );

  const menuItems = useMemo(() => {
    const navLinks = [];
    HeaderRoutes?.forEach(x => {
      const matchModule = getMatchedModule(x?.name);

      const items = [];
      x?.childs?.forEach(y => {
        const hasAccess = matchModule?.filter(x => x?.name === y?.name)?.[0]
          ?.permission;
        items?.push({
          className: `${x?.name === pathname ? 'active' : ''}`,
          template: (item, options) => {
            return hasAccess?.view === true ? (
              <>
                <span
                  className="menu_item_wrap"
                  onClick={e => options?.onClick(e)}
                >
                  <Avatar image={y?.image} />
                  <span>{y?.name}</span>
                </span>
              </>
            ) : null;
          },
          command: () => navigate(y?.path),
        });
      });
      const hasAccess = matchModule?.filter(x => x?.permission?.view)?.length;
      const className = `${
        x?.routes?.includes(`/${pathLength[1]}`)
          ? x?.name === SETTINGS
            ? 'setting_menu active'
            : 'active'
          : x?.name === SETTINGS
          ? 'setting_menu'
          : ''
      }`;

      if (hasAccess > 0) {
        navLinks?.push({
          className,
          template: (item, options) => {
            return (
              <>
                <span
                  className={`${
                    x?.childs?.length >= 0
                      ? 'menu_item_wrap parent_menu'
                      : 'menu_item_wrap'
                  }`}
                  onClick={e => options?.onClick(e)}
                >
                  <Avatar image={x?.image} />
                  <span>
                    {x?.name === DASHBOARD ? 'Business Development' : x?.name}
                  </span>
                </span>
              </>
            );
          },
          items,
          command: () => {
            if (x?.path) navigate(x?.path);
          },
        });
      }
    });
    return navLinks;
  }, [getMatchedModule, navigate, pathLength, pathname]);

  const userMenu = useMemo(
    () => [
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
              localStorage.clear();
              navigate('/');
            },
          },
        ],
      },
    ],
    [navigate],
  );

  const hideMEnuRight = useCallback(() => {
    menuRight?.current?.hide();
  }, []);

  useEffect(() => {
    setProfileLogo(profile_logo);
  }, [profile_logo, selectedUser]);

  useEffect(() => {
    return () => hideMEnuRight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuRight]);

  const start = <img alt="logo" src={Logo} />;
  const end = (
    <ul className="right_header">
      <li>
        {/* <img src={Search} alt="" /> */}
        {/* <SpeedDial model={items} direction="right" /> */}
      </li>
      <li className="notification_wrapper">
        <Button
          className="btn_transperant notification_btn"
          onClick={e => op?.current?.toggle(e)}
        >
          <img src={Notifiaction} alt="" />
          <span></span>
        </Button>
      </li>
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
              {UserPreferences?.first_name && UserPreferences?.last_name
                ? `${UserPreferences?.first_name?.charAt(0)?.toUpperCase()}
              ${UserPreferences?.last_name?.charAt(0)?.toUpperCase()}`
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
            <Menubar model={menuItems} start={start} end={end} />
          </div>
        </div>
        <div className="page_tab_wrapper">
          <NavTab />
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
}
