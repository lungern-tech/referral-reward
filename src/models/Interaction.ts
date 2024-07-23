import { ObjectId } from "mongodb";

export enum InteractStatus {
  Pending = 'pending',
  Rejected = 'rejected',
  RewardSent = 'rewardSent',
  Success = "success"
}

export default interface Interaction {
  _id?: ObjectId | string
  task_id: ObjectId | string
  proof: {
    image_link?: string,
    text?: string
  }
  user_id: ObjectId | string
  created_at: Date
  status: InteractStatus
  transition_hash?: string
}