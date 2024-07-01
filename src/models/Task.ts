export default interface Task {
  creator: string
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
}