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
});
