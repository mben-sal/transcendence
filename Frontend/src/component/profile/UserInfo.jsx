const UserInfo = ({ userData, isOwnProfile }) => {
	if (!userData) return null;
  
	return (
	  <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
		<div className="flex flex-col">
		  <h1 className="text-2xl font-bold text-gray-900">
			{userData.display_name}
		  </h1>
		  <div className="text-sm text-gray-500">@{userData.intra_id}</div>
		  
		  <div className="mt-4 flex items-center">
			<span className={`inline-block w-3 h-3 rounded-full mr-2 ${
			  userData.status === 'online' ? 'bg-green-500' :
			  userData.status === 'in_game' ? 'bg-yellow-500' :
			  'bg-gray-500'
			}`}></span>
			<span className="text-gray-700 capitalize">{userData.status}</span>
		  </div>
  
		  <div className="mt-4 grid grid-cols-3 gap-4">
			<div className="text-center">
			  <div className="text-gray-500 text-sm">Wins</div>
			  <div className="font-bold text-green-600">{userData.wins}</div>
			</div>
			<div className="text-center">
			  <div className="text-gray-500 text-sm">Losses</div>
			  <div className="font-bold text-red-600">{userData.losses}</div>
			</div>
			<div className="text-center">
			  <div className="text-gray-500 text-sm">Ratio</div>
			  <div className="font-bold text-blue-600">
				{userData.wins + userData.losses > 0 
				  ? ((userData.wins / (userData.wins + userData.losses)) * 100).toFixed(1) + '%'
				  : '0%'}
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	);
  };
  
  export default UserInfo;