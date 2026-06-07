function toPersianNumber(num) {
    const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return num.toString().replace(/\d/g, d => persianDigits[d]);
}

document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("my-player");
if (!videoElement) return;

  const player = new Plyr("#my-player", {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "captions",
      "settings",
      "pip",
      "fullscreen",
    ],
    captions: { active: true, language: "fa", update: true },
    settings: ["quality", "speed"],
    iconUrl: null,
    svgPath: null,
    clickToPlay: true,
    tooltips: { controls: true, seek: true },
    i18n: {
      settings: "تنظیمات",
      menuBack: "بازگشت",
      speed: "سرعت پخش",
      normal: "عادی",
      quality: "کیفیت تصویر",
      qualityBadge: {
        2160: "4K",
        1440: "2K",
        1080: "Full HD",
        720: "HD",
        576: "SD",
        480: "SD",
      },
    },
  });

  player.source = {
    type: "video",
    sources: [
      {
        src: "/User/stream?fileName=testVideo.mp4",
        type: "video/mp4",
        size: 1080,
      },
      {
        src: "/User/stream?fileName=testVideo.mp4",
        type: "video/mp4",
        size: 720,
      },
      {
        src: "/User/stream?fileName=testVideo.mp4",
        type: "video/mp4",
        size: 480,
      },
    ],
    tracks: [
      {
        kind: "chapters",
        label: "Chapters",
        src: "/User/GetChapters?fileName=chapters.vtt",
        default: true,
      },
      {
        kind: "captions",
        label: "فارسی",
        srcLang: "fa",
        src: "/User/GetSubtitles?fileName=subtitle.vtt",
        default: true,
      },
    ],
  };

  Object.freeze(player.source);

  player.on("loadedmetadata", () => {
    const chaptersTrack = player.media?.textTracks ? Array.from(player.media.textTracks).find(t => t.kind === 'chapters') : null;
    if (chaptersTrack) playerInit(player, chaptersTrack);
});

  player.on("ready", () => {
    replaceAllIconsWithLocalSVG(player);
  });
});

// ---------- Replace Plyr default icons with local SVGs  ----------
function replaceAllIconsWithLocalSVG(player) {
  const setButtonIcon = (button) => {
    if (!button) return;
    const dataPlyr = button.getAttribute("data-plyr");
    const isPressed = button.getAttribute("aria-pressed") === "true";
    const { svgFile, tooltipText } = getButtonIcon(dataPlyr, isPressed, button);

    switch (dataPlyr) {
      case "play":
        svgFile = isPressed ? "plyr-pause.svg" : "plyr-play.svg";
        tooltipText = isPressed ? "توقف" : "پخش";
        break;
      case "mute":
        svgFile = isPressed ? "plyr-muted.svg" : "plyr-volume.svg";
        tooltipText = isPressed ? "با صدا" : "بی صدا";
        break;
      case "captions":
        svgFile = isPressed ? "plyr-captions-on.svg" : "plyr-captions-off.svg";
        tooltipText = isPressed ? "غیرفعال کردن زیرنویس" : "فعال کردن زیرنویس";
        break;
      case "fullscreen":
        svgFile = isPressed
          ? "plyr-exit-fullscreen.svg"
          : "plyr-enter-fullscreen.svg";
        tooltipText = isPressed ? "خروج از تمام صفحه" : "تمام صفحه";
        break;
      case "pip":
        svgFile = "plyr-pip.svg";
        tooltipText = "حالت تصویر در تصویر";
        break;
      case "settings":
        svgFile = "plyr-settings.svg";
        tooltipText = "تنظیمات";
        break;
      case "airplay":
        svgFile = "plyr-airplay.svg";
        tooltipText = "ایرپلی";
        break;
      default:
        if (button.classList.contains("plyr__control--overlaid")) {
          svgFile = "plyr-play.svg";
          tooltipText = "پخش";
        }
        break;
    }
    if (!svgFile) return;

    const img = document.createElement("img");
    img.src = `/svg/${svgFile}`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.display = "block";
    img.style.filter = "brightness(0) invert(1)";

    // Set tooltip on the button itself
    button.title = tooltipText;

    button.innerHTML = "";
    button.appendChild(img);
  };

  const updateAllButtons = () => {
    const selectors = [
      'button.plyr__control[data-plyr="play"]',
      'button.plyr__control--overlaid[data-plyr="play"]',
      'button.plyr__control[data-plyr="mute"]',
      'button.plyr__control[data-plyr="captions"]',
      'button.plyr__control[data-plyr="fullscreen"]',
      'button.plyr__control[data-plyr="pip"]',
      'button.plyr__control[data-plyr="settings"]',
    ];
    selectors.forEach((sel) => setButtonIcon(document.querySelector(sel)));
  };

  updateAllButtons();
  player.on("play", updateAllButtons);
  player.on("pause", updateAllButtons);
  player.on("volumechange", updateAllButtons);
  player.on("captionsenabled", updateAllButtons);
  player.on("captionsdisabled", updateAllButtons);
  player.on("fullscreenchange", updateAllButtons);
}
// ---------- Chapter button visibility helpers ----------
function removeChapterButton() {
  const existingBtn = document.getElementById("CHBTN");
  if (existingBtn) existingBtn.remove();
}

