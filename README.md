# CTC Events – Comprehensive Campus Management Platform

<p align="center">
  <img src="public/logo.svg" alt="CTC Events Logo" width="120"/>
</p>

<p align="center">
  <b>Your all-in-one campus platform for events, academics, and career opportunities.<br>Connect with communities, discover events, access study materials, and explore placement opportunities.</b>
</p>

---

## 🚀 Overview

**CTC Events** is a comprehensive campus management platform designed specifically for educational institutions. It seamlessly integrates event management, academic resources, and career services into one unified experience. Whether you're a student, faculty member, or administrator, CTC Events provides the tools you need to stay connected, informed, and engaged with campus life.

---

## ✨ Key Features

### 🎯 **Unified Dashboard Experience**
- **All Posts Feed**: Integrated view of events, study materials, and TNP updates in one place
- **Personalized Content**: Role-based content filtering and personalized recommendations
- **Mobile-Optimized**: Responsive design with horizontal scrolling sections for mobile users

### 🎪 **Event Management**
- **Event Discovery**: Browse and filter events by type, date, and community
- **Smart Registration**: RSVP system with form-based registration and capacity management
- **Event Creation**: Rich event creation with cover images, descriptions, and custom forms
- **Calendar Integration**: Beautiful calendar view with event visualization
- **QR Code Check-ins**: Streamlined event attendance tracking

### 📚 **Academic Resources (Study Section)**
- **Study Materials**: Upload and access notes, assignments, and academic resources
- **Subject Organization**: Categorize content by subject, semester, and difficulty level
- **File Management**: Support for multiple file types with smart download handling
- **Cover Images**: Visual representation of study materials with image support

### 💼 **Training & Placement (TNP)**
- **Job Opportunities**: Browse internships, full-time positions, and placement drives
- **Role-Based Access**: Placement-specific content restricted to eligible students
- **Application Tracking**: Direct links to company applications and deadline management
- **Company Profiles**: Detailed company information and requirements

### 🏘️ **Community System**
- **Community Discovery**: Explore trending communities and join based on interests
- **Community Management**: Create and manage communities with admin controls
- **Follow System**: Follow communities for updates without full membership
- **Verification System**: Verified community badges for official organizations

### 👥 **User Management & Roles**
- **Multi-Role System**: Support for students, technical leads, operators, and admins
- **Technical Lead Dashboard**: Special dashboard for tracking referrals and event sharing
- **Operator Controls**: Content management and community oversight tools
- **Admin Panel**: Comprehensive platform administration and analytics

### 🔐 **Authentication & Security**
- **Multiple Auth Methods**: Google OAuth and credential-based authentication
- **Email Verification**: Secure account verification with OTP support
- **Role-Based Permissions**: Granular access control based on user roles
- **Session Management**: Secure session handling with NextAuth.js

### 📱 **Modern User Experience**
- **Progressive Web App**: Install as a native app on mobile and desktop
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Optimized for all screen sizes and devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

---

## 🛠️ Technology Stack

