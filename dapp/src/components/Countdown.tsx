import { useEffect, useState } from "react";

export const CountDown = ({ epochTime, onFinishCounter }: { epochTime: number, onFinishCounter: () => void }) => {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining(epochTime));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [epochTime]);

    useEffect(() => {
        calculateTimeRemaining(epochTime)
    }, [epochTime])

    function calculateTimeRemaining(epochTime: number): { days: number, hours: number, minutes: number, seconds: number } {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = epochTime - currentTime;

        if (timeRemaining <= 0) {
            onFinishCounter();
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const secondsPerMinute = 60;
        const secondsPerHour = 60 * secondsPerMinute;
        const secondsPerDay = 24 * secondsPerHour;

        const days = Math.floor(timeRemaining / secondsPerDay);
        const hours = Math.floor((timeRemaining % secondsPerDay) / secondsPerHour);
        const minutes = Math.floor((timeRemaining % secondsPerHour) / secondsPerMinute);
        const seconds = Math.floor(timeRemaining % secondsPerMinute);

        return { days, hours, minutes, seconds };
    }

    return <div className="flex flex-col">
        <h2 className="text-center text-white text-3xl mb-8">Time remaining until votation start</h2>
        <div className="grid grid-flow-col gap-10 text-center text-white  auto-cols-max">
            <div className="flex flex-col text-3xl">
                <span className="countdown font-mono text-8xl">
                    {String(timeRemaining.days.toString()).padStart(2, '0')}
                </span>
                days
            </div>
            <div className="flex flex-col text-3xl">
                <span className="countdown font-mono text-8xl">
                    {String(timeRemaining.hours.toString()).padStart(2, '0')}
                </span>
                hours
            </div>
            <div className="flex flex-col text-3xl">
                <span className="countdown font-mono text-8xl">
                    {String(timeRemaining.minutes.toString()).padStart(2, '0')}
                </span>
                min
            </div>
            <div className="flex flex-col text-3xl">
                <span className="countdown font-mono text-8xl">
                    {String(timeRemaining.seconds.toString()).padStart(2, '0')}
                </span>
                sec
            </div>
        </div>
    </div>
}