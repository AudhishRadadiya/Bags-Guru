import BusinessDev from '../../../../Assets/Images/business-dev.svg';
import SalesTrends from '../../../../Assets/Images/sales-trend.svg';
import Parties from '../../../../Assets/Images/parties.svg';
import Inventory from '../../../../Assets/Images/inventory.svg';
import Products from '../../../../Assets/Images/products.svg';
import Purchases from '../../../../Assets/Images/purchase.svg';
import Sales from '../../../../Assets/Images/sales.svg';
import Production from '../../../../Assets/Images/production.svg';
import Financials from '../../../../Assets/Images/financial.svg';
import Reports from '../../../../Assets/Images/reports.svg';
import Settings from '../../../../Assets/Images/settings.svg';
import PandingJob from '../../../../Assets/Images/panding-job.svg';
import AdminDashboard from '../../../../Assets/Images/admin-dashboard.svg';
import Consumption from '../../../../Assets/Images/consumption.svg';
import StockConsumption from '../../../../Assets/Images/stock-consumption.svg';
import StockTransfer from '../../../../Assets/Images/stock-transfer.svg';
import MobileApp from '../../../../Assets/Images/mobile-app-price-list.svg';
import TrendingProducts from '../../../../Assets/Images/trending-products.svg';
import PurchaseOrder from '../../../../Assets/Images/purchase-order.svg';
import PurchaseEntry from '../../../../Assets/Images/purchase-entry.svg';
import PrePrintedStatus from '../../../../Assets/Images/pre-printed-status.svg';
import PriceHistory from '../../../../Assets/Images/price-history.svg';
import NLRequirement from '../../../../Assets/Images/nl-requirement.svg';
import Bags from '../../../../Assets/Images/bags.svg';
import Product from '../../../../Assets/Images/product.svg';
import ProformaInvoice from '../../../../Assets/Images/proforma-invoice.svg';
import MfgLive from '../../../../Assets/Images/mfg-live.svg';
import MachineJob from '../../../../Assets/Images/machine-job.svg';
import Calculator from '../../../../Assets/Images/calculator.svg';
import Company from '../../../../Assets/Images/company.svg';
import UserLogins from '../../../../Assets/Images/user-login.svg';
import GeneralConfiguration from '../../../../Assets/Images/general-configuration.svg';
import ItemsIcon from '../../../../Assets/Images/items.svg';
import MiscMasters from '../../../../Assets/Images/misc-masters.svg';

export const getHeaderAndSideMenuItems = pathname => {
  return [
    {
      className: `${
        pathname === '/admin-dashboard' ||
        pathname === '/sales-dashboard' ||
        pathname === '/old-customer' ||
        pathname === '/sales-trends' ||
        pathname === '/customer-dashboard'
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
        {
          className: `${pathname === '/sales-trends' ? 'active' : ''}`,
          itemName: 'Sales Trends',
          resName: 'Sales Trends',
          icon: SalesTrends,
          navigateTo: '/sales-trends',
        },
        {
          className: `${pathname === '/customer-dashboard' ? 'active' : ''}`,
          itemName: 'Customer Dashboard',
          resName: 'Customer Dashboard',
          icon: SalesTrends,
          navigateTo: '/customer-dashboard',
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
          className: `${pathname === '/consumption-dashboard' ? 'active' : ''}`,
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
          className: `${pathname === '/mobile-app-price-list' ? 'active' : ''}`,
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
        pathname?.includes('update-job') ||
        pathname === '/thumbnail'
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
        {
          className: `${pathname === '/thumbnail' ? 'active' : ''}`,
          itemName: 'Thumbnail',
          resName: 'Thumbnail',
          icon: Parties,
          navigateTo: '/thumbnail',
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
        pathname === '/purchase' ||
        pathname === '/designer'
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
        {
          className: `${pathname === '/designer' ? 'active' : ''}`,
          itemName: 'Designer',
          resName: 'Designer',
          icon: PandingJob,
          navigateTo: '/designer',
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
          className: `${pathname === '/general-configuration' ? 'active' : ''}`,
          itemName: 'General Configuration',
          resName: 'General Configuration',
          icon: GeneralConfiguration,
          navigateTo: '/general-configuration',
        },
      ],
    },
    {
      className: `${pathname === '/collection' ? 'active' : ''}`,
      itemName: 'Collection',
      icon: Parties,
      navigateTo: '/collection',
      subItems: [],
    },
  ];
};

export const getOperatorHeaderMenuItems = pathname => {
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
};
