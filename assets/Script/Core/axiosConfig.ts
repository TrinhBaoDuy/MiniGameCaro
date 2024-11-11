// // axiosConfig.ts
// import axios, { AxiosInstance } from 'axios';

// const axiosInstance: AxiosInstance = axios.create({
//     baseURL: 'https://b0xp231d-8000.asse.devtunnels.ms',
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Interceptors (tùy chọn)
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Thêm token hoặc làm gì đó trước khi gửi request
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response.data; // Trả về dữ liệu
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;