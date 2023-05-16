import { web3AuthContext } from "@/contexts/web3AuthContext"
import { IWeb3AuthContext } from "@/types/contexts/IWeb3AuthContext"
import { useContext, useEffect, useState } from "react"
import { Loader } from "./Loader"
import { ConnectButton } from "./ConnectButton"

export const Header = () => {
    const { getUserInfo, logout, publicKey, isLoading } = useContext(web3AuthContext) as IWeb3AuthContext
    const [userData, setUserData] = useState<any>({})

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserInfo()
            setUserData(user)
        }
        if (publicKey)
            getUser()
    }, [publicKey])

    const getOffuscatedPublicKey = (publicKey: string) => {
        return `${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 4, publicKey.length)}`
    }

    return <div className="navbar bg-base-100">
        <div className="flex-1">
            <a href="https://thinkanddev.com/" target="_blank" rel="noopener" className="btn btn-ghost normal-case text-xl">ThinkNDev</a>
        </div>
        {
            !publicKey ? <ConnectButton />
                :
                isLoading ? <Loader /> :
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <div className="flex flex-row justify-center items-center gap-2">
                                <div className="text-end">
                                    <p className="text-gray-600">{publicKey ? getOffuscatedPublicKey(publicKey) : ""}</p>
                                    <p className="text-xs">{userData?.name}</p>
                                </div>
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={userData?.profileImage} alt="P" />
                                    </div>
                                </label>
                            </div>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li><button onClick={() => logout()}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
        }

    </div>
}