import { useUser } from '../../contexts/UserContext';

const UserInfo = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-[#133E87]">{user.display_name}</h1>
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