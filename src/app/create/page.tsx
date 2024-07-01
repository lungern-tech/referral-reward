"use client";
import Task from "@/models/Task";
import { Button, DatePicker, Input, Select, Upload } from "antd";
import { createRef, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import dayjs from "dayjs";
import { opBNB, bsc, mainnet, polygon } from "viem/chains";
import Editor from "@/components/editor";
import Delta from "quill-delta";
import { InboxOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import Image from "next/image";
import Quill, { QuillOptions } from "quill";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Dragger } = Upload

const editorConfig: Partial<QuillOptions> = {
  placeholder: "Description"
}

export default function create() {

  const router = useRouter()

  const editor = useRef<Quill>(null)

  const [taskInfo, setTaskInfo] = useState<Partial<Task>>({
    title: "",
    duration: null,
    start_time: new Date(),
    end_time: new Date(),
    chain: null,
    reward: null,
    reward_count: null,
    status: "created",
    cover_image: "",
    description: ""
  })


  const updateTaskInfo = (params: Record<string, unknown>) => {
    setTaskInfo({ ...taskInfo, ...params })
  }


  const createNewReward = () => {
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
    <Select defaultValue="usdt">
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

  const textChange = () => {
    let contents = editor.current.getSemanticHTML()
    setTaskInfo({ ...taskInfo, description: contents })
  }

  return (
    <div className="mx-auto mb-16" style={{ width: '720px' }}>
      <h1 className="text-2xl font-bold">Create New Reward</h1>
      <div className="text-xl font-bold mt-10">Name</div>
      <Input className="mt-5 px-6 py-3 text-base" placeholder="Reward Campaign Name" value={taskInfo.title} onChange={(e) => updateTaskInfo({ 'title': e.target.value })}></Input>
      <div className="text-xl font-bold mt-10">Start-End Time</div>
      <RangePicker value={[dayjs(taskInfo.start_time), dayjs(taskInfo.end_time)]} onChange={updateDurationRange} className="mt-5 px-6 py-3 text-base w-full" type="range" showTime />
      <div className="text-xl font-bold mt-10">Duration</div>
      <Input className="mt-5 px-6 py-3 text-base" readOnly disabled />
      <div className="text-xl font-bold mt-10">Chains</div>
      <Select className="text-base mt-5 w-2/4" value={taskInfo.chain} onChange={(e) => updateTaskInfo({ chain: e })} >
        <Option value={opBNB.id}>
          <div>opBNB</div>
        </Option>
        <Option value={bsc.id}>
          <div>BNB</div>
        </Option>
        <Option value={mainnet.id}>
          <div>ETH</div>
        </Option>
        <Option value={polygon.id}>
          <div>Polygon</div>
        </Option>
      </Select>
      <div className="text-xl font-bold mt-10">Reward</div>
      <Input type="number" min={0} className="mt-5" value={taskInfo.reward} onChange={(e) => updateTaskInfo({ reward: e.target.value })} addonAfter={addonAfter}>
      </Input>
      <div className="text-xl font-bold mt-10">Max Reward Count</div>
      <Input type="number" min={0} className="mt-5 px-6 py-3 text-base" value={taskInfo.reward_count} onChange={(e) => updateTaskInfo({ reward_count: e.target.value })} />
      <div className="text-xl font-bold mt-10">Description</div>
      <div className="mt-5">
        <Editor ref={editor} options={editorConfig} defaultValue={new Delta()} onTextChange={textChange} className="mt-5 rounded-sm" />
      </div>
      <div className="text-xl font-bold mt-10">Banner</div>
      {
        taskInfo.cover_image ? (
          <Image className="mt-5 ring-1 rounded-md" src={`/uploads/${taskInfo.cover_image}`} width={720} height={50} alt="cover" />
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

      <div className="mt-10">
        <Button size="large" type="primary" onClick={createNewReward}>Submit</Button>
        <Button size="large" className="ml-4">Cancel</Button>
      </div>
    </div >
  )
}