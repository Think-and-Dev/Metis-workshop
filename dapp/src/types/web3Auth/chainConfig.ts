import { CHAIN_NAMESPACES } from "@web3auth/base";

export const CHAIN_CONFIG = {
    metis_testnet: {
        displayName: "Metis Testnet",
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x440",
        rpcTarget: `https://andromeda.metis.io/?owner=1088`,
        blockExplorer: "https://andromeda-explorer.metis.io/",
        ticker: "Metis",
        tickerName: "Metis",
    },
} as const;

export type CHAIN_CONFIG_TYPE = keyof typeof CHAIN_CONFIG;