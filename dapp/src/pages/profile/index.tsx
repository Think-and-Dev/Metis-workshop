import { useSbtContract } from "@/hooks/useSbtContract";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useBalance, useNetwork } from "wagmi";

const Profile: NextPage = () => {
    const router = useRouter();
    const { address } = useAccount();
    const { data: balance } = useBalance({
        address: address,
    })
    const { chain } = useNetwork()
    const { getTokenUri, userSbtTokenId } = useSbtContract();
    const tokenUri = getTokenUri({ tokenId: userSbtTokenId });

    if (!address) router.replace('/');

    return <div className="bg-gray-100 h-screen flex flex-col items-center">
        <div className="mt-48 mx-auto bg-white rounded-lg shadow-md p-5" style={{ width: '800px', height: '400px' }}>
            <img className="w-32 h-32 rounded-full mx-auto" src={tokenUri as string} alt="Profile picture" style={{ objectFit: 'contain' }} />
            <h2 className="text-center text-2xl font-semibold mt-3">#{String(userSbtTokenId).padStart(6, '0')}</h2>
            <p className="text-center text-gray-600 mt-1">Software Engineer</p>

            <div className="w-full flex flex-col text-center py-8 gap-2">
                <p className=" text-gray-600">Chain : {chain?.name}</p>
                <p className=" text-gray-600">Balance: {balance?.formatted} {balance?.symbol}</p>
                <p className=" text-gray-600">Address : {address}</p>
            </div>
        </div>
    </div>
}

export default Profile;