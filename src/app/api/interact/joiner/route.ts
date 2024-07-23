import { auth } from "@/app/auth"
import client from "@/lib/mongodb"
import Interaction from "@/models/Interaction"
import { Document, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  const body = await request.json()
  const { page_size, page_number, status } = body
  
  const searchParams: Array<Document>= [
    {
      $match: {
        user_id: new ObjectId(session.id),
      },
    },
    {
      $lookup: {
        from: 'task',
        localField: 'task_id',
        foreignField: '_id',
        as: 'task',
      },
    },
    { $unwind: '$task' },
    {
      $lookup: {
        from: 'user',
        localField: 'task.creator',
        foreignField: '_id',
        as: 'creator',
      },
    },
    { $unwind: '$creator' },
    {
      $facet: {
        results: [
          { $skip: (page_number - 1) * page_number },
          { $limit: page_size }
        ],
        count: [{ $count: 'count' }]
      }
    },
  ]

  if (status !== "ALL") {
    searchParams[0].$match.status = status
  }
   const list = await client
  .collection<Interaction>('interaction')
  .aggregate(searchParams)
  .toArray()

  if (list.length > 0 && list[0].results.length > 0) {
    const [ { results, count: [{ count }] } ] = list
    return NextResponse.json({ list: results, count: count })
  }

  return NextResponse.json({  list: [], count: 0 })
}
