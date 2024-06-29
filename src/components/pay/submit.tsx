"use client"
import { useWriteContract } from 'wagmi'
import { abi } from '@/abi/RewardFactory.sol/RewardFactory.json'
import { sepolia } from "viem/chains"
import { Button, notification } from "antd"
import { parseEther } from "viem"
import { watchContractEvent } from '@wagmi/core'
import { wagmiConfig } from '@/context/wallet'
import { LoadingOutlined } from '@ant-design/icons'


export default function ({ account, taskId }: { account: `0x${string}`, taskId: string }) {

  const { writeContract } = useWriteContract()

  const createReward = () => {
    writeContract({
      abi,
      address: '0xa1c02b0ce440104139c2b8d498f84cc343e273f0',
      functionName: 'createNewReward',
      args: [1000, 10000000, 0, 0],
      chain: sepolia,
      account,
      chainId: sepolia.id,
      value: parseEther('0.01')
    }, {
      onSuccess: (data) => {
        console.log('success: ', data)

        notification.info({
          message: 'Success',
          description: 'Reward created successfully',
          icon: <LoadingOutlined style={{ color: 'green' }} />,
          duration: 0
        })

        const unwatch = watchContractEvent(wagmiConfig, {
          address: '0xa1c02b0ce440104139c2b8d498f84cc343e273f0',
          abi,
          onLogs(logs) {
            console.log('New logs!', logs)
          },
        })
      },
      onError(error, variables, context) {
        console.log('error: ', error, variables, context)
      },
    },)
  }

  return (
    <>
      <Button onClick={createReward}>提交</Button>
    </>
  )
}