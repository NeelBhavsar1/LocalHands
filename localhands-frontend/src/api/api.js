import axios from 'axios';

/**
 * creates an axios instance
 * meaning every request will use this configuration
 * all the api calls will be coming from endpoint baseUrl: http://localhost:8080 (whether it be /api/user/login)
 * 
 * This sends JSON data
 */
const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
})

//This tells us if a refresh erequest is already happening, and prevents multiple refresh calls at the same time
let isRefreshing = false;

//Ths stores the requests that have failed while refresh is happening and will be retried later
let failedQueue = [];

/**
 * This function runs all of the queued requests
 * If refresh failed then reject them
 * If refresh success then retry them
 * 
 * At the end we clear the queue after processing
 */
const processQueue = (error = null) => {
    failedQueue.forEach(({resolve, reject}) => {
        if (error) {
            reject(error)
        }
        else {
            resolve()
        }
    })
    failedQueue = [];
}

/**
 * This is a resposne interceptor (provided by axios and detects expired authorization tokens via 401 err).
 * This runs whenever a resposne comes back
 * 
 * If request works then we return the response, else we handle the error
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config //original req
        const status = error.response?.status //response status (exa: 401)
        const backendError = error.response?.data?.error; //retrieves backend error

        //if error is not 401 we reject normally
        if (status !== 401) {
            return Promise.reject(error)
        }

        //if refresh request itself failed, we don't refresh again to prevent an infinite loop
        if (originalRequest?.url?.includes("/api/auth/refresh")) {
            return Promise.reject(error);
        }

        // only refresh if backend explicitly says token expired, if another type of 401, don't refresh
        if (backendError !== "TOKEN_EXPIRED" && backendError !== "NO_TOKEN") {
            return Promise.reject(error);
        }

        //if we already retried once, then stop to prevent infinite retry loops
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        //marks request as retried
        originalRequest._retry = true;

        //if a refresh is already taking place, we add it to the queue
        if (isRefreshing) {
            return new Promise((resolve, reject) => { 
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        /**
         * in the try block we call the refresh endpoing and this generates a new access token (check backend code)
         * 
         * in the catch block, refresh failed and we reject all queued requests, and send user back to the login page
         */
        try {
            await api.post("/api/auth/refresh")
            processQueue() //refresh succeeded, so we retry all queued requests
            return api(originalRequest) //retry original failed req
        } catch (refreshError) {
            processQueue(refreshError)
            // Only redirect to login if this was an authenticated page request
            // Don't redirect for auth check requests (e.g., /api/users/me on public pages)
            const isAuthCheckRequest = originalRequest?.url === "/api/users/me";
            if (typeof window !== 'undefined' && 
                window.location.pathname !== '/login' && 
                !isAuthCheckRequest) {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
)

export default api;