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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});