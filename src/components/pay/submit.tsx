'use client'
import { abi } from '@/abi/RewardFactory.sol/RewardFactory.json'
import UserContext from '@/context/UserContext'
import Task, { TaskStatus } from '@/models/Task'
import ChainMap from '@/utils/ChainMap'
import { Button, Modal, notification } from 'antd'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { decodeEventLog, parseEther } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

export default function ({
  task,
  className,
}: {
  task: Task
  className: string
}) {
  const { user } = useContext(UserContext)

  const router = useRouter()
  const { data: hash, writeContract } = useWriteContract()
  const { isLoading, isSuccess, data } = useWaitForTransactionReceipt({
    hash,
  })
  const { address } = useAccount()

  const {
    reward,
    reward_count,
    start_time,
    end_time,
    _id: task_id,
    chain,
    creator,
  } = task

  const chainConfig = ChainMap[chain]
  const realChain = chainConfig.chain

  useEffect(() => {
    if (creator && user?._id && creator !== user?._id) {
      Modal.destroyAll()
      Modal.error({
        title: 'Wrong User',
        content: 'You are not creator of this contract',
        onOk: () => {
          router.push('/')
        },
        onCancel: () => {
          router.push('/')
        },
      })
    }
  }, [creator, user?._id])

  const createReward = () => {
    if (isLoading) return

    const start = new Date(start_time).getTime()
    const end = new Date(end_time).getTime()
    console.log(reward, realChain.nativeCurrency.decimals)
    const rewardInDecimals = Math.round(
      reward * 10 ** realChain.nativeCurrency.decimals
    )
    const totalCost = Math.round(reward_count * rewardInDecimals).toString()
    writeContract(
      {
        abi,
        address: chainConfig.factory_address,
        functionName: 'createNewReward',
        args: [
          Number(reward_count),
          rewardInDecimals.toString(),
          Math.round(start / 1000),
          Math.round(end / 1000),
          parseEther('0.00001', 'gwei'),
        ],
        chain: realChain,
        account: user.wallet as `0x${string}`,
        chainId: realChain.id,
        value: totalCost,
      },
      {
        onSuccess: async (data) => {
          fetch('/api/task/update', {
            method: 'POST',
            body: JSON.stringify({
              deploy_hash: hash,
              task_id,
              status: TaskStatus.Deploying,
            }),
          })
            .then((res) => res.json())
            .then(() => {
              console.log('data: ', data)
              notification.success({
                message: 'Success',
                description: (
                  <div>
                    Contract create transition has started. Check{' '}
                    <a
                      target="_blank"
                      href={`${realChain.blockExplorers.default.url}/tx/${data}`}
                      rel="noreferrer"
                    >
                      {data}
                    </a>{' '}
                    for more information
                  </div>
                ),
                duration: 10,
                showProgress: true,
                pauseOnHover: true,
              })
            })
        },
        onError(error, variables, context) {
          console.log(
            'error: ',
            error,
            'variables',
            variables,
            'context',
            context
          )
          console.log(arguments)
          handleError(error)
        },
      }
    )
  }
  /**
   *
   * @param error ContractFunctionExecutionError | CallExecutionError | InsufficientFundsError | InvalidInputRpcError | RpcRequestError
   * @returns
   */
  const handleError = (error: Error) => {
    let tmp = error
    let errorList = []
    do {
      errorList.push(tmp)
      tmp = tmp.cause as Error
    } while (tmp.cause)
    // handle specific errors, leave others the same notice
    for (let i = errorList.length - 1; i > 0; i--) {
      let error = errorList[i]
      console.log(error.name)
      if (error.name === 'InsufficientFundsError') {
        notification.error({
          message: 'Insufficient Funds',
          description: (
            <div>
              You don't have enough funds to create this contract. Please add
              more funds to your wallet and try again.
            </div>
          ),
        })
        return
      }
    }
    notification.error({
      message: 'Contract Create Failed',
      description: (
        <div>
          Some error happens. You can try again later or call someone for help.
        </div>
      ),
    })
  }

  useEffect(() => {
    if (isSuccess) {
      data.logs.forEach((log) => {
        try {
          const decodedLog = decodeEventLog({
            abi,
            data: log.data,
            topics: log.topics,
          })
          if (decodedLog.eventName === 'CreateRewardSuccess') {
            console.log('decodeEventLog: ', decodedLog)
            const emitArgs = decodedLog.args as unknown as {
              contractAddress: string
              reward_address: string
            }
            const contractAddress =
              emitArgs.contractAddress || emitArgs.reward_address
            fetch('/api/task/update', {
              method: 'POST',
              body: JSON.stringify({
                contract_address: contractAddress,
                deploy_hash: hash,
                task_id,
                status: TaskStatus.Deployed,
              }),
            })
              .then(async (res) => await res.json())
              .then(() => {
                Modal.success({
                  title: 'Contract Deployed Successfully',
                  content: (
                    <div>
                      Contract has been deployed successfully. You can check{' '}
                      <a
                        target="_blank"
                        href={`${realChain.blockExplorers.default.url}/address/${contractAddress}`}
                        rel="noreferrer"
                      >
                        {contractAddress}
                      </a>{' '}
                      for more information
                    </div>
                  ),
                  onOk: () => {
                    router.push('/account/created')
                  },
                  onCancel: () => {
                    router.refresh()
                  },
                })
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
      <Button
        className={className}
        loading={isLoading}
        onClick={createReward}
      >
        Submit
      </Button>
    </>
  )
}
