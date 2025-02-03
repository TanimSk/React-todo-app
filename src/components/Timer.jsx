import React, { useState, useEffect } from "react";

const Timer = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = Math.max(new Date(deadline).getTime() - Date.now(), 0);
            setTimeLeft(remainingTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    const formatTime = (time) => String(time).padStart(2, "0");

    const days = formatTime(Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    const hours = formatTime(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = formatTime(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = formatTime(Math.floor((timeLeft % (1000 * 60)) / 1000));

    return (
        <div className="flex flex-col items-center space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 my-[0]">Time Remaining</h2>
            <div className="flex space-x-4 p-1 bg-white shadow-md rounded-lg">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{days}</span>
                    <span className="text-sm text-gray-500">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{hours}</span>
                    <span className="text-sm text-gray-500">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{minutes}</span>
                    <span className="text-sm text-gray-500">Min</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{seconds}</span>
                    <span className="text-sm text-gray-500">Sec</span>
                </div>
            </div>
        </div>
    );
};

export default Timer;