import { IWalletProvider } from "@/core/clients/web3Auth/IWalletProvider";
import type { OpenloginUserInfo } from "@toruslabs/openlogin";
import { Web3Auth } from "@web3auth/modal";

export interface IWeb3AuthContext {
    web3Auth: Web3Auth | null;
    provider: IWalletProvider | null;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    user: Partial<OpenloginUserInfo>;
    publicKey: string;
    chain: string;
    isWeb3AuthInit: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    //signMessage: () => Promise<any>;
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
    getPublicKey: () => Promise<any>;
    // signTransaction: () => Promise<void>;
    // signAndSendTransaction: () => Promise<void>;
}   