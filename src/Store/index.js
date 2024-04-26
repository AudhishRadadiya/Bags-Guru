import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import auth from './Reducers/Auth/auth.slice';
import settings from './Reducers/Settings/SettingSlice';
import parties from './Reducers/Parties/parties.slice';
import user from '../Store/Reducers/Settings/User.slice';
import rawitem from '../Store/Reducers/Settings/RawItemSlice';
import miscMaster from '../Store/Reducers/Settings/MiscMasterSlice';
import generalConfiguration from '../Store/Reducers/Settings/GeneralConfigurationSlice';
import bagProdConsump from '../Store/Reducers/Products/BagAndProductConsumptionSlice';
import trendingProduct from '../Store/Reducers/Products/TrendingProductSlice';
import bag from '../Store/Reducers/Products/BagsSlice';
import product from '../Store/Reducers/Products/ProductSlice';
import salesOrder from '../Store/Reducers/Sales/SalesOrderSlice';
import stockRaw from '../Store/Reducers/Inventory/StockRawMaterialSlice';
import stockConsumption from '../Store/Reducers/Inventory/StockConsumptionSlice';
import stockTransfer from '../Store/Reducers/Inventory/StockTransferSlice';
import proformaInvoice from '../Store/Reducers/Sales/ProformaInvoiceSlice';
import salesInvoice from '../Store/Reducers/Sales/SalesInvoiceSlice';
import common from '../Store/Reducers/Common';
import ppPriceHistory from '../Store/Reducers/Purchase/PpPriceHistorySlice';
import mfgLive from '../Store/Reducers/Production/mfgLiveSlice';
import mfgliveOperator from '../Store/Reducers/Production/mfgLiveOperatorSlice';
import machineJobQueueSlice from '../Store/Reducers/Production/machineJobQueueSlice';
import purchaseOrder from '../Store/Reducers/Purchase/PurchaseOrderSlice';
import prePrintedStatus from '../Store/Reducers/Purchase/PrePrintedStatusSlice';
import PurchaseEntryProgress from '../Store/Reducers/Purchase/PurchaseEntryProgressSlice';
import finance from '../Store/Reducers/Finance/FinancialsSlice';
import customer from '../Store/Reducers/Customer/CustomerSlice';
// import salesDashBoard from '../Store/Reducers/Sales/SalesDashboardSlice';
import salesDashBoard from '../Store/Reducers/Sales/SalesdashboardSlice';
import adminDashBoard from '../Store/Reducers/Business/AdminDashboardSlice';
import salesTurnover from './Reducers/Report/SalesTurnoverSlice';

const reducers = combineReducers({
  auth,
  settings,
  parties,
  user,
  rawitem,
  miscMaster,
  bagProdConsump,
  trendingProduct,
  bag,
  product,
  salesOrder,
  stockRaw,
  stockConsumption,
  stockTransfer,
  generalConfiguration,
  proformaInvoice,
  salesInvoice,
  common,
  ppPriceHistory,
  mfgLive,
  mfgliveOperator,
  machineJobQueueSlice,
  purchaseOrder,
  prePrintedStatus,
  finance,
  customer,
  PurchaseEntryProgress,
  salesDashBoard,
  adminDashBoard,
  salesTurnover,
});

// const store = configureStore({
//   reducer: reducers,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// This function using when store the data in reducer:
function dateSerializer(reducerState) {
  return {
    ...reducerState,
    orderData: {
      ...reducerState.orderData,
      order_date: new Date(reducerState?.orderData?.order_date),
    },
  };
}

// // This function using when get the data from reducer:
function dateDeserializer(serializedState) {
  return {
    ...serializedState,
    orderData: {
      ...serializedState.orderData,
      order_date: new Date(serializedState.orderData.order_date),
    },
  };
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['PurchaseEntryProgress', 'salesOrder'],
  stateReconciler: autoMergeLevel2, // Define state reconciler
  serialize: dateSerializer, // Apply custom serialization function
  deserialize: dateDeserializer, // Apply custom deserialization function
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export default store;
