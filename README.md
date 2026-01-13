# GrowBox - Smart Hydroponic Growing System

GrowBox is a comprehensive mobile-first web application designed for managing automated hydroponic growing systems. It provides users with complete control over their indoor gardens through real-time monitoring, automated environmental controls, and intelligent growth tracking.

## 🌱 Overview

GrowBox enables users to cultivate various types of plants including microgreens, herbs, vegetables, mushrooms, and flowering plants in a controlled hydroponic environment. The application features seamless integration with IoT devices, providing real-time data visualization and automated parameter management for optimal plant growth.

---

## 🟢 Key Features

### Authentication & User Management

- **Secure Registration & Login**: Firebase Authentication with email/password
- **Session Management**: Persistent sessions with automatic token refresh
- **User Profiles**: Personalized settings and plant management

### Plant Management

- **Crop Type Selection**: Choose from 5 plant categories:
  - Microgreens
  - Herbs
  - Vegetables
  - Mushrooms
  - Flowering Plants
- **Growth Tracking**: Visual progress bars showing growth stages
- **Harvest Management**: Automated harvest notifications and tracking

### Device Integration & Control

- **Bluetooth Connectivity**: Direct connection to GrowBox hardware via Bluetooth Low Energy (BLE)
- **Real-time Monitoring**: Live sensor data for environmental parameters
- **Automated Controls**: Smart parameter adjustments based on plant requirements

### Environmental Monitoring

- **Light Management**: LED intensity control and scheduling
- **Temperature Control**: Precise climate management with heating/cooling
- **Humidity Regulation**: Automated humidification and dehumidification
- **Nutrition Delivery**: Automated nutrient solution dispensing
- **Ventilation Control**: Smart air circulation management
- **Watering Systems**: Automated irrigation with customizable schedules

### Data Analytics & Visualization

- **Real-time Charts**: Interactive graphs for all environmental parameters
- **Historical Data**: Comprehensive growth history and trends
- **Data Export**: Export capabilities for analysis and record-keeping

---

## 🟢 Architecture

### Application Structure

| Component          | Description                                           | Pages                                    |
| ------------------ | ----------------------------------------------------- | ---------------------------------------- |
| **Authentication** | User registration, login, and session management      | Login, Register                          |
| **Onboarding**     | New user setup and device configuration               | Onboarding (3-step process)              |
| **Dashboard**      | Main control interface with real-time data            | Dashboard                                |
| **Settings**       | Parameter configuration for each environmental factor | 6 dedicated settings pages               |
| **Profile**        | User account management and plant configuration       | Profile, Crop Selection, Growth Settings |
| **Analytics**      | Historical data visualization and export              | Historic Data (4 parameter views)        |

---

### 🟢Technology Stack

#### Frontend

- **Framework**: Next.js 15.5.7 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Routing**: Next.js App Router

#### Backend & Database

- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **API**: Next.js API Routes
- **Session Management**: Firebase Session Cookies

#### Additional Technologies

- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns
- **Icons**: Lucide React

---

## 🟢 User Experience Flow

### 1. Getting Started

1. **Welcome Screen**: Introduction to GrowBox
2. **Registration/Login**: Secure account creation or authentication
3. **Onboarding Process**: 3-step setup guide
   - Plant type selection
   - Device connection
   - Dashboard introduction

### 2. Device Setup

1. **Crop Selection**: Choose plant type and growth parameters
2. **Device Connection**: Bluetooth pairing with GrowBox hardware
3. **Growth Configuration**: Set growth duration and start date

### 3. Daily Operation

1. **Dashboard Monitoring**: Real-time environmental data
2. **Parameter Control**: Adjust settings as needed
3. **Progress Tracking**: Monitor growth progress
4. **Data Analysis**: Review historical trends

### 4. Maintenance & Harvest

1. **Settings Adjustment**: Fine-tune environmental parameters
2. **Harvest Notifications**: Automated alerts for harvest readiness
3. **Data Export**: Save growth records and analytics

---

## 🟢 Device Integration

### Hardware Connection

GrowBox seamlessly connects to physical hydroponic systems through:

- **Bluetooth Low Energy (BLE)**: Direct wireless communication
- **Real-time Data Streaming**: Continuous sensor data transmission
- **Remote Control**: Parameter adjustments from mobile device
- **Automated Synchronization**: Settings sync between app and hardware

### Supported Parameters

- **Lighting**: Full-spectrum LED control with intensity and timing
- **Temperature**: Climate control with heating and cooling systems
- **Humidity**: Automated humidification and ventilation
- **Nutrition**: pH-balanced nutrient delivery systems
- **Watering**: Precision irrigation with flow control
- **Ventilation**: Air circulation management

---

## 🟢 Data Management

### Real-time Monitoring

- Visual indicators for parameter status
- Automated alerts for out-of-range conditions
- Historical data storage with 30-day retention

### Analytics Features

- Interactive time-series charts
- Multiple time periods (day, week, month)
- Parameter correlation analysis
- Growth milestone tracking
- Export functionality for external analysis

---

## 🟢 Design System

### Responsive Design

- **Mobile-First**: Optimized for smartphones and tablets
- **Adaptive Layout**: Seamless experience across device sizes
- **Touch-Friendly**: Large buttons and intuitive gestures

### Theme Support

- **Light/Dark Mode**: Automatic theme switching
- **Consistent Branding**: Green color scheme reflecting plant growth
- **Accessibility**: High contrast ratios and readable typography

### UI Components

- **Modern Design**: Clean, minimalist interface
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Loading States**: Skeleton screens and progress indicators

---

## 🟢 Security & Privacy

### Authentication Security

- **Firebase Authentication**: Industry-standard security
- **Session Cookies**: Secure, HTTP-only session management
- **Token Refresh**: Automatic session renewal


### Data Protection

- **User Data Isolation**: Separate data storage per user
- **Privacy Controls**: Granular permission management
- **Secure API**: Protected endpoints with authentication checks

---

## 🟢 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd growbox
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to environment variables

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🟢 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality assurance

---

## 🟢 Performance

### Optimization Features

- **Next.js App Router**: Optimized routing and loading
- **Image Optimization**: Automatic image compression and WebP conversion
- **Code Splitting**: Automatic chunk splitting for better loading
- **Caching**: Intelligent caching strategies for data and assets

### Mobile Performance

- **Progressive Web App**: Installable on mobile devices
- **Fast Loading**: Optimized bundle sizes and lazy loading

---

 🌱**GrowBox** - Revolutionizing indoor agriculture through technology and smart automation.

---

## Original Next.js Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
