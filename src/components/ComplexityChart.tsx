import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ComplexityChartProps {
  algorithmType: string; // 'O(n^2)' or 'O(n)'
}

const ComplexityChart: React.FC<ComplexityChartProps> = ({ algorithmType }) => {
  const nValues = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const data = {
    labels: nValues,
    datasets: [
      {
        label: algorithmType,
        data: nValues.map(n => algorithmType.includes('n^2') ? n * n : n),
        borderColor: algorithmType.includes('n^2') ? '#fbbf24' : '#6366f1',
        backgroundColor: algorithmType.includes('n^2') ? 'rgba(251, 191, 36, 0.1)' : 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'O(log n)',
        data: nValues.map(n => Math.log2(n) * 2), // scaled for visibility
        borderColor: '#10b981',
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#94a3b8', boxWidth: 10, padding: 10, font: { size: 10 } }
      },
      tooltip: {
        enabled: true,
      }
    },
    scales: {
      y: {
        display: false,
        grid: { display: false }
      },
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div style={{ height: '140px', width: '100%', marginTop: '1rem' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ComplexityChart;
