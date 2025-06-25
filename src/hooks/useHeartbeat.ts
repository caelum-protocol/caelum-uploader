import { useEffect, useRef } from "react";

export default function useHeartbeat() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker("/workers/heartbeat-worker.js");
    worker.postMessage("start");
    workerRef.current = worker;

    return () => {
      worker.postMessage("stop");
      worker.terminate();
    };
  }, []);
}