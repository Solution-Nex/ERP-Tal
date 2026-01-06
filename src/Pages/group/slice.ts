import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Group } from "./types";

interface GroupsState {
  groups: Group[];
  selectedGroup: Group | null;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  selectedGroup: null,
  isEditing: false,
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
      state.selectedGroup = action.payload;
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
});

export const {
  setGroups,
  addGroup,
  setSelectedGroup,
  updateGroup,
  deleteGroup,
  setEditing,
  setLoading,
  setError,
  clearError,
  resetGroupsState,
} = groupsSlice.actions;

export default groupsSlice.reducer;
