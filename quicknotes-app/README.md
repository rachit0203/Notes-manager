# QuickNotes - MERN Stack Note Taking Application

A full-stack note-taking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, read, update, and delete notes with a clean and intuitive user interface.

## Features

- User authentication (signup/login)
- Create, view, edit, and delete notes
- Rich text formatting support
- Responsive design for all devices
- Real-time updates
- Secure API endpoints
- Organized folder structure

## Tech Stack

- **Frontend**: React.js, TypeScript, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS Modules / Tailwind CSS
- **Package Manager**: npm / yarn

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn
- MongoDB Atlas account or local MongoDB instance

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quicknotes-app.git
cd quicknotes-app
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory with the following variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the Application

#### Development Mode

In the root directory, run:

```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
cd ../client
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## Project Structure

```
quicknotes-app/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Application pages
│       └── App.tsx         # Main application component
├── server/                 # Backend server
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   └── models/         # Database models
│   └── .env               # Environment variables
└── README.md              # Project documentation
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the MERN stack
- Inspired by modern note-taking applications
- Special thanks to all contributors
