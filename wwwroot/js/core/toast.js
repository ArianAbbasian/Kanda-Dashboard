const toastConfig = {
    duration: 5000,        
    position: 'top-left' 
};

function initToastStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast-container {
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
            width: 100%;
        }
        
        .toast-container.top-left {
            top: 20px;
            left: 20px;
        }
        
        .toast-container.top-center {
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .toast-container.top-right {
            top: 20px;
            right: 20px;
        }
        
        .toast-container.bottom-left {
            bottom: 20px;
            left: 20px;
        }
        
        .toast-container.bottom-center {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .toast-container.bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .toast {
            background: white;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            animation: toastSlideIn 0.3s ease;
            border-right: 4px solid;
            direction: rtl;
            font-family: 'IRANYekan', sans-serif;
        }
        
        .toast.success {
            border-right-color: #2ecc71;
        }
        
        .toast.success .toast-icon {
            background: #2ecc71;
        }
        
        .toast.error {
            border-right-color: #e74c3c;
        }
        
        .toast.error .toast-icon {
            background: #e74c3c;
        }
        
        .toast.warning {
            border-right-color: #f39c12;
        }
        
        .toast.warning .toast-icon {
            background: #f39c12;
        }
        
        .toast.info {
            border-right-color: #3498db;
        }
        
        .toast.info .toast-icon {
            background: #3498db;
        }
        
        .toast-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .toast-content {
            flex: 1;
        }
        
        .toast-title {
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 4px;
            color: #2c3e50;
        }
        
        .toast-message {
            font-size: 0.85rem;
            color: #7f8c8d;
            line-height: 1.5;
        }
        
        .toast-close {
            color: #95a5a6;
            cursor: pointer;
            font-size: 18px;
            padding: 0 5px;
            transition: color 0.2s ease;
            flex-shrink: 0;
        }
        
        .toast-close:hover {
            color: #34495e;
        }
        
        @keyframes toastSlideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            to {
                transform: translateY(-20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = `toast-container ${toastConfig.position}`;
        document.body.appendChild(container);
    }
    return container;
}


function showToast(message, type = 'info', title = '', duration = toastConfig.duration) {
    initToastStyles();

    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✗';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">✕</div>
    `;

    container.appendChild(toast);

   
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.2s ease';
        setTimeout(() => toast.remove(), 200);
    });

    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.2s ease';
                setTimeout(() => toast.remove(), 200);
            }
        }, duration);
    }

    return toast;
}

const toast = {
    success: (message, title = '') => showToast(message, 'success', title),
    error: (message, title = 'خطا') => showToast(message, 'error', title),
    warning: (message, title = 'هشدار') => showToast(message, 'warning', title),
    info: (message, title = 'اطلاعیه') => showToast(message, 'info', title),
    show: showToast
};