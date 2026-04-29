let isChapterInfoAdded = false;
let playerElement = null;
let hls = null;
let player = null;
const chapterUrl = '/Video/GetChapters?fileName=chapters.vtt';
const subtitleUrl = '/Video/GetSubtitles?fileName=subtitle.vtt';


// ---------- Main Initialization on DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
    playerElement = document.getElementById('my-player');
    if (!playerElement) return;

    const streamUrl = '/Video/HLS/master.m3u8';

    // ========== TRACKS ==========
    function addTracksToVideo(video) {
        Array.from(video.querySelectorAll('track')).forEach(t => t.remove());

        const chapterTrack = document.createElement('track');
        chapterTrack.kind = 'chapters';
        chapterTrack.label = 'Chapters';
        chapterTrack.src = chapterUrl;
        chapterTrack.default = true;

        const subtitleTrack = document.createElement('track');
        subtitleTrack.kind = 'captions';
        subtitleTrack.label = 'فارسی';
        subtitleTrack.srclang = 'fa';
        subtitleTrack.src = subtitleUrl;
        subtitleTrack.default = true;

        video.appendChild(chapterTrack);
        video.appendChild(subtitleTrack);
    }

    // ========== PLYR OPTIONS ==========
    function getPlyrOptions(qualityOptions = null, qualityMap = null) {
        const baseOptions = {
            controls: [
                'play-large', 'play', 'progress', 'current-time', 'duration',
                'mute', 'volume', 'captions', 'settings', 'pip', 'fullscreen'
            ],
            captions: { active: true, language: 'fa', update: true },
            settings: ['quality', 'speed'],
            iconUrl: null,
            svgPath: null,
            clickToPlay: true,
            tooltips: { controls: true, seek: true },
            i18n: {
                settings: 'تنظیمات',
                menuBack: 'بازگشت',
                speed: 'سرعت پخش',
                normal: 'عادی',
                quality: 'کیفیت تصویر',
                qualityBadge: {
                    2160: '4K',
                    1440: '2K',
                    1080: 'Full HD',
                    720: 'HD',
                    576: 'SD',
                    480: 'SD',
                },
            }
        };

        if (qualityOptions && qualityMap) {
            baseOptions.quality = {
                default: 0,                     
                options: qualityOptions,
                forced: true,
                onChange: (newQuality) => {
                    if (hls) {
                        hls.currentLevel = newQuality === 0 ? -1 : qualityMap[newQuality];
                    }
                }
            };
            baseOptions.i18n.qualityLabel = {
                0: 'خودکار',
                ...qualityOptions.reduce((acc, q) => {
                    if (q !== 0) acc[q] = q + 'p';
                    return acc;
                }, {})
            };
        }

        return baseOptions;
    }

    // ========== CREATE PLYR INSTANCE ==========
    function createPlyrInstance(qualityOptions = null, qualityMap = null) {
        const options = getPlyrOptions(qualityOptions, qualityMap);
        player = new Plyr(playerElement, options);

        player.on('loadedmetadata', () => {
            const video = player.media;
            if (!video) return;
            const chaptersTrack = Array.from(video.textTracks).find(t => t.kind === 'chapters');
            playerInit(player, chaptersTrack);
        });

        player.on('ready', () => {
            replaceAllIconsWithLocalSVG(player);
        });

        return player;
    }

    // ========== HLS BRANCH ==========
    if (streamUrl.includes('.m3u8')) {
        if (window.Hls && Hls.isSupported()) {
            hls = new Hls({
                debug: false,
                enableWorker: true,
                startLevel: -1,                    
                abrEwmaDefaultEstimate: 300000,    
                abrBandWidthFactor: 0.95,
                abrMaxWithRealBitrate: true,
                maxBufferLength: 15,
                maxMaxBufferLength: 20,
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(playerElement);

            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                addTracksToVideo(playerElement);
            });

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const levels = hls.levels;

                
                if (levels.length > 0) {
                    hls.currentLevel = levels.length - 1;
                    setTimeout(() => {
                        if (hls && hls.currentLevel !== -1) {
                            hls.currentLevel = -1;   
                        }
                    }, 2000);
                }

                const qualities = levels.map((level, index) => ({ index, height: level.height }));
                const qualityOptions = [0, ...qualities.map(q => q.height)];   
                const qualityMap = {};
                qualities.forEach(q => { qualityMap[q.height] = q.index; });

                player = createPlyrInstance(qualityOptions, qualityMap);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('HLS: خطای شبکه، تلاش برای بازیابی...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('HLS: خطای رسانه، تلاش برای بازیابی...');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.error('HLS: خطای بحرانی، غیرقابل بازیابی');
                            hls.destroy();
                            break;
                    }
                }
            });

        } else if (playerElement.canPlayType('application/vnd.apple.mpegurl')) {
            playerElement.src = streamUrl;
            addTracksToVideo(playerElement);
            player = createPlyrInstance();
        } else {
            console.warn('مرورگر شما از HLS پشتیبانی نمی‌کند.');
        }
    }
});

