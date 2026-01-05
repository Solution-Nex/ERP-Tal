import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "../Pages/company/slice";
import ledgerReducer from "../Pages/Ledger/LedgerSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    ledger: ledgerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
