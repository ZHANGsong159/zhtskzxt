<template>
  <div>
    <el-input
      :value="inputValue"
      @input="handleInput"
      :placeholder="placeholder"
      clearable
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'CommaInput',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请输入内容，用逗号分隔'
    }
  },
  data() {
    return {
      inputValue: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.inputValue = newVal.join(',');
      }
    }
  },
  methods: {
    handleInput(value) {
            // this.inputValue = value;
            // 分割字符串并过滤空值
            const strings = value.split(',')
            
            // 向父组件传出数组
            this.$emit('input', strings);
    }
  }
};
</script>