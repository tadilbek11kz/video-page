// DOM Elements
const elements = {
    scenes: {
        "scene-1": document.querySelector('#scene-1'),
        "scene-2": document.querySelector('#scene-2'),
        "scene-3": document.querySelector('#scene-3')
    },
    modal: document.querySelector('.modal'),
    closeButton: document.querySelector('#close'),
    player: null,
    controlButton: document.querySelector('#control'),
    choices: document.querySelector('.choices'),
    canvas: document.querySelector('#transition'),
    options: document.querySelector('#options'),
    progress: document.querySelector('#progress'),
    title: document.querySelector('#title'),
    skip: document.querySelector('.skip'),
    sidebarToggle: document.querySelector('#sidebarToggle'),
    sidebar: document.querySelector('#sidebar')
};

// Initialize YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    elements.player = new YT.Player('video', {
        class: 'video',
        width: '300%',
        height: '100%',
        playerVars: {
            autoplay: 1,        // Auto-play video
            mute: 0,           // Start unmuted
            controls: 0,       // Hide default controls
            modestbranding: 1, // Minimal YT branding
            playsinline: 1,    // Play inline on mobile
            rel: 0,           // Don't show related videos
            enablejsapi: 1     // Enable JavaScript API
        },
        events: {
            onReady: onPlayerReady,
        }
    });
}

// Setup player when ready
function onPlayerReady(event) {
    setInterval(updateProgress, 200); // Update progress every 200ms

    // Add click handlers to all scenes
    Object.entries(elements.scenes).forEach(([sceneId, element]) => {
        element.addEventListener('click', () => initializeScene(sceneId));
    });
}

// Video Scene Configuration
const sceneConfig = {
    'scene-1': {
        title: 'How to do morning routine...',
        video: 'LC20A8EYmFU'
    },
    'scene-2': {
        title: 'How to have productive study session...',
        video: 'KSoVfRVSnzE'
    },
    'scene-3': {
        title: 'How to balance studying and relaxation...',
        video: 'Z7eYlPpTa7M'
    }
};

// Choice Tree Configuration for interactive video paths
const choiceTree = {
    "scene-1 Init": {
        "Snooze": "WFCADcWEJ1I",
        "Wake Up": "ThcNmaCMUO0"
    },
    "Snooze": {
        "Try Again": "LC20A8EYmFU"
    },
    "Try Again": {
        "Snooze": "WFCADcWEJ1I",
        "Wake Up": "ThcNmaCMUO0"
    },
    "Wake Up": {
        "Red Bull": "8ol7UBRrzNc",
        "Coffee": "oGVnRouWioU"
    },
    "Red Bull": {
        "TRy Again": "ThcNmaCMUO0"
    },
    "TRy Again": {
        "Red Bull": "8ol7UBRrzNc",
        "Coffee": "oGVnRouWioU"
    },
    "scene-2 Init": {
        "Hangout": "HtMJKuO9e4A",
        "Study": "jc2pZE1qcHI"
    },
    "Hangout": {
        "TrY Again": "KSoVfRVSnzE"
    },
    "TrY Again": {
        "Hangout": "HtMJKuO9e4A",
        "Study": "jc2pZE1qcHI"
    },
    "scene-3 Init": {
        "Burn Out": "H-ByDAjelfE",
        "Relax": "2-INNc_AW5Q"
    },
    "Burn Out": {
        "TRY Again": "Z7eYlPpTa7M"
    },
    "TRY Again": {
        "Burn Out": "H-ByDAjelfE",
        "Relax": "2-INNc_AW5Q"
    }
};

// Create a styled button element
const createButton = (text, className = 'hover:bg-zinc-500 text-white px-6 py-3 rounded-md transition') => {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.className = className;
    button.id = 'option';
    return button;
};

// Fade out canvas transition effect
const fadeOutCanvas = () => {
    let opacity = 1;
    const fade = setInterval(() => {
        opacity -= 0.05;
        elements.canvas.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(fade);
            elements.canvas.style.display = 'none';
        }
    }, 30);
};

// Handle video transitions between choices
const handleVideoTransition = (videoSrc, button) => {
    elements.choices.classList.remove('show');

    elements.player.pauseVideo();
    elements.player.loadVideoById(videoSrc);

    // Generate new choice buttons if available
    elements.options.innerHTML = '';
    if (choiceTree[button.innerHTML.trim()]) {
        Object.keys(choiceTree[button.innerHTML.trim()]).forEach(option => {
            const newButton = createButton(option);
            newButton.addEventListener('click', () => handleVideoTransition(choiceTree[button.innerHTML.trim()][option], newButton));
            elements.options.appendChild(newButton);
        });
    }
};

// Toggle video sound
const toggleSound = () => {
    elements.player.isMuted() ? elements.player.unMute() : elements.player.mute();
    const icon = elements.player.isMuted() ? 'volume-2' : 'volume-off';
    elements.controlButton.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i>`;
    lucide.createIcons();
};

// Update progress bar and handle video states
const updateProgress = () => {
    const value = (elements.player.getCurrentTime() / elements.player.getDuration()) * 100;
    elements.progress.style.width = `${value}%`;

    // Show skip button after 10%
    if (value > 10) {
        elements.skip.classList.add('show');
    }

    // Show choices near end
    if (value > 95 && elements.choices.children.length !== 0) {
        elements.skip.classList.remove('show');
        elements.choices.classList.add('show');
    }

    // Pause at end
    if (value > 99) {
        elements.player.pauseVideo();
    }
};

// Skip to near end of video
const skipVideo = () => {
    elements.player.seekTo(elements.player.getDuration() * 0.94);
}

// Reset modal and video state
const closeModal = () => {
    elements.modal.classList.remove('show');
    elements.choices.classList.remove('show');
    elements.player.pauseVideo();
    elements.player.seekTo(0);
    elements.controlButton.innerHTML = '<i data-lucide="volume-2" class="w-6 h-6"></i>';
    elements.progress.style.width = '0%';
    lucide.createIcons();
};

// Initialize new scene
const initializeScene = (sceneId) => {
    const scene = sceneConfig[sceneId];
    elements.player.loadVideoById(scene.video);
    elements.title.innerHTML = scene.title;

    // Generate initial choice buttons
    elements.options.innerHTML = '';
    Object.keys(choiceTree[`${sceneId} Init`]).forEach(option => {
        const button = createButton(option);
        button.addEventListener('click', () => handleVideoTransition(choiceTree[`${sceneId} Init`][option], button));
        elements.options.appendChild(button);
    });

    elements.modal.classList.add('show');
};

// Toggle sidebar visibility
const sidebarToggle = () => {
    elements.sidebar.classList.toggle('-translate-x-full');
};

// Close sidebar when clicking outside
const handleSidebarClose = (e) => {
    if (!elements.sidebar.contains(e.target) && !elements.sidebarToggle.contains(e.target)) {
        elements.sidebar.classList.add('-translate-x-full');
    }
};

// Event Listeners
elements.controlButton.addEventListener('click', toggleSound);
elements.closeButton.addEventListener('click', closeModal);
elements.skip.addEventListener('click', skipVideo);
elements.sidebarToggle.addEventListener('click', sidebarToggle);
document.addEventListener('click', handleSidebarClose);

// Initialize icons when DOM is loaded
document.addEventListener('DOMContentLoaded', lucide.createIcons);