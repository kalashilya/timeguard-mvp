(() => {
  const lockMap = new Map();

  window.TimeGuardHardening = {
    canSubmit(key, delay = 2500) {
      const now = Date.now();
      const last = lockMap.get(key) || 0;
      if (now - last < delay) return false;
      lockMap.set(key, now);
      return true;
    },
    cleanText(value, max = 140) {
      return String(value || '').trim().slice(0, max);
    },
    validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
    },
    timeToMinutes(value) {
      const [h, m] = String(value || '00:00').split(':').map(Number);
      return h * 60 + m;
    }
  };
})();
