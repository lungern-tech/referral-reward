import client from './mongodb'

export default async function initDB() {
  await client.createCollection("User")
  await client.createCollection("Reward")
  await client.createCollection("Task")
}