import { auth } from "@/app/auth";
import client from "@/lib/mongodb";
import Task, { DeployStatus, TaskStatus } from "@/models/Task";
import { Document, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth()
  const { pageSize, pageNumber, status } = await request.json() as { pageSize: number, pageNumber: number, status: TaskStatus }
  console.log(session.userInfo._id)
  const searchParams: Array<Document> = [
    {
      $match: {
        creator: new ObjectId(session.userInfo._id)
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
    {
      $facet: {
        results: [
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize }
        ],
        count: [{ $count: 'count' }]
      }
    },
  ]
  
  if (status === TaskStatus.Pending) {
    searchParams[0].$match = {
      ...searchParams[0].$match,
      status: DeployStatus.Created
    }
  } else if (status === TaskStatus.Ongoing) {
    searchParams[0].$match = {
      ...searchParams[0].$match,
      start_time: { $lt: new Date() },
      end_time: { $gt: new Date() } 
    }
  } else if (status === TaskStatus.Upcoming) {
    searchParams[0].$match = {
      ...searchParams[0].$match,
      start_time: { $gt: new Date() }
    }
  } else if (status === TaskStatus.Finished) {
    searchParams[0].$match = {
      ...searchParams[0].$match,
      expr: { $gt: ["$reward_sent_count", "$reward_count"] },
    }
  } else if (status === TaskStatus.Expired) {
    searchParams[0].$match = {
      ...searchParams[0].$match,
      end_time: { $lt: new Date() }
    }
  }

  const list = await client
      .collection<Task>('task')
      .aggregate(searchParams).toArray()
    if (list.length > 0 && list[0].results.length > 0) {
      const [ { results, count: [{ count }] } ] = list
      return NextResponse.json({ list: results, count: count })
    }

  return NextResponse.json({ list: [], count: 0 })
}