import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { VoucherTypeFromBackend, VoucherTypeFormData } from "./voucherTypes";
import * as voucherTypeApi from "./api";

interface VoucherTypeState {
  voucherTypes: VoucherTypeFromBackend[];
  selectedVoucherType: VoucherTypeFromBackend | null;
  isEditing: boolean;
  loading: boolean;
  voucherTypesFetched: boolean;
  error: string | null;
}

const initialState: VoucherTypeState = {
  voucherTypes: [
    {
      cmpId: "jkjk",
      name: "Contra Voucher",
      typeOfVoucher: "",
      useEffectiveDateForVoucher: "Yes",
      makeVoucherTypeOptionalByDefault: "Yes",
      allowNarrationInVoucher: "Yes",
      provideNarrationForEachLedgerInVoucher: "Yes",
      printVoucherAfterSaving: "Yes",
      _id: "",
      createdAt: "",
      updatedAt: "",
    },
    {
      cmpId: "jkjk",
      name: "Payment Voucher",
      typeOfVoucher: "",
      useEffectiveDateForVoucher: "Yes",
      makeVoucherTypeOptionalByDefault: "Yes",
      allowNarrationInVoucher: "Yes",
      provideNarrationForEachLedgerInVoucher: "Yes",
      printVoucherAfterSaving: "Yes",
      _id: "",
      createdAt: "",
      updatedAt: "",
    },
    {
      cmpId: "jkjk",
      name: "Receipt Voucher",
      typeOfVoucher: "",
      useEffectiveDateForVoucher: "Yes",
      makeVoucherTypeOptionalByDefault: "Yes",
      allowNarrationInVoucher: "Yes",
      provideNarrationForEachLedgerInVoucher: "Yes",
      printVoucherAfterSaving: "Yes",
      _id: "",
      createdAt: "",
      updatedAt: "",
    },
  ],
  selectedVoucherType: null,
  isEditing: false,
  loading: false,
  voucherTypesFetched: false,
  error: null,
};

// ============ ASYNC THUNKS ============

// Fetch voucher types by company ID
export const fetchByCompanyId = createAsyncThunk<
  VoucherTypeFromBackend[],
  string,
  { rejectValue: string }
>(
  "voucherTypes/fetchByCompanyId",
  async (companyId, { rejectWithValue }) => {
    try {
      const data = await voucherTypeApi.fetchByCompanyId(companyId);
      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch voucher types";
      return rejectWithValue(message);
    }
  }
);

// Fetch all voucher types
export const fetchAll = createAsyncThunk<
  VoucherTypeFromBackend[],
  void,
  { rejectValue: string }
>("voucherTypes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const data = await voucherTypeApi.fetchAll();
    return data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch voucher types";
    return rejectWithValue(message);
  }
});

// Create voucher type
export const createVoucherType = createAsyncThunk<
  VoucherTypeFromBackend,
  VoucherTypeFormData,
  { rejectValue: string }
>("voucherTypes/create", async (voucherTypeData, { rejectWithValue }) => {
  try {
    const data = await voucherTypeApi.create(voucherTypeData);
    return data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create voucher type";
    return rejectWithValue(message);
  }
});

// Update voucher type
export const updateVoucherType = createAsyncThunk<
  VoucherTypeFromBackend,
  { id: string; voucherTypeData: Partial<VoucherTypeFormData> },
  { rejectValue: string }
>(
  "voucherTypes/update",
  async ({ id, voucherTypeData }, { rejectWithValue }) => {
    try {
      const data = await voucherTypeApi.update(id, voucherTypeData);
      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update voucher type";
      return rejectWithValue(message);
    }
  }
);

// Delete voucher type
export const deleteVoucherType = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("voucherTypes/delete", async (id, { rejectWithValue }) => {
  try {
    await voucherTypeApi.deleteVoucherType(id);
    return id;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete voucher type";
    return rejectWithValue(message);
  }
});

// ============ SLICE ============

const voucherTypeSlice = createSlice({
  name: "voucherTypes",
  initialState,
  reducers: {
    setSelectedVoucherType: (
      state,
      action: PayloadAction<VoucherTypeFromBackend | null>
    ) => {
      state.selectedVoucherType = action.payload;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch by company ID
    builder
      .addCase(fetchByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByCompanyId.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherTypes = action.payload;
        state.voucherTypesFetched = true;
      })
      .addCase(fetchByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch voucher types";
      });

    // Fetch all
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherTypes = action.payload;
        state.voucherTypesFetched = true;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch voucher types";
      });

    // Create
    builder
      .addCase(createVoucherType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucherType.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherTypes.push(action.payload);
        state.isEditing = false;
      })
      .addCase(createVoucherType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create voucher type";
      });

    // Update
    builder
      .addCase(updateVoucherType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucherType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.voucherTypes.findIndex(
          (vt) => vt._id === action.payload._id
        );
        if (index !== -1) {
          state.voucherTypes[index] = action.payload;
        }
        state.selectedVoucherType = action.payload;
        state.isEditing = false;
      })
      .addCase(updateVoucherType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update voucher type";
      });

    // Delete
    builder
      .addCase(deleteVoucherType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucherType.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherTypes = state.voucherTypes.filter(
          (vt) => vt._id !== action.payload
        );
        state.selectedVoucherType = null;
      })
      .addCase(deleteVoucherType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete voucher type";
      });
  },
});

export const { setSelectedVoucherType, setEditing, clearError } =
  voucherTypeSlice.actions;

export default voucherTypeSlice.reducer;
