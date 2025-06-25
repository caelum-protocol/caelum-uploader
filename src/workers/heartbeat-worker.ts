/// <reference lib="webworker" />

const HEARTBEAT_INTERVAL = 30000;
let timer: ReturnType<typeof setInterval> | undefined;

function start() {
  timer = setInterval(() => {
    self.postMessage({ type: "heartbeat", timestamp: Date.now() });
  }, HEARTBEAT_INTERVAL);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  self.close();
}

self.addEventListener("message", (event) => {
  if (event.data === "stop") stop();
});

start();