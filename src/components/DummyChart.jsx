import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

export default function DummyChart() {
  const data = {
    labels: [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ],
    datasets: [
      {
        data: [120, 180, 150, 240, 210, 260, 230, 280, 320],
        borderColor: "#ff9f43",
        borderWidth: 3,
        tension: 0.4, // 🔥 smooth curve
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(255,159,67,0.35)");
          gradient.addColorStop(1, "rgba(255,159,67,0.02)");
          return gradient;
        },
        pointRadius: 0, // 🔥 trading chart style
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#888" },
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
        ticks: { color: "#888" },
      },
    },
  };

  return (
    <div
      style={{
        height: "350px",
        background: "transparent",
        padding: "20px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
