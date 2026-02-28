// Dynamic Text Slider Logic
function initSlider() {
    const mainTitle = document.querySelector('.main-title');
    const sliderContainer = document.querySelector('.text-slider');
    const sliderInner = document.querySelector('.slider-inner');
    const words = Array.from(sliderInner.children);

    let currentIndex = 0;
    const totalWords = words.length;

    // Force spans to not wrap so they can be measured cleanly without parent restrictions
    words.forEach(w => {
        w.style.whiteSpace = 'nowrap';
        w.style.width = 'max-content'; // Ensure they ignore parent bounds when measured
    });

    function updateSlider() {
        // Measure the current word naturally
        const currentWord = words[currentIndex];
        const wordWidth = currentWord.getBoundingClientRect().width;

        // Animate the container's width to fit the word perfectly
        sliderContainer.style.width = `${wordWidth}px`;

        // Setup timings
        let nextDelay = 1000; // Fast rotation for Life and Style
        if (currentIndex === 1) nextDelay = 1800;
        if (currentIndex === 2) nextDelay = 3000; // Double duration pause for Lifestyle focal point

        setTimeout(() => {
            // Fade out the word that is flying away
            const exitingWord = words[currentIndex];
            exitingWord.style.transition = 'opacity 0.8s ease-in-out';
            exitingWord.style.opacity = '0';

            currentIndex++;

            // Ensure transition is ON before sliding
            sliderInner.style.transition = 'transform 0.8s ease-in-out';
            const translateY = -(0.65 + (currentIndex * 1.3));
            sliderInner.style.transform = `translateY(${translateY}em)`;

            if (currentIndex === totalWords - 1) {
                // We just started sliding to the duplicate word. 
                // Update width to match "Life" immediately.
                sliderContainer.style.width = `${words[0].getBoundingClientRect().width}px`;

                setTimeout(() => {
                    // Invisible snap back after the slide animation finishes (0.8s)
                    sliderInner.style.transition = 'none';
                    sliderInner.style.transform = `translateY(-0.65em)`;
                    currentIndex = 0;

                    // Reset all words back to full opacity instantly
                    words.forEach(w => {
                        w.style.transition = 'none';
                        w.style.opacity = '1';
                    });

                    // Give the browser a frame to register the instant snap before the next timed loop
                    requestAnimationFrame(() => {
                        updateSlider();
                    });
                }, 800);
                return; // Jump out so we don't double loop
            }

            // If not resetting, loop normally
            updateSlider();
        }, nextDelay);
    }

    // Init first word
    sliderContainer.style.width = `${words[0].getBoundingClientRect().width}px`;
    sliderInner.style.transform = `translateY(-0.65em)`;

    // We only want to kick off the loop once
    if (!window.sliderInitialized) {
        window.sliderInitialized = true;
        // Start the recursive loop after a small 500ms initial breather
        setTimeout(updateSlider, 500);
    }
}

document.addEventListener("DOMContentLoaded", initSlider);
window.addEventListener("load", () => {
    // Re-trigger the accurate width assignment now that web fonts are guaranteed loaded
    const sliderContainer = document.querySelector('.text-slider');
    const currentWord = document.querySelector('.slider-inner').children[0];
    sliderContainer.style.width = `${currentWord.getBoundingClientRect().width}px`;
});
