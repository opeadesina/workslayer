// filepath: /Users/workslayer/source/Codetraining/workslayer/DomSelection/script.js

// Select the <header> element with the id "toolbar"
const toolbar = document.getElementById('toolbar');

// Attach a click event listener to the toolbar
toolbar.addEventListener('click', (event) => {
  // Check if the clicked element is a button with the attribute data-toggle-theme
  if (event.target.matches('button[data-toggle-theme]')) {
    // Toggle the "dark" class on the document body
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
  }
});