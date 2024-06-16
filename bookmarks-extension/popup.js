document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveButton').addEventListener('click', () => {
        let noteName = document.getElementById('noteName').value;
        chrome.storage.sync.set({ obsidianNote: noteName }, () => {
            console.log('Note name saved:', noteName); // Log note name saved
        });
    });
});

