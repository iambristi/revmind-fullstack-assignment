import express from "express";
import Database from "better-sqlite3";

const app = express();

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});