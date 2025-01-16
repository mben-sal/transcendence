import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const NotificationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "Nouveau message",
      message: "Vous avez reçu un nouveau message de Jean",
      time: "Il y a 5 minutes"
    },
    {
      id: 2,
      title: "Rappel",
      message: "Réunion d'équipe à 14h",
      time: "Il y a 1 heure"
    },
    {
      id: 3,
      title: "Mise à jour",
      message: "Nouvelle version de l'application disponible",
      time: "Il y a 2 heures"
    }
  ]);

  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const handleNotificationClick = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button 
        onClick={handleNotificationClick}
        className="bg-[#CBDCEB] relative p-0 rounded-full hover:text-[#133E87] border-none focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dialogue des notifications */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          
          <div className=" space-y-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="p-4 rounded-lg border hover:bg-gray-50"
              >
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationComponent;