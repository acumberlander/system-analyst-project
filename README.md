# System Analyst Project

A full-stack web application for managing student records in a system analyst program. The application provides a modern, responsive interface for administrators to manage student information efficiently.

## Features

- **Student Management**
  - View all students in a sortable, filterable table
  - Add new students with validation
  - Edit existing student information
  - Delete individual students
  - Bulk delete functionality
  - Mock data generation for testing

- **Data Validation**
  - Email format validation
  - Name format validation
  - Profanity filtering
  - Required field validation

- **User Interface**
  - Responsive design using Tailwind CSS
  - Loading states and error handling
  - Confirmation dialogs for destructive actions

## Technology Stack

### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **API**: RESTful architecture
- **CORS**: Configured for secure cross-origin requests
- **Deployment**: Vercel

## Project Structure

```
.
├── client/                 # Frontend application
│   ├── components/        # React components
│   ├── contexts/         # React context providers
│   ├── data/            # Mock data and constants
│   ├── lib/             # Utility functions
│   ├── pages/           # Next.js pages
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
│
└── backend/              # Backend application
    ├── controllers/     # Request handlers
    ├── lib/            # Database and utility functions
    ├── routes/         # API route definitions
    └── types/          # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Backend (.env)
```
PORT=4000
SUPABASE_URL=your_supabase_connection_string
NODE_ENV=development
```

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd system-analyst-project
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Start the development servers

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## API Endpoints

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get a specific student
- `POST /students` - Create a new student
- `PUT /students/:id` - Update a student
- `DELETE /students/:id` - Delete a student

## Deployment

The application is configured for deployment on Vercel and Render:

1. Frontend: `https://system-analyst-project-frontend.vercel.app`
2. Backend: `https://system-analyst-project.onrender.com`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 