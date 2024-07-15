
import saveFile from '@/utils/SaveFile';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const storagePath = path.join(process.cwd(), 'public', 'uploads/proof')
    const savedFilename = await saveFile(file, name, storagePath);
    return NextResponse.json({ filename: savedFilename });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
}