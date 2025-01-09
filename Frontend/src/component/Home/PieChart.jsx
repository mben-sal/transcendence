import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const CustomLegend = ({ payload, data }) => {
  // Calculer le total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="flex justify-center gap-8">
      {payload.map((entry, index) => {
        // Calculer le pourcentage pour chaque élément
        const percentage = ((data[index].value / total) * 100).toFixed(1);
        return (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">
              {entry.value} ({percentage}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

CustomLegend.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      value: PropTypes.string
    })
  ),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number
    })
  )
};

const FigmaPieChart = () => {
  const data = [
    { name: 'equality', value: 40 },
    { name: 'win', value: 32 },
    { name: 'loss', value: 28 }
  ];

  const COLORS = ['#3B5BDB', '#748FFC', '#DBE4FF'];

  return (
    <div className="w-full h-96">
      <div className="text-2xl text-gray-700 mb-4 text-center">
        From 1-31 Dec, 2024
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Legend content={(props) => <CustomLegend {...props} data={data} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FigmaPieChart;