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

  const realChain = ChainMap[chain].chain

  const createReward = () => {
    if (isLoading) return
    writeContract({
      abi,
      address: '0xa64a313c856b93f23e423924d84ab6078f995059',
      functionName: 'createNewReward',
      args: [Math.round(reward * 10 ** realChain.nativeCurrency.decimals), reward_count, start, end],
      chain: realChain,
      account: user.wallet as `0x${string}`,
      chainId: realChain.id,
      value: parseEther('0.01')
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
        console.log('error: ', error, variables, context)
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
            const contractAddress = (decodedLog.args as unknown as { contractAddress: string }).contractAddress
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
