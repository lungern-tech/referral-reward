import { ObjectId } from "mongodb"

export default interface User {
  _id?: ObjectId | string
  name?: string
  avatar?: string
  nickname?: string
  email?: string
  twitter?: string
  discord?: string
  wallet: string
  create_time: Date
}