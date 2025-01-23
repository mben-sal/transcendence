import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';

const UserInfo = () => {
 const { user } = useUser();
 const [stats, setStats] = useState({
   wins: 0,
   losses: 0
 });

 useEffect(() => {
   if (user) {
     setStats({
       wins: user.wins || 0,
       losses: user.losses || 0  
     });
   }
 }, [user]);

 if (!user) {
   return <div>Loading...</div>;
 }

 return (
   <div className="flex flex-col md:flex-row md:justify-between md:items-center"> 
     <div>
       <div className="flex gap-2 items-center">
         <h1 className="text-2xl font-bold text-[#133E87]">
           {user.display_name}
         </h1>
         <span className={`px-2 py-1 rounded-full text-xs ${
           user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
         } text-white`}>
           {user.status}
         </span>
       </div>
       <p className="text-blue-400 flex gap-2">
         <span>@{user.intra_id}</span>
         <span className="text-gray-600">•</span>
         <span>{user.first_name} {user.last_name}</span>
       </p>
     </div>
     <div className="mt-4 md:mt-0">
       <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold">
         Wins: {stats.wins} • Losses: {stats.losses}
       </span>
     </div>
   </div>
 );
};

export default UserInfo;