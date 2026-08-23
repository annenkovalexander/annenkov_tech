import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Pages/App/App";
import './index.css';
import { Provider } from 'react-redux';
import { store } from './services/store';

const rootNode = document.querySelector("#root") as HTMLElement;
const reactNode = createRoot(rootNode);

reactNode.render(
      <Provider store={store}>
        <App />
      </Provider>
);
