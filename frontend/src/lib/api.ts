import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
console.log('[API Client] Initialized with URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second timeout
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

api.interceptors.request.use(config => {
  console.log(`[API Client] Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error(`[API Client] Error calling ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

// Helper to get admin token from localStorage
const getAdminToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token') || '';
  }
  return '';
};

export const login = async (secret: string) => {
  const response = await api.post('/auth/login', { secret });
  if (response.data.success && response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
};

export const getBlogs = async (page = 1, limit = 9, admin = false) => {
  const headers: any = {};
  const token = getAdminToken();
  
  if (admin && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await api.get('/blogs', {
    params: { page, limit, admin },
    headers,
  });
  return response.data;
};

export const searchBlogs = async (q: string, page = 1, limit = 12) => {
  const response = await api.get('/blogs', {
    params: { q, page, limit },
  });
  return response.data;
};

export const subscribeNewsletter = async (email: string) => {
  const response = await api.post('/newsletter/subscribe', { email });
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data;
};

export const generateBlog = async (topic: string) => {
  // Blog generation can take longer than typical API calls (LLM + image fetch + DB write).
  // Use a longer timeout for this specific request to avoid false "failed" alerts.
  const response = await api.post(
    '/blogs/generate',
    { topic },
    {
      timeout: 120000, // 2 minutes
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`,
      },
    }
  );
  return response.data;
};

export const updateBlogStatus = async (id: string, status: 'draft' | 'published') => {
  const response = await api.patch(`/blogs/${id}`, { status }, {
    headers: {
      'Authorization': `Bearer ${getAdminToken()}`,
    },
  });
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await api.delete(`/blogs/${id}`, {
    headers: {
      'Authorization': `Bearer ${getAdminToken()}`,
    },
  });
  return response.data;
};
