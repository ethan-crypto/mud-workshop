// https://eips.ethereum.org/EIPS/eip-4337
// The lower 64 bits of the nonce are the sequence, the upper 192 bits are the key.
// Keys don't have to be sequential, so we can just use the current timestamp.
// Note: this breaks down if it's called multiple times in the same millisecond.
export function getNonce(): bigint {
  return BigInt(Date.now()) << 64n;
}
