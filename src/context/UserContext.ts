"use client"
import User from "@/models/User";
import { createContext } from "react";

const UserContext = createContext<{ user: User, updateUser: () => void }>({
  user: null,
  updateUser: () => { }
})

export default UserContext