import client from "@/lib/mongodb"
import Interaction from "@/models/Interaction"
import { ObjectId } from "mongodb"
export function GET() {

}


export async function POST(request: Request) {
  const data = await request.formData()
  const pageSize = Number(data.get('page_size'))
  const pageNumber = Number(data.get('page_number'))
  const task_id = data.get("task_id")
  const status = data.get("status")
  const searchParams = [
    {
      $match: {
        task_id: new ObjectId(String(task_id))
      }
    },
    {
      $lookup: {
        from: "user",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $facet: {
        results: [
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize }
        ],
        totalCount: [{ $count: 'count' }]
      }
    },
  ]
  if (status !== 'ALL') {
    searchParams[0].$match.status = status
  }
  const joinedList = await client.collection<Interaction>("interaction").aggregate(searchParams).toArray()
  return new Response(JSON.stringify(joinedList))
}