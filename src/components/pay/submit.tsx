"use client"
import { abi } from '@/abi/RewardFactory.sol/RewardFactory.json'
import ChainMap from '@/utils/ChainMap'
import { Button, notification } from "antd"
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { decodeEventLog, parseEther } from "viem"

import { useWaitForTransactionReceipt, useWriteContract, } from 'wagmi'


export default function ({ children, reward, reward_count, chain, start, end, task_id }: { reward: number, reward_count: number, chain: number, start: number, end: number, children: React.ReactNode, task_id: string }) {

  const session = useSession()

  const { data: hash, writeContract } = useWriteContract()
  const { isLoading, isSuccess, data } = useWaitForTransactionReceipt({
    hash,
  })

  const realChain = ChainMap[chain]

  const createReward = () => {
    writeContract({
      abi,
      address: '0xa64a313c856b93f23e423924d84ab6078f995059',
      functionName: 'createNewReward',
      args: [Math.round(reward * 10 ** realChain.nativeCurrency.decimals), reward_count, start, end],
      chain: realChain,
      account: session.data.address,
      chainId: realChain.id,
      value: parseEther('0.01')
    }, {
      onSuccess: async (data) => {
        console.log('success: ', data)
      },
      onError(error, variables, context) {
        console.log('error: ', error, variables, context)
      },
    },)
  }

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Success',
        description: (
          <div>
            You have created new reward. Check <a target='_blank' href={`${realChain.blockExplorers.default.url}/tx/${hash}`}>{hash}</a> for more information
          </div>
        ),
        duration: 10,
        showProgress: true,
        pauseOnHover: true
      })

      data.logs.forEach(log => {
        try {
          const decodedLog = decodeEventLog({
            abi,
            data: log.data,
            topics: log.topics,
          })
          if (decodedLog.eventName === 'CreateRewardSuccess') {
            let contractAddress = (decodedLog.args as unknown as { contractAddress: string }).contractAddress
            fetch(`/api/task/update`, {
              method: "POST",
              body: JSON.stringify({
                contract_address: contractAddress,
                deploy_hash: hash,
                task_id,
              })
            }).then(res => res.json()).then(data => {

            })
          }
        } catch (error) {
          console.error('Failed to decode log:', error)
        }
      })

    }
  }, [isSuccess])

  return (
    <>
      <Button loading={isLoading} onClick={createReward}>{
        children
      }</Button>
    </>
  )
}