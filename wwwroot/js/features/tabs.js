function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.dataset.tab;
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');

                if (tabId === 'info-tab' && typeof loadCharts === 'function') {
                    loadCharts();
                }
            }
        });
    });

    if (document.getElementById('info-tab')?.classList.contains('active')) {
        if (typeof loadCharts === 'function') {
            loadCharts();
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initTabs();
});