const Achievements = () => {
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
		<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
		{user.achievements.map(achievement => (
		  <div key={achievement.id} className="bg-gray-700 p-4 rounded-xl flex items-center space-x-3">
			<span className="text-2xl">{achievement.icon}</span>
			<span className="text-white">{achievement.name}</span>
		  </div>
		))}
	  </div>
  );
};
export default Achievements;