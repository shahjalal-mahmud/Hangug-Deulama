/* src/components/layout/NotificationButton.jsx
   Placeholder for a future notifications feature. Renders the bell icon
   only — no fake "unread" state, since there's no notifications endpoint
   in the backend yet. */

const NotificationButton = () => {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="text-text-secondary hover:text-text-primary transition-colors duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                 rounded-full p-1"
    >
      <span className="material-symbols-outlined text-[22px]">notifications</span>
    </button>
  );
};

export default NotificationButton;