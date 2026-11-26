// spo-yt-heure-fin : affiche l'heure de fin estimée à droite du timer du lecteur YouTube.
// Fin = maintenant + (durée - position) / vitesse de lecture.
(() => {
  'use strict';

  const CLS = 'spo-yt-heure-fin';
  const VIDEO_EVENTS = [
    'timeupdate', 'ratechange', 'durationchange', 'loadedmetadata',
    'seeking', 'seeked', 'play', 'pause', 'emptied', 'ended',
  ];

  // Permet de réinjecter le script (tests) sans doublons.
  if (window.__spoYtHeureFin) window.__spoYtHeureFin.stop();

  let video = null;
  let span = null;

  const timeFmt = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  function dayOffset(end, now) {
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const b = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.round((b - a) / 86400000);
  }

  function update() {
    if (!span || !video) return;
    const player = video.closest('#movie_player');
    const d = video.duration;
    const liveBadge = player?.querySelector('.ytp-live-badge');
    const isLive = !!player?.querySelector('.ytp-time-display.ytp-live')
      || !!(liveBadge && liveBadge.offsetWidth > 0);
    const isAd = !!player?.classList.contains('ad-showing');

    if (!Number.isFinite(d) || d <= 0 || isLive || isAd) {
      span.hidden = true;
      return;
    }

    const rate = video.playbackRate > 0 ? video.playbackRate : 1;
    const remainingSec = Math.max(0, d - video.currentTime) / rate;
    const now = new Date();
    const end = new Date(now.getTime() + remainingSec * 1000);
    const days = dayOffset(end, now);

    const text = 'Fin ≈ ' + timeFmt.format(end) + (days > 0 ? ` (+${days}j)` : '');
    if (span.textContent !== text) span.textContent = text;
    span.hidden = false;
  }

  function attachVideo(v) {
    if (v === video) return;
    if (video) VIDEO_EVENTS.forEach((e) => video.removeEventListener(e, update));
    video = v;
    if (video) VIDEO_EVENTS.forEach((e) => video.addEventListener(e, update));
  }

  // Trouve le lecteur, se rattache à la vidéo et (ré)insère l'affichage si besoin.
  function ensure() {
    const player = document.querySelector('#movie_player');
    if (!player) return;

    attachVideo(player.querySelector('video.html5-main-video') || player.querySelector('video'));

    const timeDisplay = player.querySelector('.ytp-time-display');
    if (!timeDisplay) return;

    if (!span || !span.isConnected || span.previousElementSibling !== timeDisplay) {
      document.querySelectorAll('.' + CLS).forEach((el) => el.remove());
      span = document.createElement('span');
      span.className = CLS;
      span.title = 'Heure de fin estimée (vitesse de lecture prise en compte)';
      timeDisplay.after(span);
    }
    update();
  }

  const timer = setInterval(ensure, 1000);
  const onNav = () => ensure();
  document.addEventListener('yt-navigate-finish', onNav);
  document.addEventListener('yt-player-updated', onNav);
  ensure();

  window.__spoYtHeureFin = {
    stop() {
      clearInterval(timer);
      document.removeEventListener('yt-navigate-finish', onNav);
      document.removeEventListener('yt-player-updated', onNav);
      attachVideo(null);
      document.querySelectorAll('.' + CLS).forEach((el) => el.remove());
      span = null;
    },
  };
})();
