import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Skill Count",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/job-skills?filter=today"
        );
        const { skills, counts } = response.data;
        setChartData({
          labels: skills,
          datasets: [
            {
              label: "Skill Count",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4 py-5">
      <h2 className="pt-5">Skill-Based Job Data</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ChartComponent;
