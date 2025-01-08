import { Line } from "react-chartjs-2";
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ chartData }) {
  const data = {
    labels: chartData.map(item => `Day ${item.day}`),
    datasets: [
      {
        data: chartData.map(item => item.matches),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
	  tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `Day ${tooltipItems[0].label.split(' ')[1]}`;
          },
          label: (context) => {
            return `${context.parsed.y} matches`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6B7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} />
    </div>
  );
}
LineChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      matches: PropTypes.number.isRequired
    })
  ).isRequired
};

LineChart.defaultProps = {
	chartData: []
};  

export default LineChart;