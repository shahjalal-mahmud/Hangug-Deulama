/* src/components/NotificationButton.jsx */
const NotificationButton = ({ hasUnread = true }) => {
  return (
    <button
      type="button"
      aria-label={hasUnread ? 'Notifications, unread items' : 'Notifications'}
      className="relative text-text-secondary hover:text-text-primary transition-colors duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                 rounded-full p-1"
    >
      <span className="material-symbols-outlined text-[22px]">notifications</span>
      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent rounded-full"
        />
      )}
    </button>
  );
};

export default NotificationButton;