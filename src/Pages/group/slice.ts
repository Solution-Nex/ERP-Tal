import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Group, GroupFromBackend } from "./types";
import * as groupApi from "./api";

interface GroupsState {
  groups: GroupFromBackend[];
  selectedGroup: GroupFromBackend | null;
  isEditing: boolean;
  loading: boolean;
  fetchedGroups: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  selectedGroup: null,
  isEditing: false,
  loading: false,
  fetchedGroups: false,
  error: null,
};

// ============ ASYNC THUNKS ============

// Fetch all groups
export const fetchAllGroups = createAsyncThunk<
  GroupFromBackend[],
  void,
  { rejectValue: string }
>("groups/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const data = await groupApi.fetchAll();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch groups";
    return rejectWithValue(message);
  }
});

// Fetch groups by company ID
export const fetchGroupsByCompanyId = createAsyncThunk<
  GroupFromBackend[],
  string,
  { rejectValue: string }
>("groups/fetchByCompanyId", async (companyId, { rejectWithValue }) => {
  try {
    const data = await groupApi.fetchByCompanyId(companyId);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch groups";
    return rejectWithValue(message);
  }
});

// Create group
export const createGroup = createAsyncThunk<
  GroupFromBackend,
  Group,
  { rejectValue: string }
>("groups/create", async (groupData, { rejectWithValue }) => {
  try {
    const data = await groupApi.create(groupData);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create group";
    return rejectWithValue(message);
  }
});

// Create multiple groups
export const createMultipleGroups = createAsyncThunk<
  GroupFromBackend[],
  Group[],
  { rejectValue: string }
>("groups/createMultiple", async (groupsData, { rejectWithValue }) => {
  try {
    const data = await groupApi.createMultiple(groupsData);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create groups";
    return rejectWithValue(message);
  }
});

// Update group
export const updateGroup = createAsyncThunk<
  GroupFromBackend,
  { id: string; data: Partial<Group> },
  { rejectValue: string }
>("groups/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const result = await groupApi.update(id, data);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update group";
    return rejectWithValue(message);
  }
});

// Update multiple groups
export const updateMultipleGroups = createAsyncThunk<
  GroupFromBackend[],
  GroupFromBackend[],
  { rejectValue: string }
>("groups/updateMultiple", async (groupsData, { rejectWithValue }) => {
  try {
    const data = await groupApi.updateMultiple(groupsData);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update groups";
    return rejectWithValue(message);
  }
});

// Delete group
export const deleteGroupAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("groups/delete", async (id, { rejectWithValue }) => {
  try {
    await groupApi.deleteGroup(id);
    return id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete group";
    return rejectWithValue(message);
  }
});

// Delete multiple groups
export const deleteMultipleGroups = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>("groups/deleteMultiple", async (ids, { rejectWithValue }) => {
  try {
    await groupApi.deleteMultiple(ids);
    return ids;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete groups";
    return rejectWithValue(message);
  }
});

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<GroupFromBackend | null>) => {
      state.selectedGroup = action.payload;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGroupsState: (state) => {
      state.groups = [];
      state.selectedGroup = null;
      state.isEditing = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ========== FETCH ALL GROUPS ==========
    builder
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.fetchedGroups = true;
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch groups";
      });

    // ========== FETCH GROUPS BY COMPANY ID ==========
    builder
      .addCase(fetchGroupsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByCompanyId.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroupsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch groups";
      });

    // ========== CREATE GROUP ==========
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.unshift(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create group";
      });

    // ========== CREATE MULTIPLE GROUPS ==========
    builder
      .addCase(createMultipleGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMultipleGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(...action.payload);
      })
      .addCase(createMultipleGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create groups";
      });

    // ========== UPDATE GROUP ==========
    builder
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.selectedGroup?.id === action.payload.id) {
          state.selectedGroup = action.payload;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update group";
      });

    // ========== UPDATE MULTIPLE GROUPS ==========
    builder
      .addCase(updateMultipleGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMultipleGroups.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((updatedGroup) => {
          const index = state.groups.findIndex((g) => g.id === updatedGroup.id);
          if (index !== -1) {
            state.groups[index] = updatedGroup;
          }
        });
      })
      .addCase(updateMultipleGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update groups";
      });

    // ========== DELETE GROUP ==========
    builder
      .addCase(deleteGroupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroupAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter((g) => g.id !== action.payload);
        if (state.selectedGroup?.id === action.payload) {
          state.selectedGroup = null;
        }
      })
      .addCase(deleteGroupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete group";
      });

    // ========== DELETE MULTIPLE GROUPS ==========
    builder
      .addCase(deleteMultipleGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMultipleGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter((g) => !action.payload.includes(g._id));
        if (state.selectedGroup && action.payload.includes(state.selectedGroup._id)) {
          state.selectedGroup = null;
        }
      })
      .addCase(deleteMultipleGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete groups";
      });
  },
});

export const {
  setSelectedGroup,
  setEditing,
  clearError,
  resetGroupsState,
} = groupsSlice.actions;

export default groupsSlice.reducer;
