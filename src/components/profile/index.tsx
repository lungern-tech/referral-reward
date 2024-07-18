'use client'

import UserContext from '@/context/UserContext'
import User from '@/models/User'
import { CopyOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Upload, message, notification } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { useContext, useEffect, useState } from 'react'
import CdnImage from '../cdn-image'

const updateUserProfile = async (userInfo: Partial<User>) => {
  await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  })
}

export default function () {
  const [nickname, setNickname] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { user, updateUser } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      setNickname(user.nickname)
    }
  }, [user])

  const updateUserName = () => {
    setLoading(true)
    updateUserInfo({ nickname })
      .then(() => {
        notification.success({
          message: 'Update successfully',
        })
      })
      .catch((err) => {
        notification.error({
          message: 'Update failed',
          description: err.message,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateUserInfo = (data: Partial<User>) => {
    return updateUserProfile({ ...data, _id: user._id }).then(() => {
      updateUser()
    })
  }

  const handleAvatarChange = (info: UploadChangeParam) => {
    setLoading(true)
    let formData = new FormData()
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)
    fetch('/api/file/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((avatar: { filename: string }) => {
        return updateUserInfo({ avatar: avatar.filename })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  message.config({
    top: 80,
  })
  const copyAddress = () => {
    navigator.clipboard.writeText(user.wallet)
    message.success({
      content: 'Successful to copy address',
    })
  }

  return (
    <div className="px-16 py-8">
      <div className="flex items-center">
        <div className="relative flex-shrink-0">
          {user ? (
            <CdnImage
              className="size-[100px] rounded-full"
              src={`${user.avatar}`}
              width={56}
              height={56}
              alt="avatar"
            />
          ) : (
            <></>
          )}
          {loading ? (
            <div
              className={`absolute left-0 top-0 z-20 bg-gray-700/70 text-white size-[100px] rounded-full overflow-hidden`}
            >
              <div className="flex flex-col h-full w-full items-center justify-center">
                <LoadingOutlined />
              </div>
            </div>
          ) : null}
          <div></div>
          <div
            className={`absolute left-0 top-0 z-10 bg-gray-700/70 text-white size-[100px] rounded-full overflow-hidden opacity-0 hover:opacity-100`}
          >
            <div className="flex flex-col h-full w-full items-center justify-center">
              <PlusOutlined />
              <div className="mt-2">Change</div>
            </div>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="absolute left-0 top-0 opacity-0"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
            >
              <div className="bg-gray-700 text-white hidden hover:block "></div>
            </Upload>
          </div>
        </div>
        {user ? (
          <div className="ml-4">
            <div className="text-2xl font-medium text-slate-700">
              {user.nickname}
            </div>
            <div
              onClick={copyAddress}
              className="mt-1 text-slate-500 cursor-pointer inline-flex justify-center"
            >
              {user.wallet}
              <CopyOutlined className="ml-1" />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        <div className="mt-8 text-xl text-slate-700 font-medium">Full Name</div>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-4 px-4 py-2"
        />
        <Button
          onClick={updateUserName}
          className="px-8 py-5 mt-4 "
          type="primary"
          loading={loading}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
