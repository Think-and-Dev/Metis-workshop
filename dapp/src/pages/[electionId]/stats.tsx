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

const Stats: NextPage = () => {
    const router = useRouter();
    const electionId = parseInt(router.query.electionId as string);
    const { candidates, getCandidateVotes } = useVoteContract({ electionId })
    const votesA = getCandidateVotes({ electionId, candidateAddress: candidates[0] })
    const votesB = getCandidateVotes({ electionId, candidateAddress: candidates[1] })

    const votes = [
        { name: candidates[0], value: votesA },
        { name: candidates[1], value: votesB }
    ]

    return <div className='w-screen h-[800px] overflow-hidden flex justify-center items-center '>
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
}

export default Stats;