### **Frontend & Framework**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router and Server Components
- **[React 18](https://react.dev/)** - Modern React with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development with full IntelliSense

### **UI & Styling**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality, accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful, customizable SVG icons
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library

### **Authentication & Security**
- **[NextAuth.js](https://next-auth.js.org/)** - Complete authentication solution
- **Google OAuth** - Social authentication integration
- **JWT Sessions** - Secure session management
- **Email Verification** - Account security with OTP support

### **Database & Backend**
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for flexible data storage
- **MongoDB Aggregation** - Complex queries and data processing
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Modern server-side data mutations

### **File Management & Media**
- **[Cloudinary](https://cloudinary.com/)** - Cloud-based image and video management
- **File Upload System** - Multi-format file support with validation
- **Image Optimization** - Automatic image compression and formatting

### **Development & Quality**
- **[ESLint](https://eslint.org/)** - Code linting and quality enforcement
- **[Prettier](https://prettier.io/)** - Code formatting and consistency
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Runtime type validation and schema parsing

### **Utilities & Libraries**
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[clsx](https://www.npmjs.com/package/clsx)** - Conditional className utility
- **[QRCode](https://www.npmjs.com/package/qrcode)** - QR code generation for events
- **[Nodemailer](https://nodemailer.com/)** - Email sending capabilities

---

## 📦 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** instance (local or MongoDB Atlas)
- **Cloudinary** account for media management
- **Google OAuth** credentials (optional, for social login)
- **SMTP** server for email notifications

### Installation & Setup

```bash
# Clone the repository
$ git clone https://github.com/your-username/ctc-events
$ cd ctc-events

# Install dependencies
$ npm install

# Copy and configure environment variables
$ cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ctc-events
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ctc-events

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (For file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Development

```bash
# Run the development server
$ npm run dev

# Build for production
$ npm run build

# Start production server
$ npm start

# Run linting
$ npm run lint
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Default Admin Account

For initial setup, you can use the built-in admin credentials:
- **Email**: `admin@ctc.com`
- **Password**: `Admin@123456`

> ⚠️ **Important**: Change these credentials in production by updating the `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `lib/auth.ts`

---

## 🧩 Project Structure

```
ctc-events/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── communities/          # Community management
│   │   ├── events/               # Event management
│   │   ├── study/                # Study materials
│   │   ├── tnp/                  # Training & Placement
│   │   └── user/                 # User management
│   ├── calendar/                 # Calendar view
│   ├── communities/              # Community pages
│   ├── events/                   # Event pages
│   ├── home/                     # Dashboard
│   ├── operator/                 # Operator dashboard
│   ├── profile/                  # User profiles
│   ├── settings/                 # User settings
│   ├── study/                    # Study materials
│   ├── technical-lead/           # Technical lead dashboard
│   └── tnp/                      # TNP pages
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── events/                   # Event-related components
│   ├── feed/                     # Feed components
│   ├── layout/                   # Layout components
│   ├── profile/                  # Profile components
│   └── ui/                       # Base UI components (shadcn/ui)
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication configuration
│   ├── mongodb.ts                # Database connection
│   └── utils.ts                  # Helper utilities
├── public/                       # Static assets
│   ├── icons/                    # App icons
│   ├── images/                   # Images and graphics
│   └── manifest.json             # PWA manifest
├── types/                        # TypeScript definitions
│   ├── event.ts                  # Event types
│   ├── feed.ts                   # Feed types
│   └── user.ts                   # User types
└── styles/                       # Global styles
    └── globals.css               # Global CSS and Tailwind
```

---

## 🎯 User Roles & Permissions

### **Student (Default)**
- Browse and register for events
- Access study materials
- Join communities
- View general TNP updates

### **CTC Student**
- All student permissions
- Access to placement-specific content
- Priority event notifications

### **Technical Lead**
- All CTC student permissions
- Referral tracking dashboard
- Event sharing with referral links
- Performance analytics

### **Operator**
- Content management capabilities
- Create and manage events
- Publish study materials and TNP posts
- Community oversight

### **Admin**
- Full platform access
- User management
- Community approval/rejection
- System analytics and reports
- Platform configuration

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
$ npm i -g vercel

# Deploy to Vercel
$ vercel

# Set environment variables in Vercel dashboard
```

### **Docker**

```bash
# Build Docker image
$ docker build -t ctc-events .

# Run container
$ docker run -p 3000:3000 ctc-events
```

### **Manual Deployment**

```bash
# Build the application
$ npm run build

# Start production server
$ npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper error handling
- Include JSDoc comments for complex functions
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and deployment
- [MongoDB](https://www.mongodb.com/) for database services
- [Cloudinary](https://cloudinary.com/) for media management

---

<p align="center">
  <b>CTC Events – Connecting Campus Life, One Event at a Time.</b>
</p>

<p align="center">
  Made with ❤️ for educational institutions worldwide
</p>
