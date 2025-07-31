/**
 * 数字输入限制函数
 * @param {*} value 输入值
 * @param {number} maxvalue 最大值
 * @param {number} minvalue 最小值
 * @param {number} decimalPlaces 小数位数
 * @returns {number|string} 处理后的值
 */
export function handleTimeInput(value, maxvalue, minvalue, decimalPlaces) {
    // 设置默认值
    const minVal = minvalue !== undefined ? minvalue : 0;
    const maxVal = maxvalue !== undefined ? maxvalue : Number.MAX_VALUE;
    const decimals = decimalPlaces !== undefined ? decimalPlaces : 2;
    
    // 处理空值
    if (value === '' || value === null || value === undefined) {
      return '';
    }

    // const isValidNumber = /^-?\d*\.?\d+$/.test(value) || /^-?\d+\.?\d*$/.test(value);
    // if (!isValidNumber) {
    //     return '';
    // }
    
    // 转换为浮点数
    let num = parseFloat(value);
    
    // 处理无效数字
    if (isNaN(num)) {
      return '';
    }
    
    // 限制小数位数
    num = parseFloat(num.toFixed(decimals));
    
    // 限制在范围内
    num = Math.min(Math.max(num, minVal), maxVal);
    
    return num;
  }
  
  // 可以导出更多相关函数
  export default {
    handleTimeInput
  };