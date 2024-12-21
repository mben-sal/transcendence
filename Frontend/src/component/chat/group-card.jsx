// import React from 'react';
import PropTypes from 'prop-types';

export const GroupCard = ({ onSelectGroup = () => {} }) => {
  // Sample data - you can replace this with your actual data
  const groups = [
    {
      id: 1,
      name: "Friends Forever",
      lastMessage: "Hahahahah",
      timestamp: "Today, 9:52pm",
      unreadCount: 4,
      avatar: "/api/placeholder/48/48"
    },
    {
      id: 2,
      name: "Chat Room",
      lastMessage: "It's not going to happen",
      timestamp: "Yesterday, 12:31pm",
      unreadCount: 0,
      avatar: "/api/placeholder/48/48"
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Groups</h2>
      <div className="space-y-4">
        {groups.map((group) => (
          <div 
            key={group.id} 
            onClick={() => onSelectGroup(group)}
            className="flex items-center justify-between pb-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img
                src={group.avatar}
                alt={group.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <p className="text-gray-500 text-sm">{group.lastMessage}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-gray-400 text-sm">{group.timestamp}</span>
              {group.unreadCount > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {group.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add PropTypes
GroupCard.propTypes = {
  onSelectGroup: PropTypes.func
};

// Add defaultProps
GroupCard.defaultProps = {
  onSelectGroup: () => {}
};

export default GroupCard;