# 🎵 You Listen - Modern Music Streaming App

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h3>🎶 A beautiful, modern music streaming application built with React Native and Expo</h3>
  <p>Experience music like never before with stunning gradients, smooth animations, and seamless playback</p>
</div>

---

## ✨ Features

### 🎵 **Core Music Features**

- **High-Quality Audio Streaming** - Crystal clear audio playback with background support
- **Seamless Playback Control** - Play, pause, seek, and skip with smooth animations
- **Real-time Progress Tracking** - Live progress updates with beautiful progress bars
- **Background Playback** - Continue listening while using other apps

### 🎨 **Beautiful UI/UX**

- **Stunning Gradients** - Eye-catching gradient backgrounds throughout the app
- **Smooth Animations** - 60fps animations with React Native Reanimated
- **Modal Audio Player** - Immersive full-screen audio experience
- **Minimalist Design** - Clean, modern interface focusing on the music

### 🔐 **User Experience**

- **Secure Authentication** - JWT-based authentication system
- **Route Protection** - Secure access to authenticated features
- **Responsive Design** - Optimized for all screen sizes
- **Loading States** - Smooth loading indicators and states

### 📱 **Mobile-First Features**

- **Touch Gestures** - Intuitive touch controls and gestures
- **Safe Area Support** - Perfect compatibility with notches and home indicators
- **Dark Mode** - Beautiful dark theme optimized for music listening
- **Cross-Platform** - Works seamlessly on iOS and Android

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Expo CLI**
- **Expo Go** app on your mobile device (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shwetanshu13/you-listen-app.git
   cd you-listen-app/mobile-app/you-listen-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm start
   # or
   npm start
   ```

4. **Run on device/emulator**

   ```bash
   # For iOS
   pnpm ios

   # For Android
   pnpm android

   # For Web
   pnpm web
   ```

---

## 🏗️ Project Structure

```
you-listen-app/
├── app/                          # App Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── library.tsx          # Music library
│   │   ├── profile.tsx          # User profile
│   │   └── _layout.tsx          # Tab layout
│   ├── audio-page.tsx           # Full-screen audio player (Modal)
│   ├── login.tsx                # Authentication screen
│   ├── index.tsx                # Landing page
│   ├── _layout.tsx              # Root layout
│   └── global.css               # Global styles
├── components/                   # Reusable components
│   ├── AudioPlayer.tsx          # Mini audio player
│   ├── AudioPlayerWrapper.tsx   # Player wrapper
│   ├── SongCard.tsx             # Song card component
│   ├── SongList.tsx             # Song list component
│   ├── ProfileCard.tsx          # Profile card
│   └── index.ts                 # Component exports
├── stores/                       # State management
│   ├── useAudioStore.ts         # Audio playback state
│   └── useAuthStore.ts          # Authentication state
├── utils/                        # Utility functions
│   └── axios.ts                 # API configuration
├── lib/                          # Helper libraries
│   └── utils.ts                 # Utility functions
└── assets/                       # Static assets
    ├── icon.png
    ├── splash-icon.png
    └── ...
```

---

## 🛠️ Tech Stack

### **Frontend**

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing system

### **Styling & UI**

- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - High-performance animations
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Lucide React Native** - Modern icon library

### **Audio & Media**

- **Expo AV** - Audio and video playback
- **React Native Community Slider** - Audio seeking controls
- **Background audio support** - Continue playback when app is backgrounded

### **State Management**

- **Zustand** - Lightweight state management
- **Async Storage** - Persistent local storage

### **Development Tools**

- **Prettier** - Code formatting
- **ESLint** - Code linting
- **TypeScript** - Static type checking

---

## 🎨 Design Philosophy

### **Visual Design**

- **Gradient-First Approach** - Beautiful gradients create depth and visual interest
- **Dark Theme Optimized** - Perfect for music listening environments
- **Minimalist Interface** - Focus on the music, not the UI
- **Smooth Animations** - Every interaction feels fluid and responsive

### **User Experience**

- **Intuitive Navigation** - Easy to understand and use
- **Seamless Playback** - Uninterrupted music experience
- **Performance First** - Optimized for smooth performance
- **Accessibility** - Designed for all users

---

## 🔧 Configuration

### **Environment Setup**

Create a `.env` file in the root directory:

```env
API_BASE_URL=your_api_base_url
```

### **Audio Configuration**

The app is configured for optimal audio playback:

- Background audio support
- Silent mode playback (iOS)
- Audio focus management (Android)
- High-quality audio streaming

---

## 📱 Key Features Breakdown

### **🎵 Audio Player**

- **Mini Player** - Always-accessible mini player at the bottom
- **Full-Screen Modal** - Immersive full-screen audio experience
- **Seek Controls** - Precise audio seeking with visual feedback
- **Real-time Updates** - Live progress and time updates

### **🎨 Visual Elements**

- **Gradient Backgrounds** - Dynamic gradients throughout the app
- **Smooth Animations** - Page transitions and micro-interactions
- **Loading States** - Beautiful loading indicators
- **Modal Presentations** - Smooth modal transitions

### **🔐 Authentication**

- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Automatic redirection for unauthorized access
- **Persistent Sessions** - Remember user login state

---

## 🚀 Performance Optimizations

- **Optimized Audio Loading** - Efficient audio streaming and caching
- **Smooth Animations** - 60fps animations with React Native Reanimated
- **Memory Management** - Proper cleanup of audio resources
- **Background Performance** - Optimized for background audio playback

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use NativeWind for styling
- Maintain component modularity
- Write descriptive commit messages
- Test on both iOS and Android

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shwetanshu13**

- GitHub: [@Shwetanshu13](https://github.com/Shwetanshu13)

---

## 🎉 Acknowledgments

- React Native community for amazing tools
- Expo team for the excellent development platform
- Zustand for lightweight state management
- All contributors who helped improve this project

---

<div align="center">
  <h3>🎵 Made with ❤️ for music lovers</h3>
  <p>If you like this project, please give it a ⭐️</p>
</div>
