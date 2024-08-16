const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to get streaming URLs
app.post('/start-stream', async (req, res) => {
  const { streamUrl, rtmpUrl } = req.body;
  console.log(streamUrl, rtmpUrl);
  if (!streamUrl || !rtmpUrl) {
    return res.status(400).send('streamUrl and rtmpUrl are required');
  }

  // Use Docker to start streaming
  const command = `docker run -p 80:80 --rm  --env 'FFMPEG_OPTION=1' --env 'STREAMING_URL=${streamUrl}' --env 'RTMP_URL=[f=flv]${rtmpUrl}'  sathish14/ffmpe-dev:v6`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Streaming failed');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send('Streaming started');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

