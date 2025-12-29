// --- বিজ্ঞাপন এবং প্লেয়ার লজিক (আপনার অরিজিনাল কোড) ---
const VAST_TAG_URL = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319475/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=";
const AD_URL = "https://archive.org/download/ical-capcut/11.%207190887293861858562.mp4"; 

let isMoviePlaying = false;
let selectedLang = null;
let midrollShown = false; 

// --- ১. UI Initialization with Lazy Loading (Shimmer Effect Added) ---
let displayedCount = 0;
const batchSize = 6; 

function init() {
    const grid = document.getElementById('movie-grid');
    if(!grid) return;
    
    const categories = [...new Set(movies.map(m => m.category))];
    
    grid.innerHTML = categories.map(cat => `
        <div class="row" id="row-${cat.split(' ').join('-')}">
            <div class="row-title">${cat}</div>
            <div class="movie-list"></div>
        </div>
    `).join('') + `<div id="load-more-trigger" style="height: 20px;"></div>`;

    loadNextBatch(); 
    setupObserver(); 
}

function loadNextBatch() {
    if (displayedCount >= movies.length) return;

    const nextMovies = movies.slice(displayedCount, displayedCount + batchSize);
    
    nextMovies.forEach(m => {
        const rowId = `row-${m.category.split(' ').join('-')}`;
        const rowList = document.querySelector(`#${rowId} .movie-list`);
        
        if (rowList) {
            const card = document.createElement('div');
            card.className = 'card loading'; 
            card.onclick = () => openDetails(m.id);
            
            const img = document.createElement('img');
            img.src = m.poster;
            img.loading = "lazy";
            img.alt = m.title;

            img.onload = function() {
                card.classList.remove('loading');
                img.classList.add('loaded');
            };

            card.innerHTML = `${m.rating ? `<div class="card-rating">★ ${m.rating}</div>` : ''}`;
            card.appendChild(img);
            rowList.appendChild(card);
        }
    });

    displayedCount += batchSize;
}

function setupObserver() {
    const trigger = document.getElementById('load-more-trigger');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayedCount < movies.length) {
            loadNextBatch();
        }
    }, { threshold: 0.1 });
    
    observer.observe(trigger);
}

// --- ২. Modal & Play Logic ---
function openDetails(id) {
    const movie = movies.find(m => m.id === id);
    window.currentMovie = movie;
    midrollShown = false;

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
    isMoviePlaying = false;
    triggerAdSequence(0, () => loadMovie());
}

async function triggerAdSequence(type, callback) {
    const root = document.getElementById('player-root');
    const adUI = document.getElementById('ad-ui');
    const skipBtn = document.getElementById('skip-ad-btn');
    adUI.style.display = 'block';
    skipBtn.style.display = 'none';

    const adVid = document.createElement('video');
    adVid.id = "seq-ad"; adVid.autoplay = true; adVid.playsinline = true;
    adVid.style = "width:100%; height:100%; background:#000; object-fit:contain;";
    root.appendChild(adVid);

    let adSourceSet = false;
    const fallback = setTimeout(() => { if (!adSourceSet) { adVid.src = AD_URL; adSourceSet = true; } }, 2000);

    try {
        const response = await fetch("https://corsproxy.io/?" + encodeURIComponent(VAST_TAG_URL));
        const xmlText = await response.text();
        const mediaUrl = parseVast(xmlText);
        if (mediaUrl && !adSourceSet) { clearTimeout(fallback); adVid.src = mediaUrl; adSourceSet = true; }
    } catch (e) { if (!adSourceSet) { adVid.src = AD_URL; adSourceSet = true; } }

    adVid.onplaying = () => { if(document.getElementById('ad-initial-loader')) document.getElementById('ad-initial-loader').remove(); };
    adVid.ontimeupdate = () => { if (adVid.duration && adVid.currentTime > (adVid.duration * 0.7)) skipBtn.style.display = 'block'; };

    const finishAd = () => { adVid.remove(); adUI.style.display = 'none'; callback(); };
    adVid.onended = finishAd; adVid.onerror = finishAd; skipBtn.onclick = finishAd;
}

