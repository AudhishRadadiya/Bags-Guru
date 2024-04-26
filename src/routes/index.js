import React, { Suspense } from 'react';
import AuthLayout from 'Components/Common/AuthLayout';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { createPopper } from '@popperjs/core';
import ProtectedRoutes from './ProtectedRoutes';
import {
  INVENTORY,
  PARTIES,
  PRODUCT,
  PURCHASES,
  RoleBags,
  RoleCompany,
  RoleConsumptionDashboard,
  RoleGeneralConfiguration,
  RoleItemsRawMaterials,
  RoleMiscMasters,
  RoleMobileAppPriceList,
  RoleOrders,
  RoleOther,
  RoleParties,
  RoleProductTransfer,
  RoleProducts,
  RoleProformaInvoice,
  RoleStockConsumptionRawMaterial,
  RoleStockRawMaterial,
  RoleStockTransferRawMaterial,
  RoleTrendingProductsBagConsumption,
  RoleUsers,
  RolesPermissions,
  SALES,
  RolePurchaseOrder,
  RolePurchaseEntry,
  SETTINGS,
  RoleTaxInvoice,
  RoleOrdersOperator,
  RoleMFGLive,
  PRODUCTION,
  RolePpPriceHistory,
  FINANCIALS,
  RoleProfitAnalysis,
  DASHBOARD,
  RoleAdminDashboard,
  RoleMFGOperator,
  RoleMachineJobQueue,
  RolePurchaseOrderOperator,
  RoleMachineJobQueueOperator,
  RoleSalesDashboard,
  RoleOldCustFollowUps,
  REPORT,
  RoleRawMaterial,
  RoleFinishedGoods,
  RolePendingJobs,
  RoleFinance,
  RolesSales,
  RolePurchase,
  RoleMonthlyTurnover,
} from 'Global/Constants';
import Loader from 'Components/Common/Loader';
import PublicRoutes from './PublicRoutes';
import RawMaterial from 'Components/Common/Reports/RawMaterial';
import FinishedGoods from 'Components/Common/Reports/FinishedGoods';
import PendingJobs from 'Components/Common/Reports/PendingJobs';
import Finance from 'Components/Common/Reports/Finance';
import Sales from 'Components/Common/Reports/Sales';
import Purchase from 'Components/Common/Reports/Purchase';
import MonthlyTurnover from 'Components/Common/Reports/MonthlyTurnover/MonthlyTurnover';

const HomePage = React.lazy(() => import('Components/Parties/index'));
const ImportPartiesStepOne = React.lazy(() =>
  import('Components/Parties/ImportPartiesStepOne'),
);
const ImportPartiesStepTwo = React.lazy(() =>
  import('Components/Parties/ImportPartiesStepTwo'),
);
const ImportPartiesStepThree = React.lazy(() =>
  import('Components/Parties/ImportPartiesStepThree'),
);
const AddParty = React.lazy(() => import('Components/Parties/AddParty'));
const EditParty = React.lazy(() => import('Components/Parties/EditParty'));
const ViewParty = React.lazy(() => import('Components/Parties/ViewPartiy'));
const ForgotPassword = React.lazy(() =>
  import('Components/Auth/ForgotPassword'),
);
const EmailVerification = React.lazy(() =>
  import('Components/Auth/EmailVerification'),
);

