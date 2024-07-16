const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());

// Serve static files (optional, depends on your project structure)
app.use(express.static('public'));

// Endpoint to stream video
app.get('/api/media/:filename', (req, res) => {
  const { filename } = req.params;
  const pathToFile = path.join(__dirname, 'videos', filename);

  // Ensure the file exists
  if (!fs.existsSync(pathToFile)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(pathToFile);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const fileStream = fs.createReadStream(pathToFile, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    fileStream.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(pathToFile).pipe(res);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
