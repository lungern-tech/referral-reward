// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { NextRequest, NextResponse } from "next/server";

// const s3Client = new S3Client({
//   region: "auto",
//   endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY_ID,
//     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(req: NextRequest) {

//   const body = await req.json()

//   const { fileName, fileType } = body;


//   const command = new PutObjectCommand({
//     Bucket: process.env.R2_BUCKET_NAME,
//     Key: fileName,
//     ContentType: fileType,
//   });

//   try {
//     const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//     return NextResponse.json({ signedUrl }, { status: 200 })
//   } catch (error) {
//     console.error('Error generating signed URL:', error);
//     return NextResponse.json({ message: 'Error generating signed URL' }, { status: 500 })
//   }
// }

import saveFile from '@/utils/SaveFile';
import { NextResponse } from 'next/server';
import path from 'path';


export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const storagePath = path.join(process.cwd(), 'public', 'uploads');
    const savedFilename = await saveFile(file, name, storagePath);

    return NextResponse.json({ filename: `/uploads/${savedFilename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
}