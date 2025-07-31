<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import WebSocketService from './utils/websocket.js';
export default {
    data() {
        return {
            socket: null,
            messages: [],
            ymessages:[],
            reconnectAttempts: 0,
            reconnectTimer: null,
        };
    },
    methods: {
        getServerAddress (){
          // 检查是否明确配置了WebSocket URL
          if (process.env.VUE_APP_WEBSOCKET_URL) {
            console.log('使用环境变量配置的WebSocket URL:', process.env.VUE_APP_WEBSOCKET_URL);
            return process.env.VUE_APP_WEBSOCKET_URL;
          }
          
          // 确定协议
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          
          // 确定主机
          let host;
          const isDevelopment = process.env.NODE_ENV === 'development';
          
          if (isDevelopment) {
            // 开发环境优先使用配置的API地址，否则使用localhost
            host = process.env.VUE_APP_API_BASE_URL || 'localhost';
          } else {
            // 生产环境使用当前页面的主机名
            host = window.location.hostname;
          }
          
          // 确定端口
          const websocketPort = process.env.VUE_APP_WEBSOCKET_PORT || '8001';
          // 构建WebSocket URL
          const websocketUrl = `${protocol}//${host}:${websocketPort}/websocket/push`;
          return websocketUrl;
        },
        connectWebSocket() {
            let ws=this.getServerAddress()
            // this.socket = new WebSocketService('ws://192.168.2.167:8001/websocket/push');
            this.socket = new WebSocketService(ws);

            // this.socket = new WebSocketService(`ws://${process.env.VUE_APP_API_BASE_URL || 'localhost'}:8001/websocket/push`);
            this.socket.connect();
            this.$store.state.socket=this.socket
        },
        sendMessage() {
            if (this.socket) {
                this.socket.send({ message: 'Hello, WebSocket!' });
            }
        },
        closeWebSocket() {
            if (this.socket) {
                this.socket.close();
            }
        },
    },
    mounted() {
          this.connectWebSocket();

          this.socket.on('open', () => {
            let userId=sessionStorage.getItem('userID')
            let parame={
              "userId":userId
            }
            this.socket.send(parame);
          });
    },
    beforeDestroy() {
      clearInterval(this.$store.state.timer);
    },
    watch:{ 


    },
    
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  height: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
