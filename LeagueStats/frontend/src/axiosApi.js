import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/'
const csrftoken = getCookie('csrftoken');
//prevent data race on /api/token/refresh when two or more requests fail
let isRefreshing = false

export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Authorization': localStorage.getItem('access_token') ? "JWT " + localStorage.getItem('access_token') : null,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-CSRFToken': csrftoken
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === '/api/token/refresh/') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 &&
            error.response.statusText === "Unauthorized") {
            const refreshToken = localStorage.getItem('refresh_token');

            if (!isRefreshing) {
                if (refreshToken) {
                    isRefreshing = true
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    // exp date in token is expressed in seconds, while now() returns milliseconds:
                    const now = Math.ceil(Date.now() / 1000);

                    if (tokenParts.exp > now) {
                        return axiosInstance
                            .post('/api/token/refresh/', {refresh: refreshToken, csrftoken: csrftoken})
                            .then((response) => {

                                localStorage.setItem('access_token', response.data.access);
                                localStorage.setItem('refresh_token', response.data.refresh);

                                axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                                originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                                isRefreshing = false

                                return axiosInstance(originalRequest);
                            })
                            .catch(err => {
                                //console.log(err)
                            });
                    } else {
                        window.location.href = '/login/';
                    }
                } else {
                    window.location.href = '/login/';
                }
            }
            return Promise.reject(error);
        }
        return Promise.reject(error)
    }
);

export default axiosInstance;

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
