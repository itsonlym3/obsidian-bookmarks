console.log('Background script loaded');

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.obsidianNote) {
        let noteName = changes.obsidianNote.newValue;
        let notePath = `Bookmarks/${noteName}`; // Specify the folder and note name
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let tab = tabs[0];
            let noteContent = `- [${tab.title}](${tab.url})`;

            let serverURL = `http://localhost:3000/create-note?path=${encodeURIComponent(notePath)}&content=${encodeURIComponent(noteContent)}`;

            console.log('Server URL:', serverURL); // Log the server URL

            fetch(serverURL)
                .then(response => {
                    console.log('Response status:', response.status); // Log response status
                    return response.text();
                })
                .then(data => {
                    console.log('Success:', data); // Log success response
                })
                .catch((error) => {
                    console.error('Error:', error); // Log error response
                    console.error('Failed to create note. Ensure the local server is running. Error: ' + error);
                });
        });
    }
});

