"use client";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import React from "react";
const { Dragger } = Upload
export default function (
  { children, proofChange }:
    { children?: React.ReactNode, proofChange: (proof: string) => void }
) {

  const uploadCoverImage = async (info: UploadChangeParam) => {
    let formData = new FormData()
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)

    const { filename } = await fetch('/api/proof', {
      method: "POST",
      body: formData
    }).then(res => res.json())
    proofChange(filename)
  }
  return (
    <Dragger onChange={uploadCoverImage} beforeUpload={() => false} showUploadList={false}>
      {
        children ? children : (
          <>
            <p className="text-6xl text-blue-600">
              <InboxOutlined />
            </p>
            <p className="mt-2 text-base">Click or drag file to this area to upload</p>
            <p className="mt-2 text-gray-500 text-sm">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </>
        )
      }
    </Dragger >
  )
}