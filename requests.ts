const API_URL = "http://10.220.197.186:3000";
import axios from "axios";

export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/otps/request_otp`, {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};

export const verifyCode = async (phoneNumber: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/otps/verify_otp`, {
      phoneNumber,
      code,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};
