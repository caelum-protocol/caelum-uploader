let interval = null;

self.onmessage = (event) => {
  if (event.data === 'start') {
    if (!interval) {
      interval = setInterval(() => {
        self.postMessage({ type: 'heartbeat', timestamp: Date.now() });
      }, 30_000);
    }
  }
  if (event.data === 'stop') {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
};

self.onclose = () => {
  if (interval) {
    clearInterval(interval);
  }
};
