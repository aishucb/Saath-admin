# Saath Admin Web

A modern React-based admin dashboard for managing the Saath mobile application. Built with React 19, Material-UI, and Vite for optimal performance and developer experience.

## 🚀 Features

- **Modern React 19**: Built with the latest React features and hooks
- **Material-UI Design**: Beautiful, responsive UI components
- **Protected Routes**: Secure authentication system with route protection
- **Forum Management**: Complete CRUD operations for forum posts and comments
- **Dashboard Analytics**: Overview of platform statistics and user activity
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Fast Development**: Hot module replacement with Vite

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: React Icons + Material Icons
- **Styling**: Emotion (CSS-in-JS)
- **Font**: Poppins (Google Fonts)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

## 🚀 Getting Started

### 1. Installation

1. Clone the repository and navigate to the adminweb directory:
   ```bash
   cd adminweb
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### 2. Environment Setup

1. Create a `.env` file in the adminweb root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_ADMIN_EMAIL=admin@saath.com
   ```

2. Update the API configuration in `src/utils/api.js` if needed.

### 3. Running the Application

#### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

#### Production Build
```bash
npm run build
# or
yarn build
```

#### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
adminweb/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   └── Sidebar.jsx    # Navigation sidebar
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Admin dashboard
│   │   ├── ForumPage.jsx  # Forum listing page
│   │   ├── ForumDetailPage.jsx # Individual forum view
│   │   └── Login.jsx      # Authentication page
│   ├── utils/             # Utility functions
│   │   └── api.js         # API configuration
│   ├── assets/            # Images and static files
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## 🔐 Authentication

The admin web uses token-based authentication:

- **Login**: Admin credentials are validated against the backend
- **Token Storage**: JWT tokens are stored in localStorage
- **Route Protection**: Protected routes automatically redirect to login
- **Session Management**: Automatic logout on token expiration

## 📊 Dashboard Features

### Main Dashboard
- Platform statistics overview
- Recent forum activity
- User engagement metrics
- Quick action buttons

### Forum Management
- **Forum Listing**: View all forum posts with search and filtering
- **Forum Details**: Detailed view of individual forums with comments
- **Comment Management**: Moderate and manage forum comments
- **User Management**: View user profiles and activity

## 🎨 UI Components

### Material-UI Integration
- **Theme**: Custom theme with Saath brand colors
- **Components**: Cards, Tables, Buttons, Forms, and more
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components

### Custom Components
- **Layout**: Consistent page layout with sidebar navigation
- **Sidebar**: Collapsible navigation menu
- **Forms**: Reusable form components with validation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality:
- React Hooks rules
- React Refresh plugin
- Modern JavaScript features

### Hot Reload

Vite provides instant hot module replacement for fast development.

## 🌐 API Integration

The admin web communicates with the Saath backend API:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT token-based requests
- **Error Handling**: Centralized error handling and user feedback
- **Loading States**: Optimistic UI updates with loading indicators

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_ADMIN_EMAIL=admin@yourdomain.com
```

## 🔒 Security Considerations

1. **Authentication**: Secure token-based authentication
2. **Route Protection**: Client-side and server-side route validation
3. **Input Validation**: Form validation and sanitization
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Proper CORS configuration on the backend

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Find and kill the process
   lsof -i :5173
   kill -9 <PID>
   ```

2. **Build Errors**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API Connection Issues**:
   - Check if the backend server is running
   - Verify API base URL in environment variables
   - Check network connectivity

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Saath community**
