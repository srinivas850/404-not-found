require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;

// Initialize Monaco Editor
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '    <meta charset="UTF-8">',
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '    <title>Basic HTML Page</title>',
            '    <style>',
            '        body {',
            '            font-family: Arial, sans-serif;',
            '            background-color: #f0f0f0;',
            '            color: #333;',
            '            margin: 0;',
            '            padding: 20px;',
            '        }',
            '    </style>',
            '</head>',
            '<body>',
            '    <h1>Welcome to My Basic HTML Page</h1>',
            '    <p>This is a simple HTML document.</p>',
            '    <button onclick="alert(\'Button Clicked!\')">Click Me!</button>',
            '</body>',
            '</html>'
        ].join('\n'),
        language: 'html',
        theme: 'vs-dark'
    });
});

// Run the user's code
function runCode() {
    const outputDiv = document.getElementById("threejs-output");
    outputDiv.innerHTML = ''; // Clear previous output

    // Clear the previous output
    const existingFrame = outputDiv.querySelector('iframe');
    if (existingFrame) {
        existingFrame.remove();
    }

    // Create a new iframe for the user HTML
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    outputDiv.appendChild(iframe);

    const userCode = editor.getValue();
    const iframeDoc = iframe.contentWindow.document;

    try {
        // Write user code to the iframe
        iframeDoc.open();
        iframeDoc.write(userCode);
        iframeDoc.close();
    } catch (error) {
        console.error('Error in user code:', error);
        outputDiv.innerHTML = 'Error in user code: ' + error.message;
    }
}
