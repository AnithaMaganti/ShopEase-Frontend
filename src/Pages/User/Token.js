import axios from "axios";

// ✅ Save Tokens to Local Storage
export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

// ✅ Get Tokens (Fix "undefined" issue)
export const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    return token && token !== "null" && token !== "undefined" ? token : null;
};


export const getRefreshToken = () => {
    const token = localStorage.getItem("refreshToken");
    return token && token !== "undefined" ? token : null;
};

// ✅ Logout User
export const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login"; // ✅ Redirect to login page
};

// ✅ Refresh Access Token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            console.log("❌ No refresh token found. Logging out...");
            return logoutUser();
        }

        console.log("🔄 Requesting new access token...");
        const response = await axios.post("http://localhost:8081/api/auth/refresh-token", { refreshToken });

        if (response.data && response.data.accessToken) {
            saveTokens(response.data.accessToken, refreshToken);
            console.log("✅ Access token refreshed successfully!");
            return response.data.accessToken;
        } else {
            console.log("❌ Refresh token expired, logging out...");
            logoutUser();
        }
    } catch (error) {
        console.error("❌ Token refresh failed:", error);
        logoutUser();
    }
};

// ✅ Check Token Expiry & Refresh If Needed
export const checkTokenExpiration = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
        console.log("❌ No valid tokens found. Logging out...");
        logoutUser();
        return;
    }

    try {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1])); // ✅ Wrapped in try-catch
        const expirationTime = decodedToken.exp * 1000;

        if (Date.now() >= expirationTime - 300000) { // ✅ Refresh 5 minutes before expiry
            console.log("🔄 Access token about to expire, refreshing...");
            return refreshAccessToken();
        }
    } catch (error) {
        console.error("❌ Invalid access token. Logging out...");
        logoutUser();
    }
};

// ✅ Create Axios Instance
const api = axios.create({
    baseURL: "http://localhost:8081/api",
     headers: {
        "Content-Type": "application/json",
        
    }
  });
  
  // ✅ Axios Interceptor to Add Token in Request Header
  api.interceptors.request.use((config) => {
    // Retrieve token from localStorage (or sessionStorage)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  // ✅ Axios Interceptor to Handle Token Expiry and Retry Request
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();  // Function to refresh token (you'll need to implement it)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest); // Retry original request with new token
      }
  
      return Promise.reject(error);
    }
  );
  
  export default api;