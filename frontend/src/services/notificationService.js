import api from "./api";

export const getNotificationsByUser = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
};

export const getUnreadCount = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}/unread-count`);
  return response.data.unread_count;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.patch("/notifications/read", {
    notification_id: notificationId,
  });
  return response.data;
};