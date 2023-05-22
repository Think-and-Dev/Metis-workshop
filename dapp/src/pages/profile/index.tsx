import { useSbtContract } from "@/hooks/useSbtContract";
import { NextPage } from "next";

const Profile: NextPage = () => {
    const { getTokenUri, userSbtTokenId } = useSbtContract();
    const tokenUri = getTokenUri({ tokenId: userSbtTokenId });

    return <div className="bg-gray-100 h-screen flex justify-center items-center">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-5">
            <img className="w-32 h-32 rounded-full mx-auto" src={tokenUri as string} alt="Profile picture" style={{ objectFit: 'contain' }} />
            <h2 className="text-center text-2xl font-semibold mt-3">John Doe</h2>
            <p className="text-center text-gray-600 mt-1">Software Engineer</p>
            <div className="flex justify-center mt-5">
                <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">Twitter</a>
                <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">LinkedIn</a>
                <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">GitHub</a>
            </div>
            <div className="mt-5">
                <h3 className="text-xl font-semibold">Bio</h3>
                <p className="text-gray-600 mt-2">John is a software engineer with over 10 years of experience in developing web and mobile applications. He is skilled in JavaScript, React, and Node.js.</p>
            </div>
        </div>
    </div>
}

export default Profile;