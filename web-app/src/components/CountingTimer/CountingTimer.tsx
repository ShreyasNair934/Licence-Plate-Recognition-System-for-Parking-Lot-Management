"use client";

import React, { useState, useEffect } from "react";

const CountingTimer = (props: any) => {
    const {
        entryTime,
        exitTime = null,
        feeCalculator = false,
        dollarsPerMinute = 1,
    } = props;

    const convertToIsoString = (input: any) => {
        // Check if the input is in ISO format (by looking for the "T" separator)
        if (input.includes("T")) {
            return input; // It's already in ISO format, so return it as is
        } else {
            // Assume it's a Unix timestamp string and convert it
            var timestamp = Math.ceil(parseFloat(input) * 1000);

            var date = new Date(timestamp); // Multiply by 1000 to convert seconds to milliseconds
            return date.toISOString();
        }
    };

    // Create a state variable to store the elapsed minutes
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        // Function to update the elapsed minutes
        const updateElapsedMinutes = () => {
            // Calculate the time difference between now and the entry time
            const currentTime =
                exitTime === null
                    ? new Date()
                    : new Date(convertToIsoString(exitTime));
            const entryTimeDate = new Date(convertToIsoString(entryTime));
            const timeDifference =
                currentTime.getTime() - entryTimeDate.getTime();
            const minutesDifference = Math.floor(timeDifference / (1000 * 60));
            setElapsedMinutes(minutesDifference);
        };

        // Update the elapsed minutes initially
        updateElapsedMinutes();

        // Set up an interval to update the elapsed minutes every minute
        const intervalId = setInterval(updateElapsedMinutes, 60000); // 60000 milliseconds = 1 minute

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [entryTime]);

    // Calculate hours and minutes
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;

    return (
        <div>
            {feeCalculator ? (
                <>${(elapsedMinutes * dollarsPerMinute).toFixed(2)}</>
            ) : (
                <>
                    {hours}h {minutes < 10 ? `0${minutes}` : minutes}min
                </>
            )}
        </div>
    );
};

export default CountingTimer;
