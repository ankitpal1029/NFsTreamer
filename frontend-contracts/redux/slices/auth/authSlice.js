import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../lib/axios_config";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk("auth/login", async (thunkAPI) => {
  try {
    const response = await axios.get("/auth/twitch/get-user");

    // use this data to register wallet address on the backend
    const user = {
      ...response.data.user,
      wallet_address: "0x0000000000000",
    };

    // return response.data.user;
    return user;
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const connectWallet = createAsyncThunk(
  "auth/wallet",
  async (thunkAPI, { getState }) => {
    try {
      const state = getState();
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      console.log(state.auth.user);
      const data = {
        id: state?.auth?.user?.id,
        wallet_address: await signer.getAddress(),
      };

      await axios.post("/add-wallet-address", data);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async(thunkAPI) => {
    console.log("hellooo")
    try{
      const response = await axios.get('/auth/twitch/logout');
      console.log(response);
      return response;
    }catch(error){
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
)
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      (state.isLoading = false),
        (state.isError = false),
        (state.isSuccess = false),
        (state.message = "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(connectWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
    .addCase(logout.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(logout.fulfilled, (state) => {
      state.isLoading = false,
        state.isSuccess = true,
        state.user = null;
    })
    .addCase(logout.rejected, (state, action) => {
      console.log("rejected")
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })
    ;
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
