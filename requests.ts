const API_URL = "http://10.114.25.87:3000";
import axios from "axios";

export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/otps/request_otp`, {
      phoneNumber,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};

export const authenticateUser = async (phoneNumber: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/otps/verify_otp`, {
      phoneNumber,
      code,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};

export const httpUpdaterUser = async ({
  phoneNumber,
  firstName,
  lastName,
  profilePhoto,
  avatarIndex,
}: {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string | null;
  avatarIndex?: number | null;
}) => {
  try {
    if (profilePhoto) {
      console.log("case1");
      const formData = new FormData();
      const fileName = profilePhoto.split("/").pop();
      formData.append("profilePhoto", {
        uri: profilePhoto,
        type: "image/jpeg",
        name: fileName,
      } as any);

      firstName && formData.append("firstName", firstName);
      lastName && formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);

      console.log(formData);

      const response = await axios.post(`${API_URL}/users/update`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    }

    if (avatarIndex) {
      console.log("case2");
      const response = await axios.post(`${API_URL}/users/update`, {
        phoneNumber,
        firstName,
        lastName,
        avatarIndex,
      });
      return response;
    }

    if (!profilePhoto && !avatarIndex) {
      console.log("case3");
      const response = await axios.post(`${API_URL}/users/update`, {
        phoneNumber,
        firstName,
        lastName,
      });

      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};
