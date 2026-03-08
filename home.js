const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const mousePos = { x: 0, y: 0 };
const cursorLink = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
    const rect = document.body.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
    
    const mouseXEl = document.getElementById('mouse-x');
    const mouseYEl = document.getElementById('mouse-y');
    if (mouseXEl) mouseXEl.textContent = Math.round(mousePos.x);
    if (mouseYEl) mouseYEl.textContent = Math.round(mousePos.y);

    cursorDot.style.left = `${mousePos.x}px`;
    cursorDot.style.top = `${mousePos.y}px`;
});

const loopCursor = () => {
    const dx = mousePos.x - cursorLink.x;
    const dy = mousePos.y - cursorLink.y;
    cursorLink.x += dx * 0.12;
    cursorLink.y += dy * 0.12;
    
    cursorOutline.style.left = `${cursorLink.x}px`;
    cursorOutline.style.top = `${cursorLink.y}px`;
    requestAnimationFrame(loopCursor);
};
loopCursor();

const updateTime = () => {
    const now = new Date();
    const timestampEl = document.getElementById('timestamp');
    if (timestampEl) {
        timestampEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + " GET";
    }
};
setInterval(updateTime, 1000);
updateTime();

const navOverlay = document.getElementById('nav-overlay');
const triggers = document.querySelectorAll('.trigger-nav');
const closers = document.querySelectorAll('.trigger-nav-close');

triggers.forEach(el => el.addEventListener('click', () => navOverlay.classList.add('active')));
closers.forEach(el => el.addEventListener('click', () => navOverlay.classList.remove('active')));

const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');
const renderMsEl = document.getElementById('render-ms');

let width, height;
const charSize = 14; 
const densityChars = " .:-=+*#%@"; 

function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

let time = 0;
function render() {
    const start = performance.now();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `600 ${charSize}px DM Sans`;
    ctx.textAlign = 'center';
    
    const colsCount = Math.ceil(width / charSize);
    const rowsCount = Math.ceil(height / charSize);

    for (let y = 0; y < rowsCount; y++) {
        for (let x = 0; x < colsCount; x++) {
            const posX = x * charSize;
            const posY = y * charSize;
            
            const dx = posX - mousePos.x;
            const dy = posY - mousePos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            const noise = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time * 0.5);
            const proximity = Math.max(0, 1 - dist / 300);
            
            if (noise > 0.2 || proximity > 0.4) {
                const charIdx = Math.floor((noise + 1) * 0.5 * densityChars.length);
                const char = densityChars[charIdx % densityChars.length];
                
                ctx.fillStyle = proximity > 0.5 ? '#c96b4d' : '#7a8d7d';
                ctx.globalAlpha = 0.2 + proximity * 0.6;
                ctx.fillText(char, posX, posY);
            }
        }
    }

    time += 0.005;
    if (renderMsEl) {
        renderMsEl.textContent = (performance.now() - start).toFixed(1);
    }
    requestAnimationFrame(render);
}
render();

// Transition to projects page
const linkProjects = document.getElementById('link-projects');
if (linkProjects) {
    linkProjects.addEventListener('click', (e) => {
        e.preventDefault();
        // Trigger transition
        if (window.transitionToProjects) {
            window.transitionToProjects();
        }
    });
}

// Also trigger on scroll down
let scrollTimeout;
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.transitionToProjects) {
                window.transitionToProjects();
            }
        }, 100);
    }
}, { passive: true });
