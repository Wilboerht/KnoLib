# Hero Background Video Setup

## 视频文件要求

请将您的背景视频文件放置在此目录中，并按以下要求命名：

### 文件名
- `hero-background.mp4` (主要格式)
- `hero-background.webm` (备用格式，可选)

### 视频规格建议
- **分辨率**: 1920x1080 (Full HD) 或更高
- **宽高比**: 16:9
- **时长**: 10-30秒 (循环播放)
- **文件大小**: 建议小于 10MB
- **帧率**: 30fps
- **编码**: H.264 (MP4) / VP9 (WebM)

### 内容建议
- 抽象几何动画
- 粒子效果
- 渐变色彩流动
- 科技感线条动画
- 知识/数据可视化动画

### 优化建议
1. **压缩视频**: 使用工具如 HandBrake 或 FFmpeg 压缩
2. **移除音频**: 背景视频不需要音频轨道
3. **循环优化**: 确保视频开始和结束帧能够无缝循环
4. **移动端优化**: 考虑创建较小的移动端版本

### 示例 FFmpeg 命令
```bash
# 压缩和优化视频
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=1920:1080 -an hero-background.mp4

# 创建 WebM 版本
ffmpeg -i hero-background.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 hero-background.webm
```

### 备用方案
如果没有视频文件，组件会自动回退到纯色背景。

### 性能考虑
- 视频会自动静音和循环播放
- 在移动设备上可能会有性能影响
- 考虑添加用户控制选项（暂停/播放）
