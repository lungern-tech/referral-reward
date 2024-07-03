import { writeFile } from 'fs/promises';
import path from 'path';

const saveFile = async (file: File, name: string, storagePath: string) => {
  const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
  let appendix = name.split('.').pop();
  const filename = `${uniqueSuffix}.${appendix}`;
  const uploadPath = path.join(storagePath, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(uploadPath, buffer);
  return filename;
}

export default saveFile
