import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { LedgerFromBackend, FormDataType } from "./Types";
import * as ledgerApi from "./api";

interface LedgerState {
  ledgers: LedgerFromBackend[];
  loading: boolean;
  ledgerFetched: boolean;
  selectedLedger: LedgerFromBackend | null;
  isEditing: boolean;
  error: string | null;
}

const initialState: LedgerState = {
  ledgers: [
    {
      _id: "989",
      ledgerName: "Accounts",
      ledgerAlias: "",
      toB: "",
      under: "nothing",
      acholderName: "",
      acNumber: "",
      ifsCode: "",
      bankName: "Not Applicable",
      bankBranch: "",
      checkBooks: "No",
      checkPrintConfig: "No",
      inventoryValue: "No",
      ledgerType: "Not Applicable",
      mailName: "",
      mailAddress: "",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "",
      mailBankDetails: "No",
      panItNO: "",
      createdAt: '787', 
      updatedAt: "898"
    },
    {
      _id: "989",
      ledgerName: "Accounts banks",
      ledgerAlias: "",
      toB: "",
      under: "nothing",
      acholderName: "",
      acNumber: "",
      ifsCode: "",
      bankName: "Not Applicable",
      bankBranch: "",
      checkBooks: "No",
      checkPrintConfig: "No",
      inventoryValue: "No",
      ledgerType: "Not Applicable",
      mailName: "",
      mailAddress: "",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "",
      mailBankDetails: "No",
      panItNO: "",
      createdAt: '787', 
      updatedAt: "898"
    },
    {
      _id: "989",
      ledgerName: "Not Accounts",
      ledgerAlias: "",
      toB: "",
      under: "nothing",
      acholderName: "",
      acNumber: "",
      ifsCode: "",
      bankName: "Not Applicable",
      bankBranch: "",
      checkBooks: "No",
      checkPrintConfig: "No",
      inventoryValue: "No",
      ledgerType: "Not Applicable",
      mailName: "",
      mailAddress: "",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "",
      mailBankDetails: "No",
      panItNO: "",
      createdAt: '787', 
      updatedAt: "898"
    },
    {
      _id: "989",
      ledgerName: "Old Accounts",
      ledgerAlias: "",
      toB: "",
      under: "nothing",
      acholderName: "",
      acNumber: "",
      ifsCode: "",
      bankName: "Not Applicable",
      bankBranch: "",
      checkBooks: "No",
      checkPrintConfig: "No",
      inventoryValue: "No",
      ledgerType: "Not Applicable",
      mailName: "",
      mailAddress: "",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "",
      mailBankDetails: "No",
      panItNO: "",
      createdAt: '787', 
      updatedAt: "898"
    }
  ],
  loading: false,
  ledgerFetched: false,
  selectedLedger: null,
  isEditing: false,
  error: null,
};

// export const fetchAll = createAsyncThunk<
//   LedgerFromBackend[],
//   void,
//   { rejectValue: string }
// >("ledgers/fetchAll", async (_, { rejectWithValue }) => {
//   try {
//     const data = await ledgerApi.fetchAll();
//     return data;
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Failed to fetch ledgers";
//     return rejectWithValue(message);
//   }
// });

export const createLedger = createAsyncThunk<
  LedgerFromBackend,
  FormDataType,
  { rejectValue: string }
>("ledgers/create", async (ledgerData, { rejectWithValue }) => {
  try {
    const data = await ledgerApi.create(ledgerData);
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create ledger";
    return rejectWithValue(message);
  }
});

export const fetchByCompanyId = createAsyncThunk<
  LedgerFromBackend[],
  string,
  { rejectValue: string }
>("ledgers/fetchByCompanyId", async (companyId, { rejectWithValue }) => {
  try {
    const data = await ledgerApi.fetchByCompanyId(companyId);
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch ledgers";
    return rejectWithValue(message);
  }
});

export const updateLedger = createAsyncThunk<
  LedgerFromBackend,
  { id: string; ledgerData: Partial<LedgerFromBackend> },
  { rejectValue: string }
>("ledgers/update", async ({ id, ledgerData }, { rejectWithValue }) => {
  try {
    const data = await ledgerApi.update(id, ledgerData);
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update ledger";
    return rejectWithValue(message);
  }
});

const LedgerSlice = createSlice({
  name: "ledgers",
  initialState,
  reducers: {
    setSelectedLedger: (
      state,
      action: PayloadAction<LedgerFromBackend | null>,
    ) => {
      const ledger = action.payload;
      state.selectedLedger =
        ledger === null
          ? null
          : (state.ledgers.find((c) => c._id === ledger._id) ?? null);
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(fetchAll.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase( fetchAll.fulfilled, (state, action: PayloadAction<LedgerFromBackend[]>) => {
    //       state.loading = false;
    //       state.ledgers = action.payload;
    //       state.ledgerFetched = true;
    //       state.error = null;
    //     }
    //   )
    //   .addCase(fetchAll.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload || "Failed to fetch ledgers";
    //   });

    builder
      .addCase(fetchByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchByCompanyId.fulfilled,
        (state, action: PayloadAction<LedgerFromBackend[]>) => {
          state.loading = false;
          state.ledgers = action.payload;
          state.ledgerFetched = true;
          state.error = null;
        },
      )
      .addCase(fetchByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch ledgers";
      });

    builder
      .addCase(updateLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateLedger.fulfilled,
        (state, action: PayloadAction<LedgerFromBackend>) => {
          state.loading = false;
          const index = state.ledgers.findIndex(
            (ledger) => ledger._id === action.payload._id,
          );
          if (index !== -1) {
            state.ledgers[index] = action.payload;
          }
          state.error = null;
        },
      )
      .addCase(updateLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update ledger";
      });
  },
});

export const { setSelectedLedger, setEditing } = LedgerSlice.actions;

export default LedgerSlice.reducer;
