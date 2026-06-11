import { createServer } from "node:http";
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const host = process.env.HOST || "127.0.0.1";
const startPort = Number(process.env.PORT || 4173);
const clients = new Set();

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".jsx", "text/babel; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".mov", "video/quicktime"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);
const rangeableTypes = new Set([".mp4", ".webm", ".mov"]);

const livePreviewScript = `
<script>
(() => {
  const source = new EventSource("/.liveons-live-reload");
  source.addEventListener("reload", () => location.reload());
  source.onerror = () => {
    console.info("[liveons] live preview connection lost; retrying automatically.");
  };
})();
</script>`;

function isInsideRoot(filePath) {
  const rel = relative(root, filePath);
  return rel === "" || (!rel.startsWith("..") && !rel.includes(`..${sep}`));
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function streamFile(req, res, filePath, type, ext) {
  const fileSize = statSync(filePath).size;
  const baseHeaders = {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "Content-Length": fileSize,
  };

  if (rangeableTypes.has(ext)) {
    baseHeaders["Accept-Ranges"] = "bytes";
  }

  if (req.method === "HEAD") {
    res.writeHead(200, baseHeaders);
    res.end();
    return;
  }

  const range = req.headers.range;
  if (rangeableTypes.has(ext) && range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      res.writeHead(416, { ...baseHeaders, "Content-Range": `bytes */${fileSize}` });
      res.end();
      return;
    }

    let start = match[1] ? Number(match[1]) : 0;
    let end = match[2] ? Number(match[2]) : fileSize - 1;
    if (!match[1] && match[2]) {
      const suffixLength = Number(match[2]);
      start = Math.max(fileSize - suffixLength, 0);
      end = fileSize - 1;
    }

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileSize) {
      res.writeHead(416, { ...baseHeaders, "Content-Range": `bytes */${fileSize}` });
      res.end();
      return;
    }

    end = Math.min(end, fileSize - 1);
    res.writeHead(206, {
      ...baseHeaders,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    });
    createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, baseHeaders);
  createReadStream(filePath).pipe(res);
}

async function findFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let filePath = resolve(root, clean.slice(1));

  if (!isInsideRoot(filePath)) return null;

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath) && !extname(filePath)) {
    const htmlPath = `${filePath}.html`;
    if (existsSync(htmlPath)) filePath = htmlPath;
  }

  if (!isInsideRoot(filePath)) return null;

  try {
    await access(filePath);
    return filePath;
  } catch {
    return null;
  }
}

async function serveFile(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/.liveons-live-reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  const filePath = await findFile(url.pathname === "/" ? "/index.html" : url.pathname);
  if (!filePath) {
    send(res, 404, "Not found");
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const type = mimeTypes.get(ext) || "application/octet-stream";
  if (ext === ".php") {
    send(res, 404, "Not found");
    return;
  }

  if (ext === ".html") {
    const html = await readFile(filePath, "utf8");
    const body = html.includes("</body>")
      ? html.replace("</body>", `${livePreviewScript}\n</body>`)
      : `${html}\n${livePreviewScript}`;
    send(res, 200, body, type);
    return;
  }

  streamFile(req, res, filePath, type, ext);
}

function notifyReload() {
  for (const client of clients) {
    client.write("event: reload\n");
    client.write(`data: ${Date.now()}\n\n`);
  }
}

function shouldReload(filename = "") {
  if (!filename) return true;
  if (filename.includes("node_modules")) return false;
  if (filename.includes(".DS_Store")) return false;
  return /\.(html|css|js|jsx|json|md|svg|png|jpe?g|webp|gif|ico|mp4|webm|mov)$/i.test(filename);
}

let reloadTimer;
watch(root, { recursive: true }, (_event, filename) => {
  if (!shouldReload(String(filename))) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(notifyReload, 120);
});

function listen(port) {
  const server = createServer((req, res) => {
    serveFile(req, res).catch((error) => {
      console.error(error);
      send(res, 500, "Internal server error");
    });
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    console.log(`Liveons live preview: http://${host}:${port}/`);
    console.log("Watching HTML, CSS, JSX, and asset changes. Press Ctrl+C to stop.");
  });
}

listen(startPort);
