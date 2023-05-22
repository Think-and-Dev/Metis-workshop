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
            <h2 className="mt-4 text-2xl font-semibold capitalize text-gray-800">Votation {votationId + 1}</h2>
        </div>
    );
};