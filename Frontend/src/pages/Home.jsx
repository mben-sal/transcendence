// import {Chart as ChartJS} from "chart.js";
import Vector from '../assets/src/Vector.svg';
import player from '../assets/src/player_.svg';
import pingpong from '../assets/src/pingpong.svg';
// import { CategoryScale } from "chart.js";
import LineChart from '../component/charts/LineChart';

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

  const topPlayers = [
    { name: 'Jon Khan', points: '125,000 points', avatar: player },
    { name: 'John benbot', points: '101,150 points', avatar: player },
    { name: 'Ely noc', points: '81,500 points', avatar: player },
  ];

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          
          {/* Section gauche */}
          <div className="space-y-8">
            <div className="bg-gray rounded-xl p-5 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Your Match</h2>
              <p className="text-sm text-gray-500 mb-8">From 1-31 Dec, 2024</p>
              
              <div className="relative w-56 h-56 mx-auto mb-8">
                <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-blue-300 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-blue-500 rounded-full" 
                     style={{clipPath: 'polygon(0 0, 40% 0, 40% 100%, 0 100%)'}}></div>
              </div>
              
              <div className="flex justify-center gap-12 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">equality 40%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                  <span className="text-gray-600">win 60%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span className="text-gray-600">loss 0%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray rounded-xl p-5 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Hello John Doe</h3>
              <p className="text-gray-600 mb-6">Its good to see you again.</p>
              <img src={Vector} alt="avatar" className=" w-47" />
            </div>
          </div>

          {/* Section droite */}
          <div className="space-y-8">
            <div className="bg-gray rounded-xl p-10 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-blue-900">TOP 3 PLAYERS</h3>
                <img src={pingpong} alt="avatar" className="w-12 h-12" />
              </div>
              
              <div className="space-y-6">
                {topPlayers.map((player, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                      <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full" />
                      <div className='flex justify-between items-center w-full'>
                        <p className="font-semibold text-gray-800">{player.name}</p>
                        <p className=" text-sm text-gray-500">{player.points}</p>
                      </div>
                    </div>
                  </div>
                ))}
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