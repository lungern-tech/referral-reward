import { ObjectId } from "mongodb"


export enum TaskStatus {
  Created = "created",
  Deployed = "deployed",
  Deploying = "deploying",
  Failed = "failed"
}

export default interface Task {
  _id?: ObjectId | string
  creator: string | ObjectId
  title: string
  chain: number
  start_time: Date
  end_time: Date
  duration: string
  reward: number
  reward_count: number
  reward_token: string
  status: "created" | "active" | "inactive" | "end"
  created_at: Date,
  updated_at: Date,
  deploy_hash: string
  contract_address: string
  cover_image: string
  description: string
  task: string
}