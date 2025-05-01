import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createGroupApi,
  deleteGroupApi,
  getGroupsApi,
  updateGroupApi,
} from "../../service/api";

export const getGroups = createAsyncThunk("group/getGroups", async () => {
  const response = await getGroupsApi();
  return response.data.data;
});

export const addGroup = createAsyncThunk("group/addGroup", async ({ name }) => {
  const response = await createGroupApi(name);
  return response.data.data;
});

export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({ id, name }) => {
    const response = await updateGroupApi(id, name);
    return response.data.data;
  }
);

export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (id, { dispatch, getState }) => {
    const response = await deleteGroupApi(id);
    
    // After successful deletion, filter out related expenses from the state
    const state = getState();
    const expenses = state.expense.expenses;
    const relatedExpenseIds = expenses
      .filter(expense => expense.group && expense.group.id === parseInt(id))
      .map(expense => expense.id);
    
    // Dispatch actions to update the expense state
    relatedExpenseIds.forEach(expenseId => {
      // We're only updating the state, not making API calls
      dispatch({ 
        type: 'expense/deleteExpense/fulfilled', 
        payload: { id: expenseId } 
      });
      
      // Also update dashboard state if needed
      if (state.dashboard && state.dashboard.recentExpenses) {
        dispatch({
          type: 'dashboard/expenseDeleted',
          payload: { id: expenseId }
        });
      }
    });
    
    return response.data.data;
  }
);

const initialState = {
  groups: [], 
  group: [],
  loading: false,
  error: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    getGroup: (state, action) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.id
      );
      if (group) {
        state.group = group;
      } else {
        state.group = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGroups.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.groups = action.payload.groups;
    });

    builder.addCase(getGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(addGroup.fulfilled, (state, action) => {
      state.loading = false;
    
      state.groups.push(action.payload.group);
    });

    builder.addCase(addGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.groups.findIndex(
        (group) => group.id === action.payload.group.id
      );

      if (index !== -1) {
        state.groups[index] = action.payload.group;
      }
    });

    builder.addCase(updateGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });

    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.loading = false;
      // Filter out the deleted group from the state using the id from the response
      state.groups = state.groups.filter((group) => (
        group.id !== parseInt(action.payload.id)
      ));
    });

    builder.addCase(deleteGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.data.error.message;
    });
  },
});


export const { getGroup } = groupSlice.actions;
export const selectGroups = (state) => state.group.groups;
export const selectGroup = (state) => state.group.group;
export const selectLoading = (state) => state.group.loading;
export const selectError = (state) => state.group.error;

export default groupSlice.reducer;