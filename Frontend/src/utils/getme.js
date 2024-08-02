import axios from 'axios';
import { backend_url } from '../../config';

export const getme = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, data: null }; 

    const result = await axios.get(`${backend_url}/getme`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
    return {
      success: result.data.message ? true : false,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      data: null
    };
  }
};
