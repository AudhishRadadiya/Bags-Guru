import { App } from 'app';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { persistor, store } from './Store/index';
import 'sanitize.css/sanitize.css';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer theme="light" />
        <App />
      </PersistGate>
    </Provider>
  </HelmetProvider>,
);
