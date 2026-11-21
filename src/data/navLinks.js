export const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
    { id: 'testimonials', label: 'Testimonials' },
]

// Links shown in the "More ▾" dropdown (drops down from the top-right corner).
// Add a new link = add one line here.
//   - { label, id }              → smooth-scrolls to a section (same as navLinks)
//   - { label, href: '#about' }  → plain anchor
//   - { label, href: '/path/' }  → another page
//   - add external: true         → opens in a new tab
export const moreLinks = [
    { label: 'Food Delivery', href: '/food_devliery/', icon: '🍔' },
    { label: 'YouTube', href: 'https://www.youtube.com/playlist?list=PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6', icon: '📺', external: true },
    { label: 'Telegram', href: 'https://t.me/palolol', icon: '✈️', external: true },
]

// How many "More" links fit in the top row (left → right).
// Any extra links continue down the right edge (top-right → bottom-right).
export const MORE_ROW_MAX = 4