import express from "express";
import Database from "better-sqlite3";

const app = express();

const db = new Database("db.sqlite");

app.get("/api/summary", (req, res) => {
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});