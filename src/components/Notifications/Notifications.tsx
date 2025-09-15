import NotificationFeed from "./NotificationFeed";
import NotificationPostForm from "./NotificationPostForm";

export default function NotificationsPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {/* Show feed for everyone */}
      <NotificationFeed />
      
      {/* Show form if admin */}
      <NotificationPostForm />
    </div>
  );
}
