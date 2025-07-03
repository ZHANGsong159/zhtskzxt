<template>
  <div class="ip-input-container">
    <div
      v-for="n in 4" 
      :key="n"
      class="ip-input-wrapper"
      >
    <el-input 
      :ref="`ipInput${n}`"
      v-model.number="ipParts[n-1]"
      @input="handleInput(n-1, $event)"
      @keydown="handleKeyDown($event, n-1)"
      @paste.prevent="handlePaste"
      @focus="handleFocus(n-1)"
      maxlength="3"
      style=" margin-right: 5px;"
    ></el-input>
    <span v-if="n < 4" class="spandian">.</span>

    </div>
  </div>
</template>

<script>
export default {
  name: 'IpInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ipParts: ['', '', '', '']
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const parts = newVal.split('.');
          if (parts.length === 4) {
            this.ipParts = parts.map(part => part.slice(0, 3));
          }
        } else {
          this.ipParts = ['', '', '', ''];
        }
      }
    }
  },
  computed: {
    ipAddress() {
      return this.ipParts.join('.');
    }
  },
  methods: {
    handleInput(index, value) {
      // 验证数字范围
      if (value && (isNaN(value) || value < 0 || value > 255)) {
        this.ipParts[index] = '';
        return;
      }
      
      // 更新父组件绑定的值
      this.$emit('input', this.ipAddress);
      
      // 自动跳到下一个输入框
      if (value.length === 3 && index < 3) {
        this.$nextTick(() => {
          this.$refs[`ipInput${index+2}`][0].focus();
        });
      }
    },
    handleKeyDown(e, index) {
      // 允许数字和特定控制键
      if (/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
        // 处理退格键在空输入框的情况
        if (e.key === 'Backspace' && !this.ipParts[index] && index > 0) {
          this.$nextTick(() => {
            this.$refs[`ipInput${index}`][0].focus();
          });
        }
        return;
      }
      
      // 允许点号键自动跳到下一个输入框
      if (e.key === '.' || e.key === ' ') {
        e.preventDefault();
        if (index < 3) {
          this.$nextTick(() => {
            this.$refs[`ipInput${index+2}`][0].focus();
          });
        }
        return;
      }
      
      e.preventDefault();
    },
    handlePaste(e) {
      const pasteData = e.clipboardData.getData('text');
      const parts = pasteData.split('.');
      if (parts.length === 4) {
        parts.forEach((part, i) => {
          if (i < 4) {
            const num = parseInt(part);
            if (!isNaN(num) && num >= 0 && num <= 255) {
              this.ipParts[i] = part.slice(0, 3);
            }
          }
        });
        this.$emit('input', this.ipAddress);
      }
    },
    handleFocus(index) {
      // 全选文本获得焦点时
      this.$nextTick(() => {
        this.$refs[`ipInput${index+1}`][0].select();
      });
    }
  }
}
</script>

<style scoped>
.ip-input-container {
  height: 100%;
  display: flex;
  align-items: center;
}
.ip-input-wrapper{
  position: relative;
}
::v-deep .el-input__inner{
  padding: 0 5px;
  text-align: center;
}
.spandian{
  color: #fff !important;
  position:absolute;
  top:0;
  right:0;
}
</style>