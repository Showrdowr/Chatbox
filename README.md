# Telehealth Chat Application

A full-stack 1-on-1 chat application built with React, Node.js, and TypeScript.

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** In-memory data store (Arrays)

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or later recommended)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-folder>
````
### 2. Install Dependencie

**server setup**
Open a new terminal (or go back to root):

```bash
cd chat-app-server
npm install
````

**Client Setup:**
Open a new terminal (or go back to root):

```bash
cd ../client
npm install
```

-----

## 🏃‍♂️ How to Run

### 1\. Start the Backend Server

In the `chat-app-server` directory:

```bash
npm run dev
```

The server will start at `http://localhost:3001`.

### 2\. Start the Frontend Client

In the `client` directory (open a new terminal):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (check your terminal for the exact port).

-----

## 🧪 How to Test (Mock Users)

[cite\_start]Since there is no formal authentication system (as per requirements [cite: 13]), the app uses a **Mock Login** mechanism with seeded users:

1.  Open the frontend URL in your browser.
2.  You will see a **"Select User"** screen with the following seeded users:
      - **Alice**
      - **Bob**
      - **Charlie**
3.  Click on a user (e.g., **Alice**) to log in.
4.  **To test chatting:**
      - Open a **new incognito window** or a different browser tab.
      - Log in as a different user (e.g., **Bob**).
      - On Alice's screen, select "Bob" from the dropdown to start a conversation.
      - Send messages back and forth.

[cite\_start]**Note for Reviewers:** The current user's ID is sent via the `x-user-id` header in API requests to identify the session[cite: 14, 63].

-----
<!-- end list -->

```






