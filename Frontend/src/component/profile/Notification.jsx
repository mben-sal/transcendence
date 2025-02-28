import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const NotificationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Rafraîchir les notifications toutes les 10 secondes
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/notifications/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/notifications/${notificationId}/read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mettre à jour la liste des notifications localement
      setNotifications(
        notifications.map(n => 
          n.id === notificationId ? {...n, is_read: true} : n
        )
      );
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  const navigateToUserProfile = (notification) => {
	console.log("Notification complète:", notification);
	console.log("ID de l'expéditeur:", notification.sender_id);
	console.log("Intra ID de l'expéditeur:", notification.sender_intra_id);
	
	// Essayez d'abord de vérifier si l'utilisateur existe
	axios.get(`http://localhost:8000/api/users/${notification.sender_intra_id}/`, {
	  headers: { Authorization: `Bearer ${token}` }
	})
	.then(response => {
	  console.log("Utilisateur trouvé:", response.data);
	  setIsOpen(false);
	  markAsRead(notification.id);
	  navigate(`/profile/${notification.sender_intra_id}`);
	})
	.catch(error => {
	  console.error("Erreur lors de la récupération du profil:", error);
	  alert("Impossible de trouver le profil de cet utilisateur");
	});
  }

  const getNotificationContent = (notification) => {
    switch (notification.notification_type) {
      case 'friend_request':
        return (
          <div className="cursor-pointer" onClick={() => navigateToUserProfile(notification)}>
            <p className="font-semibold">{notification.sender_name}</p>
            <p className="text-sm">vous a envoyé une demande d'ami</p>
          </div>
        );
      
      case 'game_invite':
        return (
          <div className="cursor-pointer hover:bg-gray-50">
            <p className="font-semibold">{notification.sender_name}</p>
            <p className="text-sm">vous invite à jouer une partie</p>
          </div>
        );
      
      case 'message':
        return (
          <div className="cursor-pointer hover:bg-gray-50">
            <p className="font-semibold">{notification.sender_name}</p>
            <p className="text-sm">Nouveau message: {notification.content}</p>
          </div>
        );
        
      default:
        return (
          <div className="cursor-pointer hover:bg-gray-50">
            <p className="font-semibold">{notification.sender_name}</p>
            <p className="text-sm">{notification.content}</p>
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-[#5376aa] hover:bg-gray-400"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500">Aucune notification</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:bg-gray-100 ${!notification.is_read ? 'bg-blue-50' : ''}`}
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