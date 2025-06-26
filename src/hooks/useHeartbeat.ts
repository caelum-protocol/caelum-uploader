import { useEffect, useRef } from "react";

// Optional: Accept a callback to handle the heartbeat
export function useHeartbeat(onHeartbeat?: (timestamp: number) => void) {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    // Prevent running on SSR
    if (typeof window === "undefined") return;

    // Create the web worker (path may need adjusting based on your structure)
    const worker = new Worker(
      new URL("../workers/my-app-heartbeat-worker.js", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    // Start the heartbeat worker
    worker.postMessage("start");

    // Listen for messages from the worker
    worker.onmessage = (event) => {
      if (event.data?.type === "heartbeat") {
        onHeartbeat?.(event.data.timestamp);
      }
    };

    // Cleanup on page unload or unmount
    const handleUnload = () => {
      worker.postMessage("stop");
      worker.terminate();
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [onHeartbeat]);
}