const SetPassword = React.lazy(() => import('Components/Auth/SetPassword'));
const Login = React.lazy(() => import('Components/Auth/Login'));
const Company = React.lazy(() => import('Components/Settings/Company'));
const User = React.lazy(() => import('Components/Settings/Users'));
// const AddUsers = React.lazy(() => import('Components/Settings/AddUsers'));
const AddUser = React.lazy(() => import('Components/Settings/User/AddUser'));
const EditUser = React.lazy(() => import('Components/Settings/User/EditUser'));
const ViewUser = React.lazy(() => import('Components/Settings/User/ViewUser'));
const Items = React.lazy(() => import('Components/Settings/Items'));
// const AddItems = React.lazy(() => import('Components/Settings/AddItems'));
const AddItem = React.lazy(() => import('Components/Settings/Item/AddItem'));
const EditItem = React.lazy(() => import('Components/Settings/Item/EditItem'));
const ViewItem = React.lazy(() => import('Components/Settings/Item/ViewItem'));
const MyProfile = React.lazy(() => import('Components/Settings/MyProfile'));
const Order = React.lazy(() => import('Components/Sales/Order'));
// const AddNewOrder = React.lazy(() => import('Components/Sales/AddNewOrder'));
const AddOrder = React.lazy(() => import('Components/Sales/Orders/AddOrder'));
const EditOrder = React.lazy(() => import('Components/Sales/Orders/EditOrder'));
// const AddJob = React.lazy(() => import('Components/Sales/AddJob'));
const AddJob = React.lazy(() => import('Components/Sales/Jobs/AddJob'));
const EditJob = React.lazy(() => import('Components/Sales/Jobs/EditJob'));
const ViewJob = React.lazy(() => import('Components/Sales/Jobs/ViewJob'));
const OrderDetails = React.lazy(() => import('Components/Sales/OrderDetails'));
const OrderOperator = React.lazy(() =>
  import('Components/Sales/OrderOperator'),
);
const RolePermissions = React.lazy(() =>
  import('Components/Settings/RolePermissions'),
);
const AddRolePermissions = React.lazy(() =>
  import('Components/Settings/AddRolePermissions'),
);
const MiscMaster = React.lazy(() =>
  import('Components/Settings/MiscMaster/Index'),
);
const ProformaInvoice = React.lazy(() =>
  import('Components/Sales/ProformaInvoice'),
);
// const AddProformaInvoice = React.lazy(() =>
//   import('Components/Sales/AddProformaInvoice'),
// );
const AddProformaInvoice = React.lazy(() =>
  import('Components/Sales/ProformaInvoice/AddProformaInvoice'),
);
const EditProformaInvoice = React.lazy(() =>
  import('Components/Sales/ProformaInvoice/EditProformaInvoice'),
);
const ViewProformaInvoice = React.lazy(() =>
  import('Components/Sales/ProformaInvoice/ViewProformaInvoice'),
);
const SalesInvoice = React.lazy(() => import('Components/Sales/SalesInvoice'));
// const AddSalesInvoice = React.lazy(() =>
//   import('Components/Sales/AddSalesInvoice'),
// );
const AddSalesInvoice = React.lazy(() =>
  import('Components/Sales/SalesInvoice/AddSalesInvoice'),
);
const EditSalesInvoice = React.lazy(() =>
  import('Components/Sales/SalesInvoice/EditSalesInvoice'),
);
const ViewSalesInvoice = React.lazy(() =>
  import('Components/Sales/SalesInvoice/ViewSalesInvoice'),
);
const ConsumptionDashboard = React.lazy(() =>
  import('Components/Inventory/Index'),
);
const Stock = React.lazy(() => import('Components/Inventory/Stock'));
const StockConsumption = React.lazy(() =>
  import('Components/Inventory/StockConsumption'),
);
const StockTransfer = React.lazy(() =>
  import('Components/Inventory/StockTransfer'),
);
const TrendingProductsBagConsumption = React.lazy(() =>
  import('Components/Products/Index'),
);
const Bags = React.lazy(() => import('Components/Products/Bags'));
const Addbag = React.lazy(() => import('Components/Products/Addbag'));
const EditBag = React.lazy(() => import('Components/Products/EditBag'));
const DuplicateBag = React.lazy(() =>
  import('Components/Products/DuplicateBag'),
);
const Product = React.lazy(() => import('Components/Products/Product'));
const NotFound = React.lazy(() => import('Components/Common/NotFound'));
const AccessDenied = React.lazy(() => import('Components/Common/AccessDenied'));
// const AddProduct = React.lazy(() => import('Components/Products/AddProduct'));
const AddProduct = React.lazy(() =>
  import('Components/Products/Product/AddProduct'),
);
const ViewProduct = React.lazy(() =>
  import('Components/Products/Product/ViewProduct'),
);
const EditProduct = React.lazy(() =>
  import('Components/Products/Product/EditProduct'),
);
const DuplicateProduct = React.lazy(() =>
  import('Components/Products/Product/DuplicateProduct'),
);
const ProductTransfer = React.lazy(() =>
  import('Components/Products/ProductTransfer'),
);
const MobileAppPriceList = React.lazy(() =>
  import('Components/Products/MobileAppPriceList'),
);
const GeneralConfiguration = React.lazy(() =>
  import('Components/Settings/GeneralConfiguration'),
);
const PurchaseOrder = React.lazy(() =>
  import('Components/Purchases/PurchaseOrder'),
);
// const AddPurchaseOrder = React.lazy(() =>
//   import('Components/Purchases/AddPurchaseOrder'),
// );

