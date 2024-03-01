import React, { useState, useEffect } from "react";

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="clock">
      <h3>{currentTime}</h3>
    </div>
  );
};

export default Clock;