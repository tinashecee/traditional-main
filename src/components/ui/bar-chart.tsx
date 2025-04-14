import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  data,
  backgroundColor,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
