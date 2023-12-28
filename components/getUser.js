import { supabase } from '../config/supabase';

const getCurrentUser = async () => {
  try {
    const { user, error } = await supabase.auth.getSession();
    console.log(user)
    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
console.log('this is' ,user)
    return user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
};

export default getCurrentUser;
