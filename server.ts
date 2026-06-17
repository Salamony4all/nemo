import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client if api key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const ai = getGeminiClient();

// 1. Server-side Gemini AI assistant route
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Graceful fallback for local development without API keys
      return res.json({
        text: `Salam! (Welcome to Nemo Tours). Currently, the Gemini Assistant is operating in offline discovery mode as the API secret is loading. But I can tell you Marsa Alam tours are available starting from $85, with snorkeling with dolphins, and hotel pickups! How else can I help?`,
      });
    }

    // Construct the context & recent history formatted smoothly
    const systemInstruction = 
      "You are the official Nemo Tours (نيمو تورز) Travel Coach, an elite customer advocate specialized in " +
      "Egyptian luxury excursions, particularly Marsa Alam yacht trips, dolphin snorkeling, and Red Sea adventures. " +
      "Your tone is professional, warm, and highly cultured, adhering to the 'Alexandria' premium design look. " +
      "Provide literal helpful guidance with pricing details (Marsa Alam starting at $85/person, VIP cruising, " +
      "78 Abdel Salam Aref, Alexandria address, phone 01100086772). " +
      "Keep answers concise (under 3 or 4 clear bullet points or 1-2 friendly paragraphs). Always mention how they can " +
      "use the 'Nemo Media Hub' tab to watch dynamic reels and download photos/videos natively to their device!";

    // Prepare contents array
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.status(500).json({
      error: "Could not consult our Nemo AI Assistant right now. " + error.message,
    });
  }
});

// 2. Native File Downloader CORS Proxy
// Streams files (reels, images) directly from external servers so the browser can download them
// with appropriate Content-Disposition headers (natively save).
app.get("/api/download", async (req, res) => {
  try {
    const fileUrl = req.query.url as string;
    const fileName = (req.query.name as string) || "nemo-adventure-asset";

    if (!fileUrl) {
      return res.status(400).send("Parameter 'url' is required.");
    }

    // Ensure the request is fetching safe resources (images, video streams, or facebook assets)
    if (
      !fileUrl.startsWith("https://") &&
      !fileUrl.startsWith("http://")
    ) {
      return res.status(400).send("Invalid protocol.");
    }

    console.log(`Proxying download request for: ${fileUrl}`);

    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch secure asset: Status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    
    // Detect extension from content type or URL
    let extension = "";
    if (contentType.includes("image/jpeg")) extension = ".jpg";
    else if (contentType.includes("image/png")) extension = ".png";
    else if (contentType.includes("video/mp4")) extension = ".mp4";
    else if (contentType.includes("video/")) extension = ".mp4";
    else if (fileUrl.includes(".jpg") || fileUrl.includes(".jpeg")) extension = ".jpg";
    else if (fileUrl.includes(".png")) extension = ".png";
    else if (fileUrl.includes(".mp4")) extension = ".mp4";

    const cleanFileName = fileName.endsWith(extension) ? fileName : `${fileName}${extension}`;

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(cleanFileName)}"`
    );

    // Stream the body using built-in high-performance web streams
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(Buffer.from(value));
        await pump();
      };
      await pump();
    } else {
      res.status(500).send("No content body stream available.");
    }
  } catch (error: any) {
    console.error("Downloader endpoint error:", error);
    res.status(500).send("Failed to retrieve or save the requested media asset natively.");
  }
});

// Setup dev server with Vite, or static bundle for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with active Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving pre-bundled static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nemo Tours full-stack server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
