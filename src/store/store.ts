import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "../Pages/company/slice";
import sidebarReducer from "../Pages/sidebarSlice";
import groupReducer from "../Pages/group/slice";
import ledgerReducer from "../Pages/Ledger/slice";
import voucherTypeReducer from "../Pages/vouchers/slice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    sidebar: sidebarReducer,
    groups: groupReducer,
    ledgers: ledgerReducer,
    voucherTypes: voucherTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//App wide hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;