// ========== CUSTOM ICONS (SVG Local) ==========

function replaceAllIconsWithLocalSVG(player) {
    const setButtonIcon = (button) => {
        if (!button) return;
        const dataPlyr = button.getAttribute('data-plyr');
        const isPressed = button.getAttribute('aria-pressed') === 'true';
        let svgFile = '';
        let tooltipText = '';

        switch (dataPlyr) {
            case 'play':
                svgFile = isPressed ? 'plyr-pause.svg' : 'plyr-play.svg';
                tooltipText = isPressed ? 'توقف' : 'پخش';
                break;
            case 'mute':
                svgFile = isPressed ? 'plyr-muted.svg' : 'plyr-volume.svg';
                tooltipText = isPressed ? 'با صدا' : 'بی صدا';
                break;
            case 'captions':
                svgFile = isPressed ? 'plyr-captions-on.svg' : 'plyr-captions-off.svg';
                tooltipText = isPressed ? 'غیرفعال کردن زیرنویس' : 'فعال کردن زیرنویس';
                break;
            case 'fullscreen':
                svgFile = isPressed ? 'plyr-exit-fullscreen.svg' : 'plyr-enter-fullscreen.svg';
                tooltipText = isPressed ? 'خروج از تمام صفحه' : 'تمام صفحه';
                break;
            case 'pip':
                svgFile = 'plyr-pip.svg';
                tooltipText = 'حالت تصویر در تصویر';
                break;
            case 'settings':
                svgFile = 'plyr-settings.svg';
                tooltipText = 'تنظیمات';
                break;
            case 'airplay':
                svgFile = 'plyr-airplay.svg';
                tooltipText = 'ایرپلی';
                break;
            default:
                if (button.classList.contains('plyr__control--overlaid')) {
                    svgFile = 'plyr-play.svg';
                    tooltipText = 'پخش';
                } else {
                    return;
                }
        }
        if (!svgFile) return;

        const img = document.createElement('img');
        img.src = `/svg/${svgFile}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';
        img.style.filter = 'brightness(0) invert(1)';

        button.title = tooltipText;
        button.innerHTML = '';
        button.appendChild(img);
    };

    const updateAllButtons = () => {
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="play"]'));
        setButtonIcon(document.querySelector('button.plyr__control--overlaid[data-plyr="play"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="mute"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="captions"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="fullscreen"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="pip"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="settings"]'));
        setButtonIcon(document.querySelector('button.plyr__control[data-plyr="airplay"]'));
    };

    updateAllButtons();
    player.on('play', updateAllButtons);
    player.on('pause', updateAllButtons);
    player.on('volumechange', updateAllButtons);
    player.on('captionsenabled', updateAllButtons);
    player.on('captionsdisabled', updateAllButtons);
    player.on('fullscreenchange', updateAllButtons);
}


// ========== CHAPTER UI HELPERS ==========

function removeChapterButton() {
    const existingBtn = document.getElementById('CHBTN');
    if (existingBtn) existingBtn.remove();
}

function updateChapterButton() {
    const container = document.getElementById('chapters-ui');
    const hasChapters = container && container.querySelectorAll('.chapter-box').length > 0;
    if (hasChapters) {
        if (!document.getElementById('CHBTN')) {
            ChapterBtnInit();
        }
    } else {
        removeChapterButton();
    }
}


// ========== MAIN PLAYER INIT (Chapters, UI, Keyboard) ==========

function playerInit(player, chaptersTrack) {
    let currentChapterInfoElement = null;
    let fullscreenBox = null;
    let isFullscreen = false;
    let hideTimeout = null;
    let allChapterButtons = [];

    function highlightCurrentChapter(currentTime, cues) {
        if (!cues || cues.length === 0) return;
        let activeIndex = -1;
        for (let i = 0; i < cues.length; i++) {
            const cue = cues[i];
            if (cue.startTime <= currentTime && cue.endTime >= currentTime) {
                activeIndex = i;
                break;
            }
        }
        allChapterButtons.forEach(btn => {
            const idx = parseInt(btn.dataset.chapterIndex);
            btn.classList.toggle('active-chapter', idx === activeIndex);
        });
    }

    function renderChapters(chaptersTrack, player) {
        const container = document.getElementById('chapters-ui');
        if (!container) {
            console.error('Chapters UI container not found!');
            return;
        }
        container.innerHTML = "";
        const cues = chaptersTrack.cues;
        if (!cues || cues.length === 0) {
            container.textContent = 'No chapters available.';
            updateChapterButton();
            return;
        }

        Array.from(cues).forEach((cue, idx) => {
            const num = toPersianNumber(idx + 1);
            const div = document.createElement('div');
            div.classList.add('chapter-box');

            const img = document.createElement('img');
            img.src = '../images/Chapter1.png';
            img.alt = cue.text + ' thumbnail';
            const div2 = document.createElement('div');
            div2.appendChild(img);

            const btn = document.createElement('button');
            btn.className = 'chapter-btn';
            btn.textContent = num + '. ' + cue.text;
            btn.dataset.chapterIndex = idx;
            btn.onclick = () => {
                player.currentTime = cue.startTime + 0.5;
                if (fullscreenBox && isFullscreen && !fullscreenBox.classList.contains('fullscreen-chapterBoxHide')) {
                    if (hideTimeout) clearTimeout(hideTimeout);
                    fullscreenBox.classList.remove('fullscreen-chapterBoxHide');
                }
            };
            allChapterButtons.push(btn);
            div.appendChild(div2);
            div.appendChild(btn);
            container.appendChild(div);
        });

        buildFullscreenChapterBox(chaptersTrack, player);
        highlightCurrentChapter(player.currentTime, cues);
        updateChapterButton();
    }

    function buildFullscreenChapterBox(chaptersTrack, player) {
        const existingBox = document.querySelector('.fullscreen-chapterBox');
        if (existingBox) existingBox.remove();

        const cues = chaptersTrack.cues;
        if (!cues || cues.length === 0) return;

        const box = document.createElement('div');
        box.classList.add('fullscreen-chapterBox', 'fullscreen-chapterBoxHide');
        fullscreenBox = box;

        Array.from(cues).forEach((cue, idx) => {
            const num = toPersianNumber(idx + 1);
            const btn = document.createElement('button');
            btn.textContent = num + '. ' + cue.text;
            btn.dataset.chapterIndex = idx;
            btn.onclick = (e) => {
                e.stopPropagation();
                player.currentTime = cue.startTime + 0.5;
                if (isFullscreen) {
                    if (hideTimeout) clearTimeout(hideTimeout);
                    box.classList.remove('fullscreen-chapterBoxHide');
                }
            };
            box.appendChild(btn);
            allChapterButtons.push(btn);
        });

        const chapterInfo = document.getElementById('ChapterInfoText');
        if (chapterInfo) {
            chapterInfo.insertAdjacentElement('afterend', box);
        } else {
            document.querySelector('.player-container')?.appendChild(box);
        }

        const scheduleHide = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (fullscreenBox && !fullscreenBox.matches(':hover')) {
                    fullscreenBox.classList.add('fullscreen-chapterBoxHide');
                }
                hideTimeout = null;
            }, 200);
        };
        const cancelHide = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        };
        const showBoxIfFullscreen = () => {
            if (isFullscreen) {
                cancelHide();
                fullscreenBox.classList.remove('fullscreen-chapterBoxHide');
            }
        };

        if (chapterInfo) {
            chapterInfo.addEventListener('mouseenter', showBoxIfFullscreen);
            chapterInfo.addEventListener('mouseleave', () => { if (isFullscreen) scheduleHide(); });
        }
        if (box) {
            box.addEventListener('mouseenter', () => { if (isFullscreen) cancelHide(); });
            box.addEventListener('mouseleave', () => { if (isFullscreen) scheduleHide(); });
        }

        player.on('enterfullscreen', () => {
            isFullscreen = true;
            const chapterInfo = document.getElementById('ChapterInfoText');
            if (chapterInfo && chapterInfo.matches(':hover')) {
                showBoxIfFullscreen();
            } else {
                fullscreenBox.classList.add('fullscreen-chapterBoxHide');
            }
        });
        player.on('exitfullscreen', () => {
            isFullscreen = false;
            cancelHide();
            fullscreenBox.classList.add('fullscreen-chapterBoxHide');
        });
    }

    function updateChapterDisplay(player, cues) {
        const currentTime = player.currentTime;
        let activeCue = null;
        for (let i = 0; i < cues.length; i++) {
            const cue = cues[i];
            if (cue.startTime <= currentTime && cue.endTime >= currentTime) {
                activeCue = cue;
                break;
            }
        }
        if (currentChapterInfoElement) {
            currentChapterInfoElement.textContent = activeCue ? activeCue.text : '';
        }
        highlightCurrentChapter(currentTime, cues);
    }

    // --- Chapter Track Handling ---
    if (chaptersTrack) {
        chaptersTrack.mode = "hidden";
        chaptersTrack.addEventListener("cuechange", () => {
            if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
                renderChapters(chaptersTrack, player);
                updateChapterDisplay(player, chaptersTrack.cues);
            }
        });
        setTimeout(() => {
            if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
                renderChapters(chaptersTrack, player);
                updateChapterDisplay(player, chaptersTrack.cues);
            } else {
                updateChapterButton();
            }
        }, 300);
    } else {
        console.warn('No chapters track found.');
        const container = document.getElementById('chapters-ui');
        if (container) container.textContent = 'Chapters not supported.';
        updateChapterButton();
    }

    // --- Create Chapter Info Text (next to play button) ---
    const playPauseButton = document.querySelector('button.plyr__control[data-plyr="play"]');
    const ChapterInfo = document.createElement('p');
    ChapterInfo.id = 'ChapterInfoText';
    ChapterInfo.textContent = '';
    if (playPauseButton && !isChapterInfoAdded) {
        playPauseButton.insertAdjacentElement('afterend', ChapterInfo);
        isChapterInfoAdded = true;
    }
    currentChapterInfoElement = ChapterInfo;

    if (chaptersTrack && chaptersTrack.cues) {
        player.on('timeupdate', () => {
            if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
                updateChapterDisplay(player, chaptersTrack.cues);
            }
        });
    }

    // ========== KEYBOARD SHORTCUTS ==========
    const handleKeyDown = (e) => {
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        if (e.key === ' ' || e.key === 'Space' || e.code === 'Space') {
            e.preventDefault();
            e.stopImmediatePropagation();
            player.playing ? player.pause() : player.play();
            return;
        }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                const video = player.media;
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.warn(err));
                } else {
                    video?.requestFullscreen?.().catch(err => console.warn('Fullscreen error:', err));
                }
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    e.preventDefault();
                    document.exitFullscreen().catch(err => console.warn(err));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                player.volume = Math.min(1, player.volume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                player.volume = Math.max(0, player.volume - 0.1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                player.currentTime = Math.max(0, player.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                player.currentTime = Math.min(player.duration, player.currentTime + 10);
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown, false);
}

// ========== CHAPTER BUTTON IN CONTROL BAR (like captions button) ==========

function ChapterBtnInit() {
    const captionsButton = document.querySelector('button.plyr__control[data-plyr="captions"]');
    if (!captionsButton) {
        console.warn("Captions button not found, cannot insert chapter button");
        return;
    }
    if (document.getElementById('CHBTN')) return;

    const ChapterBtn = document.createElement('button');
    ChapterBtn.type = 'button';
    ChapterBtn.className = 'plyr__control plyr__controls__item';
    ChapterBtn.id = 'CHBTN';
    ChapterBtn.setAttribute('data-plyr', 'chapter');

    const img = document.createElement('img');
    img.src = '/svg/chapters.svg';      
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    img.style.filter = 'brightness(0) invert(1)';

    ChapterBtn.title = 'نمایش فصل ها';
    ChapterBtn.appendChild(img);

    ChapterBtn.addEventListener('click', () => {
        const chapterBox = document.getElementById('chapters-ui');
        if (!chapterBox) return;
        const isHidden = chapterBox.style.display === 'none' || chapterBox.style.display === '';
        if (isHidden) {
            if (typeof toast !== 'undefined' && toast.info) toast.info('منو سرفصل ها باز شد', '');
            chapterBox.style.display = 'flex';
        } else {
            if (typeof toast !== 'undefined' && toast.info) toast.info('منو سرفصل ها بسته شد', '');
            chapterBox.style.display = 'none';
        }
    });

    captionsButton.after(ChapterBtn);
}