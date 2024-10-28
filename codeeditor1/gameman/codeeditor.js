require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;
let scene, camera, renderer, cube;

// Initialize Monaco Editor
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: [
            '// Three.js Animated Scene Example',
            'const scene = new THREE.Scene();',
            'const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);',
            'const renderer = new THREE.WebGLRenderer();',
            'renderer.setSize(document.getElementById("threejs-output").clientWidth, document.getElementById("threejs-output").clientHeight);',
            'document.getElementById("threejs-output").appendChild(renderer.domElement);',
            '',
            'const geometry = new THREE.BoxGeometry();',
            'const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });',
            'const cube = new THREE.Mesh(geometry, material);',
            'scene.add(cube);',
            '',
            'const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light',
            'scene.add(ambientLight);',
            'const pointLight = new THREE.PointLight(0xffffff, 1, 100);',
            'pointLight.position.set(10, 10, 10);',
            'scene.add(pointLight);',
            '',
            'camera.position.z = 5;',
            '',
            'function animate() {',
            '    requestAnimationFrame(animate);',
            '    cube.rotation.x += 0.01;',
            '    cube.rotation.y += 0.01;',
            '    renderer.render(scene, camera);',
            '}',
            'animate();'
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark'
    });
});

// Run the user's code
function runCode() {
    const outputDiv = document.getElementById("threejs-output");
    outputDiv.innerHTML = ''; // Clear previous output

    // Clear the previous Three.js context
    const existingCanvas = outputDiv.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    const userCode = editor.getValue();

    try {
        // Create a new scene, camera, and renderer for user code
        eval(userCode);
    } catch (error) {
        console.error('Error in user code:', error);
        outputDiv.innerHTML = 'Error in user code: ' + error.message;
    }
}
