import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react";

const NotificationDemo: React.FC = () => {
  const { addNotification, clearAll } = useNotifications();

  const handleAddInfoNotification = () => {
    addNotification({
      type: "info",
      title: "Information Message",
      message: "This is a simple information notification.",
      dismissible: true,
    });
  };

  const handleAddWarningNotification = () => {
    addNotification({
      type: "warning",
      title: "Warning Message",
      message: "This is a warning notification that requires attention.",
      dismissible: true,
    });
  };

  const handleAddSuccessNotification = () => {
    addNotification({
      type: "success",
      title: "Success Message",
      message: "Your action was completed successfully!",
      dismissible: true,
    });
  };

  const handleAddActionNotification = () => {
    addNotification({
      type: "info",
      title: "Action Required",
      message: "This notification includes an action button.",
      action: {
        label: "Take Action",
        onClick: async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          addNotification({
            type: "success",
            title: "Action Completed",
            message: "You successfully completed the action!",
            dismissible: true,
          });
        },
      },
      dismissible: true,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Notification System Demo
      </h2>
      <p className="text-gray-600 mb-6">
        Click the buttons below to see different types of notifications in
        action. Check the bell icon in the navbar to view your notifications.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleAddInfoNotification}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Info className="w-5 h-5" />
          <span>Info Notification</span>
        </button>

        <button
          onClick={handleAddWarningNotification}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Warning Notification</span>
        </button>

        <button
          onClick={handleAddSuccessNotification}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Success Notification</span>
        </button>

        <button
          onClick={handleAddActionNotification}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span>Action Notification</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDemo;
