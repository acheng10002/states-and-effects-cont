import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  AppOne,
  MyComponent,
  AppTwo,
  CountInputChangesOne,
  CountInputChangesTwo,
  CountSecrets,
} from "./App.jsx";
import "./index.css";

/* Hot Module Replacement (HMR) - feature in development tools tht allows for modules
                                  to be replaced in a running application without 
                                  requiring a full page reload */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppOne />
    <MyComponent />
    <AppTwo />
    <CountInputChangesOne />
    <CountInputChangesTwo />
    <CountSecrets />
  </StrictMode>
);
