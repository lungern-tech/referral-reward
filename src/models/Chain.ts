import { ObjectId } from "mongodb";

export default interface Chain {
  _id: ObjectId | string
  rpc: string
  factory_address: string
  chain_id: number
  chain_name: string
}