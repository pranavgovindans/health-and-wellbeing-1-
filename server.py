from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
STORE = ROOT / "work" / "published-news.json"

def load_news():
    try:
        return json.loads(STORE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_news(news):
    STORE.parent.mkdir(exist_ok=True)
    STORE.write_text(json.dumps(news, ensure_ascii=False, indent=2), encoding="utf-8")

class VitaWellHandler(SimpleHTTPRequestHandler):
    def send_json(self, value, status=200):
        payload = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == "/api/news":
            return self.send_json(load_news())
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/news":
            return self.send_json({"error": "Not found"}, 404)
        try:
            size = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(size))
            title, copy = data.get("title", "").strip(), data.get("copy", "").strip()
            if not title or not copy:
                return self.send_json({"error": "Headline and copy are required"}, 400)
            news = load_news()
            news.insert(0, {"title": title[:100], "copy": copy[:1500], "date": data.get("date", "")})
            save_news(news)
            return self.send_json({"ok": True, "news": news[0]}, 201)
        except (ValueError, json.JSONDecodeError):
            return self.send_json({"error": "Invalid request"}, 400)

if __name__ == "__main__":
    print("VitaWell server: http://127.0.0.1:8001")
    ThreadingHTTPServer(("127.0.0.1", 8001), VitaWellHandler).serve_forever()
