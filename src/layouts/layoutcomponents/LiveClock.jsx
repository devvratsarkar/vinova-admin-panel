import React, { useEffect, useState } from "react";
import moment from "moment";

const LiveClock = React.memo(() => {
  const [now, setNow] = useState(() => moment());

  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-clock" aria-label={now.format("DD-MM-YYYY hh:mm:ss A")}>
      <span className="live-clock__date">{now.format("DD-MM-YYYY")}</span>
      <span className="live-clock__time">{now.format("hh:mm:ss A")}</span>
    </div>
  );
});

export default LiveClock;
