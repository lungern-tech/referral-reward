import { ObjectId } from "mongodb";
import { InteractStatus } from "./Interaction";
export default interface InteractionLog {
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