document.addEventListener('DOMContentLoaded', function () {
    // Load initial table data
    if (typeof loadTableUsers === 'function') {
        loadTableUsers(1);
    }
    // Initialize modal
    if (typeof initModal === 'function') initModal();

    // Initialize filter with callback to reload table
    if (typeof initFilter === 'function') {
        initFilter((page, filters) => {
            // When filters change, reload the table
            if (typeof loadTableUsers === 'function') {
                loadTableUsers(page);
            }
        });
    }

    // Initialize tabs
    if (typeof initTabs === 'function') initTabs();
});