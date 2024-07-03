"use client"
import { abi } from '@/abi/RewardFactory.sol/RewardFactory.json'
import ChainMap from '@/utils/ChainMap'
import { Button, notification } from "antd"
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { parseEther } from "viem"
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'


export default function ({ children, reward, reward_count, chain, start, end }: { reward: number, reward_count: number, chain: number, start: number, end: number, children: React.ReactNode }) {

  const session = useSession()

  const { data: hash, writeContract } = useWriteContract()

  console.log("hash: ", hash)

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const realChain = ChainMap[chain]

  console.log(realChain)

  const createReward = () => {
    writeContract({
      abi,
      address: '0xa1c02b0ce440104139c2b8d498f84cc343e273f0',
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