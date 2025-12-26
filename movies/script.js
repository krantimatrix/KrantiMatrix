// --- বিজ্ঞাপন এবং প্লেয়ার লজিক ---
const VAST_TAG_URL = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319475/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=";
const AD_URL = "https://archive.org/download/ical-capcut/11.%207190887293861858562.mp4"; 
const adTimeline = [0, 0, 300, -1]; 

let adsPlayedIndices = []; 
let isMoviePlaying = false;
let selectedLang = null;

// --- ১. UI Initialization ---
function init() {
    const grid = document.getElementById('movie-grid');
    if(!grid) return;
    const categories = [...new Set(movies.map(m => m.category))];
    grid.innerHTML = categories.map(cat => `
        <div class="row">
            <div class="row-title">${cat}</div>
            <div class="movie-list">
                ${movies.filter(m => m.category === cat).map(m => `
                    <div class="card" onclick="openDetails(${m.id})">
                        ${m.rating ? `<div class="card-rating">★ ${m.rating}</div>` : ''}
                        <img src="${m.poster}" loading="lazy">
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// --- ২. Modal & Play Logic ---
function openDetails(id) {
    const movie = movies.find(m => m.id === id);
    window.currentMovie = movie;

    document.getElementById('trailer-section').innerHTML = `
        <div id="t-poster" class="trailer-poster" style="background-image:url('${movie.trailer_poster}')" onclick="playTrailer()">
            <div class="play-btn-ui">▶</div>
        </div>
        <div id="t-video-box" style="display:none; width:100%; height:100%;"></div>
    `;

    const availableLangs = Object.keys(movie.languages).filter(l => movie.languages[l].mp4 || movie.languages[l].embed);
    selectedLang = movie.languages[availableLangs[0]];

    let metaData = `<span class="rating-box">★ ${movie.rating}</span><span style="color:#8e8e93">${movie.year}</span><span class="maturity">${movie.maturity}</span><span style="color:var(--ios-blue); font-weight:bold;">4K HD</span>`;

    document.getElementById('modalContent').innerHTML = `
        <h2 class="modal-title">${movie.title}</h2>
        <div class="meta-container">${metaData}</div>
        <div style="font-size:11px; color:var(--ios-blue); font-weight:700; margin-top:15px;">SELECT AUDIO</div>
        <div class="lang-selector">
            ${availableLangs.map((l, i) => `<button class="lang-btn ${i===0?'active':''}" onclick="changeLang(this, '${l}')">${l}</button>`).join('')}
        </div>
        <p style="font-size:14px; color:#ccc; line-height:1.5; margin:0;">${movie.desc}</p>
        <div class="action-area">
            <div id="btn-loader" class="loader-box" style="display:flex;"><div class="spinner"></div></div>
            <div id="btn-group" class="btn-group" style="display:none;">
                <button class="btn btn-play" onclick="handlePlay()">WATCH NOW</button>
                <button id="dl-btn" class="btn btn-download">DOWNLOAD</button>
            </div>
        </div>
    `;

    document.getElementById('detailsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    checkDownload(selectedLang.mp4);
}

function handlePlay() {
    document.getElementById('detailsModal').style.display = 'none';
    document.getElementById('player-overlay').style.display = 'block';
    const root = document.getElementById('player-root');
    root.innerHTML = `<div class="full-screen-loader" id="ad-initial-loader"><div class="spinner"></div><div class="loader-text">Loading Ad...</div></div>`;
    adsPlayedIndices = [];
    isMoviePlaying = false;
    setTimeout(() => { triggerAd(0); }, 500);
}

// --- ৩. Ad Engine ---
async function triggerAd(timeType) {
    const root = document.getElementById('player-root');
    const adUI = document.getElementById('ad-ui');
    const skipBtn = document.getElementById('skip-ad-btn');
    const adIndex = adTimeline.findIndex((t, i) => t === timeType && !adsPlayedIndices.includes(i));
    
    if(adIndex === -1) { if(timeType === 0) loadMovie(); return; }

    adsPlayedIndices.push(adIndex);
    adUI.style.display = 'block';
    skipBtn.style.display = 'none'; 

    root.innerHTML += `<video id="ad-video" autoplay playsinline disablePictureInPicture style="width:100%; height:100%; object-fit:contain; background:#000; pointer-events:none;"></video>`;
    const adVid = document.getElementById('ad-video');
    adVid.controls = false;

    try {
        const response = await fetch("https://corsproxy.io/?" + encodeURIComponent(VAST_TAG_URL));
        const xmlText = await response.text();
        const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
        const mediaFiles = xmlDoc.getElementsByTagName("MediaFile");
        let mediaUrl = "";
        for (let i = 0; i < mediaFiles.length; i++) {
            if (mediaFiles[i].getAttribute("type") === "video/mp4") {
                mediaUrl = mediaFiles[i].textContent.trim();
                break;
            }
        }
        adVid.src = mediaUrl || AD_URL; 
    } catch (e) { adVid.src = AD_URL; }

    adVid.onplaying = () => {
        const loader = document.getElementById('ad-initial-loader');
        if(loader) loader.remove();
    };

    adVid.ontimeupdate = () => {
        if (adVid.seeking) { adVid.currentTime = adVid.played.end(0); }
        if (adVid.duration && adVid.currentTime > (adVid.duration * 0.8)) {
            skipBtn.style.display = 'block';
        }
    };

    adVid.onended = () => skipAdNow(timeType);
    adVid.onerror = () => skipAdNow(timeType);
}

function skipAdNow(timeType) {
    document.getElementById('ad-ui').style.display = 'none';
    if(!isMoviePlaying && timeType === 0) loadMovie();
    else if (timeType === -1) exitPlayer();
}

// --- ৪. Movie & Trailer Loader ---
function loadMovie() {
    isMoviePlaying = true;
    const root = document.getElementById('player-root');
    root.innerHTML = `<div id="movie-loader" class="full-screen-loader"><div class="spinner"></div><div class="loader-text">Loading Movie...</div></div><div id="video-container" style="width:100%; height:100%; background:#000;"></div>`;
    const videoContainer = document.getElementById('video-container');
    if(selectedLang.mp4) {
        const mv = document.createElement('video');
        mv.id = "m-vid"; mv.controls = true; mv.autoplay = true;
        mv.style.width = "100%"; mv.style.height = "100%";
        mv.src = selectedLang.mp4;
        mv.onplaying = () => {
            const loader = document.getElementById('movie-loader');
            if(loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 300); }
        };
        mv.onended = () => exitPlayer();
        videoContainer.appendChild(mv);
    } else {
        videoContainer.innerHTML = `<iframe src="${selectedLang.embed}" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
        setTimeout(() => { const loader = document.getElementById('movie-loader'); if(loader) loader.remove(); }, 3000);
    }
}

function playTrailer() {
    const movie = window.currentMovie;
    const poster = document.getElementById('t-poster');
    const box = document.getElementById('t-video-box');
    poster.style.display = 'none'; box.style.display = 'block';
    if(movie.trailer_mp4) {
        box.innerHTML = `<video id="tra-vid" autoplay controls style="width:100%; height:100%;"><source src="${movie.trailer_mp4}" type="video/mp4"></video>`;
    } else { box.innerHTML = `<iframe src="${movie.trailer_embed}?autoplay=1" allow="autoplay; fullscreen" style="width:100%; height:100%;"></iframe>`; }
}

// --- ৫. Helper Functions ---
function changeLang(btn, key) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedLang = window.currentMovie.languages[key];
    document.getElementById('btn-group').style.display = 'none';
    document.getElementById('btn-loader').style.display = 'flex';
    checkDownload(selectedLang.mp4);
}

function checkDownload(url) {
    const dlBtn = document.getElementById('dl-btn');
    const group = document.getElementById('btn-group');
    const loader = document.getElementById('btn-loader');
    if(!url) { finish(false); return; }
    const v = document.createElement('video'); v.src = url;
    const t = setTimeout(() => finish(false), 4000);
    v.onloadedmetadata = () => { clearTimeout(t); finish(true); };
    v.onerror = () => { clearTimeout(t); finish(false); };
    function finish(ok) {
        loader.style.display = 'none'; group.style.display = 'flex';
        dlBtn.style.display = ok ? 'flex' : 'none';
        if(ok) dlBtn.onclick = () => window.open(url);
    }
}

function closeModal() { document.getElementById('detailsModal').style.display = 'none'; document.body.style.overflow = 'auto'; }
function exitPlayer() { document.getElementById('player-overlay').style.display = 'none'; document.getElementById('player-root').innerHTML = ""; document.body.style.overflow = 'auto'; isMoviePlaying = false; }

// --- ৬. PWA & Install Logic (Combined) ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => console.log("SW Error:", err));
}

let deferredPrompt;
const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// অ্যান্ড্রয়েড লজিক
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installContainer = document.getElementById('install-container');
    if(installContainer) installContainer.style.display = 'block';
});

document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            document.getElementById('install-container').style.display = 'none';
        }
        deferredPrompt = null;
    }
});

// আইফোন লজিক
if (isIos() && !isInStandaloneMode()) {
  setTimeout(() => {
    const iosPrompt = document.getElementById('ios-install-prompt');
    if(iosPrompt) iosPrompt.style.display = 'block';
  }, 3000);
}

// ইনিশিয়ালাইজেশন
init();
window.addEventListener('beforeinstallprompt', (e) => {
    // ডিফল্ট পপ-আপ বন্ধ করা
    e.preventDefault();
    deferredPrompt = e;
    
    // বাটনটি দেখানোর জন্য
    const installContainer = document.getElementById('install-container');
    if (installContainer) {
        installContainer.style.setProperty('display', 'block', 'important');
    }
    console.log("Android Install Prompt Ready");
});
