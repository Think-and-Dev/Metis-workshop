import { Loader } from "./Loader"
import { ConnectButton } from "./ConnectButton"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useRouter } from "next/router"

export const Header = () => {
    const router = useRouter();
    const { address, isConnected, isConnecting } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const getOffuscatedPublicKey = (publicKey: string) => {
        return `${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 4, publicKey.length)}`
    }

    return <div className="navbar bg-base-100">
        <div className="w-full flex-row justify-between h-20 px-4">
            <div className="cursor-pointer" onClick={() => router.push('/')}>
                <b>Metis Buidl Hour 2023</b>
            </div>
            <div>
                <a href="https://thinkanddev.com/" target="_blank" rel="noopener" className="btn btn-ghost normal-case text-xl">
                    <img alt='Think&Dev' src="./tyd/tyd_blue.png" className="h-48" />
                </a>
            </div>
            <div>
                <a href="https://www.metis.io/" target="_blank" rel="noopener" className="btn btn-ghost normal-case text-xl">
                    <img alt='Metis' src="./metis/png/BlackGreen@3x.png" className="h-24" />
                </a>
            </div>
            <div>
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
                                        <li><button onClick={() => router.push('/profile')}>Profile</button></li>
                                        <li><button onClick={() => disconnect()}>Logout</button></li>
                                    </ul>
                                </div>
                            </div>
                }
            </div>
        </div>
    </div>
}