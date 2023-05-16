import { SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { IWalletProvider } from "./IWalletProvider";

const ethProvider = (provider: SafeEventEmitterProvider): IWalletProvider => {
    const getAccounts = async () => {
        try {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();

            // Get user's Ethereum public address
            const address = await signer.getAddress();

            return address;
        } catch (error) {
            return error;
        }
    };

    const getBalance = async () => {
        try {
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();

            // Get user's Ethereum public address
            const address = await signer.getAddress();

            // Get user's balance in ether
            const balance = ethers.utils.formatEther(
                await ethersProvider.getBalance(address) // Balance is in wei
            );

            return balance;
        } catch (error) {
            return error as string;
        }
    };

    // const signMessage = async () => {
    //     try {
    //         const ethersProvider = new ethers.providers.Web3Provider(provider);
    //         const signer = ethersProvider.getSigner();

    //         const originalMessage = "YOUR_MESSAGE";

    //         // Sign the message
    //         const signedMessage = await signer.signMessage(originalMessage);

    //         return signedMessage;
    //     } catch (error) {
    //         return error as string;
    //     }
    // };

    // const signAndSendTransaction = async () => {
    //     try {
    //         const web3 = new Web3(provider as any);
    //         const accounts = await web3.eth.getAccounts();
    //         console.log("pubKey", accounts);
    //         const txRes = await web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], value: web3.utils.toWei("0.01") });
    //         uiConsole("txRes", txRes);
    //     } catch (error) {
    //         console.log("error", error);
    //         uiConsole("error", error);
    //     }
    // };

    // const signTransaction = async () => {
    //     try {
    //         const web3 = new Web3(provider as any);
    //         const accounts = await web3.eth.getAccounts();
    //         console.log("pubKey", accounts);
    //         // only supported with social logins (openlogin adapter)
    //         const txRes = await web3.eth.signTransaction({ from: accounts[0], to: accounts[0], value: web3.utils.toWei("0.01") });
    //         uiConsole("txRes", txRes);
    //     } catch (error) {
    //         console.log("error", error);
    //         uiConsole("error", error);
    //     }
    // };
    return { getAccounts, getBalance };
};

export default ethProvider;