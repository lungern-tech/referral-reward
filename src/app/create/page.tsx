"use client";
import CdnImage from "@/components/cdn-image";
import Task from "@/models/Task";
import getPrice from "@/service/getPrice";
import ChainMap from "@/utils/ChainMap";
import { firstOfDay } from "@/utils/DateFormat";
import { DeleteOutlined, InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select, Upload, notification } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { QuillOptions } from "quill";
import Delta from "quill-delta";
import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import "./index.scss";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false
})

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Dragger } = Upload

const editorConfig: Partial<QuillOptions> = {
  placeholder: "Description"
}

export default function create() {

  const router = useRouter()

  const chainId = useChainId()

  const [taskInfo, setTaskInfo] = useState<Partial<Task>>({
    title: "",
    duration: null,
    start_time: firstOfDay(new Date()),
    end_time: firstOfDay(new Date()),
    chain: null,
    reward: null,
    reward_count: null,
    status: "created",
    cover_image: "",
    description: "",
    reward_token: "USDT"
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let diff = dayjs(taskInfo.end_time).diff(taskInfo.start_time, 'minutes')
    console.log('diff', diff)
    const day = diff / (24 * 60);
    const hour = diff % (24 * 60) / 60;
    const minute = diff % (24 * 60) % 60;
    setTaskInfo({ ...taskInfo, duration: `${day} days ${hour} hours ${minute} minutes` })
  }, [taskInfo.start_time, taskInfo.end_time])

  useEffect(() => {
    getPrice(1).then((data) => {
      console.log(data)
    })
  }, [taskInfo.reward_token])

  const updateTaskInfo = (params: Record<string, unknown>) => {
    setTaskInfo({ ...taskInfo, ...params })
  }


  const createNewReward = () => {
    if (Object.values(taskInfo).some(e => !e)) {
      notification.error({
        message: 'Please complete all required fields'
      })
      return
    }
    fetch('/api/task/create', {
      method: 'POST',
      body: JSON.stringify(taskInfo)
    }).then(res => res.json()).then((data: { insertedId: string }) => {
      router.push(`/pay/${data.insertedId}`)
    })
  }

  const updateDurationRange = (e) => {
    if (e) {
      updateTaskInfo({ 'start_time': e[0].toDate(), 'end_time': e[1].toDate() })
    }
  }

  const addonAfter = (
    <Select onChange={(e) => setTaskInfo({ reward_token: e })} defaultValue="usdt" className="!text-white">
      <Option value="usdt">USDT</Option>
    </Select>
  )

  const uploadCoverImage = async (info: UploadChangeParam) => {
    if (loading) return
    setLoading(true)
    let formData = new FormData();
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)
    try {
      let result = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      }).then<{ filename: string }>(res => res.json())

      setTaskInfo({ ...taskInfo, cover_image: result.filename })
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  const textChange = (contents: string) => {
    setTaskInfo({ ...taskInfo, description: contents })
  }

  const taskChange = (contents: string) => {
    setTaskInfo({ ...taskInfo, task: contents })
  }

  const cancelCreate = () => {
    router.back()
  }

  return (
    <div className="mx-auto mb-16 max-w-[800px]" >
      <h1 className="text-2xl font-bold">Create New Reward</h1>
      <div className="text-xl font-bold mt-10">Name</div>
      <Input className="mt-5 px-6 py-3 text-base" placeholder="Reward Campaign Name" value={taskInfo.title} onChange={(e) => updateTaskInfo({ 'title': e.target.value })}></Input>
      <div className="text-xl font-bold mt-10">Start-End Time</div>
      <RangePicker value={[dayjs(taskInfo.start_time), dayjs(taskInfo.end_time)]} format={'YYYY-MM-DD HH:mm'} onChange={updateDurationRange} className="mt-5 px-6 py-3 text-base w-full" type="range" showTime />
      <div className="text-xl font-bold mt-10">Duration</div>
      <Input value={taskInfo.duration} className="mt-5 px-6 py-3 text-base" placeholder="Duration of this campaign" readOnly />
      <div className="text-xl font-bold mt-10">Chains</div>
      <Select size="large" placeholder="Choose Which chain that winner can get reward" className="text-base w-full" value={taskInfo.chain} onChange={(e) => updateTaskInfo({ chain: e })} >
        {
          Object.entries(ChainMap).map(([key, value]) => (
            <Option key={key} value={key}>{value.chain.name}</Option>
          ))
        }
      </Select>
      <div className="text-xl font-bold mt-10">Reward</div>
      <Input placeholder="reward that one winner can get" size="large" type="number" min={0} className="mt-5" value={taskInfo.reward} onChange={(e) => updateTaskInfo({ reward: e.target.value })} addonAfter={addonAfter}>
      </Input>
      <div className="text-xl font-bold mt-10">Count</div>
      <Input type="number" placeholder="the maximum count of winners" min={0} className="mt-5 px-6 py-3 text-base" value={taskInfo.reward_count} onChange={(e) => updateTaskInfo({ reward_count: e.target.value })} />
      <div className="text-xl font-bold mt-10">Description</div>
      <div className="mt-5">
        <Editor options={editorConfig} defaultValue={new Delta()} onTextChange={textChange} className="mt-5 rounded-sm" />
      </div>
      <div className="text-xl font-bold mt-10">Banner</div>
      {
        taskInfo.cover_image ? (
          <div className="relative">
            <CdnImage className="mt-5 ring-1 rounded-md w-full" src={`${taskInfo.cover_image}`} width={720} height={50} alt="cover" />
            <div className="absolute z-10 left-0 top-0 w-full h-full transition opacity-0 hover:opacity-100 bg-gray-300/30 flex items-center justify-center" >
              <DeleteOutlined onClick={() => setTaskInfo({ ...taskInfo, cover_image: '' })} className="text-red-700 text-2xl cursor-pointer mix-blend-multiply" />
            </div>
          </div>
        ) : (
          <div className="mt-5" >
            <Dragger disabled={loading} onChange={uploadCoverImage} beforeUpload={() => false} showUploadList={false}>
              {
                loading ? (
                  <div className="z-10 absolute left-0 top-0 h-full w-full bg-gray-300/30 flex justify-center items-center" >
                    <LoadingOutlined className="text-white text-3xl" size={90} />
                  </div>
                ) : null
              }
              <p className="text-6xl text-blue-600">
                <InboxOutlined />
              </p>
              <p className="mt-2 text-base">Click or drag file to this area to upload</p>
              <p className="mt-2 text-gray-500 text-sm">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
              </p>
            </Dragger >
          </div >
        )
      }
      <div className="mt-10 text-xl font-bold">Task Guide</div>
      <div className="mt-5">
        <Editor options={editorConfig} defaultValue={new Delta()} onTextChange={taskChange} className="mt-5 rounded-sm" />
      </div>
      <div className="mt-10 text-xl font-bold">Proof Method</div>
      <Select className="text-base mt-5 w-2/4" size="large" defaultValue="manual">
        <Option value="manual">
          Manual
        </Option>
      </Select>
      <div className="mt-10">
        <Button size="large" type="primary" onClick={createNewReward}>Submit</Button>
        <Button size="large" className="ml-4" onClick={cancelCreate}>Cancel</Button>
      </div>
    </div >
  )
}