import { useUser } from '../../contexts/UserContext';

const UserInfo = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#133E87]">
            {user.first_name} {user.last_name}
          </h1>
          {/* Dynamic Status Indicator */}
          {user.status === 'online' && (
            <div className="relative flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
          {user.status === 'in_game' && (
            <div className="relative flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="absolute w-3 h-3 bg-yellow-500 rounded-full animate-pulse opacity-75"></div>
            </div>
          )}
          {user.status === 'offline' && (
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          )}
        </div>
        <p className="text-blue-400">{user.intra_id || user.email}</p>
      </div>
      <div className="mt-4 md:mt-0">
        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold">
          Wins: {user.wins} • Losses: {user.losses}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;