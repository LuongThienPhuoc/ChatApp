// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"
/* eslint-disable */
export const getUserProfile = createAsyncThunk("appChat/getTasks", async () => {
  const response = await axios.get("/apps/chat/users/profile-user")
  console.log(response.data)
  return response.data
})

export const getChatContacts = createAsyncThunk(
  "appChat/getChatContacts",
  async () => {
    const response = await axios.get("/apps/chat/chats-and-contacts")
    return response.data
  }
)

export const selectChat = createAsyncThunk(
  "appChat/selectChat",
  async (id, { dispatch }) => {
    const response = await axios.get("/apps/chat/get-chat", { id })
    await dispatch(getChatContacts())
    return response.data
  }
)

export const sendMsg = createAsyncThunk(
  "appChat/sendMsg",
  async (obj, { dispatch }) => {
    const response = await axios.post("/apps/chat/send-msg", { obj })
    await dispatch(selectChat(obj.contact.id))
    return response.data
  }
)

export const selectChatUser = createAsyncThunk(
  "select-chat-user",
  async (id, { dispatch }) => {
    const response = await axios.get(
      `http://localhost:5000/api/user-chat/get-chat?id=${id}`
    )
    await dispatch(getAllChat())
    const data = {
      chat: {
        id: id,
        unseenMsgs: response.data.message.unseenMsgs,
        userId: id,
        chat: response.data.message.chat
      },
      contact: {
        ...response.data.user,
        avatar: require("@src/assets/images/portrait/small/avatar.png").default
      }
    }
    return data
  }
)

export const getAllChat = createAsyncThunk(
  "get-all-contacts-and-chats",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/user-chat/get-all-contacts-and-chats"
    )
    const data = {
      profileUser: {
        id: "admin",
        avatar: require("@src/assets/images/portrait/small/admin.png").default,
        fullName: "Adminstrator",
        role: "admin",
        about:
          "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
        status: "online",
        settings: {
          isTwoStepAuthVerificationEnabled: true,
          isNotificationsOn: false
        }
      },
      selectedUser: {},
      contacts: response.data.users.map((user) => {
        return {
          id: user.username,
          fullName: user.fullname,
          role: user.role,
          about: user.about,
          avatar: require("@src/assets/images/portrait/small/avatar.png")
            .default,
          status: user.status
        }
      }),
      chats: response.data.users.map((user) => {
        return {
          about: user.about,
          avatar: require("@src/assets/images/portrait/small/avatar.png")
            .default,
          chat: user.chat,
          fullName: user.username,
          id: user.username,
          role: user.role,
          status: user.status
        }
      })
    }
    return data
  }
)

export const appChatSlice = createSlice({
  name: "appChat",
  initialState: {
    chats: [],
    contacts: [],
    userProfile: {},
    selectedUser: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
      })
      .addCase(getChatContacts.fulfilled, (state, action) => {
        state.chats = action.payload.chatsContacts
        state.contacts = action.payload.contacts
      })
      .addCase(selectChat.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(getAllChat.fulfilled, (state, action) => {
        console.log("action.payload", action.payload)
        state.chats = action.payload.chats
        state.contacts = action.payload.contacts
        state.userProfile = action.payload.profileUser
      })
      .addCase(selectChatUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  }
})

export default appChatSlice.reducer
