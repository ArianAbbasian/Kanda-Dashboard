import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Font,
    Highlight,
    RemoveFormat,
    Alignment,
    List,
    Indent,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    Base64UploadAdapter
} from '/js/scripts/ckeditor5/ckeditor5.js';

let editorInstance;

ClassicEditor
    .create(document.querySelector('#editor'), {
        licenseKey: 'GPL',
        plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Font,
            Highlight,
            RemoveFormat,
            Alignment,
            List,
            Indent,
            Image,
            ImageUpload,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            Base64UploadAdapter
        ],
        toolbar: {
            items: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                'highlight', 'removeFormat', '|',
                'alignment', '|',
                'bulletedList', 'numberedList', 'indent', 'outdent', '|',
                'uploadImage'
            ]
        },
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'resizeImage:25',
                'resizeImage:50',
                'resizeImage:75',
                'resizeImage:original'
            ],
            resizeOptions: [
                { name: 'resizeImage:25', label: '25%', value: '25', icon: 'small' },
                { name: 'resizeImage:50', label: '50%', value: '50', icon: 'medium' },
                { name: 'resizeImage:75', label: '75%', value: '75', icon: 'large' },
                { name: 'resizeImage:original', label: 'Original', value: null, icon: 'original' }
            ],
            resizeUnit: '%'
        }
    })
    .then(editor => {
        editorInstance = editor;
        console.log('✅ CKEditor ready');
    })
    .catch(error => {
        console.error('Editor initialization failed:', error);
    });