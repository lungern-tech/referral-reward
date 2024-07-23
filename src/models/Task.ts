import { ObjectId } from "mongodb"


export enum DeployStatus {
  Created = "created",
  Deployed = "deployed",
  Deploying = "deploying",
  Failed = "failed"
}

export enum TaskStatus {
  ALL = "",
  Pending = "pending",
  Upcoming = "upcoming",
  Ongoing = "ongoing",
  Finished = "finished",
  Expired = "expired"
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
  reward_sent_count: number
  reward_in_usd: number
  reward_token: string
  token_price_usd: number
  status: DeployStatus
  created_at: Date,
  updated_at: Date,
  deploy_hash: string
  contract_address: string
  cover_image: string
  description: string
  task: string
}