#project setUP
# Create new React project with Vite
npm create vite@latest dkut-nav-app -- --template react

# Navigate to project
cd dkut-nav-app

# Install dependencies
npm install

#install Required Packages
# Core dependencies
npm install react-router-dom axios

# UI Framework - Choose ONE:
# Option 1: Material-UI (Recommended for this project)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Option 2: Ant Design
# npm install antd @ant-design/icons

# Option 3: Chakra UI
# npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# State Management
npm install @tanstack/react-query zustand

# Forms & Validation
npm install react-hook-form yup @hookform/resolvers

# Maps (for location features)
npm install leaflet react-leaflet

# Utilities
npm install date-fns lodash

# Dev dependencies
npm install -D @types/leaflet

# Notifications/Toasts
npm install react-hot-toast

# Icons
npm install lucide-react

#create multiple folders
mkdir -p src/{api,components/{common,buildings,locations,facilities,maps},hooks,layouts,pages,store,utils,styles}
