const xdata = [
    [1,20],
    [1.01,19],
    [1.02,18],
    [1.03,17],
    [1.04,16],
    [1.05,15],
    [1.06,14],
    [1.07,13],
    [1.08,12],
    [1.09,11],
    [1.1,10],
    [1.11,9],
    [1.12,8],
    [1.13,7],
    [1.14,58],
    [1.15,59],
    [1.16,50],
    [1.17,51],
    // 以下是新增的4000个数据点
    ...Array(200000).fill().map((_, i) => {
        const x = 1.18 + i * 0.01; // 按0.01递增
        const y = Math.floor(Math.random() * 100); // 0-99的随机整数
        return [parseFloat(x.toFixed(2)), y];
    })
];

// 提取所有第二个数值的数组
const secondValues = xdata.map(item => item[1]);


// 在文件末尾添加导出语句
export { xdata, secondValues };