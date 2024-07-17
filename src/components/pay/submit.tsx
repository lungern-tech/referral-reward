'use client'
import { abi } from '@/abi/RewardFactory.sol/RewardFactory.json'
import UserContext from '@/context/UserContext'
import { TaskStatus } from '@/models/Task'
import ChainMap from '@/utils/ChainMap'
import { Button, Modal, notification } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { decodeEventLog, parseEther } from 'viem'

import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export default function ({ children, reward, reward_count, chain, start, end, task_id, className }: { reward: number, reward_count: number, chain: number, start: number, end: number, children: React.ReactNode, task_id: string, className: string }) {
  const { user } = useContext(UserContext)

  const router = useRouter()
  const { data: hash, writeContract } = useWriteContract()
  const { isLoading, isSuccess, data } = useWaitForTransactionReceipt({
    hash
  })

  const chainConfig = ChainMap[chain]
  const realChain = chainConfig.chain


  const createReward = () => {
    if (isLoading) return
    console.log(reward, realChain.nativeCurrency.decimals)
    const rewardInDecimals = Math.round(reward * 10 ** realChain.nativeCurrency.decimals)
    const totalCost = Math.round(reward_count * rewardInDecimals).toString()
    writeContract({
      abi,
      address: chainConfig.factory_address,
      functionName: 'createNewReward',
      args: [Number(reward_count), rewardInDecimals.toString(), Math.round(start / 1000), Math.round(end / 1000), parseEther('0.00001', 'gwei')],
      chain: realChain,
      account: user.wallet as `0x${string}`,
      chainId: realChain.id,
      value: totalCost
    }, {
      onSuccess: async (data) => {
        fetch('/api/task/update', {
          method: 'POST',
          body: JSON.stringify({
            deploy_hash: hash,
            task_id,
            status: TaskStatus.Deploying
          })
        }).then(res => res.json()).then(() => {
          console.log('data: ', data)
          notification.success({
            message: 'Success',
            description: (
              <div>
                Contract create transition has started. Check <a target='_blank'
                  href={`${realChain.blockExplorers.default.url}/tx/${data}`}
                  rel="noreferrer">{data}</a> for more information
              </div>
            ),
            duration: 10,
            showProgress: true,
            pauseOnHover: true
          })
        })
      },
      onError(error, variables, context) {
        console.log('error: ', error, 'variables', variables, 'context', context)
        console.log(arguments)
      }
    })
  }

  useEffect(() => {
    if (isSuccess) {
      data.logs.forEach(log => {
        try {
          const decodedLog = decodeEventLog({
            abi,
            data: log.data,
            topics: log.topics
          })
          if (decodedLog.eventName === 'CreateRewardSuccess') {
            console.log('decodeEventLog: ', decodedLog)
            const emitArgs = decodedLog.args as unknown as { contractAddress: string, reward_address: string }
            const contractAddress = emitArgs.contractAddress || emitArgs.reward_address
            fetch('/api/task/update', {
              method: 'POST',
              body: JSON.stringify({
                contract_address: contractAddress,
                deploy_hash: hash,
                task_id,
                status: TaskStatus.Deployed
              })
            }).then(async res => await res.json()).then(() => {
              Modal.success({
                title: 'Contract Deployed Successfully',
                content: (
                  <div>
                    Contract has been deployed successfully.  You can check <a target='_blank'
                      href={`${realChain.blockExplorers.default.url}/address/${contractAddress}`}
                      rel="noreferrer">{contractAddress}</a> for more information
                  </div>
                ),
                onOk: () => {
                  router.push('/account/created')
                },
                onCancel: () => {
                  router.refresh()
                }
              }
              )
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
      <Button className={className}
        loading={isLoading}
        onClick={createReward}>{
          children
        }</Button>
    </>
  )
}
