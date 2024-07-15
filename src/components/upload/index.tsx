"use client";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import React from "react";
const { Dragger } = Upload
export default function (
  { children, proofChange }:
    { children?: React.ReactNode, proofChange: (proof: string) => void }
) {

  const [loading, setLoading] = React.useState(false)

  const uploadCoverImage = async (info: UploadChangeParam) => {
    if (loading) return
    setLoading(true)
    let formData = new FormData()
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)

    try {

      const { filename } = await fetch('/api/proof', {
        method: "POST",
        body: formData
      }).then(res => res.json())
      proofChange(filename)
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }
  return (
    <Dragger disabled={loading} onChange={uploadCoverImage} beforeUpload={() => false} showUploadList={false}>
      {
        loading ? (
          <div className="z-10 absolute left-0 top-0 h-full w-full bg-gray-300/30 flex justify-center items-center" >
            <LoadingOutlined className="text-white text-3xl" />
          </div>
        ) : null
      }
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