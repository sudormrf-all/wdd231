// Course data
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands-on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// DOM elements
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.nav');
const coursesGrid = document.getElementById('coursesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCreditsSpan = document.getElementById('totalCredits');
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');

// State
let currentFilter = 'all';
let filteredCourses = [...courses];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeDateInfo();
    initializeCourseFiltering();
    renderCourses();
    calculateTotalCredits();
});

// Navigation functionality
function initializeNavigation() {
    navToggle.addEventListener('click', toggleNavigation);

    // Close navigation when clicking outside
    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target) && !navToggle.contains(event.target)) {
            closeNavigation();
        }
    });

    // Handle keyboard navigation
    navToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleNavigation();
        }
    });

    // Close navigation on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('active')) {
            closeNavigation();
            navToggle.focus();
        }
    });
}

function toggleNavigation() {
    const isOpen = navigation.classList.contains('active');

    if (isOpen) {
        closeNavigation();
    } else {
        openNavigation();
    }
}

function openNavigation() {
    navigation.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
}

function closeNavigation() {
    navigation.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
}

// Date initialization
function initializeDateInfo() {
    // Set current year
    const currentYear = new Date().getFullYear();
    if (currentYearSpan) {
        currentYearSpan.textContent = currentYear;
    }

    // Set last modified date
    const lastModified = document.lastModified;
    const formattedDate = new Date(lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = formattedDate;
    }
}

// Course filtering initialization
function initializeCourseFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const filter = button.dataset.filter;
            setActiveFilter(button);
            filterCourses(filter);
        });
    });
}

// Course rendering
function renderCourses() {
    if (!coursesGrid) return;

    coursesGrid.innerHTML = '';

    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = `course-card ${course.completed ? 'course-card--completed' : 'course-card--incomplete'}`;

    const techTags = course.technology.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    const statusClass = course.completed ? 'status--success' : 'status--error';
    const statusText = course.completed ? 'Completed' : 'In Progress';

    card.innerHTML = `
    <div class="course-card__header">
      <div class="course-card__code">${course.subject} ${course.number}</div>
      <div class="course-card__credits">${course.credits} Credits</div>
    </div>
    <h3 class="course-card__title">${course.title}</h3>
    <p class="course-card__description">${course.description}</p>
    <div class="course-card__tech">${techTags}</div>
    <div class="course-card__status">
      <span class="status ${statusClass}">${statusText}</span>
    </div>
  `;

    return card;
}

// Filter functionality
function setActiveFilter(activeButton) {
    filterButtons.forEach(button => {
        button.classList.remove('active');
        button.classList.remove('btn--primary');
        button.classList.add('btn--secondary');
    });

    activeButton.classList.add('active');
    activeButton.classList.remove('btn--secondary');
    activeButton.classList.add('btn--primary');
}

function filterCourses(filter) {
    currentFilter = filter;

    // Filter courses based on the selected filter
    if (filter === 'all') {
        filteredCourses = [...courses];
    } else {
        filteredCourses = courses.filter(course => course.subject === filter);
    }

    // Re-render courses and update credits
    renderCourses();
    calculateTotalCredits();

    // Announce the change for screen readers
    announceFilterChange();
}

// Credit calculation using reduce function
function calculateTotalCredits() {
    const totalCredits = filteredCourses.reduce((total, course) => {
        return total + course.credits;
    }, 0);

    if (totalCreditsSpan) {
        totalCreditsSpan.textContent = totalCredits;

        // Add animation effect
        totalCreditsSpan.style.transform = 'scale(1.1)';
        totalCreditsSpan.style.transition = 'transform 0.2s ease';

        setTimeout(() => {
            totalCreditsSpan.style.transform = 'scale(1)';
        }, 200);
    }
}

// Accessibility enhancements
function announceFilterChange() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';

    const courseCount = filteredCourses.length;
    const filterText = currentFilter === 'all' ? 'all courses' : `${currentFilter} courses`;
    const creditsText = totalCreditsSpan ? totalCreditsSpan.textContent : '0';
    announcement.textContent = `Showing ${courseCount} ${filterText}. Total credits: ${creditsText}.`;

    document.body.appendChild(announcement);

    // Remove announcement after screen readers have had time to read it
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Smooth scrolling for internal links
document.addEventListener('click', (event) => {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle resize events for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile navigation on resize to desktop
        if (window.innerWidth >= 768 && navigation && navigation.classList.contains('active')) {
            closeNavigation();
        }
    }, 250);
});

// Performance optimization: Debounced function utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for course rendering
function handleRenderError(error) {
    console.error('Error rendering courses:', error);
    if (coursesGrid) {
        coursesGrid.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 2rem; color: var(--color-error);">
        <p>Sorry, there was an error loading the courses. Please try refreshing the page.</p>
      </div>
    `;
    }
}

// Safe rendering wrapper
function safeRenderCourses() {
    try {
        renderCourses();
    } catch (error) {
        handleRenderError(error);
    }
}

// Initialize with error handling
function initializeApplication() {
    try {
        initializeNavigation();
        initializeDateInfo();
        initializeCourseFiltering();
        renderCourses();
        calculateTotalCredits();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Enhanced DOMContentLoaded event
document.addEventListener('DOMContentLoaded', initializeApplication);

// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}