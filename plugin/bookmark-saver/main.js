const { Plugin } = require('obsidian');
const http = require('http');

class BookmarkPlugin extends Plugin {
    onload() {
        console.log('Loading Bookmark Plugin...');
        this.startServer();
    }

    onunload() {
        if (this.server) {
            this.server.close();
        }
    }

    startServer() {
        this.server = http.createServer((req, res) => {
            console.log('Received request:', req.url); // Log incoming request

            if (req.method === 'GET' && req.url.startsWith('/create-note')) {
                const urlParams = new URLSearchParams(req.url.split('?')[1]);
                const notePath = urlParams.get('path');
                const content = urlParams.get('content');

                console.log('Note Path:', notePath); // Log note path
                console.log('Content:', content); // Log content

                this.createOrAppendNote(notePath, content)
                    .then(() => {
                        console.log('Note created/updated successfully');
                        res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                        res.end('Note created');
                    })
                    .catch((error) => {
                        console.error('Error creating note:', error); // Log errors
                        res.writeHead(500, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                        res.end('Error creating note');
                    });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                res.end('Not found');
            }
        });

        this.server.listen(3000, () => {
            console.log('Server listening on port 3000'); // Log server status
        });
    }

    async createOrAppendNote(notePath, content) {
        const filePath = `${notePath}.md`;
        const file = this.app.vault.getAbstractFileByPath(filePath);
        
        console.log('File Path:', filePath); // Log file path

        if (file) {
            console.log('File exists, appending content'); // Log file existence
            const fileContent = await this.app.vault.read(file);
            await this.app.vault.modify(file, fileContent + '\n' + content);
        } else {
            console.log('File does not exist, creating new file'); // Log file creation
            await this.app.vault.create(filePath, content);
        }
    }
}

module.exports = BookmarkPlugin;

