// Store references to DOM elements for easy access
const elements = {
    slider: document.querySelector('#slider'),
    pageIndicator: document.querySelector('#pageIndicator'),
    prevButton: document.querySelector('#prevBtn'),
    nextButton: document.querySelector('#nextBtn'),
    sidebarToggle: document.querySelector('#sidebarToggle'),
    sidebar: document.querySelector('#sidebar')
}

// Team member data with names and bios
const teamMembers = [
    { name: 'David Foster', bio: 'Hey, I’m David! I was all over this project — filming, designing the logo and video covers, acting, editing, and even proofreading. Basically, I had my hands in everything, and I loved every second of it. This site and the film are a mix of all those late nights, crazy ideas, and some pretty awesome teamwork.' },
    { name: 'Adilbek Tursynbek', bio: 'Let’s leave it as it is...' },
    { name: 'Samira Aldybergenova', bio: 'Hey, my name is Samira ! i am a third year EE major at NYUAD. i love coding, reading, design, and tennis :)' },
    { name: 'Uditi Sharma', bio: 'Hi! I’m Uditi, a Sophomore majoring in computer science and minoring in IM! This was my first time ever working with film, and it was a great learning experience. As someone who had never held a digital camera before, seeing the process of what goes into making a film was very interesting. I hope to keep learning about new things that I wouldn’t have thought of through future IM classes :)' },
];

// Track current slide position
let currentSlide = 0;

// Generate HTML for a team member slide
const createSlide = (member, index) => {
    return `
        <div class="slide ${index === currentSlide ? 'active' : ''}" data-index="${index}">
            <div class="h-full flex flex-col md:flex-row">
                <div class="flex w-full md:w-1/2 bg-zinc-600/50 flex items-center justify-center p-4">
                    <img src="assets/images/team/${index + 1}.jpeg" alt="${member.name}" class="rounded-full w-64 h-64 object-cover" />
                </div>
                <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 class="text-2xl font-bold mb-2 text-white">${member.name}</h2>
                    <p class="text-gray-400">${member.bio}</p>
                </div>
            </div>
        </div>
    `;
}

// Update slider content and page indicator
const updateSlider = () => {
    elements.slider.innerHTML = teamMembers.map((member, index) => createSlide(member, index)).join('');
    elements.pageIndicator.textContent = `Page ${currentSlide + 1} of ${teamMembers.length}`;
}

// Handle slide transitions with fade effects
const changeSlide = (direction) => {
    const slides = document.querySelectorAll('.slide');
    const currentSlideElement = slides[currentSlide];

    // Add fade out animation
    currentSlideElement.classList.add('fade-out');

    // Wait for fade out, then update slide
    setTimeout(() => {
        // Calculate new slide index with wraparound
        currentSlide = (currentSlide + direction + teamMembers.length) % teamMembers.length;
        updateSlider();
        slides[currentSlide].classList.add('fade-in');
    }, 500);
}

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

// Set up event listeners
elements.prevButton.addEventListener('click', () => changeSlide(-1));
elements.nextButton.addEventListener('click', () => changeSlide(1));
elements.sidebarToggle.addEventListener('click', sidebarToggle);
document.addEventListener('click', handleSidebarClose);

// Initialize slider and icons when DOM loads
document.addEventListener('DOMContentLoaded', updateSlider);
document.addEventListener('DOMContentLoaded', lucide.createIcons);