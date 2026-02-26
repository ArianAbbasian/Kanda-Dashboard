function initConfirmModalStyles() {
    if (document.getElementById('confirm-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'confirm-modal-styles';
    style.textContent = `
        .confirm-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            direction: rtl;
            animation: fadeIn 0.2s ease;
        }
        
        .confirm-modal {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalPop 0.3s ease;
        }
        
        .confirm-modal-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .confirm-modal-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 35px;
        }
        
        .confirm-modal-icon.warning {
            background: #fff3e0;
            color: #f39c12;
        }
        
        .confirm-modal-icon.danger {
            background: #fee;
            color: #e74c3c;
        }
        
        .confirm-modal-icon.info {
            background: #e8f4fd;
            color: #3498db;
        }
        
        .confirm-modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .confirm-modal-message {
            color: #7f8c8d;
            font-size: 1rem;
            line-height: 1.6;
            text-align: center;
            margin-bottom: 25px;
        }
        
        .confirm-modal-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .confirm-modal-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'IRANYekan', sans-serif;
            flex: 1;
        }
        
        .confirm-modal-btn.cancel {
            background: #ecf0f1;
            color: #7f8c8d;
        }
        
        .confirm-modal-btn.cancel:hover {
            background: #bdc3c7;
            color: #2c3e50;
        }
        
        .confirm-modal-btn.confirm {
            background: #3498db;
            color: white;
        }
        
        .confirm-modal-btn.confirm:hover {
            background: #2980b9;
        }
        
        .confirm-modal-btn.delete {
            background: #e74c3c;
            color: white;
        }
        
        .confirm-modal-btn.delete:hover {
            background: #c0392b;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalPop {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Showing Modal
function showConfirmModal(options) {
    initConfirmModalStyles();

    return new Promise((resolve) => {
        // ایجاد المان‌ها به صورت مستقیم
        const overlay = document.createElement('div');
        overlay.className = 'confirm-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'confirm-modal';

        // هدر مودال
        const header = document.createElement('div');
        header.className = 'confirm-modal-header';

        const iconType = options.type || 'warning';
        let icon = '⚠️';
        if (iconType === 'danger') icon = '❗';
        if (iconType === 'info') icon = 'ℹ️';

        const iconDiv = document.createElement('div');
        iconDiv.className = `confirm-modal-icon ${iconType}`;
        iconDiv.textContent = icon;

        const title = document.createElement('div');
        title.className = 'confirm-modal-title';
        title.textContent = options.title || 'تأیید';

        const message = document.createElement('div');
        message.className = 'confirm-modal-message';
        message.textContent = options.message || 'آیا اطمینان دارید؟';

        header.appendChild(iconDiv);
        header.appendChild(title);
        header.appendChild(message);

        // دکمه‌ها
        const actions = document.createElement('div');
        actions.className = 'confirm-modal-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'confirm-modal-btn cancel';
        cancelBtn.textContent = options.cancelText || 'انصراف';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = `confirm-modal-btn ${options.confirmClass || 'confirm'}`;
        confirmBtn.textContent = options.confirmText || 'تأیید';

        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);

        // مونتاژ مودال
        modal.appendChild(header);
        modal.appendChild(actions);
        overlay.appendChild(modal);

        // اضافه کردن به DOM
        document.body.appendChild(overlay);

        // event listenerها
        cancelBtn.addEventListener('click', () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            resolve(false);
        });

        confirmBtn.addEventListener('click', () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            resolve(true);
        });

        // بستن با کلیک روی overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                resolve(false);
            }
        });

        // بستن با Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                document.removeEventListener('keydown', escHandler);
                resolve(false);
            }
        };
        document.addEventListener('keydown', escHandler);
    });
}


const confirm = {
    warning: (message, title = 'هشدار') => showConfirmModal({
        type: 'warning',
        title,
        message,
        confirmClass: 'confirm',
        confirmText: 'بله، ادامه بده',
        cancelText: 'خیر'
    }),

    danger: (message, title = 'اخطار') => showConfirmModal({
        type: 'danger',
        title,
        message,
        confirmClass: 'delete',
        confirmText: 'بله، حذف کن',
        cancelText: 'انصراف'
    }),

    delete: (message, title = 'حذف کاربر') => showConfirmModal({
        type: 'danger',
        title,
        message,
        confirmClass: 'delete',
        confirmText: 'بله، حذف کن',
        cancelText: 'انصراف'
    }),

    info: (message, title = 'اطلاعیه') => showConfirmModal({
        type: 'info',
        title,
        message,
        confirmClass: 'confirm',
        confirmText: 'باشه',
        cancelText: 'بستن'
    }),

    custom: (options) => showConfirmModal(options)
};