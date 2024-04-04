TASKMATE

### A simple task management app built with Express and React.

### Tech Stack

- React
- Express
- NeonDB
- Node.js
- Shadcn UI Base Components
- Taiwind CSS
- React Query

### How to run the app

1. Clone the repository
2. Install dependencies
3. Please create a database on NeonDB for DB connection. Set that as the DB url in .env file (details in .env.example) 
5. Run "npx prisma db push" before starting the server to create the tables in the database.
4. For Client, run `npm install` in the client directory and `npm start` to start the client.
   - Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
5. For Server, run `npm install` in the server directory and `npm start` to start the server. The server will run on port 4000.

### Features

- Create, update, delete tasks
- Mark tasks as complete
- Filter tasks by status
- Search tasks by title
- Add notes to tasks
- Add Due Date to tasks
- Add reminders to tasks
- Send reminder to email using node-cron and nodemailer.



















