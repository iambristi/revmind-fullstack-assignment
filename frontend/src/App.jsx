import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [products, setProducts] = useState([]);

  // AI Chat States
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/trends")
      .then((res) => setTrends(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Ask AI Function
  const askQuestion = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          question: question
        }
      );

      setAnswer(res.data.answer);
    } catch (error) {
      console.error(error);

      setAnswer(
        error.response?.data?.answer ||
        "Gemini quota exceeded or server error."
      );
    } finally {
      setLoading(false);
    }
  };

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
          marginBottom: "40px",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            minWidth: "220px",
            textAlign: "center"
          }}
        >
          <h3>Total Net Revenue</h3>
          <p>${summary.totalRevenue}</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            minWidth: "220px",
            textAlign: "center"
          }}
        >
          <h3>Gross Profit Margin</h3>
          <p>{summary.margin}%</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            minWidth: "220px",
            textAlign: "center"
          }}
        >
          <h3>Top Region</h3>
          <p>{summary.topRegion}</p>
        </div>
      </div>

      <h2>Revenue Trend</h2>

      <LineChart
        width={900}
        height={400}
        data={trends}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
        />
      </LineChart>

      <h2 style={{ marginTop: "50px" }}>
        Top Products
      </h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: "20px",
          borderCollapse: "collapse",
          width: "100%"
        }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
            <th>Units Sold</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product_name}</td>
              <td>${product.revenue}</td>
              <td>{product.units}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AI CHAT SECTION */}

      <h2 style={{ marginTop: "50px" }}>
        Ask NovaBite AI
      </h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a business question..."
        style={{
          width: "500px",
          padding: "10px",
          marginRight: "10px"
        }}
      />

      <button
        onClick={askQuestion}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Ask
      </button>

      {loading && (
        <p style={{ marginTop: "20px" }}>
          Thinking...
        </p>
      )}

      {answer && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid gray",
            padding: "15px"
          }}
        >
          <h3>Answer</h3>
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              fontSize: "16px"
            }}
          >
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;