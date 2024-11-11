export class HttpRequest {
    baseURL: string = 'https://b0xp231d-8000.asse.devtunnels.ms/api/';
    baseURL2: string = 'http://103.23.135.57:8001/';

    call(method = 'GET', endpoint: string, body?: Record<string, any>, token?: string, callBack?: (data: any) => void, callBackError?: () => void): any {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, `${this.baseURL}${endpoint}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    const response = JSON.parse(xhr.response);
                    callBack && callBack(response);
                    resolve(response);
                }
                if (xhr?.status >= 400) {
                    const response = JSON.parse(xhr?.response || '{}');
                    if (typeof response === 'string') console.log('response err', response);
                    callBackError && callBackError();
                    reject(xhr.response?.message ?? 'Error');
                }
            };
            xhr.onerror = (e) => {
                console.log('xhr call error', e);
                reject(e);
            };
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            if (body) {
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        });
    }

    call2(method = 'GET', endpoint: string, body?: Record<string, any>, callBack?: (data: any) => void, callBackError?: () => void): any {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, `${this.baseURL2}${endpoint}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    const response = JSON.parse(xhr.response);
                    callBack && callBack(response);
                    resolve(response);
                }
                if (xhr?.status >= 400) {
                    const response = JSON.parse(xhr?.response || '{}');
                    if (typeof response === 'string') console.log('response err', response);
                    callBackError && callBackError();
                    reject(xhr.response?.message ?? 'Error');
                }
            };
            xhr.onerror = (e) => {
                console.log('xhr call error', e);
                reject(e);
            };

            if (body) {
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        });
    }
}
