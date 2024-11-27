// DOM Elements
const elements = {
    scenes: {
        "scene-1": document.querySelector('#scene-1'),
        "scene-2": document.querySelector('#scene-2'),
        "scene-3": document.querySelector('#scene-3')
    },
    modal: document.querySelector('.modal'),
    closeButton: document.querySelector('#close'),
    player: document.querySelector('#video'),
    controlButton: document.querySelector('#control'),
    choices: document.querySelector('.choices'),
    canvas: document.querySelector('#transition'),
    options: document.querySelector('#options'),
    progress: document.querySelector('#progress'),
    title: document.querySelector('#title'),
    skip: document.querySelector('.skip')
};

// Video Scene Configuration
const sceneConfig = {
    'scene-1': {
        title: 'How to do morning routine...',
        video: 'assets/videos/morning-habits.mp4'
    },
    'scene-2': {
        title: 'How to have productive study session...',
        video: 'assets/videos/academics.mp4'
    },
    'scene-3': {
        title: 'How to balance studying and relaxation...',
        video: 'assets/videos/balance.mp4'
    }
};

// Choice Tree Configuration
const choiceTree = {
    "scene-1 Init": {
        "Snooze": "assets/videos/snooze.mp4",
        "Wake Up": "assets/videos/wake-up.mp4"
    },
    "Snooze": {
        "Try Again": "assets/videos/morning-habits.mp4"
    },
    "Try Again": {
        "Snooze": "assets/videos/snooze.mp4",
        "Wake Up": "assets/videos/wake-up.mp4"
    },
    "Wake Up": {
        "Red Bull": "assets/videos/redbull.mp4",
        "Coffee": "assets/videos/coffee.mp4"
    },
    "Red Bull": {
        "TRy Again": "assets/videos/wake-up.mp4"
    },
    "TRy Again": {
        "Red Bull": "assets/videos/redbull.mp4",
        "Coffee": "assets/videos/coffee.mp4"
    },
    "scene-2 Init": {
        "Hangout": "assets/videos/hangout.mp4",
        "Study": "assets/videos/study.mp4"
    },
    "Hangout": {
        "TrY Again": "assets/videos/academics.mp4"
    },
    "TrY Again": {
        "Hangout": "assets/videos/hangout.mp4",
        "Study": "assets/videos/study.mp4"
    },
    "scene-3 Init": {
        "Burn Out": "assets/videos/burn-out.mp4",
        "Relax": "assets/videos/relax.mp4"
    },
    "Burn Out": {
        "TRY Again": "assets/videos/balance.mp4"
    },
    "TRY Again": {
        "Burn Out": "assets/videos/burn-out.mp4",
        "Relax": "assets/videos/relax.mp4"
    }
};

// Utility Functions
const createButton = (text, className = 'hover:bg-zinc-500 text-white px-6 py-3 rounded-md transition') => {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.className = className;
    button.id = 'option';
    return button;
};

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

const handleVideoTransition = (videoSrc, button) => {
    const ctx = elements.canvas.getContext('2d');
    elements.canvas.width = elements.player.clientWidth;
    elements.canvas.height = elements.player.clientHeight;

    ctx.drawImage(video, 0, 0, elements.canvas.width, elements.canvas.height);
    elements.canvas.style.display = 'block';
    elements.choices.classList.remove('show');

    elements.player.pause();
    elements.player.style.height = elements.canvas.height + 'px';
    elements.player.src = videoSrc;

    elements.options.innerHTML = '';
    if (choiceTree[button.innerHTML.trim()]) {
        Object.keys(choiceTree[button.innerHTML.trim()]).forEach(option => {
            const newButton = createButton(option);
            newButton.addEventListener('click', () => handleVideoTransition(choiceTree[button.innerHTML.trim()][option], newButton));
            elements.options.appendChild(newButton);
        });
    }

    elements.player.load();
    elements.player.addEventListener('canplay', function onCanPlay() {
        elements.player.play();
        elements.player.style.height = 'auto';
        fadeOutCanvas();
        elements.player.removeEventListener('canplay', onCanPlay);
    });
};

// Event Handlers
const toggleSound = () => {
    elements.player.muted = !elements.player.muted;
    const icon = elements.player.muted ? 'volume-off' : 'volume-2';
    elements.controlButton.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i>`;
    lucide.createIcons();
};

const updateProgress = () => {
    const value = (elements.player.currentTime / elements.player.duration) * 100;
    elements.progress.style.width = `${value}%`;
    if (value > 10) {
        elements.skip.classList.add('show');
    }

    if (value > 95 && elements.choices.children.length !== 0) {
        elements.skip.classList.remove('show');
        elements.choices.classList.add('show');
    }

};

const skipVideo = () => {
    elements.player.currentTime = elements.player.duration * 0.94;
}

const closeModal = () => {
    elements.modal.classList.remove('show');
    elements.choices.classList.remove('show');
    elements.player.pause();
    elements.player.currentTime = 0;
    elements.controlButton.innerHTML = '<i data-lucide="volume-2" class="w-6 h-6"></i>';
    elements.progress.style.width = '0%';
    lucide.createIcons();
};

const initializeScene = (sceneId) => {
    const scene = sceneConfig[sceneId];
    elements.player.src = scene.video;
    elements.title.innerHTML = scene.title;

    elements.options.innerHTML = '';
    Object.keys(choiceTree[`${sceneId} Init`]).forEach(option => {
        const button = createButton(option);
        button.addEventListener('click', () => handleVideoTransition(choiceTree[`${sceneId} Init`][option], button));
        elements.options.appendChild(button);
    });

    elements.modal.classList.add('show');
};

// Event Listeners
elements.controlButton.addEventListener('click', toggleSound);
elements.player.addEventListener('timeupdate', updateProgress);
elements.closeButton.addEventListener('click', closeModal);
elements.skip.addEventListener('click', skipVideo);

Object.entries(elements.scenes).forEach(([sceneId, element]) => {
    element.addEventListener('click', () => initializeScene(sceneId));
});

// Initialize
document.addEventListener('DOMContentLoaded', lucide.createIcons);