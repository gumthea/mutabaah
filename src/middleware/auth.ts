import { auth } from '@/utils/firebase';

export const getUserToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};