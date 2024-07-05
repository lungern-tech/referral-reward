import { ObjectId } from "mongodb"

export default interface User {
  name?: string
  _id?: ObjectId | string
  nickname?: string
  email?: string
  twitter?: string
  discord?: string
  wallet: string
  create_time: Date
}