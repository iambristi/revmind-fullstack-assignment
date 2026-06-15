# RevMind AI - NovaBite Consumer Goods Dashboard

## Overview

This project is a full-stack business intelligence dashboard for NovaBite Consumer Goods.

The application provides:

* KPI dashboard
* Monthly revenue trend visualization
* Product performance table
* AI-powered business chatbot

---

## Tech Stack

### Frontend

* React (Vite)
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* SQLite
* Better-SQLite3

### LLM

* Google Gemini 2.5 Flash

---

# How to Run the Project Locally

## 1. Clone the repository

```bash
git clone <repository-url>
cd revmind-fullstack-assignment
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Create .env file

Create a file named `.env` inside the backend folder:

```env
GEMINI_API_KEY=your_api_key_here
```

## 4. Seed the database

```bash
node seed.js
```

This creates `db.sqlite` from the provided CSV dataset.

## 5. Start backend server

```bash
npm start
```

Server runs on:

```text
http://localhost:5000
```

## 6. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## 7. Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# LLM Used

I used **Google Gemini 2.5 Flash**.

Reasons:

* Fast response times
* Easy API integration
* Generous free tier
* Good performance for business analytics and question answering

---

# Prompt Structure Used in /api/chat

The chatbot receives:

1. User question
2. Business summary context

Example structure:

```text
You are a business analyst for NovaBite Consumer Goods.

Business Summary:
{summary data}

Question:
{user question}

Rules:
- Give concise answers
- Maximum 3 sentences
- Do not show raw JSON
- Respond like a business dashboard assistant
```

For the five required assignment questions, SQL-based calculations are used to ensure accurate

## What I Would Improve With More Time

* Add streaming AI responses for a more interactive chat experience.
* Add filtering by region, channel, and category.
* Add additional charts such as revenue by category and revenue by region.
* Improve prompt engineering for more accurate business insights.
* Add automated tests for API endpoints.

## Tradeoffs and Shortcuts

* SQLite was used instead of a hosted database to keep deployment simple.
* The five required business questions are answered using SQL queries to guarantee accuracy.
* Gemini is used as a fallback for general business questions.
* UI styling was kept simple to focus on functionality and assignment requirements.