const AddPurchaseOrder = React.lazy(() =>
  import('Components/Purchases/PurchaseOrder/AddPurchaseOrder'),
);
const EditPurchaseOrder = React.lazy(() =>
  import('Components/Purchases/PurchaseOrder/EditPurchaseOrder'),
);
const ViewPurchaseOrder = React.lazy(() =>
  import('Components/Purchases/PurchaseOrder/ViewPurchaseOrder'),
);

// const ReceivePurchaseOrder = React.lazy(() =>
//   import('Components/Purchases/ReceivePurchaseOrder'),
// );
const AddReceivePurchaseOrder = React.lazy(() =>
  import('Components/Purchases/ReceivePurchaseOrder/AddReceivePurchaseOrder'),
);
const ViewReceivePurchaseOrder = React.lazy(() =>
  import('Components/Purchases/ReceivePurchaseOrder/ViewReceivePurchaseOrder'),
);

const InkPurchaseOrder = React.lazy(() =>
  import('Components/Purchases/InkPurchaseOrder'),
);
const PurchaseEntry = React.lazy(() =>
  import('Components/Purchases/PurchaseEntry'),
);
const ImportPurchaseEntryStepOne = React.lazy(() =>
  import('Components/Purchases/ImportPurchaseEntryStepOne'),
);
const ImportPurchaseEntryStepTwo = React.lazy(() =>
  import('Components/Purchases/ImportPurchaseEntryStepTwo'),
);
const ImportPurchaseEntryStepThree = React.lazy(() =>
  import('Components/Purchases/ImportPurchaseEntryStepThree'),
);
const PrePrintedRolls = React.lazy(() =>
  import('Components/Purchases/PrePrintedRolls'),
);
const PpPriceHistory = React.lazy(() =>
  import('Components/Purchases/PpPriceHistory'),
);
const NLRequirement = React.lazy(() =>
  import('Components/Purchases/NLRequirement'),
);
const MFGLiveAdmin = React.lazy(() =>
  import('Components/Production/MFGLive/MFGLiveAdmin'),
);
const MFGLiveOperator = React.lazy(() =>
  import('Components/Production/MFGLive/MFGLiveOperator/Index'),
);
const MachineJobQueue = React.lazy(() =>
  import('Components/Production/MachineJobQueue/Index'),
);
const JobMachines = React.lazy(() =>
  import('Components/Production/MachineJobQueue/Index'),
);
const ProfitAnalysis = React.lazy(() =>
  import('Components/Financials/ProfitAnalysis'),
);
const BrokerMargin = React.lazy(() =>
  import('Components/Financials/BrokerMargin'),
);
const AdminDashboard = React.lazy(() =>
  import('Components/BusinessDevelopment/AdminDashboard'),
);
const SalesDashboard = React.lazy(() =>
  import('Components/BusinessDevelopment/SalesDashboard'),
);
const OldCustomer = React.lazy(() =>
  import('Components/BusinessDevelopment/OldCustomer'),
);

