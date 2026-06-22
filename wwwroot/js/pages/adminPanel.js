document.addEventListener("DOMContentLoaded", function () {
  // Load initial table data
  if (typeof loadTableUsers === "function") {
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

  const paginationDiv = document.getElementById("pagination");
  if (paginationDiv) {
    paginationDiv.parentNode.insertBefore(
      clearSelBtn,
      paginationDiv.nextSibling,
    );
  } else {
    document.querySelector(".users-section")?.appendChild(clearSelBtn);
  }
});
