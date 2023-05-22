import { BytesLike, parseBytes32String } from 'ethers/lib/utils'

export function bytes32ToString(bytes32: BytesLike): string {
    if (!bytes32) return "";

    return ""
    // return parseBytes32String(bytes32)
}