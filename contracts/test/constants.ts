import {keccak256, toUtf8Bytes} from 'ethers/lib/utils'

export const CANDIDATE_STATUS = keccak256(toUtf8Bytes('CANDIDATE_STATUS'))
export const ELECTED_STATUS = keccak256(toUtf8Bytes('ELECTED_STATUS'))

export const ELECTION_POSITION = keccak256(toUtf8Bytes('METIS_PRESIDENT'))
export const PARTY_ONE = keccak256(toUtf8Bytes('PARTY_ONE'))
export const PARTY_TWO = keccak256(toUtf8Bytes('PARTY_TWO'))
