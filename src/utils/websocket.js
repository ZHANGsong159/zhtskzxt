class WebSocketService {
    constructor(url) {
        this.socket = null;
        this.url = url;
        this.callbacks = {};
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log('WebSocket 连接已建立');
            this._executeCallback('open');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('收到消息:', data);
            this._executeCallback('message', data);
        };

        this.socket.onclose = () => {
            console.log('WebSocket 连接已关闭');
            this._executeCallback('close');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket 发生错误:', error);
            this._executeCallback('error', error);
        };
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket 未连接，无法发送消息');
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    _executeCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }
}

export default WebSocketService;
    