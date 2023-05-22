import { bytes32ToString } from "@/utils/parser";

export interface Election {
    position: string;
    startTime: number;
    endTime: number;
}


export const parseToElection = (election: any): Election => {
    if (!election) return {} as Election;

    return {
        position: bytes32ToString(election[0] || ""),
        startTime: Number(election[1]),
        endTime: Number(election[2]),
    };
}