import { keccak256, toHex } from 'viem'

const eventSignature = "0x47ed57bfaeeb2c5c6b0d4f139a73e362e90217ebef4193f18d65ca6944d131a7"
console.log('Event signature:', eventSignature)

// If you know the event name and parameter types, you can verify it:
const calculatedSignature = keccak256(toHex('YourEventName(address,uint256)'))
console.log('Calculated signature:', calculatedSignature)