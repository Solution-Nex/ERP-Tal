import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// You should ideally move this to your ./types file
export interface Ledger {
  ledgerName: string;
  ledgerAlias?: string;
  toB?: string; // Total Opening Balance
  under: string; // Group

  // Bank Details (Optional)
  acholderName?: string;
  acNumber?: string;
  ifsCode?: string;
  bankName?: string;
  bankBranch?: string;
  checkBooks?: string;
  checkPrintConfig?: string;

  // Configs
  inventoryValue?: string;
  ledgerType?: string;

  // Mailing Details
  mailName: string;
  mailAddress: string;
  mailCountry: string;
  mailState: string;
  mailPinCode: string;
  mailBankDetails?: string;

  // Tax
  panItNO: string;
}

// Ledger + _id (from backend)
export type LedgerFromBackend = Ledger & { _id: string };

// --- MOCK API IMPORTS (Replace these with your actual API calls) ---
// import { fetchAllLedgers, createLedger, updateLedger, deleteLedger } from "./ledgerApi";
// For now, we simulate API calls to avoid build errors if you paste this:
const api = {
  fetchAll: async () => [] as LedgerFromBackend[],
  create: async (data: Ledger) => ({ ...data, _id: Math.random().toString() }),
  update: async (id: string, data: Partial<Ledger>) =>
    ({ _id: id, ...data } as LedgerFromBackend),
  delete: async (id: string) => id,
};
// ------------------------------------------------------------------

function extractErrorMessage(err: unknown, fallback = "An error occurred") {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

interface LedgerState {
  ledgers: LedgerFromBackend[];
  selectedLedger: LedgerFromBackend | null;
  ledgersFetched: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LedgerState = {
  ledgers: [
    {
      _id: "1",
      ledgerName: "Cash",
      ledgerAlias: "",
      under: "Cash-in-Hand",
      toB: "5000",
      mailName: "Cash Account",
      mailAddress: "N/A",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "00000",
      panItNO: "N/A",
    },
    {
      _id: "2",
      ledgerName: "HBL Bank",
      ledgerAlias: "HBL",
      under: "Bank Accounts",
      toB: "100000",
      acholderName: "John Doe",
      acNumber: "123456789",
      ifsCode: "HBL001",
      bankName: "HBL",
      bankBranch: "Sialkot Cantt",
      mailName: "John Doe",
      mailAddress: "Sialkot",
      mailCountry: "Pakistan",
      mailState: "Punjab",
      mailPinCode: "51310",
      panItNO: "ABCDE1234F",
    },
  ],
  selectedLedger: null,
  ledgersFetched: false,
  loading: false,
  error: null,
};

// FETCH ALL
export const fetchLedgers = createAsyncThunk<
  LedgerFromBackend[],
  void,
  { rejectValue: string }
>("ledger/fetchLedgers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchAll(); // Replace with real API
    return response;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch ledgers"));
  }
});

// CREATE
export const createLedger = createAsyncThunk<
  LedgerFromBackend,
  Ledger,
  { rejectValue: string }
>("ledger/createLedger", async (ledgerData, { rejectWithValue }) => {
  try {
    const created = await api.create(ledgerData); // Replace with real API
    return created;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to create ledger"));
  }
});

// UPDATE
export const updateLedger = createAsyncThunk<
  LedgerFromBackend,
  { id: string; data: Partial<Ledger> },
  { rejectValue: string }
>("ledger/updateLedger", async ({ id, data }, { rejectWithValue }) => {
  try {
    // Cast data as Partial<LedgerFromBackend> for the API call
    const updated = await api.update(id, data); // Replace with real API
    return updated;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to update ledger"));
  }
});

// DELETE
export const deleteLedger = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("ledger/deleteLedger", async (id, { rejectWithValue }) => {
  try {
    await api.delete(id); // Replace with real API
    return id;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to delete ledger"));
  }
});

const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    resetLedgerState: (state) => {
      state.ledgers = [];
      state.selectedLedger = null;
      state.ledgersFetched = false;
      state.loading = false;
      state.error = null;
    },
    setSelectedLedger: (
      state,
      action: PayloadAction<LedgerFromBackend | null>
    ) => {
      const ledger = action.payload;
      state.selectedLedger =
        ledger === null
          ? null
          : state.ledgers.find((l) => l._id === ledger._id) ?? null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchLedgers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLedgers.fulfilled,
        (state, action: PayloadAction<LedgerFromBackend[]>) => {
          state.loading = false;
          // Note: If API returns empty, we might want to keep initial dummy data or overwrite it.
          // For now, we overwrite.
          if (action.payload.length > 0) {
            state.ledgers = action.payload;
          }
          state.ledgersFetched = true;
          state.error = null;
        }
      )
      .addCase(fetchLedgers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // CREATE
    builder
      .addCase(createLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createLedger.fulfilled,
        (state, action: PayloadAction<LedgerFromBackend>) => {
          state.loading = false;
          state.ledgers.unshift(action.payload);
        }
      )
      .addCase(createLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // UPDATE
    builder
      .addCase(updateLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateLedger.fulfilled,
        (state, action: PayloadAction<LedgerFromBackend>) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.ledgers.findIndex((l) => l._id === updated._id);
          if (index !== -1) {
            state.ledgers[index] = updated;
          }
          if (state.selectedLedger?._id === updated._id) {
            state.selectedLedger = updated;
          }
        }
      )
      .addCase(updateLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // DELETE
    builder
      .addCase(deleteLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteLedger.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const id = action.payload;
          state.ledgers = state.ledgers.filter((l) => l._id !== id);
          if (state.selectedLedger?._id === id) {
            state.selectedLedger = null;
          }
        }
      )
      .addCase(deleteLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });
  },
});

export const { resetLedgerState, setSelectedLedger } = ledgerSlice.actions;

// Selectors
// export const selectLedgers = (state: RootState) => state.ledger.ledgers;
// export const selectLedgerById = (state: RootState, id: string) =>
//   state.ledger.ledgers.find((l) => l._id === id) ?? null;
// export const selectSelectedLedger = (state: RootState) => state.ledger.selectedLedger;
// export const selectLedgerLoading = (state: RootState) => state.ledger.loading;

export default ledgerSlice.reducer;
