import React, { useEffect, useState } from "react";
import moment from "moment";

const LiveClock = React.memo(() => {
  const [time, setTime] = useState(
    moment().format("DD-MM-YYYY hh:mm:ss A")
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format("DD-MM-YYYY hh:mm:ss A"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-clock text-dark fw-bold px-3 py-2 border rounded-3 bg-light d-flex align-items-center">
      {time}
    </div>
  );
});

export default LiveClock;
