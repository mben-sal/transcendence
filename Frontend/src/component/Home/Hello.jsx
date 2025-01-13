import { useState, useEffect } from 'react';
import Vector from '../../assets/src/Vector.svg';

const Hello = () => {
  const [userData, setUserData] = useState({
    username: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData({
          username: data.username,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setUserData({
          username: 'Manar',
          loading: false,
          error: error.message
        });
      }
    };

    fetchUserData();
  }, []); 

  if (userData.loading) {
    return (
      <div className="rounded-xl p-5 shadow-lg animate-pulse">
        <div className="h-8 w-48 rounded mb-4"></div>
        <div className="h-6 w-64 rounded mb-6"></div>
        <div className="w-47 h-47 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-blue-900 mb-4">
        Hello{' '}
        <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-[slideDown_1s_ease-out_1]">
          {userData.username}
        </span>
      </h3>
      <p className="text-gray-600 mb-6">Its good to see you again.</p>
      <img src={Vector} alt="avatar" className="w-47" />
    </div>
  );
};


export default Hello;