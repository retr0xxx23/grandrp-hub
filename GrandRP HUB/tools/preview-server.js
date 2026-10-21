// Minimal static file server for previewing the rebuilt site locally.
// Usage: node tools\preview-server.js <rootDirectory> [startPort]
// Binds 127.0.0.1, auto-increments the port if it is busy, and opens the
// default browser only after this site is actually being served.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = process.argv[2] || process.cwd();
let port = Number(process.argv[3] || 8080);
const maxPort = Math.min(port + 20, 65535);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";

    const filePath = path.normalize(path.join(root, urlPath));
    if (!filePath.startsWith(path.normalize(root))) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("403 Forbidden");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 Not Found");
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && port < maxPort) {
    port += 1;
    server.listen(port, "127.0.0.1");
    return;
  }
  console.error(`Failed to start: ${err.message}`);
  console.error("Close the program using the port and try again.");
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://localhost:${port}/`;
  console.log(`GrandRP HUB preview: ${url}`);
  console.log(`Serving: ${root}`);
  console.log("Opening your browser...");
  console.log("Press Ctrl+C or close this window to stop.");
  spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
});
