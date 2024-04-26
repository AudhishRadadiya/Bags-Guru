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
import AdminDashboard from '../../Assets/Images/admin-dashboard.svg';
import Consumption from '../../Assets/Images/consumption.svg';
import StockConsumption from '../../Assets/Images/stock-consumption.svg';
import StockTransfer from '../../Assets/Images/stock-transfer.svg';
import TrendingProducts from '../../Assets/Images/trending-products.svg';
import PurchaseOrder from '../../Assets/Images/purchase-order.svg';
import PurchaseEntry from '../../Assets/Images/purchase-entry.svg';
import Bags from '../../Assets/Images/bags.svg';
import Product from '../../Assets/Images/product.svg';
import ProformaInvoice from '../../Assets/Images/proforma-invoice.svg';
import MfgLive from '../../Assets/Images/mfg-live.svg';
import MachineJob from '../../Assets/Images/machine-job.svg';
import Chat from '../../Assets/Images/chat.svg';
import Calculator from '../../Assets/Images/calculator.svg';
import Company from '../../Assets/Images/company.svg';
import UserLogins from '../../Assets/Images/user-login.svg';
import ItemsIcon from '../../Assets/Images/items.svg';
import MiscMasters from '../../Assets/Images/misc-masters.svg';
import {
  DASHBOARD,
  FINANCIALS,
  INVENTORY,
  PARTIES,
  PRODUCT,
  PRODUCTION,
  PURCHASES,
  REPORT,
  RoleAdminDashboard,
  RoleBags,
  RoleBrokerMargin,
  RoleCollectionSMS,
  RoleCompany,
  RoleConsumptionDashboard,
  RoleGeneralConfiguration,
  RoleItemsRawMaterials,
  RoleMFGLive,
  RoleMachineJobQueue,
  RoleMiscMasters,
  RoleMobileAppPriceList,
  RoleOldCustFollowUps,
  RoleOrders,
  RolePrePrinted,
  RoleProductTransfer,
  RoleProducts,
  RoleProfitAnalysis,
  RoleProformaInvoice,
  RolePurchaseDashboard,
  RolePurchaseEntry,
  RolePurchaseOrder,
  RoleSalesDashboard,
  RoleStockConsumptionRawMaterial,
  RoleStockRawMaterial,
  RoleStockTransferRawMaterial,
  RoleTaxInvoice,
  RoleTrendingProductsBagConsumption,
  RoleUsers,
  RolesPermissions,
  SALES,
  SETTINGS,
} from 'Global/Constants';

