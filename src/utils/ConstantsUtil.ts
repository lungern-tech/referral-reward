const projectId = process.env['NEXT_PUBLIC_PROJECT_ID']
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}
export const WALLET_URL = process.env['WALLET_URL'] || 'https://react-wallet.walletconnect.com/'

export const CUSTOM_WALLET = 'wc:custom_wallet'

let storedCustomWallet
if (typeof window !== 'undefined') {
  storedCustomWallet = localStorage.getItem(CUSTOM_WALLET)
}

const customWallet = storedCustomWallet ? [JSON.parse(storedCustomWallet)] : []

export const ConstantsUtil = {
  SigningSucceededToastTitle: 'Signing Succeeded',
  SigningFailedToastTitle: 'Signing Failed',
  TestIdSiweAuthenticationStatus: 'w3m-authentication-status',
  Metadata: {
    name: 'Web3Modal',
    description: 'Web3Modal Laboratory',
    url: 'https://lab.web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    verifyUrl: ''
  },
  CustomWallets: [
    ...customWallet,
  ],
  ProjectId: projectId
}
