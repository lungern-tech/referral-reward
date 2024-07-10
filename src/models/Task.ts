import { ObjectId } from "mongodb"

export default interface Task {
  _id?: ObjectId | string
  creator: string | ObjectId
  title: string
  chain: number
  start_time: Date
  end_time: Date
  duration: number
  reward: number
  reward_count: number
  status: "created" | "active" | "inactive" | "end"
  created_at: Date,
  updated_at: Date,
  deploy_hash: string
  contract_address: string
  cover_image: string
  description: string
  task: string
}