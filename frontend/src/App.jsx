import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!summary) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>NovaBite Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Total Revenue</h3>
          <p>${summary.totalRevenue}</p>
        </div>

        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Gross Margin</h3>
          <p>{summary.margin}%</p>
        </div>

        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Top Region</h3>
          <p>{summary.topRegion}</p>
        </div>
      </div>
    </div>
  );
}

export default App;