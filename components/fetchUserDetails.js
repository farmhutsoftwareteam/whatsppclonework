import { supabase } from "../config/supabase";

const fetchUserId = async () => {
  try {
    const user = await supabase.auth.getUser();
    return user ? user.id : null;
  } catch (error) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }
};

export default fetchUserId;
