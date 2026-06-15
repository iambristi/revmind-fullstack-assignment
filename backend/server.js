import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();

app.use(express.json());

app.use(cors());

const db = new Database("db.sqlite");

/*app.get("/api/summary", (req, res) => {
  const result = db.prepare(`
    SELECT
      ROUND(SUM(net_revenue_usd),2) as totalRevenue,
      SUM(units_sold) as totalUnits,
      ROUND(
        SUM(gross_profit_usd) * 100.0 /
        SUM(net_revenue_usd),2
      ) as margin
    FROM sales
  `).get();

  res.json(result);
});
*/

app.get("/api/summary", (req, res) => {

  const summary = db.prepare(`
    SELECT
      ROUND(SUM(net_revenue_usd),2) as totalRevenue,
      SUM(units_sold) as totalUnits,
      ROUND(
        SUM(gross_profit_usd) * 100.0 /
        SUM(net_revenue_usd),2
      ) as margin
    FROM sales
  `).get();

  const topRegion = db.prepare(`
    SELECT region
    FROM sales
    GROUP BY region
    ORDER BY SUM(net_revenue_usd) DESC
    LIMIT 1
  `).get();

  const topChannel = db.prepare(`
    SELECT channel
    FROM sales
    GROUP BY channel
    ORDER BY SUM(net_revenue_usd) DESC
    LIMIT 1
  `).get();

  const topProduct = db.prepare(`
    SELECT product_name
    FROM sales
    GROUP BY product_name
    ORDER BY SUM(net_revenue_usd) DESC
    LIMIT 1
  `).get();

  res.json({
    ...summary,
    topRegion: topRegion.region,
    topChannel: topChannel.channel,
    topProduct: topProduct.product_name
  });

});

app.get("/api/trends", (req, res) => {

  const trends = db.prepare(`
    SELECT
      month,
      ROUND(SUM(net_revenue_usd),2) as revenue
    FROM sales
    GROUP BY month
    ORDER BY month
  `).all();

  res.json(trends);

});

app.get("/api/products", (req, res) => {

  const products = db.prepare(`
    SELECT
      product_name,
      ROUND(SUM(net_revenue_usd),2) as revenue,
      SUM(units_sold) as units
    FROM sales
    GROUP BY product_name
    ORDER BY revenue DESC
  `).all();

  res.json(products);

});

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    const q = question.toLowerCase();

    // Question 1
    if (
      q.includes("highest net revenue") &&
      q.includes("q1") &&
      q.includes("2024")
    ) {
      const result = db.prepare(`
        SELECT
          region,
          ROUND(SUM(net_revenue_usd), 2) AS revenue
        FROM sales
        WHERE quarter = 'Q1-2024'
        GROUP BY region
        ORDER BY revenue DESC
        LIMIT 1
      `).get();

      return res.json({
        answer: `${result.region} had the highest net revenue in Q1 2024 with $${result.revenue}.`
      });
    }

    // Question 2
    if (
      q.includes("snacks") &&
      q.includes("margin")
    ) {
      const result = db.prepare(`
        SELECT
          ROUND(
            SUM(gross_profit_usd) * 100.0 /
            SUM(net_revenue_usd),
            2
          ) AS margin
        FROM sales
        WHERE category = 'Snacks'
      `).get();

      return res.json({
        answer: `The gross profit margin for the Snacks category is ${result.margin}%.`
      });
    }

    // Question 3
    if (
      q.includes("sales rep") &&
      q.includes("2025")
    ) {
      const result = db.prepare(`
        SELECT
          sales_rep,
          SUM(units_sold) AS units
        FROM sales
        WHERE month LIKE '2025%'
        GROUP BY sales_rep
        ORDER BY units DESC
        LIMIT 1
      `).get();

      return res.json({
        answer: `${result.sales_rep} sold the most units in 2025 with ${result.units} units.`
      });
    }

    // Question 4
    if (
      q.includes("e-commerce") &&
      q.includes("modern trade")
    ) {
      const result = db.prepare(`
    SELECT
      channel,
      ROUND(SUM(net_revenue_usd),2) AS revenue
    FROM sales
    WHERE channel IN ('E-Commerce','Modern Trade')
    GROUP BY channel
  `).all();

      const ecommerce = result.find(
        item => item.channel === "E-Commerce"
      );

      const modernTrade = result.find(
        item => item.channel === "Modern Trade"
      );

      return res.json({
        answer: `E-Commerce generated $${ecommerce.revenue} in net revenue, while Modern Trade generated $${modernTrade.revenue}.`
      });
    }
    // Question 5
    if (
      q.includes("best performing product") &&
      q.includes("west")
    ) {
      const result = db.prepare(`
        SELECT
          product_name,
          ROUND(SUM(net_revenue_usd),2) AS revenue
        FROM sales
        WHERE region='West'
        GROUP BY product_name
        ORDER BY revenue DESC
        LIMIT 1
      `).get();

      return res.json({
        answer: `${result.product_name} was the best performing product in the West region with revenue of $${result.revenue}.`
      });
    }

    // Gemini fallback for other questions

    const summary = db.prepare(`
      SELECT
        ROUND(SUM(net_revenue_usd),2) as totalRevenue,
        SUM(units_sold) as totalUnits,
        ROUND(
          SUM(gross_profit_usd) * 100.0 /
          SUM(net_revenue_usd),2
        ) as margin
      FROM sales
    `).get();

    const prompt = `
You are a business analyst for NovaBite Consumer Goods.

Business Summary:
${JSON.stringify(summary)}

Question:
${question}

Rules:
- Give concise answers.
- Maximum 3 sentences.
- Do not show raw JSON.
- Do not show calculations.
- Do not list transaction records.
- Respond like a business dashboard assistant.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      answer: response.text,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      answer: error.message,
    });
  }
});

app.get("/api/chat", (req, res) => {
  res.json({
    message: "Chat API is working. Use POST request."
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
