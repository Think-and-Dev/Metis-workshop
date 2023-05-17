import { useContext, useEffect, useState } from "react"
import { Loader } from "./Loader"
import { ConnectButton } from "./ConnectButton"
import { useAccount } from "wagmi"

export const Header = () => {
    // const { address, isConnected } = useAccount()
    // console.log("wagmi", address, isConnected)
    // const { getUserInfo, logout, publicKey, isLoading } = useContext(web3AuthContext) as IWeb3AuthContext
    const [userData, setUserData] = useState<any>({})

    // useEffect(() => {
    //     const getUser = async () => {
    //         const user = await getUserInfo()
    //         setUserData(user)
    //     }
    //     if (publicKey)
    //         getUser()
    // }, [publicKey])

    // const getOffuscatedPublicKey = (publicKey: string) => {
    //     return `${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 4, publicKey.length)}`
    // }

    return <>
    </>

    // return <div className="navbar bg-base-100">
    //     <div className="flex-1">
    //         <a href="https://thinkanddev.com/" target="_blank" rel="noopener" className="btn btn-ghost normal-case text-xl">ThinkNDev</a>
    //     </div>
    //     {
    //         !publicKey ? <ConnectButton />
    //             :
    //             isLoading ? <Loader /> :
    //                 <div className="flex-none">
    //                     <div className="dropdown dropdown-end">
    //                         <div className="flex flex-row justify-center items-center gap-2">
    //                             <div className="text-end">
    //                                 <p className="text-gray-600">{publicKey ? getOffuscatedPublicKey(publicKey) : ""}</p>
    //                                 <p className="text-xs">{userData?.name}</p>
    //                             </div>
    //                             <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
    //                                 <div className="w-10 rounded-full">
    //                                     <img src={userData?.profileImage || "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"} alt="Avatar" />
    //                                 </div>
    //                             </label>
    //                         </div>
    //                         <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
    //                             <li><button onClick={() => logout()}>Logout</button></li>
    //                         </ul>
    //                     </div>
    //                 </div>
    //     }

    // </div>
}