"use client";
import CdnImage from "@/components/cdn-image";
import Task from "@/models/Task";
import ChainMap from "@/utils/ChainMap";
import { firstOfDay } from "@/utils/DateFormat";
import { InboxOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select, Upload, notification } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { QuillOptions } from "quill";
import Delta from "quill-delta";
import { useEffect, useState } from "react";
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
    description: ""
  })

  useEffect(() => {
    let diff = dayjs(taskInfo.end_time).diff(taskInfo.start_time, 'minutes')
    console.log('diff', diff)
    const day = diff / (24 * 60);
    const hour = diff % (24 * 60) / 60;
    const minute = diff % (24 * 60) % 60;
    setTaskInfo({ ...taskInfo, duration: `${day} days ${hour} hours ${minute} minutes` })
  }, [taskInfo.start_time, taskInfo.end_time])


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
    <Select defaultValue="usdt" className="!text-white">
      <Option value="usdt">USDT</Option>
    </Select>
  )

  const uploadCoverImage = async (info: UploadChangeParam) => {
    let formData = new FormData();
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)
    let result = await fetch('/api/file/upload', {
      method: 'POST',
      body: formData,
    }).then<{ filename: string }>(res => res.json())
    setTaskInfo({ ...taskInfo, cover_image: result.filename })
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
            <Option key={key} value={key}>{value.name}</Option>
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
          <CdnImage className="mt-5 ring-1 rounded-md" src={`${taskInfo.cover_image}`} width={720} height={50} alt="cover" />
        ) : (
          <div className="mt-5" >
            <Dragger onChange={uploadCoverImage} beforeUpload={() => false} showUploadList={false}>
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