# Live Streaming with HLS

This project allows you to stream a YouTube video using HLS (HTTP Live Streaming) and play it in a web browser using Video.js.

## Requirements
- A server capable of handling the streaming process.
- `video.js` for video playback in the browser.
- A YouTube video URL for streaming.

## API Endpoint: Start Stream
### HTTP POST Request
```
POST http://URL/start-stream
```

### Sample Request
```bash
curl --location 'http://URL/start-stream' \  
--header 'Content-Type: application/json' \  
--data '{
  "streamUrl": "https://www.youtube.com/watch?v=WR8PyAhn6tQ&list=RDWR8PyAhn6tQ&start_radio=1",
  "outputType": "hls"
}'
```

## Frontend (HTML File)
The `index.html` file contains a simple video player using `video.js` to play the HLS stream.

Post method return video path. Change video endpoint `/hls/Big_Buck_Bunny_720_10s_1MBmp4/stream.m3u8`.
src="http://localhost:3000/hls/Big_Buck_Bunny_720_10s_1MBmp4/stream.m3u8
### Sample index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Stream</title>
  <link href="https://cdn.jsdelivr.net/npm/video.js/dist/video-js.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/video.js/dist/video.js"></script>
</head>
<body>

  <h1>Live Stream</h1>
  <video id="my-video" class="video-js vjs-default-skin" controls autoplay width="640" height="360">
    <source src="http://localhost:3000/hls/Big_Buck_Bunny_720_10s_1MBmp4/stream.m3u8" type="application/x-mpegURL">
  </video>

  <script>
    var player = videojs('my-video');
  </script>

</body>
</html>
```

## How to Run
1. Start the server that handles the streaming process.
2. Make a POST request to `http://URL/start-stream` with the required JSON payload.
3. Open `index.html` in a browser to view the stream.

## Notes
- Replace `http://URL/start-stream` with your actual streaming server URL.
- The video source URL (`http://localhost:3000/hls/stream.m3u8`) should match the one provided by your backend service.
- Ensure CORS policies allow requests from your frontend to your backend.

## License
This project is licensed under the MIT License.

