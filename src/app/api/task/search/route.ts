import client from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const task = await client.collection("task").findOne({
    _id: new ObjectId(query.get("id")!)
  })
  return new NextResponse(JSON.stringify(task), {
    status: 200
  })
}

