<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import WebSocketService from './utils/websocket.js';
import {getCmdRate}  from "@/api/api.js"



export default {
    data() {
        return {
            socket: null,
            messages: [],
            ymessages:[],
        };
    },
    methods: {
        connectWebSocket() {
            this.socket = new WebSocketService('ws://192.168.2.167:8001/websocket/push');
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
        //发送频谱请求接口
        getCmdRateFun(){
          getCmdRate().then(res => {
            return res.data
          })
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



          // this.socket.on('message', (data) => {
          //   console.log('message');
            
          //     if(data.ratePushDTO.segmentStartRate==1){
          //       this.messages=[]
          //       this.ymessages=[]
          //     }
          //     data.ratePushDTO.values.forEach((item,index)=>{
          //         this.messages.push([index+Number(data.ratePushDTO.segmentStartRate),item]);
          //         this.ymessages.push(item)
          //     })
          //     this.$store.state.messages=this.messages
          //     this.$store.state.ymessages=this.ymessages
          // });       
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
