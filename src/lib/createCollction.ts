import client from './mongodb'

const db = client.db("reward")
export default async function initDB() {
  await db.createCollection("User")
  await db.createCollection("Reward")
  await db.createCollection("Task")
}