import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🤖 OPENAI (ChatGPT) */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   🧠 CHAT API (AI reply)
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).send("AI error");
  }
});

/* =========================
   🔊 VOICE API (ElevenLabs)
========================= */
app.post("/voice", async (req, res) => {
  try {
    const { text, voice } = req.body;

    const voiceId =
      voice === "male"
        ? process.env.MALE_VOICE_ID
        : process.env.FEMALE_VOICE_ID;

    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        text: text,
        model_id: "eleven_multilingual_v2",
      },
      responseType: "arraybuffer",
    });

    res.set("Content-Type", "audio/mpeg");
    res.send(response.data);

  } catch (err) {
    console.log(err);
    res.status(500).send("Voice error");
  }
});

/* =========================
   🚀 SERVER START
========================= */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
