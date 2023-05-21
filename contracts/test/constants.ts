import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'

export const CANDIDATE_STATUS = keccak256(toUtf8Bytes('CANDIDATE_STATUS'))
export const ELECTED_STATUS = keccak256(toUtf8Bytes('ELECTED_STATUS'))

export const ELECTION_POSITION = keccak256(toUtf8Bytes('METIS_PRESIDENT'))
