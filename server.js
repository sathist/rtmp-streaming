const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create 'hls' root directory if it doesn't exist
if (!fs.existsSync("hls")) {
  fs.mkdirSync("hls");
}

// Serve static files (for index.html)
app.use(express.static(path.join(__dirname, "public")));

// Function to generate a safe folder name from URL
const getSafeFolderName = (url) => {
  const filename = path.basename(new URL(url).pathname);
  return filename.replace(/[^a-zA-Z0-9_-]/g, "") || crypto.randomBytes(6).toString("hex");
};

// Endpoint to start streaming
app.post("/start-stream", async (req, res) => {
  const { streamUrl } = req.body;

  if (!streamUrl) {
    return res.status(400).send("streamUrl is required");
  }

  // Create a unique folder based on file name
  const folderName = getSafeFolderName(streamUrl);
  const outputFolder = path.join("hls", folderName);
  console.log("folderName", folderName)

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // let command;

  // if (outputType === "rtmp") {
  //   // Convert MP4 to RTMP and stream it
  //   command = `ffmpeg -re -i "${streamUrl}" \
  //   -c:v libx264 -preset ultrafast -b:v 3000k -maxrate 3500k -bufsize 6000k \
  //   -c:a aac -b:a 128k -ar 44100 -strict -2 \
  //   -f flv rtmp://your-rtmp-server/live/stream-key`;
  // } else {
  //   // Convert MP4 to HLS for web streaming
  //   command = `ffmpeg -re -i "${streamUrl}" \
  //   -c:v libx264 -preset ultrafast -tune zerolatency -g 25 -sc_threshold 0 \
  //   -b:v 1500k -maxrate 1500k -bufsize 3000k -c:a aac -b:a 128k \
  //   -hls_time 2 -hls_list_size 5 -hls_flags delete_segments \
  //   -f hls "hls/stream.m3u8"`;
  // }

  const command = `ffmpeg -re -i "${streamUrl}" \
    -c:v libx264 -preset ultrafast -tune zerolatency -g 25 -sc_threshold 0 \
    -b:v 1500k -maxrate 1500k -bufsize 3000k -c:a aac -b:a 128k \
    -hls_time 2 -hls_list_size 5 -hls_flags delete_segments \
    -f hls "${outputFolder}/stream.m3u8"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Streaming failed");
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.json({ message: "Streaming started", streamUrl: `/hls/${folderName}/stream.m3u8` });
  });
});

// Serve HLS files dynamically
app.use("/hls", express.static("hls"));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});





