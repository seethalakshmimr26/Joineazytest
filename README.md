# Joineazy – Assignment Management System

Joineazy is a web-based Assignment Management System developed using React.js and Tailwind CSS. It helps administrators create and manage assignments while allowing students to view and track their assigned work and submission status.

## Live Demo

[Visit Joineazy](https://joineazytest.vercel.app/)

## Features

### Admin Dashboard
- Create new assignments.
- Edit and delete existing assignments.
- Assign tasks to selected students.
- Add assignment descriptions, due dates and Google Drive links.
- View individual student submission statuses.
- Track assignment completion using progress bars.
- View only assignments created by the logged-in admin.

### Student Dashboard
- View assignments assigned to the student.
- View assignment descriptions and due dates.
- Access Google Drive links.
- Confirm assignment submissions through a two-step confirmation process.
- Track overall submission progress.
- Search assignments by title.
- Filter assignments by submission status.
- Highlight overdue pending assignments.

### Additional Features
- Role switching between 2 admins and 5 students.
- Responsive layout for desktop and mobile.
- Data persistence using browser localStorage.

## Technologies Used

- React.js
- JavaScript
- Tailwind CSS
- Vite
- HTML
- Browser localStorage
- GitHub
- Vercel

## Project Structure

```text
joineazy-dashboard/
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Adjust it to match the actual folders and files in your project.*

## Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project folder

```bash
cd joineazy-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 5. Build for production

```bash
npm run build
```

## Component Architecture

The application is organized into three main components:

**1. App Component**
- Manages the application state.
- Handles user switching.
- Manages assignment creation, updating and deletion.
- Handles student submission updates.
- Stores assignment data in localStorage.

**2. StudentDashboard Component**
- Displays student-specific assignments.
- Handles search and status filtering.
- Manages submission confirmation.
- Displays overall submission progress.

**3. AdminDashboard Component**
- Provides assignment management functionality.
- Allows assignment allocation to selected students.
- Displays student submission statuses.
- Calculates and displays assignment completion progress.

## Data Storage

The application uses browser localStorage to persist assignment data across page refreshes.

This project uses mock users and does not require a backend server or database.

**Note:** localStorage data is specific to the browser and device being used.

## Design Decisions

- Separate dashboards are provided for administrators and students.
- Students can access only assignments assigned to them.
- Administrators can manage only assignments they created.
- A confirmation process helps prevent accidental submission-status updates.
- Progress indicators make assignment completion easier to track.
- Responsive layouts support both desktop and mobile screens.

## Deployment

The application is deployed using Vercel.

Live URL: https://joineazytest.vercel.app/
