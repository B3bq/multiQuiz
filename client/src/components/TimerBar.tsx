import { useEffect, useState } from "react";

interface Props {
  endTime: number;
}

export default function TimerBar({ endTime }: Props) {
  const [percent, setPercent] = useState(100);

  useEffect(() => {

    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      const p = Math.max(0, remaining / 15000 * 100);
      setPercent(p);
    }, 100);

    return () => clearInterval(interval);

  }, [endTime]);

  return (
    <div style={{ background: "#ddd", height: 10 }}>
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          background: "green"
        }}
      />
    </div>
  );
}