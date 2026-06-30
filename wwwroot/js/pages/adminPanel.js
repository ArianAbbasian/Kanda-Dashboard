document.addEventListener("DOMContentLoaded", function () {
  // Load initial table data
  if (typeof loadTableUsers === "function") {
    const tbody = document.getElementById("tableBody");
    if (tbody)
      tbody.innerHTML =
        '<tr><td colspan="12" class="loading-msg">در حال بارگذاری...</td></tr>';
    loadTableUsers(1);
  }
  // Initialize modal
  if (typeof initModal === "function") initModal();

  // Initialize filter with callback to reload table
  if (typeof initFilter === "function") {
    initFilter((page, filters) => {
      // When filters change, reload the table
      if (typeof loadTableUsers === "function") {
        loadTableUsers(page);
      }
    });
  }

  // Initialize tabs
  if (typeof initTabs === "function") initTabs();

  if (typeof updateSelectedUserCount === "function") updateSelectedUserCount();

  // Add copy emails button
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋 کپی ایمیل‌های انتخاب‌شده";
  copyBtn.className = "copy-emails-btn";
  copyBtn.style.margin = "10px";
  copyBtn.addEventListener("click", () => {
    const selectedIds = getSelectedUserIdsFromLocalStorage();
    if (selectedIds.length === 0) {
      toast.warning("کاربری انتخاب نشده است", "هشدار");
      return;
    }
    // Extract emails from currently displayed table rows
    const rows = document.querySelectorAll("#tableBody tr");
    const emails = [];
    rows.forEach((row) => {
      const id = row.getAttribute("data-user-id");
      if (id && selectedIds.includes(id)) {
        const emailCell = row.querySelector("td:nth-child(6)"); // email column
        if (emailCell) {
          emails.push(emailCell.textContent.trim());
        }
      }
      // Back to top button
      const topBtn = document.createElement("button");
      topBtn.textContent = "⬆️";
      topBtn.type = "button";
      topBtn.style.cssText =
        "position:fixed;bottom:30px;right:30px;z-index:9999;width:40px;height:40px;border-radius:50%;background:#3498db;color:white;border:none;font-size:20px;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.3);";
      topBtn.title = "بازگشت به بالا";
      document.body.appendChild(topBtn);

      window.addEventListener("scroll", () => {
        topBtn.style.display = window.scrollY > 300 ? "flex" : "none";
      });
      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      topBtn.style.transition = "transform 0.2s, box-shadow 0.2s";
      topBtn.addEventListener(
        "mouseenter",
        () => (topBtn.style.transform = "scale(1.1)"),
      );
      topBtn.addEventListener(
        "mouseleave",
        () => (topBtn.style.transform = "scale(1)"),
      );
    });
    if (emails.length > 0) {
      navigator.clipboard
        .writeText(emails.join("\n"))
        .then(() => {
          toast.success("ایمیل‌ها کپی شدند", "موفقیت");
        })
        .catch(() => {
          toast.error("خطا در کپی ایمیل‌ها", "خطا");
        });
    } else {
      toast.info("ایمیلی برای کپی یافت نشد", "اطلاعیه");
    }
  });
  // Append button near the table or under pagination
  const paginationDiv = document.getElementById("pagination");
  if (paginationDiv) {
    paginationDiv.parentNode.insertBefore(copyBtn, paginationDiv.nextSibling);
  } else {
    document.querySelector(".users-section")?.appendChild(copyBtn);
  }

  // CSV Export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "📥 دریافت CSV انتخاب‌شده‌ها";
  exportBtn.className = "csv-export-btn";
  exportBtn.style.margin = "10px";
  exportBtn.addEventListener("click", () => {
    const selectedIds = getSelectedUserIdsFromLocalStorage();
    if (selectedIds.length === 0) {
      toast.warning("کاربری انتخاب نشده است", "هشدار");
      return;
    }
    const rows = document.querySelectorAll("#tableBody tr");
    const csvData = [
      [
        "نام",
        "نام خانوادگی",
        "نام کاربری",
        "ایمیل",
        "تلفن",
        "استان",
        "شهر",
        "نوع کاربر",
      ],
    ];
    rows.forEach((row) => {
      const id = row.getAttribute("data-user-id");
      if (id && selectedIds.includes(id)) {
        const cells = row.querySelectorAll("td");
        csvData.push([
          cells[2].textContent.trim(),
          cells[3].textContent.trim(),
          cells[4].textContent.trim(),
          cells[5].textContent.trim(),
          cells[6].textContent.trim(),
          cells[7].textContent.trim(),
          cells[8].textContent.trim(),
          cells[9].textContent.trim(),
        ]);
      }
    });
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
    toast.success("فایل CSV آماده شد", "موفقیت");
  });
  const paginationDiv = document.getElementById("pagination");
  if (paginationDiv) {
    paginationDiv.parentNode.insertBefore(exportBtn, paginationDiv.nextSibling);
  } else {
    document.querySelector(".users-section")?.appendChild(exportBtn);
  }

  // Auto logout after 20 minutes of inactivity
  let logoutTimer;
  const LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes
  function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      toast.warning("به دلیل عدم فعالیت از سیستم خارج شدید", "خروج");
      setTimeout(() => {
        window.location.href = "/Auth/Logout";
      }, 2000);
    }, LOGOUT_TIME);
  }
  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach((evt) =>
    document.addEventListener(evt, resetLogoutTimer, true),
  );
  resetLogoutTimer();

  // Clear all selections button
  const clearSelBtn = document.createElement("button");
  clearSelBtn.textContent = "❌ لغو انتخاب همه";
  clearSelBtn.className = "clear-selection-btn";
  clearSelBtn.style.margin = "10px";
  clearSelBtn.addEventListener("click", () => {
    clearLocalStorageSelection();
    // Uncheck all row checkboxes and remove selected-row class
    document.querySelectorAll(".row-select-checkbox").forEach((cb) => {
      cb.checked = false;
      const row = cb.closest("tr");
      if (row) row.classList.remove("selected-row");
    });
    const selectAll = document.getElementById("selectAllCheckbox");
    if (selectAll) selectAll.checked = false;
    updateSelectedUserCount();
    toast.info("انتخاب همه کاربران لغو شد", "");
  });

  const uploadBtn = document.getElementById("uploadVideoBtn");
  const fileInput = document.getElementById("videoFile");
  if (uploadBtn && fileInput) {
    uploadBtn.disabled = true;
    fileInput.addEventListener("change", () => {
      uploadBtn.disabled = !fileInput.files.length;
    });
  }

  const paginationDiv = document.getElementById("pagination");
  if (paginationDiv) {
    paginationDiv.parentNode.insertBefore(
      clearSelBtn,
      paginationDiv.nextSibling,
    );
  } else {
    document.querySelector(".users-section")?.appendChild(clearSelBtn);
  }

  // مدیریت ویدیوها
  function loadVideoList() {
    fetch("/Video/GetVideos")
      .then((res) => res.json())
      .then((videos) => {
        const container = document.getElementById("videoListContainer");
        if (!container) return;
        if (videos.length === 0) {
          container.innerHTML = "<p>هیچ ویدیویی آپلود نشده است.</p>";
          return;
        }
        container.innerHTML = videos
          .map(
            (v) => `
                <div style="display:flex; align-items:center; gap:10px; padding:8px; border-bottom:1px solid #ddd;">
                    <span>${v.title}</span>
                    <span style="color:#888; font-size:0.9em;">(${v.fileName})</span>
                    <button class="delete-video-btn" data-id="${v.id}" style="margin-left:auto; background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">حذف</button>
                </div>
            `,
          )
          .join("");
        // Attach delete events
        document.querySelectorAll(".delete-video-btn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (!confirm("آیا از حذف ویدیو اطمینان دارید؟")) return;
            const res = await fetch("/Video/DeleteVideo", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `id=${id}`,
            });
            const result = await res.json();
            if (result.success) {
              toast.success(result.message, "موفقیت");
              loadVideoList();
            } else {
              toast.error(result.message, "خطا");
            }
          });
        });
      });
  }

  document
    .getElementById("uploadVideoBtn")
    ?.addEventListener("click", async () => {
      const title = document.getElementById("videoTitle").value.trim();
      const fileInput = document.getElementById("videoFile");
      const file = fileInput.files[0];
      if (!title || !file) {
        toast.warning("عنوان و فایل ویدیو را وارد کنید", "هشدار");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      const progress = document.getElementById("uploadProgress");
      progress.style.display = "block";
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/Video/Upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            progress.value = (e.loaded / e.total) * 100;
          }
        };
        xhr.onload = () => {
          progress.style.display = "none";
          const resp = JSON.parse(xhr.responseText);
          if (resp.success) {
            toast.success(resp.message, "موفقیت");
            fileInput.value = "";
            document.getElementById("videoTitle").value = "";
            progress.value = 0;
            loadVideoList();
          } else {
            toast.error(resp.message, "خطا");
          }
        };
        xhr.onerror = () => {
          progress.style.display = "none";
          toast.error("خطا در آپلود فایل", "خطا");
        };
        xhr.send(formData);
      } catch (err) {
        console.error(err);
        toast.error("خطای غیرمنتظره", "خطا");
      }
    });

  // لود اولیه لیست
  if (document.getElementById("videoListContainer")) {
    loadVideoList();
  }
});
