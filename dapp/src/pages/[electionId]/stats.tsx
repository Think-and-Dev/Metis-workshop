import { useVoteContract } from '@/hooks/useVoteContract';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }:
    { cx: any, cy: any, midAngle: any, innerRadius: any, outerRadius: any, percent: any, index: any }
) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CrownSvg = () => {
    return <svg fill='yellow' height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512" >
        <polygon points="0,443.733 0,68.267 17.067,68.267 136.533,187.733 256,68.267 375.467,187.733 
   494.933,68.267 512,68.267 512,443.733 "/>
        <polygon points="494.933,68.267 375.467,187.733 256.002,68.267 256,68.267 256,443.733 512,443.733 
   512,68.267 "/>
    </svg>
}

const Stats: NextPage = () => {
    const router = useRouter();
    const electionId = parseInt(router.query.electionId as string);
    const { candidates, getCandidateVotes, isElectionActive } = useVoteContract({ electionId })
    const votesA = getCandidateVotes({ electionId, candidateAddress: candidates[0] })
    const votesB = getCandidateVotes({ electionId, candidateAddress: candidates[1] })

    const votes = [
        { name: candidates[0], value: votesA },
        { name: candidates[1], value: votesB }
    ]

    if (!isElectionActive?.data) return <>
        <div className="flex">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Election {electionId} hasn't started yet</h3>
                <p className="py-4">Please come back when the timer end!</p>
                <div className="modal-action">
                    <label htmlFor="my-modal" className="btn" onClick={() => router.push(`/${electionId}`)}>Yay!</label>
                </div>
            </div>
        </div>
    </>

    return <>
        <h2 className='mt-16 text-center text-white font-bold text-5xl'>Status of Election {electionId}</h2>
        <div className='w-screen h-[400px] overflow-hidden flex justify-center items-center '>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={800} height={800} style={{ transform: 'scale(2)' }}>
                    <Pie
                        data={votes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        label={renderCustomizedLabel}
                        fill="#8884d8"
                        dataKey="value"
                        height={800}
                        width={800}
                    >
                        {votes?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className='w-full text-center flex justify-center'>
            <ul className='flex flex-col gap-2'>
                <li className='flex flex-row gap-2'>
                    <p className='text-white text-xl'>Candidate address <span className='font-bold'>{candidates[0]}</span> : {votesA}</p>
                    {
                        votesA > votesB ? <CrownSvg /> : <></>
                    }
                </li>
                <li className='flex flex-row gap-2'>
                    <p className='text-white text-xl'>Candidate address <span className='font-bold'>{candidates[1]}</span> : {votesB}</p>
                    {
                        votesB > votesA ? <CrownSvg /> : <></>
                    }
                </li>
            </ul>
        </div >
    </>
}

export default Stats;