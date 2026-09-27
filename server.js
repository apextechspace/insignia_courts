import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve vendor files directly if available from node_modules
app.use('/vendor/react', express.static(path.join(__dirname, 'node_modules/react/umd')));
app.use('/vendor/react-dom', express.static(path.join(__dirname, 'node_modules/react-dom/umd')));

// Serve static assets from root directory
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  dotfiles: 'allow'
}));

// Root route serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Single Page Application fallback for HTML navigation
app.get('*', (req, res, next) => {
  // If the request has a file extension or targets uploads/assets, do not fall back to index.html
  if (path.extname(req.path) || req.path.startsWith('/uploads/') || req.path.startsWith('/vendor/')) {
    return res.status(404).type('text/plain').send('Not found');
  }

  // Only serve index.html for standard GET page requests accepting HTML
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
      if (err) {
        if (!res.headersSent) {
          if (err.status === 416 || err.name === 'RangeNotSatisfiableError') {
            return res.status(416).type('text/plain').send('Range Not Satisfiable');
          }
          next(err);
        }
      }
    });
  } else {
    res.status(404).type('text/plain').send('Not found');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.status === 416 || err.name === 'RangeNotSatisfiableError') {
    return res.status(416).type('text/plain').send('Range Not Satisfiable');
  }
  console.error('Server error:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).type('text/plain').send(err.message || 'Internal Server Error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
