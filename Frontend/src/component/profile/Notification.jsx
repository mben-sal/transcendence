import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const NotificationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connexion WebSocket
    const websocket = new WebSocket(`ws://${window.location.host}/ws/notifications/`);
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prev => [data, ...prev]);
    };

    setWs(websocket);

    // Charger les notifications existantes
    fetchNotifications();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationAction = async (notification) => {
    switch (notification.notification_type) {
      case 'friend_request':
        // Logique pour accepter/refuser l'ami
        break;
      case 'game_invite':
        // Logique pour rejoindre/refuser le jeu
        break;
      case 'message':
        // Rediriger vers la conversation
        break;
    }
  };

  const getNotificationContent = (notification) => {
    switch (notification.notification_type) {
      case 'friend_request':
        return (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{notification.sender_name}</p>
              <p className="text-sm">vous a envoyé une demande d'ami</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded">Accepter</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">Refuser</button>
            </div>
          </div>
        );
      
      case 'game_invite':
        return (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{notification.sender_name}</p>
              <p className="text-sm">vous invite à jouer une partie</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded">Rejoindre</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">Décliner</button>
            </div>
          </div>
        );
      
      case 'message':
        return (
          <div className="cursor-pointer hover:bg-gray-50">
            <p className="font-semibold">{notification.sender_name}</p>
            <p className="text-sm">Nouveau message: {notification.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-[#5376aa] hover:bg-gray-400"
      >
        <Bell className="w-6 h-6" />
        {notifications.filter(n => !n.is_read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">Aucune notification</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 rounded-lg border"
                  onClick={() => handleNotificationAction(notification)}
                >
                  {getNotificationContent(notification)}
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationComponent;