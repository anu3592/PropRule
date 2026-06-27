/**
 * PropRules Theme Sync — theme.js
 * Must be loaded SYNCHRONOUSLY (no defer) as early as possible
 * to prevent flash of wrong theme.
 */
(function() {
    var saved = localStorage.getItem('theme');
    // Default to dark if no preference saved
    var theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();
