# 🚀 TaskForce - Freelance Task Management Platform

A modern, responsive React web application that connects freelancers with clients through an intuitive task management system. Built with React 19, Firebase, and modern web technologies.

## 🌐 Live Demo

**Live Application:** [https://freelance-auth-96883.web.app/](https://freelance-auth-96883.web.app/)

## ✨ Features

### 🔐 Authentication & User Management

- **Secure Login/Registration** with Firebase Authentication
- **User Profiles** with customizable information
- **Protected Routes** for authenticated users
- **Role-based Access** (Clients & Freelancers)

### 📋 Task Management

- **Post Tasks** - Clients can create detailed task descriptions
- **Browse Tasks** - Freelancers can search and filter available tasks
- **Task Categories** - Web Development, Design, Writing, Marketing, and more
- **Task Details** - Comprehensive view with requirements and budget
- **My Tasks** - Personal dashboard for managing posted and accepted tasks
- **Update Tasks** - Edit task details and requirements

### 🎨 Modern UI/UX

- **Responsive Design** - Works seamlessly on all devices
- **Beautiful Animations** - Smooth transitions with Framer Motion
- **Interactive Components** - Engaging user experience
- **Lottie Animations** - Eye-catching loading and success states
- **Tailwind CSS** - Modern, utility-first styling

### 🚀 Performance & Security

- **Fast Loading** - Built with Vite for optimal performance
- **Firebase Backend** - Scalable and secure cloud infrastructure
- **Real-time Updates** - Instant data synchronization
- **Error Handling** - Comprehensive error management

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lottie React** - Animation components

### Services & APIs

- **Firebase** - Authentication, hosting, and database
- **RESTful APIs** - External service integration

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Git** - Version control

## 📁 Project Structure

```
freelance-client/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── BannerSlider.jsx
│   │   ├── Footer.jsx
│   │   ├── FuzzyText.jsx
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/           # Application pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AddTask.jsx
│   │   ├── BrowseTask.jsx
│   │   ├── MyTasks.jsx
│   │   ├── Profile.jsx
│   │   ├── SeeDetails.jsx
│   │   └── UpdateTask.jsx
│   ├── context/         # React context providers
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── firebase/        # Firebase configuration
│   │   └── firebase.init.js
│   ├── routes/          # Routing configuration
│   │   └── router.jsx
│   ├── assets/          # Static assets and animations
│   │   └── lottie/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account and project

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Akhlakur07/freelance-web-client.git
   cd freelance-web/freelance-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/firebase/firebase.init.js`

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

## 🔧 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Key Pages & Components

- **Home** - Landing page with hero section and features
- **Login/Register** - User authentication forms
- **Browse Tasks** - Task discovery and filtering
- **Add Task** - Task creation form
- **Task Details** - Comprehensive task information
- **Profile** - User profile management
- **My Tasks** - Personal task dashboard

## 🎯 Core Features Implementation

### Authentication System

- Firebase Authentication integration
- Protected routes with React Router
- User context management
- Secure login/logout functionality

### Task Management

- CRUD operations for tasks
- Category-based organization
- Search and filtering capabilities
- Real-time updates

### Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- DaisyUI components
- Smooth animations

## 🌟 Highlights

- **Modern React 19** - Latest features and performance improvements
- **Beautiful Animations** - Engaging user experience with Framer Motion
- **Firebase Integration** - Scalable backend infrastructure
- **Responsive Design** - Works perfectly on all devices
- **Clean Code** - Well-structured and maintainable codebase
- **Performance Optimized** - Fast loading with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations

---

⭐ **Star this repository if you find it helpful!**
