import { bytes32ToString } from "@/utils/parser";

export interface Candidate {
    party: string;
    status: string;
    votes: number;
}

export const parseToCandidates = (data: any) => {
    if (!data) return [];

    let candidates = [];
    for (let index = 0; index < data.length; index++) {
        candidates.push(data[index])
    }

    return candidates;
}

export const parseToCandidate = (data: any): Candidate => {
    return {
        party: bytes32ToString(data[0]),
        status: data[1],
        votes: Number(data[2]),
    }
}