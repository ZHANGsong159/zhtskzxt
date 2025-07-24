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
        connectWebSocket() {
            // this.socket = new WebSocketService('ws://192.168.2.167:8001/websocket/push');
            this.socket = new WebSocketService(`ws://${process.env.VUE_APP_API_BASE_URL || 'localhost'}:8001/websocket/push`);

            
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
