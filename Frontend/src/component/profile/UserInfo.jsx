const UserInfo = () => {
	const user = {
		name: "John Doe",
		username: "@johndoe",
		level: 42,
		rank: "Gold Master",
		followers: 1234,
		following: 891,
		posts: 156,
		achievements: [
		  { id: 1, name: "First Win", icon: "🏆" },
		  { id: 2, name: "Speed Demon", icon: "⚡" },
		  { id: 3, name: "Pro Player", icon: "👑" }
		]
	  };
  return (
	<div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#133E87]">{user.name}</h1>
              <p className="text-blue-400">{user.username}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold">
                Level {user.level} • {user.rank}
              </span>
            </div>
          </div>
  );
};

export default UserInfo;