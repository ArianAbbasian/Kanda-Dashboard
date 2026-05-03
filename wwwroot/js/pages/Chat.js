const editor = document.getElementById("TextEditor");


// ------------------  COMMAND EXECUTION  ------------------
function execCommand(command) {
    document.execCommand(command, false, null);
    editor.focus();
    updateToolbarState();
}


// ------------------  TOOLBAR BTN STATE  ------------------
function updateToolbarState() {
    toggleButtonState("boldButton", document.queryCommandState("bold"));
    toggleButtonState("italicButton", document.queryCommandState("italic"));
    toggleButtonState("underlineButton", document.queryCommandState("underline"));
}

function toggleButtonState(buttonId, isActive) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    if (isActive) btn.classList.add("active");
    else btn.classList.remove("active");
}


// ------------------   IMAGE INSERTION LOGIC  ------------------


function insertImageWithWrapper(src) {
    const wrapper = document.createElement("span");
    wrapper.className = "image-wrapper";
    wrapper.contentEditable = "false"; 

    const img = document.createElement("img");
    img.src = src;

    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-image-btn";
    removeBtn.innerHTML = "&times;";

    removeBtn.onclick = function (event) {
        event.stopPropagation();
        wrapper.remove();
        editor.focus();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);

    editor.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(wrapper);


    const newRange = document.createRange();
    newRange.setStartAfter(wrapper); 
    newRange.collapse(true); 
    selection.removeAllRanges();
    selection.addRange(newRange);
    

    const nextParagraph = document.createElement("p");
    nextParagraph.innerHTML = "<br>"; 
    editor.appendChild(nextParagraph);

    const newSelection = window.getSelection();
    newSelection.selectAllChildren(nextParagraph);
    newSelection.collapseToEnd();

    updateToolbarState();
}


// ------------------   IMAGE UPLOAD (File Chooser)   ------------------
function insertImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        insertImageWithWrapper(e.target.result);
    };

    reader.readAsDataURL(file);
    event.target.value = null;
}


// ------------------   COPY / PASTE IMAGE   ------------------
function handlePaste(e) {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf("image") !== -1) {
            e.preventDefault();
            const file = item.getAsFile();

            const reader = new FileReader();
            reader.onload = (ev) => insertImageWithWrapper(ev.target.result);
            reader.readAsDataURL(file);

            return;
        }
    }
}

// ------------------   DRAG & DROP   ------------------
function handleImageFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        insertImageWithWrapper(e.target.result);
    };
    reader.readAsDataURL(file);
}

function handleDragOver(e) {
    e.preventDefault();
    editor.classList.add("drag-drop-active");
    editor.classList.remove("drag-drop-inactive");
}

function handleDragLeave(e) {
    e.preventDefault();
    editor.classList.remove("drag-drop-active");
    editor.classList.add("drag-drop-inactive");
}

function handleDrop(e) {
    e.preventDefault();
    editor.classList.remove("drag-drop-active");
    editor.classList.add("drag-drop-inactive");

    const file = e.dataTransfer.files[0];
    handleImageFile(file);
}


// ------------------   Editor Init   ------------------
function initializeEditor(toolbarId) {
    const toolbar = document.getElementById(toolbarId);
    const imageUploadInput = toolbar.querySelector("#imageUpload");

    editor.contentEditable = true;
    editor.setAttribute("spellcheck", "false");

    editor.addEventListener("paste", handlePaste);
    editor.addEventListener("keyup", updateToolbarState);
    editor.addEventListener("mouseup", updateToolbarState);

    document.addEventListener("selectionchange", () => {
        if (document.activeElement === editor) updateToolbarState();
    });

    editor.addEventListener("dragover", handleDragOver);
    editor.addEventListener("dragleave", handleDragLeave);
    editor.addEventListener("drop", handleDrop);

    if (imageUploadInput) {
        imageUploadInput.addEventListener("change", insertImage);
    }

    const imageButton = toolbar.querySelector(".insert-image-btn");
    if (imageButton) {
        imageButton.addEventListener("click", () => imageUploadInput.click());
    }

    updateToolbarState();
}

// Start
document.addEventListener("DOMContentLoaded", () => {
    initializeEditor("editorToolbar");
});
