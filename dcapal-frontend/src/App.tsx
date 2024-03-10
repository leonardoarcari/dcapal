// import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@app/store"
import { Router } from "@routes/router"
import "./style.css";
export const App = () => {
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor} loading={null}> */}
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      {/* </PersistGate> */}
    </Provider>
  )
}