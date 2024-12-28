import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import {store, persistor} from './store/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

createRoot(document.getElementById("root")!).render(
 <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
 </StrictMode>,
);
