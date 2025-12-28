import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Company } from "./types";
import { fetchAll, update, deleteComp, create } from "./api";

//Company + _id (from backend)
export type CompanyFromBackend = Company & { _id: string };


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

interface CompanyState {
  companies: CompanyFromBackend[];
  selectedCompany: CompanyFromBackend | null;
  companiesFetched: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  companiesFetched: false,
  loading: false,
  error: null,
};
// FETCH ALL
export const fetchCompanies = createAsyncThunk<
  CompanyFromBackend[],
  void,
  { rejectValue: string }
>("company/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAll();
    return response;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch companies"));
  }
});

export const createCompany = createAsyncThunk<
  CompanyFromBackend,
  Company,
  { rejectValue: string }
>("company/createCompany", async (companyData, { rejectWithValue }) => {
  try {
    const created = await create(companyData);
    return created;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to create company"));
  }
});

// UPDATE
export const updateCompany = createAsyncThunk<
  CompanyFromBackend,
  { id: string; data: Partial<Company> },
  { rejectValue: string }
>("company/updateCompany", async ({ id, data }, { rejectWithValue }) => {
  try {
    const updated = await update(id, data as Partial<CompanyFromBackend>);
    return updated;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to update company"));
  }
});

// DELETE
export const deleteCompany = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("company/deleteCompany", async (id, { rejectWithValue }) => {
  try {
    await deleteComp(id);
    return id;
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to delete company"));
  }
});
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    resetCompaniesState: (state) => {
      state.companies = [];
      state.selectedCompany = null;
      state.companiesFetched = false;
      state.loading = false;
      state.error = null;
    },
    setSelectedCompany: (state, action: PayloadAction<string | null>) => {
      const id = action.payload;
      state.selectedCompany =
        id == null ? null : state.companies.find((c) => c._id === id) ?? null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<CompanyFromBackend[]>) => {
          state.loading = false;
          state.companies = action.payload;
          state.companiesFetched = true;
          state.error = null;
        }
      )
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // CREATE
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCompany.fulfilled,
        (state, action: PayloadAction<CompanyFromBackend>) => {
          state.loading = false;
          state.companies.unshift(action.payload);
        }
      )
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // UPDATE
    builder
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<CompanyFromBackend>) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.companies.findIndex((c) => c._id === updated._id);
          if (index !== -1) {
            state.companies[index] = updated;
          }
          if (state.selectedCompany?._id === updated._id) {
            state.selectedCompany = updated;
          }
        }
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });

    // DELETE
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const id = action.payload;
          state.companies = state.companies.filter((c) => c._id !== id);
          if (state.selectedCompany?._id === id) {
            state.selectedCompany = null;
          }
        }
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });
  },
});

export const { resetCompaniesState, setSelectedCompany } = companySlice.actions;

// Selectors
// export const selectCompanies = (state: RootState) => state.company.companies;
// export const selectCompanyById = (state: RootState, id: string) =>
//   state.company.companies.find((c) => c._id === id) ?? null;
// export const selectSelectedCompany = (state: RootState) => state.company.selectedCompany;
// export const selectCompanyLoading = (state: RootState) => state.company.loading;
// export const selectCompaniesFetched = (state: RootState) => state.company.companiesFetched;

export default companySlice.reducer;
