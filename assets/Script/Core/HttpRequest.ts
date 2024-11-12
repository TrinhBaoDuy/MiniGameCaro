class HttpRequest {
    private baseUrl: string;
    private token: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    public setToken(token: string) {
        this.token = token;
    }
    // Phương thức POST
    async post(endpoint: string, data: any) {
        const headers = this.token ? {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
        }
            : {
                'Content-Type': 'application/json',
            }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response; // Hoặc xử lý theo nhu cầu
    }

    async get(endpoint: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response; // Hoặc xử lý theo nhu cầu
    }
    // Bạn có thể thêm các phương thức khác như GET, PUT, DELETE, v.v.
}

// Xuất thể hiện HttpClient
const APIRequest = new HttpRequest('https://b0xp231d-8000.asse.devtunnels.ms');

// Xuất ra để sử dụng trong các phần khác của ứng dụng
export default APIRequest;

export const API_ADDRESS = {
    LOGIN: "/api/users/login",
    SIGNUP: "/api/users/"
}