function loadMovie() {
    isMoviePlaying = true;
    const root = document.getElementById('player-root');
    root.innerHTML = `<div id="movie-loader" class="full-screen-loader"><div class="spinner"></div></div><div id="video-container" style="width:100%; height:100%; background:#000;"></div>`;
    const videoContainer = document.getElementById('video-container');

    if(selectedLang.mp4) {
        const mv = document.createElement('video');
        mv.id = "m-vid"; mv.controls = true; mv.autoplay = true;
        mv.style.width = "100%"; mv.style.height = "100%";
        mv.setAttribute('controlsList', 'nodownload');
        mv.src = selectedLang.mp4;
        mv.onplaying = () => { if(document.getElementById('movie-loader')) { document.getElementById('movie-loader').style.opacity = '0'; setTimeout(() => document.getElementById('movie-loader').remove(), 300); } if (!midrollShown) setTimeout(() => tryVastMidroll(mv), 300000); };
        mv.onended = () => triggerAdSequence(-1, () => exitPlayer());
        videoContainer.appendChild(mv);
    } else {
        videoContainer.innerHTML = `<iframe src="${selectedLang.embed}" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
        setTimeout(() => { if(document.getElementById('movie-loader')) document.getElementById('movie-loader').remove(); }, 2000);
    }
}

async function tryVastMidroll(movieVid) {
    if (!isMoviePlaying) return;
    try {
        const response = await fetch("https://corsproxy.io/?" + encodeURIComponent(VAST_TAG_URL));
        const xmlText = await response.text();
        const mediaUrl = parseVast(xmlText);
        if (mediaUrl) { movieVid.pause(); midrollShown = true; playMidrollAd(mediaUrl, movieVid); }
    } catch (e) { console.log("No VAST for mid-roll."); }
}

function playMidrollAd(src, movieVid) {
    const root = document.getElementById('player-root');
    const adUI = document.getElementById('ad-ui');
    adUI.style.display = 'block';
    const adVid = document.createElement('video');
    adVid.style = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:1001; background:#000;";
    adVid.src = src; adVid.autoplay = true;
    adVid.onended = () => { adVid.remove(); adUI.style.display = 'none'; movieVid.play(); };
    adVid.onerror = () => { adVid.remove(); adUI.style.display = 'none'; movieVid.play(); };
    root.appendChild(adVid);
}

function parseVast(xml) {
    const xmlDoc = new DOMParser().parseFromString(xml, "text/xml");
    const mediaFiles = xmlDoc.getElementsByTagName("MediaFile");
    for (let i = 0; i < mediaFiles.length; i++) { if (mediaFiles[i].getAttribute("type") === "video/mp4") return mediaFiles[i].textContent.trim(); }
    return null;
}

function playTrailer() {
    const movie = window.currentMovie;
    const poster = document.getElementById('t-poster');
    const box = document.getElementById('t-video-box');
    poster.style.display = 'none'; box.style.display = 'block';
    if(movie.trailer_mp4) box.innerHTML = `<video id="tra-vid" autoplay controls style="width:100%; height:100%;"><source src="${movie.trailer_mp4}" type="video/mp4"></video>`;
    else box.innerHTML = `<iframe src="${movie.trailer_embed}?autoplay=1" allow="autoplay; fullscreen" style="width:100%; height:100%;"></iframe>`;
}

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
    function finish(ok) { loader.style.display = 'none'; group.style.display = 'flex'; dlBtn.style.display = ok ? 'flex' : 'none'; if(ok) dlBtn.onclick = () => window.open(url); }
}

function closeModal() { document.getElementById('detailsModal').style.display = 'none'; document.body.style.overflow = 'auto'; }
function exitPlayer() { document.getElementById('player-overlay').style.display = 'none'; document.getElementById('player-root').innerHTML = ""; document.body.style.overflow = 'auto'; isMoviePlaying = false; }

// --- ৩. Search Function ---
function searchMovies() {
    let input = document.getElementById('movie-search').value.toLowerCase();
    let movieCards = document.querySelectorAll('.card');
    let rows = document.querySelectorAll('.row');
    let noResults = document.getElementById('no-results');
    let anyFound = false;

    movieCards.forEach((card) => {
        let title = card.querySelector('img').alt.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "block";
            anyFound = true;
        } else {
            card.style.display = "none";
        }
    });

    rows.forEach(row => {
        let visibleCards = Array.from(row.querySelectorAll('.card')).filter(c => c.style.display !== "none");
        row.style.display = (visibleCards.length > 0 || input === "") ? "block" : "none";
    });

    noResults.style.display = (!anyFound && input !== "") ? "flex" : "none";
}

// --- ৪. Initialization & Social Bar & Loader Fix ---
init();

(function() {
    var s = document.createElement('script'); s.type = 'text/javascript';
    s.src = 'https://pl28298649.effectivegatecpm.com/3d/37/ed/3d37ed0885c16dd24335547a81158e60.js';
    s.async = true;
    if (document.body) document.body.appendChild(s);
    else window.addEventListener('DOMContentLoaded', function() { document.body.appendChild(s); });
})();

// লোডার সরানোর ফাংশন (যাতে বার বার লিখতে না হয়)
function clearLoader() {
    const loader = document.getElementById('main-site-loader');
    if(loader && !loader.classList.contains('loader-finished')) {
        loader.classList.add('loader-finished');
        setTimeout(() => { 
            loader.style.display = 'none'; 
            document.body.style.overflow = 'auto';
        }, 800);
    }
}

// পেজ পুরোপুরি লোড হলে লোডার সরবে
window.addEventListener('load', clearLoader);

// অথবা যদি কোনো কারণে লোড হতে দেরি হয়, তবে ৩.৫ সেকেন্ড পর জোর করে সরিয়ে দেবে (Safety Timer)
setTimeout(clearLoader, 3500);
// movie id

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (movieId) {
        openDetails(parseInt(movieId));
    }
};
function checkIfInstalled() {
    // চেক করছে সাইটটি অ্যাপ হিসেবে ওপেন হয়েছে কি না
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        const installBtn = document.getElementById('install-container'); // আপনার বাটনের আইডি দিন
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }
}

// এই ফাংশনটি init() এর ভেতরে কল করে দিন
window.addEventListener('DOMContentLoaded', checkIfInstalled);
// --- অনলাইন ডেটা লোড করার অ্যাডিশনাল লজিক ---

// ১. আপনার অনলাইন JSON লিংকটি এখানে বসান
const EXTERNAL_DATA_URL = "https://krantibeats.page.gd/data3.js"; 

// ২. movies ভেরিয়েবলটি গ্লোবাল হিসেবে রাখা হলো (যাতে আগের সব ফাংশন একে পায়)
var movies = []; 

async function loadOnlineData() {
    try {
        const response = await fetch(EXTERNAL_DATA_URL);
        if (!response.ok) throw new Error("Data fetch failed");
        
        // ডেটা লোড করে মুভিস ভেরিয়েবলে রাখা
        movies = await response.json(); 
        
        // ৩. ডেটা আসার পর আপনার আগের ফাংশনগুলো রান করা
        init(); 
        checkIfInstalled();
        
        // ৪. URL এ আইডি থাকলে ডিটেইলস ওপেন করা
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('id');
        if (movieId) {
            openDetails(parseInt(movieId));
        }
        
    } catch (error) {
        console.error("Error loading movies:", error);
        const grid = document.getElementById('movie-grid');
        if(grid) {
            grid.innerHTML = `<p style="color:white;text-align:center;padding:50px;">ডেটা লোড করা সম্ভব হয়নি। লিংকটি চেক করুন।</p>`;
        }
    }
}

// আপনার অরিজিনাল কোডের শেষে থাকা init(); এবং window.onload এর পরিবর্তে এটি কল করুন
loadOnlineData();



