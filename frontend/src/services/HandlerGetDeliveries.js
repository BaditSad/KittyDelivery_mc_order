import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getDelivery = async (restaurantId) => {
  try {
    const response = await axios.get(`${API_URL}/deliveries/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de delivery:", error);
    throw error;
  }
};
