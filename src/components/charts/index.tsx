import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { ICharts } from "../../types";
import { useParams } from "react-router-dom";
import { fetchCoincapApi } from "../../services/api";
import { startDataCharts } from "../../constants";
import styles from "./Charts.module.scss";
import { getFormatHours, getHightPrice } from '../../utils/charts'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export const Charts: React.FC = () => {
  const [data, setData] = useState<ICharts[]>(startDataCharts);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCoincapApi(`${id}/history?interval=h1`).then((res) =>
        setData(res.data.slice(0, 24))
      );
    }
  }, [id]);

  const formatedHours: string[] = [];
  const chartPrices: string[] = [];
  data.forEach((el) => formatedHours.push(getFormatHours(el.date)));
  data.forEach((el) => chartPrices.push(el.priceUsd));

  const chartData = {
    labels: formatedHours,
    datasets: [
      {
        label: id,
        data: chartPrices,
        borderColor: "#22d3ee",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#22d3ee",
        pointHoverBorderColor: "#0a0c15",
        pointHoverBorderWidth: 2,
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(34, 211, 238, 0.25)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(34, 211, 238, 0.32)");
          gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#12151f",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#9aa2ba",
        bodyColor: "#f5f6fb",
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => `$${Number(ctx.parsed.y).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#636b81", font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        border: { display: false },
        ticks: {
          color: "#636b81",
          font: { size: 11 },
          callback: (value: any) => "$" + Number(value).toLocaleString(),
        },
      },
    },
  };

  return (
    <div className={styles.chart}>
      <div className={styles.canvas}>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className={styles.details}>
        <div className={styles.stat}>
          <span className={`${styles.statDot} ${styles.up}`} />
          <span className={styles.statLabel}>High</span>
          <span className={styles.statValue}>{"$" + Number(getHightPrice(data)[0].priceUsd).toFixed(2)}</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statDot} ${styles.down}`} />
          <span className={styles.statLabel}>Low</span>
          <span className={styles.statValue}>{"$" + Number(getHightPrice(data)[getHightPrice(data).length - 1].priceUsd).toFixed(2)}</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statDot} ${styles.avg}`} />
          <span className={styles.statLabel}>Average</span>
          <span className={styles.statValue}>{"$" + ((Number(getHightPrice(data)[0].priceUsd) + Number(getHightPrice(data)[getHightPrice(data).length - 1].priceUsd)) / 2).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