function updateChapterButton() {
  const container = document.getElementById("chapters-ui");
  const hasChapters =
    container && container.querySelectorAll(".chapter-box").length > 0;
  if (hasChapters && !document.getElementById("CHBTN")) {
    ChapterBtnInit();
}
}

// ---------- Main player initialization (chapters, UI, events) ----------
function playerInit(player, chaptersTrack) {
  let isChapterInfoAdded = false;
  let currentChapterInfoElement = null;
  let fullscreenBox = null;
  let isFullscreen = false;
  let hideTimeout = null;
  const allChapterButtons = [];

  // Highlight the active chapter button
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
    allChapterButtons.forEach((btn) => {
      const idx = parseInt(btn.dataset.chapterIndex);
      if (idx === activeIndex) {
        btn.classList.add("active-chapter");
      } else {
        btn.classList.remove("active-chapter");
      }
    });
  }

  // Render normal chapter list (inside #chapters-ui)
  function renderChapters(chaptersTrack, player) {
    const container = document.getElementById("chapters-ui");
    if (!container) {
      console.error("Chapters UI container not found!");
      return;
    }
    container.innerHTML = "";
    const cues = chaptersTrack.cues;
    if (!cues || cues.length === 0) {
      container.textContent = "No chapters available.";
      updateChapterButton();
      return;
    }

    // Clear previous chapter buttons
    allChapterButtons = [];

    [...cues].forEach((cue, idx) => {
      const num = toPersianNumber(idx + 1);
      const div = document.createElement("div");
      div.classList.add("chapter-box");

      const img = document.createElement("img");
      img.src = "../images/Chapter1.png";
      img.alt = cue.text + " thumbnail";
      const div2 = document.createElement("div");
      div2.appendChild(img);

      const btn = document.createElement("button");
      btn.className = "chapter-btn";
      btn.textContent = num + `. ` + cue.text;
      btn.dataset.chapterIndex = idx;
      btn.onclick = () => {
        player.currentTime = cue.startTime + 0.5;
        if (
          fullscreenBox &&
          isFullscreen &&
          !fullscreenBox.classList.contains("fullscreen-chapterBoxHide")
        ) {
          if (hideTimeout) clearTimeout(hideTimeout);
          fullscreenBox.classList.remove("fullscreen-chapterBoxHide");
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

  // Build the fullscreen hover chapter box
  function buildFullscreenChapterBox(chaptersTrack, player) {
    const existingBox = document.querySelector(".fullscreen-chapterBox");
    if (existingBox) {
      const newBox = existingBox.cloneNode(true);
      existingBox.replaceWith(newBox);
      fullscreenBox = null;
    }

    const cues = chaptersTrack.cues;
    if (!cues || cues.length === 0) return;

    const box = document.createElement("div");
    box.classList.add("fullscreen-chapterBox", "fullscreen-chapterBoxHide");
    fullscreenBox = box;

    Array.from(cues).forEach((cue, idx) => {
      const num = toPersianNumber(idx + 1);
      const btn = document.createElement("button");
      btn.textContent = num + `. ` + cue.text;
      btn.dataset.chapterIndex = idx;
      btn.onclick = (e) => {
        e.stopPropagation();
        player.currentTime = cue.startTime + 0.5;
        if (isFullscreen) {
          if (hideTimeout) clearTimeout(hideTimeout);
          box.classList.remove("fullscreen-chapterBoxHide");
        }
      };
      box.appendChild(btn);
      allChapterButtons.push(btn);
    });

    const chapterInfo = document.getElementById("ChapterInfoText");
    if (chapterInfo) {
      chapterInfo.insertAdjacentElement("afterend", box);
    } else {
      document.querySelector(".player-container")?.appendChild(box);
    }

    const scheduleHide = () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (fullscreenBox && !fullscreenBox.matches(":hover")) {
          fullscreenBox.classList.add("fullscreen-chapterBoxHide");
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
        fullscreenBox.classList.remove("fullscreen-chapterBoxHide");
      }
    };

    if (chapterInfo) {
      chapterInfo.addEventListener("mouseenter", showBoxIfFullscreen);
      chapterInfo.addEventListener("mouseleave", () => {
        if (isFullscreen) scheduleHide();
      });
    }
    if (box) {
      box.addEventListener("mouseenter", () => {
        if (isFullscreen) cancelHide();
      });
      box.addEventListener("mouseleave", () => {
        if (isFullscreen) scheduleHide();
      });
    }

    player.on("enterfullscreen", () => {
      isFullscreen = true;
      const chapterInfo = document.getElementById("ChapterInfoText");
      if (chapterInfo && chapterInfo.matches(":hover")) {
        showBoxIfFullscreen();
      } else {
        fullscreenBox.classList.add("fullscreen-chapterBoxHide");
      }
    });
    player.on("exitfullscreen", () => {
      isFullscreen = false;
      cancelHide();
      fullscreenBox.classList.add("fullscreen-chapterBoxHide");
    });
  }

  // Update the small current-chapter text and button highlighting
  function updateChapterDisplay(player, cues) {
    const currentTime = player.currentTime;
    const activeCue =
      [...cues].find(
        (cue) => cue.startTime <= currentTime && cue.endTime >= currentTime,
      ) ?? null;
    if (currentChapterInfoElement) {
      currentChapterInfoElement.textContent = activeCue ? activeCue.text : "";
    }
    highlightCurrentChapter(currentTime, cues);
  }

  // Handle chapters track
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
    console.warn("No chapters track found.");
    const container = document.getElementById("chapters-ui");
    if (container) container.textContent = "Chapters not supported.";
    updateChapterButton();
  }

  // Create ChapterInfoText element next to play button
  const playPauseButton = document.querySelector(
    'button.plyr__control[data-plyr="play"]',
  );
  const ChapterInfo = document.createElement("p");
  ChapterInfo.id = "ChapterInfoText";
  ChapterInfo.textContent = "";
  if (playPauseButton && !isChapterInfoAdded) {
    playPauseButton.insertAdjacentElement("afterend", ChapterInfo);
    isChapterInfoAdded = true;
  }
  currentChapterInfoElement = ChapterInfo;

  // Update chapter info on timeupdate
  if (chaptersTrack && chaptersTrack.cues) {
    player.on("timeupdate", () => {
      if (chaptersTrack.cues && chaptersTrack.cues.length > 0) {
        updateChapterDisplay(player, chaptersTrack.cues);
      }
    });
  }

  const handleKeyDown = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    // Prevent repeated events for space
    if (e.repeat) return;

    if (e.code === "Space") {
      e.preventDefault();
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
      return;
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        player.fullscreen.toggle();
        break;
      case "Escape":
        if (document.fullscreenElement) {
          e.preventDefault();
          document.exitFullscreen().catch((err) => console.warn(err));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        player.volume = Math.min(1, player.volume + 0.1);
        break;
      case "ArrowDown":
        e.preventDefault();
        player.volume = Math.max(0, player.volume - 0.1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        player.currentTime = Math.max(0, player.currentTime - 10);
        break;
      case "ArrowRight":
        e.preventDefault();
        player.currentTime = Math.min(player.duration, player.currentTime + 10);
        break;
      case "f":
      case "F":
        e.preventDefault();
        player.fullscreen.toggle();
        break;
      case "m":
      case "M":
        e.preventDefault();
        player.muted = !player.muted;
        break;
      default:
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown, false);

  // Cleanup on player destroy
  player.on("destroy", () => {
    window.removeEventListener("keydown", handleKeyDown);
  });
}

// ---------- Add custom button to settings menu (نمایش فصل ها) ----------
function ChapterBtnInit() {
  const settingsMenu = document.querySelector(
    '.plyr__menu__container [role="menu"]',
  );
  if (!settingsMenu) {
    console.warn("Settings menu not found for Chapter button");
    return;
  }
  if (document.getElementById("CHBTN")) return;

  const ChapterBtn = document.createElement("button");
  ChapterBtn.type = "button";
  ChapterBtn.className = "plyr__control";
  ChapterBtn.id = "CHBTN";
  ChapterBtn.setAttribute("role", "menuitem");
  ChapterBtn.innerText = "نمایش فصل ها";

  ChapterBtn.addEventListener("click", () => {
    const chapterBox = document.getElementById("chapters-ui");
    if (!chapterBox) return;
    const isHidden =
      chapterBox.style.display === "none" || chapterBox.style.display === "";
    if (isHidden) {
      if (typeof toast !== "undefined" && toast.info)
        toast.info("منو سرفصل ها باز شد", "");
      chapterBox.style.display = "flex";
    } else {
      if (typeof toast !== "undefined" && toast.info)
        toast.info("منو سرفصل ها بسته شد", "");
      chapterBox.style.display = "none";
    }
  });

  settingsMenu.appendChild(ChapterBtn);
}
