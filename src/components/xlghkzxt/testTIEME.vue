<template>
  <div class="visualization-container">
    <!-- 控制区域 -->
    <div class="controls">
      <button @click="toggleAnimation">{{ isPlaying ? '暂停' : '开始' }}</button>
      <button @click="resetCharts">重置</button>
    </div>
    
    <!-- 频谱图 -->
    <div class="chart-container">
      <h3>频谱图（当前时刻频率分布）</h3>
      <canvas ref="spectrumCanvas" width="800" height="300"></canvas>
    </div>
    
    <!-- 瀑布图 -->
    <div class="chart-container">
      <h3>瀑布图（频率随时间变化）</h3>
      <canvas ref="waterfallCanvas" width="800" height="400"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpectrumVisualizer',
  data() {
    return {
      isPlaying: false,
      animationId: null,
      sampleRate: 1000,        // 采样率(Hz)
      duration: 10,            // 数据总时长(秒)
      frequencies: [30, 80, 150], // 模拟信号基频
      noiseLevel: 0.2,          // 噪声强度
      timeData: [],             // 时域数据存储
      waterfallData: [],        // 瀑布图历史数据栈
      maxWaterfallFrames: 100   // 最大缓存帧数[1](@ref)
    }
  },
  mounted() {
    this.initCanvasContext();
    this.generateTestData();
  },
  beforeDestroy() {
    this.stopAnimation();
  },
  methods: {
    // 初始化Canvas上下文
    initCanvasContext() {
      this.spectrumCtx = this.$refs.spectrumCanvas.getContext('2d');
      this.waterfallCtx = this.$refs.waterfallCanvas.getContext('2d');
      
      // 初始化瀑布图背景[5](@ref)
      this.waterfallCtx.fillStyle = '#0f1a26';
      this.waterfallCtx.fillRect(0, 0, 
        this.$refs.waterfallCanvas.width, 
        this.$refs.waterfallCanvas.height
      );
    },
    
    // 生成模拟振动信号
    generateTestData() {
      const numSamples = this.sampleRate * this.duration;
      this.timeData = [];
      
      for (let i = 0; i < numSamples; i++) {
        const t = i / this.sampleRate;
        let value = 0;
        
        // 多频段信号合成
        this.frequencies.forEach(freq => {
          value += Math.sin(2 * Math.PI * freq * t);
        });
        
        // 添加高斯噪声
        value += this.noiseLevel * (Math.random() - 0.5);
        this.timeData.push(value);
      }
      console.log(this.frequencies,'frequencies');

    },
    
    // 简易FFT计算（Hamming窗减少泄漏）
    calculateFFT(signal) {
      const N = signal.length;
      const fft = new Array(N/2).fill(0);
      
      for (let k = 0; k < N/2; k++) {
        let real = 0;
        let imag = 0;
        
        for (let n = 0; n < N; n++) {
          const angle = (2 * Math.PI * k * n) / N;
          const window = 0.54 - 0.46 * Math.cos(2 * Math.PI * n / (N - 1));
          real += signal[n] * window * Math.cos(angle);
          imag -= signal[n] * window * Math.sin(angle);
        }
        fft[k] = Math.sqrt(real*real + imag*imag) / N * 2;
      }
      return fft;
    },
    
    // 绘制频谱图
    drawSpectrum(fftData) {
      const canvas = this.$refs.spectrumCanvas;
      const width = canvas.width;
      const height = canvas.height;
      
      // 清空画布
      this.spectrumCtx.clearRect(0, 0, width, height);
      
      // 创建渐变着色器[4](@ref)
      const gradient = this.spectrumCtx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#4facfe');
      gradient.addColorStop(1, '#00f2fe');
      
      // 绘制频谱曲线
      this.spectrumCtx.beginPath();
      for (let i = 0; i < fftData.length; i++) {
        const x = 50 + (i / fftData.length) * (width - 70);
        const y = height - 30 - fftData[i] * height * 0.6;
        
        if (i === 0) this.spectrumCtx.moveTo(x, y);
        else this.spectrumCtx.lineTo(x, y);
      }
      this.spectrumCtx.strokeStyle = gradient;
      this.spectrumCtx.lineWidth = 2;
      this.spectrumCtx.stroke();
    },
    
    // 绘制瀑布图（热力图形式）
    drawWaterfall(fftData) {
      const canvas = this.$refs.waterfallCanvas;
      const width = canvas.width;
      const height = canvas.height;
      
      // 1. 更新数据栈
      this.waterfallData.unshift(fftData);
      if (this.waterfallData.length > this.maxWaterfallFrames) {
        this.waterfallData.pop();
      }
      
      // 2. 清空画布（保留历史帧）
      this.waterfallCtx.fillStyle = '#0f1a26';
      this.waterfallCtx.fillRect(0, 0, width, height);
      
      // 3. 绘制所有帧
      const frameHeight = height / this.maxWaterfallFrames;
      const colorMap = this.generateColorMap();
      
      for (let t = 0; t < this.waterfallData.length; t++) {
        const spectrum = this.waterfallData[t];
        const yPos = height - t * frameHeight;
        
        for (let f = 0; f < spectrum.length; f++) {
          const xPos = (f / spectrum.length) * width;
          const amplitude = spectrum[f];
          
          // 振幅映射到颜色索引[3](@ref)
          const colorIndex = Math.min(Math.floor(amplitude * 255), colorMap.length - 1);
          this.waterfallCtx.fillStyle = colorMap[colorIndex];
          
          this.waterfallCtx.fillRect(
            xPos, 
            yPos, 
            Math.max(2, width / spectrum.length), 
            frameHeight + 1
          );
        }
      }
    },
    
    // 生成蓝-红渐变色谱
    generateColorMap() {
      const colors = [];
      for (let i = 0; i < 256; i++) {
        let r, g, b;
        if (i < 64) {
          r = 0; g = i*4; b = 255;        // 蓝→青
        } else if (i < 128) {
          r = 0; g = 255; b = 255 - (i-64)*4; // 青→绿
        } else if (i < 192) {
          r = (i-128)*4; g = 255; b = 0;    // 绿→黄
        } else {
          r = 255; g = 255 - (i-192)*4; b = 0; // 黄→红
        }
        colors.push(`rgb(${r},${g},${b})`);
      }
      return colors;
    },
    
    // 动画循环（核心）
    animationFrame() {
      if (!this.isPlaying) return;
      
      // 从测试数据随机截取256点
      const frameSize = 256;
      const startIndex = Math.floor(
        Math.random() * (this.timeData.length - frameSize)
      );
      const segment = this.timeData.slice(startIndex, startIndex + frameSize);
      
      // 计算FFT并更新视图
      const fftResult = this.calculateFFT(segment);
      this.drawSpectrum(fftResult);
      this.drawWaterfall(fftResult);
      
      this.animationId = requestAnimationFrame(this.animationFrame);
    },
    
    // 控制函数
    toggleAnimation() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.animationId = requestAnimationFrame(this.animationFrame);
      } else if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
    
    resetCharts() {
      this.waterfallData = [];
      this.waterfallCtx.fillStyle = '#0f1a26';
      this.waterfallCtx.fillRect(0, 0, 
        this.$refs.waterfallCanvas.width, 
        this.$refs.waterfallCanvas.height
      );
    },
    
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.isPlaying = false;
      }
    }
  }
};
</script>

<style scoped>
.visualization-container {
  padding: 20px;
  background: #1e2a38;
  border-radius: 10px;
  font-family: 'Segoe UI', sans-serif;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

button {
  padding: 10px 20px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
}

.chart-container {
  margin-bottom: 30px;
  background: rgba(15, 26, 38, 0.7);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

h3 {
  color: #00f2fe;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.4em;
  font-weight: 500;
}

canvas {
  display: block;
  border-radius: 8px;
  background: #0a121b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
</style>