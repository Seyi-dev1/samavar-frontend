const API_URL = "http://10.145.52.87:3000";
import axios from "axios";
import { eq } from "drizzle-orm";
import { v4 as uuid } from 'uuid';
import { db } from "./db/client";
import { chats, users } from "./db/schema";



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
  firstName: string;
  lastName: string;
  profilePhoto?: string | null;
  avatarIndex?: number | null;
}) => {
  try {
    if (profilePhoto) {
      console.log("case1");
      const formData = new FormData();
      const fileName = profilePhoto.split("/").pop();
      formData.append("profilePhotoFile", {
        uri: profilePhoto,
        type: "image/jpeg",
        name: fileName,
      } as any);

       formData.append("firstName", firstName);
       formData.append("lastName", lastName);
       formData.append("avatarIndex", String(avatarIndex));
      formData.append("phoneNumber", phoneNumber);
      formData.append("profilePhoto", profilePhoto)

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
        profilePhoto:null
      });
      return response;
    }

    if (!profilePhoto && !avatarIndex) {
      console.log("case3");
      const response = await axios.post(`${API_URL}/users/update`, {
        phoneNumber,
        firstName,
        lastName,
        profilePhoto:null,
        avatarIndex:null
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

export const httpFetchOnlineUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/online`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
}

export const httpFetchChats = async () => {
  try {
    const response = await db.select().from(chats);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
}

export async function httpgetOrCreateChat(participantId: string, lastMessage: string, lastMessageAt: string, lastMessageSenderId: string) {
  //  check if chat already exists
  try {
    // console.log('lastMessageSenderId', lastMessageSenderId);
    const existing = await db
    .select()
    .from(chats)
    .where(eq(chats.participantId, participantId))
    .limit(1);

  if (existing.length) {
    const chat = existing[0];

    await db
    .update(chats)
    .set({
      lastMessageAt: lastMessageAt,
      lastMessage: lastMessage,
      lastMessageStatus: 'pending',
      lastMessageSenderId: lastMessageSenderId,
      unreadCount: 0
    })
    .where(eq(chats.id, chat.id));

    const updated = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chat.id))
    .limit(1);

  return updated[0];
  }

  // create chat if not found
  const chat = {
    id: uuid(),
    participantId: participantId,
    lastMessage: lastMessage,
    lastMessageAt: lastMessageAt,
    lastMessageStatus: 'pending',
    lastMessageSenderId: lastMessageSenderId,
    unreadCount: 0
  };

  await db.insert(chats).values(chat);
  return chat;
  } catch (error) {
    throw error;
  }
  
}

export const httpGetChatsForUI = async() =>{
  try {
    const response = await db.select({
      chatId: chats.id,
      participantId: chats.participantId,
      lastMessage: chats.lastMessage,
      lastMessageAt: chats.lastMessageAt,
      lastMessageStatus: chats.lastMessageStatus,
      lastMessageSenderId: chats.lastMessageSenderId,
      unreadCount: chats.unreadCount,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarIndex: users.avatarIndex,
      profilePhoto: users.profilePhoto,
    })
    .from(chats)
    .leftJoin(users, eq(users.phoneNumber, chats.participantId));
    return response;
  } catch (error) {
    throw error;
  }
  
}

export const fetchUsersByIds = async (ids: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/users/by_ids`, { phoneNumbers: ids });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
}

export const  httpsyncMissingUsers = async() => {
  const rows = await httpGetChatsForUI();

  const missingIds = rows
    .filter(row => !row.firstName)
    .map(row => row.participantId);

  if (!missingIds.length) return;

  console.log('missingIds', missingIds);

  const usersFromApi = await fetchUsersByIds(missingIds);

  console.log('usersFromApi', usersFromApi);

  // Map API user data to local database schema because of different field names, especially the id field
  const mappedUsers = usersFromApi.map((user: any) => ({
    id: user._id,
    profilePhoto: user.profilePhoto,
    phoneNumber: user.phoneNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarIndex: user.avatarIndex
  }));
  

  await db.insert(users).values(mappedUsers);
}
