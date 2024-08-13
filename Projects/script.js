var projectViewing = 1;
var currentHexColor = '#a10171';
const projectCount = document.getElementById('projects').children.length;
const scrollThreshold = ((document.documentElement.scrollHeight - window.innerHeight + (window.innerHeight / 16)) / projectCount);

document.addEventListener('DOMContentLoaded', function() {
    var actualProjectViewing = Math.min(projectCount, Math.max(1, (window.scrollY / scrollThreshold) % 1 == 0 ? (window.scrollY / scrollThreshold) : Math.ceil((window.scrollY / scrollThreshold))));
    projectViewing = actualProjectViewing;

    document.getElementById('projects').style.top = `${(-2 * 0.5 * (window.innerHeight - 150) - 150) * (projectViewing - 1)}px`;
    document.getElementById(`tabIndicator${projectViewing}`).style.backgroundColor = '#ccc9c931';
    changeGradient();
});


document.addEventListener('scroll', () =>{
    if (window.scrollY > (scrollThreshold * projectViewing)) {
        document.getElementById('projects').style.top = `${Number(document.getElementById('projects').style.top.replace('px','')) - 2 * 0.5 * (window.innerHeight - 150) - 150}px`;
        projectViewing++;
        document.getElementById(`tabIndicator${projectViewing}`).style.backgroundColor = '#ccc9c931';
        document.getElementById(`tabIndicator${projectViewing - 1}`).style.backgroundColor = '';
        changeGradient();
    }
    else if (window.scrollY < (scrollThreshold * (projectViewing - 1))){
        document.getElementById('projects').style.top = `${Number(document.getElementById('projects').style.top.replace('px','')) + 2 * 0.5 * (window.innerHeight + 150) - 150}px`;
        projectViewing--;
        document.getElementById(`tabIndicator${projectViewing}`).style.backgroundColor = '#ccc9c931';
        document.getElementById(`tabIndicator${projectViewing + 1}`).style.backgroundColor = '';
        changeGradient();
    }
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        window.location.reload();
    }, 250);
});

function changeGradient() {
    const colors = ['#a10171', '#940505', '#b2b40f']
    startColorTransition(currentHexColor, colors[projectViewing - 1]);
}

function startColorTransition(colorStart, colorEnd) {
    const duration = 1000;
    const startColor = colorStart;
    const endColor = colorEnd;
    const startTime = performance.now();

    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const factor = Math.min(elapsed / duration, 1); // Clamp factor to [0, 1]
        const currentColor = interpolateColor(startRgb, endRgb, factor);
        currentHexColor = rgbToHex(...currentColor);
        document.getElementById('gradient').style.backgroundImage = `linear-gradient(to bottom right, #00000000, ${currentHexColor + '4b'})`;
        
        if (factor < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function hexToRgb(hex) {
    // Convert hex color to RGB
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    // Convert RGB color to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolateColor(color1, color2, factor) {
    // Interpolate between two RGB colors
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}