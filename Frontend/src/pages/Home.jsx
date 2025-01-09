// import {Chart as ChartJS} from "chart.js";
// import Vector from '../assets/src/Vector.svg';
// import player from '../assets/src/player_.svg';
import pingpong from '../assets/src/pingpong.svg';
// import { CategoryScale } from "chart.js";
import LineChart from '../component/Home/LineChart';
import PieChart from '../component/Home/PieChart';
import Hello from '../component/Home/Hello';
import TopPlayer from '../component/Home/TopPlayer';

// ChartJS.register(CategoryScale);

const PongDashboard = () => {
  const matchData = [
    { day: 25, matches: 4 },
    { day: 26, matches: 5 },
    { day: 27, matches: 7 },
    { day: 28, matches: 8 },
    { day: 29, matches: 7 },
    { day: 30, matches: 6 },
  ];

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-10xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          
          {/* Section gauche */}
          <div className="space-y-8 ">
            <div className="bg-gray rounded-xl p-2 shadow-lg ">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 ">Your Match</h2>              
              <div>
				<PieChart />
              </div>
            </div>

            <div className="bg-gray rounded-xl p-5 shadow-lg">
			  <Hello />
            </div>
          </div>

          {/* Section droite */}
          <div className="space-y-8">
            <div className="bg-gray rounded-xl p-10 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-blue-900">TOP 3 PLAYERS</h3>
                <img src={pingpong} alt="avatar" className="w-12 h-12" />
              </div>
              
              <div className="space-y-8">
				<TopPlayer />
              </div>
            </div>

            <div className="bg-gray rounded-xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-900">Score</h3>
                <span className="text-red-500 text-sm">↓ 2.1% vs last week</span>
              </div>
              <p className="text-sm text-gray-500 mb-8">from 1-31 Dec, 2024</p>
              
              <div className="h-64">
				<LineChart chartData={matchData} />
              </div>
            </div>
          </div>
		  </div>
        </div>
      </div>
  );
};

export default PongDashboard;