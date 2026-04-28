function renderPagination(currentPage, totalPages, onPageChange) {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;

    paginationDiv.innerHTML = '';
    paginationDiv.className = 'pagination';

    if (totalPages <= 1) return;

    const prevButton = createButton('‹', currentPage > 1, () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    }, 'nav-btn');
    paginationDiv.appendChild(prevButton);

    const pages = getVisiblePages(currentPage, totalPages);

    pages.forEach(page => {
        if (page === '...') {
            const dotSpan = document.createElement('span');
            dotSpan.textContent = '...';
            dotSpan.className = 'pagination-dots';
            paginationDiv.appendChild(dotSpan);
        } else {
            const pageButton = createButton(page.toString(), true, () => onPageChange(page));
            if (page === currentPage) {
                pageButton.classList.add('active');
                pageButton.disabled = true;
            }
            paginationDiv.appendChild(pageButton);
        }
    });

    const nextButton = createButton('›', currentPage < totalPages, () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    }, 'nav-btn');
    paginationDiv.appendChild(nextButton);
}

// Page Callcolation 
function getVisiblePages(currentPage, totalPages) {
    const pages = [];

    if (totalPages <= 5) {
        // Show all pages if its less than 5 pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show the first Page
        pages.push(1);

        if (currentPage <= 3) {
            // Close To Beggin
            pages.push(2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            // Close To End
            pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            // Middle
            pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return pages;
}

// Button Maker
function createButton(text, enabled, clickHandler, extraClass = '') {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'page-btn';
    if (extraClass) {
        button.classList.add(extraClass);
    }
    button.disabled = !enabled;
    if (enabled) {
        button.addEventListener('click', clickHandler);
    }
    return button;
}