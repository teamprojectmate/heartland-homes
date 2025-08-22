import axios from 'axios';

const API_URL = 'http://localhost:8080/notifications';

const sendTelegramMessage = async (message, token) => {
  const response = await axios.post(
    `${API_URL}/telegram`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

const notificationService = {
  sendTelegramMessage
};

export default notificationService;
