import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { useRouter } from "next/router";
import { useVoteContract } from "@/hooks/useVoteContract";

export const Home = () => {
    const { electionIdCounter } = useVoteContract({});

    const getLast3Events = () => {
        if (!electionIdCounter) return [];
        const events = [];

        for (let index = 0; index < Number(electionIdCounter) - 1; index++) {
            events.push(index);
        }

        return events.reverse();
    }

    return (
        <div className="h-screen w-full bg-white">
            <main>
                <div className="container mx-auto px-6 py-16 pt-28 text-center">
                    <div className="mx-auto max-w-lg">
                        <h1 className="text-3xl font-bold text-gray-800  md:text-4xl">Voting System Interface with Blockchain Power</h1>
                        <p className="mt-6 text-gray-500 ">Empowering citizens through secure and transparent digital voting solutions.</p>
                    </div>
                </div>

                <section className="bg-white">
                    <div className="container mx-auto px-6 py-28">
                        <h1 className="text-2xl font-semibold text-gray-800 lg:text-4xl">Latest votings</h1>

                        <div className="mt-8 lg:-mx-12 lg:flex xl:mt-16">
                            <div className="mt-8 flex-1 lg:mx-12 lg:mt-0">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                                    {
                                        getLast3Events().map((votationId) => (
                                            <HomeCard votationId={votationId} key={votationId} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

const useRandomImage = () => {
    const [image, setImage] = useState<string>();
    const [isFetchingImage, setIsFetchingImage] = useState<boolean>(false);

    useEffect(() => {
        const getRandomImage = async () => {
            try {
                setIsFetchingImage(true);
                const response = await fetch('https://picsum.photos/600', {
                    method: "GET",
                });

                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);

                setImage(imageUrl);
                setIsFetchingImage(false);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        };

        if (!isFetchingImage && !image) {
            getRandomImage();
        }
    }, [isFetchingImage, image]);

    return { image, isFetchingImage };
};

const HomeCard = ({ votationId }: { votationId: number }) => {
    const { image, isFetchingImage } = useRandomImage();
    const router = useRouter();

    return (
        <div>
            <div className="flex justify-center items-center h-96 w-full overflow-hidden" onClick={() => router.push(`/${votationId + 1}`)}>
                {isFetchingImage ? (
                    <Loader />
                ) : (
                    <img className="h-96 w-full rounded-lg object-fill cursor-pointer hover:scale-105  transition-all" src={image} alt="Cover Image" style={{ objectFit: 'fill' }} />
                )}
            </div>
            <div className="flex flex-row justify-between items-center">
                <h2 className="mt-4 text-2xl font-semibold capitalize text-gray-800">Votation {votationId + 1}</h2>
                <svg onClick={() => router.push(`/${votationId + 1}/stats`)} className="cursor-pointer mt-4  mx-2" fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 459.75 459.75">
                    <g>
                        <path d="M447.652,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138
		c6.681,0,12.098-5.416,12.098-12.098v-95.805C459.75,309.546,454.334,304.13,447.652,304.13z"/>
                        <path d="M348.798,258.13H308.66c-6.681,0-12.098,5.416-12.098,12.097v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138
		c6.681,0,12.097-5.416,12.097-12.098V270.228C360.896,263.546,355.48,258.13,348.798,258.13z"/>
                        <path d="M151.09,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138
		c6.681,0,12.098-5.416,12.098-12.098v-95.805C163.188,309.546,157.771,304.13,151.09,304.13z"/>
                        <path d="M52.236,258.13H12.098C5.416,258.13,0,263.546,0,270.228v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138
		c6.681,0,12.097-5.416,12.097-12.098V270.228C64.333,263.546,58.917,258.13,52.236,258.13z"/>
                        <path d="M249.944,196.968h-40.138c-6.681,0-12.098,5.416-12.098,12.098v202.967c0,6.681,5.416,12.098,12.098,12.098h40.138
		c6.681,0,12.098-5.416,12.098-12.098V209.066C262.042,202.384,256.625,196.968,249.944,196.968z"/>
                        <path d="M436.869,244.62c8.14,0,15-6.633,15-15v-48.479c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v12.119L269.52,40.044
		c-3.148-3.165-7.536-4.767-11.989-4.362c-4.446,0.403-8.482,2.765-11.011,6.445L131.745,209.185L30.942,144.969
		c-6.987-4.451-16.26-2.396-20.71,4.592c-4.451,6.987-2.396,16.259,4.592,20.71l113.021,72c2.495,1.589,5.286,2.351,8.046,2.351
		c4.783,0,9.475-2.285,12.376-6.507L261.003,74.025L400.8,214.62h-12.41c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15
		c6.71,0,41.649,0,48.443,0H436.869z"/>
                    </g>
                </svg>
            </div>

        </div>
    );
};