export let HeaderRoutes = [
  {
    image: BusinessDev,
    name: DASHBOARD,
    routes: [''],
    childs: [
      {
        image: AdminDashboard,
        name: RoleAdminDashboard,
        path: '',
      },
      {
        image: BusinessDev,
        name: RoleSalesDashboard,
        path: '',
      },
      {
        image: BusinessDev,
        name: RoleOldCustFollowUps,
        path: '',
      },
    ],
  },
  {
    image: Parties,
    name: PARTIES,
    path: '/parties',
    routes: [
      '/parties',
      '/add-parties',
      '/import-parties',
      '/parties-details',
      '/update-parties',
      '/import-parties-map-columns',
      '/import-parties-import-records',
    ],
  },
  {
    image: Inventory,
    name: INVENTORY,
    path: null,
    routes: [
      '/consumption-dashboard',
      '/stock-raw-material',
      '/stock-consumption',
      '/stock-transfer',
    ],
    childs: [
      {
        image: Consumption,
        name: RoleConsumptionDashboard,
        path: '/consumption-dashboard',
      },
      {
        image: Production,
        name: RoleStockRawMaterial,
        path: '/stock-consumption',
      },
      {
        image: StockConsumption,
        name: RoleStockConsumptionRawMaterial,
        path: '/stock-consumption',
      },
      {
        image: StockTransfer,
        name: RoleStockTransferRawMaterial,
        path: '/stock-consumption',
      },
    ],
  },
  {
    image: Products,
    name: PRODUCT,
    path: null,
    routes: [
      '/trending-products-and-bag-consumption',
      '/bags',
      '/add-bags',
      '/update-bag',
      '/duplicate-bag',
      '/bag-details',
      '/product-details',
      '/product',
      '/add-product',
      '/product-details',
      '/update-product',
      '/duplicate-product',
      '/product-transfer',
      '/mobile-app-price-list',
    ],
    childs: [
      {
        image: TrendingProducts,
        name: RoleTrendingProductsBagConsumption,
        path: '/trending-products-and-bag-consumption',
      },
      {
        image: Bags,
        name: RoleBags,
        path: '/bags',
      },
      {
        image: Product,
        name: RoleProducts,
        path: '/product',
      },
      {
        image: StockTransfer,
        name: RoleProductTransfer,
        path: '/product-transfer',
      },
      {
        image: StockTransfer,
        name: RoleMobileAppPriceList,
        path: '/mobile-app-price-list',
      },
    ],
  },
  {
    image: Purchases,
    name: PURCHASES,
    path: null,
    routes: [
      '/purchase-order',
      '/purchase-dashboard',
      '/purchase-entry',
      '/purchase-order',
      '/pre-printed-rolls',
      '/add-purchase-order',
      '/ink-purchase-order',
      '/import-purchase-entry-stepone',
      '/import-purchase-entry-steptwo',
      '/import-purchase-entry-stepthree',
    ],
    childs: [
      {
        image: BusinessDev,
        name: RolePurchaseDashboard,
        path: '/purchase-dashboard',
      },
      {
        image: PurchaseOrder,
        name: RolePurchaseOrder,
        path: '/purchase-order',
      },
      {
        image: PurchaseEntry,
        name: RolePurchaseEntry,
        path: '/purchase-entry',
      },
      {
        image: PurchaseEntry,
        name: RolePrePrinted,
        path: '/pre-printed-rolls',
      },
    ],
  },
  {
    image: Sales,
    name: SALES,
    path: null,
    routes: [
      '/order',
      '/add-new-order',
      '/update-order',
      '/perfoma-invoice',
      '/update-job',
      '/add-perfoma-invoice',
      '/sales-invoice',
      '/job-details',
      '/add-sales-invoice',
      '/order-details',
      '/add-job',
      '/perfoma-invoice',
      '/add-perfoma-invoice',
      '/sales-invoice',
      '/add-sales-invoice',
    ],
    childs: [
      {
        image: PurchaseOrder,
        name: RoleOrders,
        path: '/order',
      },
      {
        image: ProformaInvoice,
        name: RoleProformaInvoice,
        path: '/perfoma-invoice',
      },
      {
        image: PurchaseEntry,
        name: RoleTaxInvoice,
        path: '/tax-invoice',
      },
    ],
  },
  {
    image: Sales,
    name: PRODUCTION,
    path: null,
    childs: [
      {
        image: MfgLive,
        name: RoleMFGLive,
        path: null,
      },
      {
        image: MachineJob,
        name: RoleMachineJobQueue,
        path: null,
      },
    ],
  },
  {
    image: Financials,
    name: FINANCIALS,
    path: null,
    childs: [
      {
        image: TrendingProducts,
        name: RoleProfitAnalysis,
        path: null,
      },
      {
        image: Chat,
        name: RoleCollectionSMS,
        path: null,
      },
      {
        image: Calculator,
        name: RoleBrokerMargin,
        path: null,
      },
    ],
  },
  {
    image: Reports,
    name: REPORT,
    path: '/reports',
  },
  {
    image: Settings,
    name: SETTINGS,
    path: null,
    routes: [
      '/company',
      '/users',
      '/add-user',
      '/update-user',
      '/update-item',
      '/items',
      '/role-and-permissions',
      '/update-role-and-permissions',
      '/misc-master',
      '/add-items',
      '/add-role-and-permissions',
      '/add-user',
      '/general-configuration',
      '/my-profile',
    ],
    childs: [
      {
        image: Company,
        name: RoleCompany,
        path: '/company',
      },
      {
        image: UserLogins,
        name: RoleUsers,
        path: '/users',
      },
      {
        image: ItemsIcon,
        name: RoleItemsRawMaterials,
        path: '/items',
      },
      {
        image: MiscMasters,
        name: RoleMiscMasters,
        path: '/misc-master',
      },
      {
        image: UserLogins,
        name: RolesPermissions,
        path: '/role-and-permissions',
      },
      {
        image: UserLogins,
        name: RoleGeneralConfiguration,
        path: '/general-configuration',
      },
    ],
  },
];
