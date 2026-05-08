// Video Request URL ====> User/stream?fileName=testVideo.mp4

document.addEventListener("DOMContentLoaded", () => {
    const playerElement = document.getElementById('my-player');
    if (!playerElement) {
        console.error("Player element with ID 'my-player' not found!");
        return;
    }

    const player = new Plyr('#my-player', {
        controls: [
            'play-large', 'play', 'progress', 'current-time', 'duration',
            'mute', 'volume', 'captions' , 'settings', 'pip' ,'fullscreen'
        ],
        captions: { active: true, language: 'fa', update: true },
        settings: ['quality', 'speed' , 'captions']
    });

    // ---- Load chapters ----
    const videoElem = document.getElementById('my-player');
    const chaptersTrack = Array.from(videoElem.textTracks).find(t => t.kind === 'chapters');
    //console.log('chaptersTrack =>', chaptersTrack )

    function renderChapters(chaptersTrack, player) {
        const container = document.getElementById('chapters-ui');
        if (!container) {
            console.error('Chapters UI container not found!');
            return;
        }
        container.innerHTML = ""; 


        const cues = chaptersTrack.cues;
        if (!cues || cues.length === 0) {
            console.warn('No cues found in the chapters track.');

            container.textContent = 'No chapters available.';
            return;
        }
        let counter = 1;
        let startTime = 0;
        Array.from(cues).forEach(cue => {           
            //console.log('startTime =>', startTime);
            //console.log('endTime =>', cue.endTime);
            startTime = cue.endTime;
            const num = toPersianNumber(counter++);
            const div = document.createElement('div');
            div.classList.add('chapter-box');
            const img = document.createElement('img');
            img.src = '../images/Chapter1.png';
            img.alt = cue.text + ' thumbnail';
            const div2 = document.createElement('div');
            const btn = document.createElement('button');
            btn.className = 'chapter-btn';
            btn.textContent =  num + `.`  + cue.text ;
            btn.onclick = () => {
                player.currentTime = cue.startTime;
            };
            div2.appendChild(img);
            div.appendChild(div2);
            container.appendChild(div);
            div.appendChild(btn);



        });
    }

    if (chaptersTrack) {
        chaptersTrack.mode = "hidden";

        chaptersTrack.addEventListener("cuechange", () => {
            if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
                renderChapters(chaptersTrack, player);
            }
        });


        setTimeout(() => {
            if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
                renderChapters(chaptersTrack, player);
            }
        }, 300);

    } else {
        console.warn('No chapters track found on the video element.');
        const container = document.getElementById('chapters-ui');
        if (container) {
            container.textContent = 'Chapters not supported for this video.';
        }
    }


    function setInitialFaIcons() {

        const playPauseButton = document.querySelector('button.plyr__control[data-plyr="play"]');
        if (playPauseButton && !playPauseButton.querySelector('i.fa-play-circle') && !playPauseButton.querySelector('i.fa-pause')) {
            playPauseButton.innerHTML = '<i class="fa fa-play-circle" aria-hidden="true"></i>';
            playPauseButton.setAttribute('aria-label', 'Play');
        }
        const muteButton = document.querySelector('button.plyr__control[data-plyr="mute"]');
        if (muteButton && !muteButton.querySelector('i.fa-volume-up') && !muteButton.querySelector('i.fa-volume-off')) {
            muteButton.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>'; 
            muteButton.setAttribute('aria-label', 'Mute');
        }
        const captionsButton = document.querySelector('button.plyr__control[data-plyr="captions"]');
        if (captionsButton && !captionsButton.querySelector('i.fa-cc')) {
            const svgCaption = captionsButton.querySelector('svg');
            if (svgCaption) svgCaption.remove();
            captionsButton.innerHTML += '<i class="fa fa-cc" aria-hidden="true"></i>';
            captionsButton.setAttribute('aria-label', 'Enable captions');
        }
        const settingsButton = document.querySelector('button.plyr__control[data-plyr="settings"]');
        if (settingsButton && !settingsButton.querySelector('i.fa-cog')) {
            const svgSetting = settingsButton.querySelector('svg');
            if (svgSetting) svgSetting.remove();
            settingsButton.innerHTML += '<i class="fa fa-cog" aria-hidden="true"></i>';
            settingsButton.setAttribute('aria-label', 'Settings');
        }

        const fullscreenButton = document.querySelector('button.plyr__control[data-plyr="fullscreen"]');
        if (fullscreenButton && !fullscreenButton.querySelector('i.fa-expand') && !fullscreenButton.querySelector('i.fa-compress')) {
            const svgFullscreen = fullscreenButton.querySelector('svg');
            if (svgFullscreen) svgFullscreen.remove();
            fullscreenButton.innerHTML += '<i class="fa fa-expand" aria-hidden="true"></i>'; 
            fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        }
        const pipButton = document.querySelector('button.plyr__control[data-plyr="pip"]');
        if (pipButton) {
            const svgPip = pipButton.querySelector('svg');
            if (svgPip) svgPip.remove();

            if (!pipButton.querySelector('i.fa-window-restore')) {
                pipButton.innerHTML += '<i class="fa fa-window-restore" aria-hidden="true"></i>';
                pipButton.setAttribute('aria-label', 'PIP');
            }
        }

        const overlayPlayPauseButton = document.querySelector('button.plyr__control--overlaid[data-plyr="play"]');
        if (overlayPlayPauseButton) {
            const svgOverlay = overlayPlayPauseButton.querySelector('svg');
            if (svgOverlay) svgOverlay.remove();
            overlayPlayPauseButton.classList.add('size-fixer');
            if (!overlayPlayPauseButton.querySelector('i.fa-play')) {
                overlayPlayPauseButton.innerHTML += '<i class="fa fa-play" aria-hidden="true"></i>';
                overlayPlayPauseButton.setAttribute('aria-label', 'Play');
            }
        }

    }
    function updateIcons() {
        const playPauseButton = document.querySelector('button.plyr__control[data-plyr="play"]');
        const muteButton = document.querySelector('button.plyr__control[data-plyr="mute"]');
        const captionsButton = document.querySelector('button.plyr__control[data-plyr="captions"]');
        const settingsButton = document.querySelector('button.plyr__control[data-plyr="settings"]');
        const fullscreenButton = document.querySelector('button.plyr__control[data-plyr="fullscreen"]');
        const pipButton = document.querySelector('button.plyr__control[data-plyr="pip"]'); 

        if (playPauseButton) {
            if (player.playing) {
                playPauseButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
                playPauseButton.setAttribute('aria-label', 'Pause');
            } else {
                playPauseButton.innerHTML = '<i class="fa fa-play-circle" aria-hidden="true"></i>';
                playPauseButton.setAttribute('aria-label', 'Play');
            }
            playPauseButton.setAttribute('aria-pressed', player.playing ? 'true' : 'false');
        }

        if (muteButton) {
            if (player.muted) {
                muteButton.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
                muteButton.setAttribute('aria-label', 'Unmute');
            } else {
                muteButton.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
                muteButton.setAttribute('aria-label', 'Mute');
            }
            muteButton.setAttribute('aria-pressed', player.muted ? 'true' : 'false');
        }

        if (captionsButton) {
            if (player.captions.active) {
                captionsButton.innerHTML = '<i class="fa fa-cc" aria-hidden="true"></i>';
                captionsButton.setAttribute('aria-label', 'Disable captions');
            } else {
                captionsButton.innerHTML = '<i class="fa fa-cc" aria-hidden="true"></i>';
                captionsButton.setAttribute('aria-label', 'Enable captions');
            }
            captionsButton.setAttribute('aria-pressed', player.captions.active ? 'true' : 'false');
        }
   
        if (fullscreenButton) {
            if (player.isFullScreen) {
                fullscreenButton.innerHTML = '<i class="fa fa-compress" aria-hidden="true"></i>';
                fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
            } else {
                fullscreenButton.innerHTML = '<i class="fa fa-expand" aria-hidden="true"></i>';
                fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
            }
            fullscreenButton.setAttribute('aria-pressed', player.isFullScreen ? 'true' : 'false');
        }
    }

    
    setInitialFaIcons();

    setTimeout(() => {
        updateIcons();
    }, 500);

    // --- Event Listeners ---
    player.on('play', updateIcons);
    player.on('pause', updateIcons);
    player.on('volumechange', updateIcons);
    player.on('captionsenabled', updateIcons);
    player.on('captionsdisabled', updateIcons);
    player.on('ready', updateIcons);
    player.on('fullscreenchange', updateIcons);

    const playPauseButton = document.querySelector('button.plyr__control[data-plyr="play"]');
    const muteButton = document.querySelector('button.plyr__control[data-plyr="mute"]');
    const captionsButton = document.querySelector('button.plyr__control[data-plyr="captions"]');
    const fullscreenButton = document.querySelector('button.plyr__control[data-plyr="fullscreen"]');
    const pipButton = document.querySelector('button.plyr__control[data-plyr="pip"]'); 

    const buttonsToListen = [playPauseButton, muteButton, captionsButton, fullscreenButton, pipButton];
    buttonsToListen.forEach(button => {
        if (button) {
            button.addEventListener('click', () => {
                setTimeout(updateIcons, 100); 
            });
        }
    });

    player.on('ready', () => {

        const settingsMenu = document.querySelector('.plyr__menu__container [role="menu"]');
        const speedMenuItem = settingsMenu.querySelector('[role="menuitem"][data-plyr="speed"]');
        const qualityMenuItem = settingsMenu.querySelector('[role="menuitem"][data-plyr="quality"]');
        const menuItems = settingsMenu.querySelectorAll('[role="menuitem"]');

        menuItems.forEach(item => {
            const textSpan = item.querySelector('span:not(.plyr__menu__value)');
            let itemText = '';

            if (textSpan) {
                const firstNode = textSpan.firstChild;
                if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
                    itemText = firstNode.textContent.trim();
                } else {
                    console.warn("First child is not a text node:", firstNode);
                }
            }


            if (!item.getAttribute('data-my-custom-button')) {
                let valueSpan;
                switch (itemText) {
                    case 'Quality':
                        valueSpan = item.querySelector('.plyr__menu__value');
                        if (valueSpan) valueSpan.textContent = 'HD';
                        if (textSpan) textSpan.textContent = 'کیفیت تصویر';
                        break;
                    case 'Speed':
                        valueSpan = item.querySelector('.plyr__menu__value');
                        if (valueSpan) valueSpan.textContent = 'سرعت';
                        if (textSpan) textSpan.textContent = 'سرعت پخش';
                        break;
                    case 'Captions':
                        valueSpan = item.querySelector('.plyr__menu__value');
                        if (valueSpan) valueSpan.textContent = 'فارسی';
                        if (textSpan) textSpan.textContent = 'زیرنویس';
                        break;
                    default: console.error('Setting Menu Items Not Found !');
                        break;
                }
            }
        

        });

        if (!settingsMenu) {
            console.warn("Settings menu not found!");
            return;
        }

        const ChapterBtn = document.createElement('button');
        ChapterBtn.type = 'button';
        ChapterBtn.className = 'plyr__control';
        ChapterBtn.setAttribute('role', 'menuitem');
        ChapterBtn.textContent = 'نمایش فصل ها';

        ChapterBtn.addEventListener('click', () => {

            const chapterBox = document.getElementById('chapters-ui');
            const vid = document.querySelector('.vid');

            if (!chapterBox) {
                console.error("Element #chapters-ui یافت نشد");
                return;
            }

            const isHidden = chapterBox.style.display === 'none' || chapterBox.style.display === '';

            if (isHidden) {
                toast.info('منو سرفصل ها باز شد', '');
                chapterBox.style.display = 'flex';

                if (vid) vid.style.width = '100%';
            } else {
                toast.info('منو سرفصل ها بسته شد', '');
                chapterBox.style.display = 'none';
                if (vid) vid.style.width = '100%';
            }

        });

        settingsMenu.appendChild(ChapterBtn);
    });
});
