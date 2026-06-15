import fs from "fs";
import csv from "csv-parser";
import Database from "better-sqlite3";

const db = new Database("db.sqlite");

db.exec(`
DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
  transaction_id TEXT,
  date TEXT,
  month TEXT,
  quarter TEXT,
  sku TEXT,
  product_name TEXT,
  category TEXT,
  subcategory TEXT,
  region TEXT,
  channel TEXT,
  sales_rep TEXT,
  units_sold INTEGER,
  unit_price_usd REAL,
  gross_revenue_usd REAL,
  discount_pct REAL,
  net_revenue_usd REAL,
  cogs_usd REAL,
  gross_profit_usd REAL
);
`);

const insert = db.prepare(`
INSERT INTO sales VALUES (
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)
`);

fs.createReadStream("../data/novabite_sales_data.csv")
  .pipe(csv())
  .on("data", (row) => {
    insert.run(
      row.transaction_id,
      row.date,
      row.month,
      row.quarter,
      row.sku,
      row.product_name,
      row.category,
      row.subcategory,
      row.region,
      row.channel,
      row.sales_rep,
      row.units_sold,
      row.unit_price_usd,
      row.gross_revenue_usd,
      row.discount_pct,
      row.net_revenue_usd,
      row.cogs_usd,
      row.gross_profit_usd
    );
  })
  .on("end", () => {
    console.log("Database seeded successfully!");
  });