# 🧠 AI Blog Generator

An intelligent **AI-powered Blog Generator** built with **LangChain**, **Google Gemini**, **Express (TypeScript)**, and **Next.js (TypeScript)**.  
It allows users to generate, edit, and manage SEO-optimized blog posts with an elegant UI powered by **ShadCN** and **Tailwind CSS**.

---

## 🚀 Live Demo

https://blog-generator-jet.vercel.app/
---

## ✨ Features

- 📝 **AI Blog Generation** — Generate complete blogs using **Gemini + LangChain**
- 🧩 **Custom Prompts** — Choose tone, topic, and word count
- ⚡ **Full Stack Integration** — Next.js frontend + Express backend (TypeScript)
- 🧠 **SEO Optimization** — Meta description & SEO score suggestions
- 📦 **Export Formats** — Markdown, HTML, PDF
- 🔐 **JWT Authentication** — Protected routes and user sessions
- 💾 **MongoDB Integration** — Stores generated blogs & user data
- 🪄 **Modern UI** — Built with **ShadCN UI**, **Tailwind CSS**, and **Lucide Icons**
- 📱 **Responsive Design** — Works on all screen sizes

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (TypeScript), ShadCN UI, Tailwind CSS |
| **Backend** | Express.js (TypeScript), LangChain, Google Gemini API |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + Zustand Store (Frontend State) |
| **Styling** | ShadCN + TailwindCSS |
| **Deployment** | Vercel (Frontend) & Render / Railway (Backend) |


---

## ⚙️ Environment Variables

Create `.env` files in both frontend and backend folders.

### Backend `.env`
```env

JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters_long

PORT=5000

MONGO_URI==database uri

GEMINI_API_KEY=

NODE_ENV === "production"

