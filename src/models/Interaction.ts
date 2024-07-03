import { ObjectId } from "mongodb";

export enum InteractStatus {
  Pending = 'pending',
  Approved = 'approved',
  Joined = 'joined',
  Rejected = 'rejected'
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
}