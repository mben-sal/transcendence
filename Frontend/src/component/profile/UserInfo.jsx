import { useState, useEffect } from 'react';

const UserInfo = ({ userData, isOwnProfile }) => {
  const [displayData, setDisplayData] = useState(null);

  useEffect(() => {
    if (userData) {
      setDisplayData(userData);
    }
  }, [userData]);

  if (!displayData) return null;
  
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900">
          {displayData.display_name}
        </h1>
        <div className="text-sm text-gray-500">@{displayData.intra_id}</div>
        
        <div className="mt-4 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
            displayData.status === 'online' ? 'bg-green-500' :
            displayData.status === 'in_game' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}></span>
          <span className="text-gray-700 capitalize">{displayData.status}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-gray-500 text-sm">Wins</div>
            <div className="font-bold text-green-600">{displayData.wins || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-sm">Losses</div>
            <div className="font-bold text-red-600">{displayData.losses || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-sm">Ratio</div>
            <div className="font-bold text-blue-600">
              {displayData.wins + displayData.losses > 0 
                ? ((displayData.wins / (displayData.wins + displayData.losses)) * 100).toFixed(1) + '%'
                : '0%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;