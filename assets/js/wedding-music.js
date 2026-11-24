(function initializeWeddingMusic() {
  const audio = document.getElementById("weddingAudio");
  const toggleButton = document.getElementById("musicToggle");
  const restartButton = document.getElementById("musicRestart");
  const requestedKey = "weddingMusicRequested";
  const positionKey = "weddingMusicPosition";
  const volumeKey = "weddingMusicVolume";
  let fadeTimer;
  let saveTimer;

  if (!audio) return;

  audio.src = new URL("../media/InstrumentalElida.mp3", document.currentScript.src).href;

  const setControlState = isPlaying => {
    if (!toggleButton) return;

    toggleButton.classList.toggle("is-playing", isPlaying);
    toggleButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
    toggleButton.setAttribute("aria-pressed", String(isPlaying));
  };

  const savePosition = () => {
    if (Number.isFinite(audio.currentTime)) {
      sessionStorage.setItem(positionKey, String(audio.currentTime));
      sessionStorage.setItem(volumeKey, String(audio.volume));
    }
  };

  const fadeIn = () => {
    window.clearInterval(fadeTimer);
    audio.volume = 0;

    let volume = 0;
    fadeTimer = window.setInterval(() => {
      volume = Math.min(volume + 0.035, 0.7);
      audio.volume = volume;

      if (volume >= 0.7) window.clearInterval(fadeTimer);
    }, 180);
  };

  const start = ({ fade = true } = {}) => {
    sessionStorage.setItem(requestedKey, "true");
    audio.muted = false;
    if (fade) {
      audio.volume = 0;
    } else {
      const savedVolume = Number.parseFloat(sessionStorage.getItem(volumeKey) || "");
      audio.volume = Number.isFinite(savedVolume) && savedVolume > 0
        ? Math.min(savedVolume, 0.7)
        : 0.7;
    }

    const playRequest = audio.play();
    if (playRequest && typeof playRequest.then === "function") {
      playRequest.then(() => {
        if (fade) fadeIn();
      }).catch(error => {
        sessionStorage.setItem(requestedKey, "false");
        setControlState(false);
        console.warn("La reproducción automática fue bloqueada; usa el control de música para iniciarla.", error);
      });
    } else if (fade) {
      fadeIn();
    }
  };

  const stop = () => {
    window.clearInterval(fadeTimer);
    window.clearInterval(saveTimer);
    audio.pause();
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) audio.currentTime = 0;
    audio.volume = 0;
    sessionStorage.setItem(requestedKey, "false");
    sessionStorage.setItem(positionKey, "0");
    setControlState(false);
  };

  audio.addEventListener("playing", () => {
    sessionStorage.setItem(requestedKey, "true");
    setControlState(true);
    window.clearInterval(saveTimer);
    saveTimer = window.setInterval(savePosition, 750);
  });

  audio.addEventListener("pause", () => {
    window.clearInterval(fadeTimer);
    window.clearInterval(saveTimer);
    savePosition();
    setControlState(false);
  });

  audio.addEventListener("ended", () => {
    sessionStorage.setItem(requestedKey, "false");
    sessionStorage.setItem(positionKey, "0");
    setControlState(false);
  });

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      if (audio.paused || audio.ended) {
        start();
      } else {
        audio.pause();
        sessionStorage.setItem(requestedKey, "false");
      }
    });
  }

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      const resetPosition = () => {
        audio.currentTime = 0;
        sessionStorage.setItem(positionKey, "0");
      };

      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        resetPosition();
      } else {
        audio.addEventListener("loadedmetadata", resetPosition, { once: true });
      }
      start();

      restartButton.classList.remove("is-restarting");
      void restartButton.offsetWidth;
      restartButton.classList.add("is-restarting");
      window.setTimeout(() => restartButton.classList.remove("is-restarting"), 650);
    });
  }

  const resumeFromSavedPosition = () => {
    const savedPosition = Number.parseFloat(sessionStorage.getItem(positionKey) || "0");
    if (Number.isFinite(savedPosition) && savedPosition > 0 && savedPosition < audio.duration) {
      audio.currentTime = savedPosition;
    }
    start({ fade: false });
  };

  if (
    toggleButton &&
    sessionStorage.getItem(requestedKey) === "true"
  ) {
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      resumeFromSavedPosition();
    } else {
      audio.addEventListener("loadedmetadata", resumeFromSavedPosition, { once: true });
      audio.load();
    }
  }

  window.addEventListener("beforeunload", savePosition);
  window.weddingMusic = { start, stop };
})();
