'use client'
import CdnImage from '@/components/cdn-image'
import Task, { TaskStatus } from '@/models/Task'
import getPrice from '@/service/getPrice'
import ChainMap from '@/utils/ChainMap'
import { firstOfDay } from '@/utils/DateFormat'
import {
  DeleteOutlined,
  InboxOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, DatePicker, Input, Select, Upload, notification } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { QuillOptions } from 'quill'
import Delta from 'quill-delta'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'
import './index.scss'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

const { RangePicker } = DatePicker
const { Option } = Select
const { Dragger } = Upload

const editorConfig: Partial<QuillOptions> = {
  placeholder: 'Whole Campaign Guide',
}

const guideConfig: Partial<QuillOptions> = {
  placeholder: 'Key Points to Achieve',
}

export default function create() {
  const router = useRouter()

  const chainId = useChainId()

  const [taskInfo, setTaskInfo] = useState<Partial<Task>>({
    title: '',
    duration: null,
    start_time: firstOfDay(new Date()),
    end_time: firstOfDay(new Date()),
    chain: null,
    reward: null,
    reward_in_usd: null,
    reward_count: null,
    status: TaskStatus.Created,
    cover_image: '',
    description: '',
    reward_token: 'USDT',
    token_price_usd: 0,
  })

  const [loading, setLoading] = useState(false)

  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    let diff = dayjs(taskInfo.end_time).diff(taskInfo.start_time, 'minutes')
    const day = diff / (24 * 60)
    const hour = (diff % (24 * 60)) / 60
    const minute = (diff % (24 * 60)) % 60
    setTaskInfo({
      ...taskInfo,
      duration: `${day} days ${hour} hours ${minute} minutes`,
    })
  }, [taskInfo.start_time, taskInfo.end_time])

  useEffect(() => {
    getPrice(chainId).then((data) => {
      if (data.data.length > 0) {
        setTaskInfo({
          ...taskInfo,
          token_price_usd: Number(data.data[0].lastPrice),
        })
      }
    })
  }, [taskInfo.reward_token])

  const updateTaskInfo = (params: Record<string, unknown>) => {
    setTaskInfo({ ...taskInfo, ...params })
  }

  const createNewReward = () => {
    if (Object.values(taskInfo).some((e) => !e)) {
      notification.error({
        message: 'Please complete all required fields',
      })
      return
    }
    setSubmitLoading(true)
    fetch('/api/task/create', {
      method: 'POST',
      body: JSON.stringify(taskInfo),
    })
      .then((res) => res.json())
      .then((data: { insertedId: string }) => {
        router.push(`/pay/${data.insertedId}`)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  const updateDurationRange = (e) => {
    if (e) {
      updateTaskInfo({ start_time: e[0].toDate(), end_time: e[1].toDate() })
    }
  }

  const currentChain = ChainMap[chainId].chain.nativeCurrency.symbol

  const addonAfter = (
    <Select
      onChange={(e) => setTaskInfo({ reward_token: e })}
      defaultValue={currentChain}
      className="!text-white"
    >
      <Option value={currentChain}>{currentChain}</Option>
    </Select>
  )

  const uploadCoverImage = async (info: UploadChangeParam) => {
    if (loading) return
    setLoading(true)
    let formData = new FormData()
    formData.append('file', info.file as unknown as File)
    formData.append('name', info.file.name)
    try {
      let result = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      }).then<{ filename: string }>((res) => res.json())

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

  const rewardChange = (e) => {
    let reward_in_usd
    const value = e.target.value
    const tokenPrice = taskInfo.token_price_usd
    if (tokenPrice) {
      reward_in_usd = tokenPrice * (Number(e.target.value) || 0)
    }
    updateTaskInfo({ reward: value, reward_in_usd })
  }

  const rewardUsdChange = (e) => {
    let reward
    const reward_in_usd = e.target.value
    const tokenPrice = taskInfo.token_price_usd
    if (tokenPrice) {
      reward = Number(reward_in_usd) / tokenPrice
    }
    updateTaskInfo({ reward_in_usd, reward })
  }

  const cancelCreate = () => {
    router.back()
  }

  return (
    <div className="mx-auto mb-16 pt-8 max-w-[800px]">
      <h1 className="text-2xl font-bold text-slate-700">Create New Reward</h1>
      <div className="text-xl font-bold mt-12 text-slate-700">Name</div>
      <Input
        className="mt-5 px-6 py-3 text-base text-slate-900"
        placeholder="Reward Campaign Name"
        value={taskInfo.title}
        onChange={(e) => updateTaskInfo({ title: e.target.value })}
      ></Input>
      <div className="text-xl font-bold mt-10 text-slate-700">
        Start-End Time
      </div>
      <RangePicker
        value={[dayjs(taskInfo.start_time), dayjs(taskInfo.end_time)]}
        format={'YYYY-MM-DD HH:mm'}
        onChange={updateDurationRange}
        className="mt-5 px-6 py-3 text-base w-full text-slate-900"
        type="range"
        showTime
      />
      <div className="text-xl font-bold mt-10 text-slate-700">Duration</div>
      <Input
        value={taskInfo.duration}
        className="mt-5 px-6 py-3 text-base text-slate-900"
        placeholder="Duration of this campaign"
        readOnly
      />
      <div className="text-xl font-bold mt-10 text-slate-700">Chains</div>
      <Select
        size="large"
        placeholder="Choose Which chain that winner can get reward "
        className="text-base w-full mt-5 text-slate-900"
        value={taskInfo.chain}
        onChange={(e) => updateTaskInfo({ chain: e })}
      >
        {Object.entries(ChainMap).map(([key, value]) => (
          <Option
            key={key}
            value={key}
          >
            {value.chain.name}
          </Option>
        ))}
      </Select>
      <div className="text-xl font-bold mt-10 text-slate-700">Reward</div>
      <div className="flex justify-center mt-5">
        <Input
          placeholder="reward that one winner can get"
          size="large"
          type="number"
          min={0}
          className="w-2/4"
          value={taskInfo.reward}
          onChange={rewardChange}
          addonAfter={addonAfter}
        />
        <span className="flex justify-center items-center mx-4">=</span>
        <Input
          placeholder="equivalent usd "
          size="large"
          onChange={rewardUsdChange}
          value={taskInfo.reward_in_usd}
          className="w-2/4"
          addonAfter={<div className="text-slate-700 font-semibold">USD</div>}
        />
      </div>
      <div className="text-xl font-bold mt-10 text-slate-700">Count</div>
      <Input
        type="number"
        placeholder="the maximum count of winners"
        min={0}
        className="mt-5 px-6 py-3 text-base"
        value={taskInfo.reward_count}
        onChange={(e) => updateTaskInfo({ reward_count: e.target.value })}
      />

      <div className="text-xl font-bold mt-10 text-slate-700">Banner</div>
      {taskInfo.cover_image ? (
        <div className="relative">
          <CdnImage
            className="mt-5 ring-1 rounded-md w-full"
            src={`${taskInfo.cover_image}`}
            width={720}
            height={50}
            alt="cover"
          />
          <div
            className="absolute z-10 left-0 top-0 w-full h-full transition opacity-0 
          hover:opacity-100 bg-gray-300/30 flex items-center justify-center"
          >
            <DeleteOutlined
              onClick={() => setTaskInfo({ ...taskInfo, cover_image: '' })}
              className="text-red-700 text-2xl cursor-pointer mix-blend-multiply"
            />
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <Dragger
            disabled={loading}
            onChange={uploadCoverImage}
            beforeUpload={() => false}
            showUploadList={false}
          >
            {loading ? (
              <div className="z-10 absolute left-0 top-0 h-full w-full bg-gray-300/30 flex justify-center items-center">
                <LoadingOutlined
                  className="text-white text-3xl"
                  size={90}
                />
              </div>
            ) : null}
            <p className="text-6xl text-blue-600">
              <InboxOutlined />
            </p>
            <p className="mt-2 text-base">
              Click or drag file to this area to upload
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </div>
      )}
      <div className="mt-10 text-xl font-bold text-slate-700">Task Guide</div>
      <div className="mt-5">
        <Editor
          options={guideConfig}
          defaultValue={new Delta()}
          onTextChange={taskChange}
          className="mt-5 rounded-sm text-slate-900"
        />
      </div>
      <div className="mt-10 text-xl font-bold text-slate-700">Proof Method</div>
      <Select
        className="text-base mt-5 w-2/4 text-slate-900"
        size="large"
        defaultValue="manual"
      >
        <Option value="manual">Manual</Option>
      </Select>
      <div className="text-xl font-bold mt-10 text-slate-700">Description</div>
      <div className="mt-5">
        <Editor
          options={editorConfig}
          defaultValue={new Delta()}
          onTextChange={textChange}
          className="mt-5 rounded-sm text-slate-900"
        />
      </div>
      <div className="mt-10">
        <Button
          loading={submitLoading}
          size="large"
          type="primary"
          onClick={createNewReward}
        >
          Submit
        </Button>
        <Button
          size="large"
          className="ml-4"
          onClick={cancelCreate}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