export default function Index() {
  const popcorn = document.querySelector('#popcorn');
  const tooltip = document.querySelector('#tooltip');
  createPopper(popcorn, tooltip, {
    placement: 'top',
  });

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoutes>
                <ForgotPassword />
              </PublicRoutes>
            }
          />
          <Route
            path="/email-verification"
            element={
              <PublicRoutes>
                <EmailVerification />
              </PublicRoutes>
            }
          />
          <Route
            path="/set-new-password"
            element={
              <PublicRoutes>
                <SetPassword />
              </PublicRoutes>
            }
          />
          <Route element={<AuthLayout />}>
            <Route
              path="/parties"
              element={
                <ProtectedRoutes>
                  <HomePage
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/parties-details/:id"
              element={
                <ProtectedRoutes>
                  {/* <AddParties
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  /> */}
                  <ViewParty
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-parties/:id"
              element={
                <ProtectedRoutes>
                  {/* <AddParties
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  /> */}
                  <EditParty
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-parties"
              element={
                <ProtectedRoutes>
                  {/* <AddParties
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  /> */}
                  <AddParty
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/import-parties"
              element={
                <ProtectedRoutes>
                  <ImportPartiesStepOne
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              // path="/import-parties-map-columns"
              path="/import-parties-steptwo"
              element={
                <ProtectedRoutes>
                  <ImportPartiesStepTwo
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              // path="/import-parties-import-records"
              path="/import-parties-import-three"
              element={
                <ProtectedRoutes>
                  <ImportPartiesStepThree
                    role={{ mainModule: PARTIES, subModule: RoleParties }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/trending-products-and-bag-consumption"
              element={
                <ProtectedRoutes>
                  <TrendingProductsBagConsumption
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleTrendingProductsBagConsumption,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/bags"
              element={
                <ProtectedRoutes>
                  <Bags
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-bags"
              element={
                <ProtectedRoutes>
                  <Addbag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-bag/:bag_id"
              element={
                <ProtectedRoutes>
                  <EditBag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/duplicate-bag/:bag_id"
              element={
                <ProtectedRoutes>
                  <DuplicateBag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            {/* <Route
              path="/update-bag/:bag_id"
              element={
                <ProtectedRoutes>
                  <Addbag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/duplicate-bag/:bag_id"
              element={
                <ProtectedRoutes>
                  <Addbag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            /> */}
            <Route
              path="/bag-details/:bag_id"
              element={
                <ProtectedRoutes>
                  <Addbag
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleBags,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoutes>
                  <Product
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoutes>
                  <AddProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/product-details/:product_id"
              element={
                <ProtectedRoutes>
                  {/* <AddProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  /> */}
                  <ViewProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-product/:product_id"
              element={
                <ProtectedRoutes>
                  {/* <AddProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  /> */}
                  <EditProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/duplicate-product/:product_id"
              element={
                <ProtectedRoutes>
                  {/* <AddProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  /> */}
                  <DuplicateProduct
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProducts,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/product-transfer"
              element={
                <ProtectedRoutes>
                  <ProductTransfer
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleProductTransfer,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/mobile-app-price-list"
              element={
                <ProtectedRoutes>
                  <MobileAppPriceList
                    role={{
                      mainModule: PRODUCT,
                      subModule: RoleMobileAppPriceList,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoutes>
                  <Order
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-new-order"
              element={
                <ProtectedRoutes>
                  <AddOrder
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                  {/* <AddNewOrder
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  /> */}
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-order/:order_id"
              element={
                <ProtectedRoutes>
                  <EditOrder
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                  {/* <AddNewOrder
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  /> */}
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-job/:order_id"
              element={
                <ProtectedRoutes>
                  {/* <AddJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  /> */}
                  <AddJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-job/:job_id"
              element={
                <ProtectedRoutes>
                  <EditJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                  {/* <AddJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  /> */}
                </ProtectedRoutes>
              }
            />
            <Route
              path="/job-details/:job_id"
              element={
                <ProtectedRoutes>
                  <ViewJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                  {/* <AddJob
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  /> */}
                </ProtectedRoutes>
              }
            />
            <Route
              path="/order-details/:order_id"
              element={
                <ProtectedRoutes>
                  <OrderDetails
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrders,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/order-operator"
              element={
                <ProtectedRoutes>
                  <OrderOperator
                    role={{
                      mainModule: SALES,
                      subModule: RoleOrdersOperator,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/proforma-invoice"
              element={
                <ProtectedRoutes>
                  <ProformaInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleProformaInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-proforma-invoice"
              element={
                <ProtectedRoutes>
                  <AddProformaInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleProformaInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/proforma-details/:proformaId"
              element={
                <ProtectedRoutes>
                  <ViewProformaInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleProformaInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-proforma-invoice/:proformaId"
              element={
                <ProtectedRoutes>
                  <EditProformaInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleProformaInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sales-invoice"
              element={
                <ProtectedRoutes>
                  <SalesInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleTaxInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-sales-invoice"
              element={
                <ProtectedRoutes>
                  <AddSalesInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleTaxInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-sales-invoice/:id"
              element={
                <ProtectedRoutes>
                  <EditSalesInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleTaxInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sales-invoice-details/:id"
              element={
                <ProtectedRoutes>
                  <ViewSalesInvoice
                    role={{
                      mainModule: SALES,
                      subModule: RoleTaxInvoice,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/consumption-dashboard"
              element={
                <ProtectedRoutes>
                  <ConsumptionDashboard
                    role={{
                      mainModule: INVENTORY,
                      subModule: RoleConsumptionDashboard,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/stock-raw-material"
              element={
                <ProtectedRoutes>
                  <Stock
                    role={{
                      mainModule: INVENTORY,
                      subModule: RoleStockRawMaterial,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/stock-consumption"
              element={
                <ProtectedRoutes>
                  <StockConsumption
                    role={{
                      mainModule: INVENTORY,
                      subModule: RoleStockConsumptionRawMaterial,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/stock-transfer"
              element={
                <ProtectedRoutes>
                  <StockTransfer
                    role={{
                      mainModule: INVENTORY,
                      subModule: RoleStockTransferRawMaterial,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/company"
              element={
                <ProtectedRoutes>
                  <Company
                    role={{ mainModule: SETTINGS, subModule: RoleCompany }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoutes>
                  <User role={{ mainModule: SETTINGS, subModule: RoleUsers }} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-user"
              element={
                <ProtectedRoutes>
                  <AddUser
                    role={{ mainModule: SETTINGS, subModule: RoleUsers }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-user/:user_id"
              element={
                <ProtectedRoutes>
                  <EditUser
                    role={{ mainModule: SETTINGS, subModule: RoleUsers }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/user-details/:user_id"
              element={
                <ProtectedRoutes>
                  <ViewUser
                    role={{ mainModule: SETTINGS, subModule: RoleUsers }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/items"
              element={
                <ProtectedRoutes>
                  <Items
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleItemsRawMaterials,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/item-details/:item_id"
              element={
                <ProtectedRoutes>
                  <ViewItem
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleItemsRawMaterials,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-item/:item_id"
              element={
                <ProtectedRoutes>
                  <EditItem
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleItemsRawMaterials,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-items"
              element={
                <ProtectedRoutes>
                  <AddItem
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleItemsRawMaterials,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/misc-master"
              element={
                <ProtectedRoutes>
                  <MiscMaster
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleMiscMasters,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/role-and-permissions"
              element={
                <ProtectedRoutes>
                  <RolePermissions
                    role={{
                      mainModule: SETTINGS,
                      subModule: RolesPermissions,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/role-and-permissions-details/:role_id"
              element={
                <ProtectedRoutes>
                  <AddRolePermissions
                    role={{
                      mainModule: SETTINGS,
                      subModule: RolesPermissions,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-role-and-permissions/:role_id"
              element={
                <ProtectedRoutes>
                  <AddRolePermissions
                    role={{
                      mainModule: SETTINGS,
                      subModule: RolesPermissions,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-role-and-permissions"
              element={
                <ProtectedRoutes>
                  <AddRolePermissions
                    role={{
                      mainModule: SETTINGS,
                      subModule: RolesPermissions,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoutes>
                  <MyProfile
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleOther,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/general-configuration"
              element={
                <ProtectedRoutes>
                  <GeneralConfiguration
                    role={{
                      mainModule: SETTINGS,
                      subModule: RoleGeneralConfiguration,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase-order"
              element={
                <ProtectedRoutes>
                  <PurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase-order-operator"
              element={
                <ProtectedRoutes>
                  <PurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrderOperator,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-purchase-order"
              element={
                <ProtectedRoutes>
                  <AddPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-purchase-order/:purchase_id"
              element={
                <ProtectedRoutes>
                  {/* <AddPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  /> */}
                  <EditPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase-order-details/:purchase_id"
              element={
                <ProtectedRoutes>
                  {/* <AddPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  /> */}
                  <ViewPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/receive-purchase-order/:id"
              element={
                <ProtectedRoutes>
                  {/* <ReceivePurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  /> */}
                  <AddReceivePurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase-receive-details/:id"
              element={
                <ProtectedRoutes>
                  {/* <ReceivePurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  /> */}
                  <ViewReceivePurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/ink-purchase-order"
              element={
                <ProtectedRoutes>
                  <InkPurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase-receive"
              element={
                <ProtectedRoutes>
                  <PurchaseEntry
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseEntry,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              // path="/import-purchase-entry-stepone"
              path="/import-received-stepone"
              element={
                <ProtectedRoutes>
                  <ImportPurchaseEntryStepOne
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseEntry,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/import-purchase-entry-steptwo"
              element={
                <ProtectedRoutes>
                  <ImportPurchaseEntryStepTwo
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseEntry,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              // path="/import-purchase-entry-stepthree"
              path="/import-received-steptwo"
              element={
                <ProtectedRoutes>
                  <ImportPurchaseEntryStepThree
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseEntry,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/pre-printed-rolls"
              element={
                <ProtectedRoutes>
                  <PrePrintedRolls
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/pp-price-history"
              element={
                <ProtectedRoutes>
                  <PpPriceHistory
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePpPriceHistory,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/nl-requirement"
              element={
                <ProtectedRoutes>
                  <NLRequirement
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePpPriceHistory,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            {/* <Route
              path="/mfg-"
              element={
                <ProtectedRoutes>
                  <PurchaseOrder
                    role={{
                      mainModule: PURCHASES,
                      subModule: RolePurchaseOrder,
                    }}
                  />
                </ProtectedRoutes>
              }
            /> */}
            <Route
              path="/mfg-live-admin"
              element={
                <ProtectedRoutes>
                  <MFGLiveAdmin
                    role={{
                      mainModule: PRODUCTION,
                      subModule: RoleMFGLive,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/mfg-live-operator"
              element={
                <ProtectedRoutes>
                  <MFGLiveOperator
                    role={{
                      mainModule: PRODUCTION,
                      // subModule: RoleMFGLive,
                      subModule: RoleMFGOperator,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/machine-job-queue"
              element={
                <ProtectedRoutes>
                  {/* <MachineJobQueue
                    role={{
                      mainModule: PRODUCTION,
                      // subModule: RoleMFGLive,
                      subModule: RoleMachineJobQueue,
                    }}
                  /> */}
                  <JobMachines
                    role={{
                      mainModule: PRODUCTION,
                      // subModule: RoleMFGLive,
                      subModule: RoleMachineJobQueue,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/machine-job-queue-operator"
              element={
                <ProtectedRoutes>
                  <MachineJobQueue
                    role={{
                      mainModule: PRODUCTION,
                      subModule: RoleMachineJobQueueOperator,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profit-analysis"
              element={
                <ProtectedRoutes>
                  <ProfitAnalysis
                    role={{
                      mainModule: FINANCIALS,
                      subModule: RoleProfitAnalysis,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/broker-margin"
              element={
                <ProtectedRoutes>
                  <BrokerMargin
                    role={{
                      mainModule: FINANCIALS,
                      subModule: RoleProfitAnalysis,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoutes>
                  <AdminDashboard
                    role={{
                      mainModule: DASHBOARD,
                      subModule: RoleAdminDashboard,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sales-dashboard"
              element={
                <ProtectedRoutes>
                  <SalesDashboard
                    role={{
                      mainModule: DASHBOARD,
                      subModule: RoleSalesDashboard,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/old-customer"
              element={
                <ProtectedRoutes>
                  <OldCustomer
                    role={{
                      mainModule: DASHBOARD,
                      subModule: RoleOldCustFollowUps,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/raw-material"
              element={
                <ProtectedRoutes>
                  <RawMaterial
                    role={{
                      mainModule: REPORT,
                      subModule: RoleRawMaterial,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/finished-goods"
              element={
                <ProtectedRoutes>
                  <FinishedGoods
                    role={{
                      mainModule: REPORT,
                      subModule: RoleFinishedGoods,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/pending-jobs"
              element={
                <ProtectedRoutes>
                  <PendingJobs
                    role={{
                      mainModule: REPORT,
                      subModule: RolePendingJobs,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/finance"
              element={
                <ProtectedRoutes>
                  <Finance
                    role={{
                      mainModule: REPORT,
                      subModule: RoleFinance,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoutes>
                  <Sales
                    role={{
                      mainModule: REPORT,
                      subModule: RolesSales,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoutes>
                  <Purchase
                    role={{
                      mainModule: REPORT,
                      subModule: RolePurchase,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/monthly-turnover"
              element={
                <ProtectedRoutes>
                  <MonthlyTurnover
                    role={{
                      mainModule: REPORT,
                      subModule: RoleMonthlyTurnover,
                    }}
                  />
                </ProtectedRoutes>
              }
            />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
