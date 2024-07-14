import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
});



const saveFile = async (file: File, name: string, storagePath: string) => {
  console.log('start to upload file')
  const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
  let appendix = name.split('.').pop();
  const filename = `${uniqueSuffix}.${appendix}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type
    },
  });

  try {
    upload.on('httpUploadProgress', (progress) => {
      console.log('upload progress: ', progress)
    })
    const result = await upload.done();
    console.log("Image uploaded successfully:", result.Location);
    return `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${result.Key}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error
  }
}

export default saveFile
