import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../lib/axios_config";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ShortenAddress } from "../../../lib/shorten_address";

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

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const data = {
      ...response.data.user,
      wallet_address: ShortenAddress(await signer.getAddress()),
    };

    // return response.data.user;
    return data;
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
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
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
