

import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function Modal({ show, onClose, fundDetail }) {
    const [timeframe, setTimeframe] = useState("all");
    const [secondFundCode, setSecondFundCode] = useState("");
    const [secondFundDetail, setSecondFundDetail] = useState(null);


  useEffect(() => {
    if (secondFundCode) {
      fetch(`https://api.mfapi.in/mf/${secondFundCode}`)
        .then((res) => res.json())
        .then((res) => setSecondFundDetail(res));
    }
  }, [secondFundCode]);

  if (!show || !fundDetail) return null;

  const getFilteredData = (fullData) => {
    const total = fullData.length;
    if (timeframe === "1m") return fullData.slice(0, 30);
    if (timeframe === "3m") return fullData.slice(0, 90);
    return fullData;
  };

  const primaryData = getFilteredData(fundDetail.data).reverse();
  const secondaryData = secondFundDetail ? getFilteredData(secondFundDetail.data).reverse() : [];

  const chartLabels = primaryData?.map((d) => d.date);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: fundDetail.meta.scheme_name,
        data: primaryData?.map((d) => parseFloat(d.nav)),
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  if (secondFundDetail) {
    chartData.datasets.push({
      label: secondFundDetail.meta.scheme_name,
      data: secondaryData?.map((d) => parseFloat(d.nav)),
      borderColor: "#e83e8c",
      backgroundColor: "#e83e8c",
      tension: 0.3,
      pointRadius: 2,
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 12 } },
      y: { beginAtZero: false },
    },
  };

  const downloadCSV = () => {
    const csvRows = [
      ["Date", "NAV"],
      ...fundDetail.data?.map((entry) => [entry.date, entry.nav]),
    ];
    const csvContent = csvRows?.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fundDetail.meta.scheme_name.replace(/[^a-z0-9]/gi, "_")}_NAV.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{fundDetail.meta.scheme_name}</h2>
        <p><strong>Fund House:</strong> {fundDetail.meta.fund_house}</p>
        <p><strong>Category:</strong> {fundDetail.meta.scheme_category}</p>
        <p><strong>Type:</strong> {fundDetail.meta.scheme_type}</p>

        {/* Timeframe Toggle */}
        <div className="timeframe-buttons">
          {["1m", "3m", "all"].map((tf) => (
            <button
              key={tf}
              className={timeframe === tf ? "active" : ""}
              onClick={() => setTimeframe(tf)}
            >
              {tf === "1m" ? "1 Month" : tf === "3m" ? "3 Months" : "All"}
            </button>
          ))}
        </div>


        {/* Chart */}
        <div style={{ marginTop: "20px" }}>
          <Line data={chartData} options={options} />
        </div>

        <button className="download-btn" onClick={downloadCSV}>
          📥 Download Primary NAV (CSV)
        </button>
      </div>
    </div>
  );
}

export default Modal;
