function openTab(tabName) {
    // Hide all tab contents first (keep them in the DOM but hide them)
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.opacity = '0';
        tabContents[i].style.transform = 'translateY(20px)';
        setTimeout(() => {
            tabContents[i].classList.remove('active');
        }, 300); // Wait for fade out animation
    }
    
    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Find the button that opened the tab and add active class immediately
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase() === tabName) {
            button.classList.add('active');
        }
    });
    
    // Show the selected tab content with delay for smooth transition
    setTimeout(() => {
        const selectedTab = document.getElementById(tabName);
        selectedTab.classList.add('active');
        // Allow a tiny delay for the display:block to take effect before animating opacity
        setTimeout(() => {
            selectedTab.style.opacity = '1';
            selectedTab.style.transform = 'translateY(0)';
        }, 50);
    }, 350); // Slightly longer than the hide animation
}

// Initialize to make sure the active tab is properly displayed
document.addEventListener('DOMContentLoaded', function() {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.style.opacity = '1';
        activeTab.style.transform = 'translateY(0)';
    }
});
