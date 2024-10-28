require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;

// Initialize Monaco Editor
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: [
            '// JavaScript Example',
            'function greet() {',
            '    console.log("Hello, World!");',
            '}',
            '',
            'greet();'
        ].join('\n'),
        language: 'javascript',
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

    // Create a new iframe for the user JavaScript
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    outputDiv.appendChild(iframe);

    const userCode = editor.getValue();
    const iframeDoc = iframe.contentWindow.document;

    // Capture console.log outputs
    const originalConsoleLog = iframe.contentWindow.console.log;

    iframe.contentWindow.console.log = function (...args) {
        const output = document.createElement('div');
        output.style.color = 'white'; // Set the text color to white
        output.textContent = args.join(' ');
        outputDiv.insertBefore(output, outputDiv.firstChild); // Prepend output to the output div
        originalConsoleLog.apply(console, args); // Call the original console.log for debugging
    };

    try {
        // Write user code to the iframe
        iframeDoc.open();
        iframeDoc.write(`
            <script>
                ${userCode}
            <\/script>
        `);
        iframeDoc.close();
    } catch (error) {
        console.error('Error in user code:', error);
        outputDiv.innerHTML = 'Error in user code: ' + error.message;
    }
}
