import { Loader } from "./Loader"
import { ConnectButton } from "./ConnectButton"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'

export const Header = () => {
    const { address, isConnected, isConnecting } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const getOffuscatedPublicKey = (publicKey: string) => {
        return `${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 4, publicKey.length)}`
    }

    return <div className="navbar bg-base-100">
        <div className="flex-1">
            <a href="https://thinkanddev.com/" target="_blank" rel="noopener" className="btn btn-ghost normal-case text-xl">ThinkNDev</a>
        </div>
        {
            !isConnected ? <ConnectButton />
                :
                isConnecting ? <Loader /> :
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <div className="flex flex-row justify-center items-center gap-2">
                                <div className="text-end">
                                    <p className="text-gray-600">{address ? getOffuscatedPublicKey(address) : ""}</p>
                                </div>
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={"https://mir-s3-cdn-cf.behance.net/user/276/6e207c112569317.5a0eeb422ad13.jpg"} alt="Avatar" />
                                    </div>
                                </label>
                            </div>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li><button onClick={() => disconnect()}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
        }

    </div>
}