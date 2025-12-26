const video = document.getElementById('live-video');
const overlay = document.getElementById('player-overlay');
const loader = document.getElementById('loading');

function playLive() {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const current = schedule.find(s => timeStr >= s.startTime && timeStr <= s.endTime);

    if (current) {
        overlay.style.display = 'flex';
        loader.style.display = 'flex';
        video.src = current.url;
        video.load();

        // টাইম সিঙ্কিং লজিক
        const startParts = current.startTime.split(':');
        const startDate = new Date();
        startDate.setHours(startParts[0], startParts[1], 0);
        const diff = Math.floor((now - startDate) / 1000);

        video.onloadedmetadata = function() {
            if (diff > 0 && diff < video.duration) {
                video.currentTime = diff;
            }
            loader.style.display = 'none';
            video.play().catch(() => {
                video.muted = true;
                video.play();
            });
        };
    }
}

// সিকিং (টানাটানি) পুরোপুরি ব্লক করার লজিক
video.addEventListener('seeking', function() {
    if (video.currentTime !== video.lastTime) {
        video.currentTime = video.lastTime;
    }
});

video.addEventListener('timeupdate', function() {
    if (!video.seeking) {
        video.lastTime = video.currentTime;
    }
});

function closePlayer() {
    overlay.style.display = 'none';
    video.pause();
    video.src = "";
    document.body.style.overflow = 'auto';
}

// রাইট ক্লিক বন্ধ
document.addEventListener('contextmenu', event => event.preventDefault());
