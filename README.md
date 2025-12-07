
# Advanced Ludo – Full Stack Web Game

A modern web-based Ludo game inspired by **Ludo King**, built with:

- **React + Vite** (frontend)
- **Node.js + Express + Socket.io** (backend)
- Auth, rooms and local demo mode

> Online multiplayer and full 52-cell Ludo King rule-set are planned as future work.  
> Current version focuses on clean UI, authentication, game rooms and a polished local Ludo demo.

---

## 🧱 Project Structure

```bash
LUDOGAME/
│
├── ludo-backend/          # Node.js + Express + Socket.io backend
│   ├── src/
│   │   ├── config/        # DB config, JWT, etc.
│   │   ├── controllers/   # auth, user, leaderboard controllers
│   │   ├── models/        # User, Game, Room schemas (Mongo-ready)
│   │   ├── routes/        # authRoutes, userRoutes, leaderboardRoutes
│   │   ├── sockets/       # gameSocket (room & real-time events)
│   │   └── utils/         # game logic helpers, JWT helpers
│   └── server.js          # API + WebSocket entry point
│
└── ludo-frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/    # Ludo board, dice, navbar, UI blocks
    │   ├── context/       # AuthContext, SocketContext
    │   ├── hooks/         # useAuth, useGameState, useLocalLudo
    │   ├── pages/         # Login, Register, Home, GameRoom, LocalGame, Profile, Leaderboard
    │   └── styles/        # global styles
    └── index.html
````

---

## ⚙️ Tech Stack

### Frontend

* React 18
* Vite
* React Router
* Context API (Auth + Socket)
* Axios
* Custom CSS / utility classes

### Backend

* Node.js
* Express.js
* Socket.io
* bcryptjs
* jsonwebtoken (JWT)
* Mongoose (MongoDB-ready – can be enabled when DB is available)

---

## 🎮 Game Features (Current Version)

### 🔐 Authentication

* User **registration & login**
* Password hashing using **bcryptjs**
* JWT-based authentication (ready to secure APIs)
* Auth context on the frontend for protected pages

### 🏠 Lobby & Rooms

* Home page showing:

  * **Create Room** – start a new multiplayer room (architecture ready)
  * **Join Room** – join by room code
* Socket.io integration prepared for real-time multiplayer.

*(Rooms can be demonstrated in UI even if Mongo/production server is not fully connected.)*

### 🎲 Local Ludo Demo

* **4 players**: RED, GREEN, YELLOW, BLUE
* **4 tokens per player**
* Turn-based dice rolling
* Tokens move from **home → path → goal**
* Simple step-based movement along each colour’s lane
* **Activity log** showing every dice roll and move
* When all 4 tokens of a colour reach goal:

  * Big, coloured banner appears:
    **“RED WINS THE GAME! 🎉”**

### 🎨 Ludo Board UI

* Ludo-style **cross board**:

  * 4 coloured quadrants (homes)
  * Centre diamond with 4 coloured triangles
  * Straight colour-coded paths towards the centre
* Tokens rendered as **white pawns with colour outline**
* If multiple tokens stand on the same cell, a count is displayed.
* Dark, modern theme suitable for a “gaming” feel.

---

## 🚀 Getting Started

> Requires **Node.js 16+** and **npm**.

### 1️⃣ Clone the repo

```bash
git clone https://github.com/567darshan/ludo-game.git
cd ludo-game   # or LUDOGAME depending on your folder name
```

---

### 2️⃣ Backend Setup (`ludo-backend`)

```bash
cd ludo-backend
npm install
```

Create a `.env` file (optional, if you want DB & JWT):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ludo
JWT_SECRET=your_jwt_secret_here
CLIENT_ORIGIN=http://localhost:5173
```

Run the backend in dev mode:

```bash
npm run dev
```

Backend will start at:

```text
http://localhost:5000
```

> If MongoDB is not running, the app can still be demonstrated in **local demo mode** for UI and gameplay.

---

### 3️⃣ Frontend Setup (`ludo-frontend`)

Open a **second terminal**:

```bash
cd ludo-frontend
npm install
npm run dev
```

Vite will start at:

```text
http://localhost:5173
```

---

## 📦 Useful Scripts

### Backend (`ludo-backend/package.json`)

* `npm run dev` – start backend with Nodemon (auto-reload)
* `npm start` – start backend with Node

### Frontend (`ludo-frontend/package.json`)

* `npm run dev` – start Vite dev server
* `npm run build` – build production bundle
* `npm run preview` – preview built app

---

## 🧠 Local Game Logic – Overview

Main files:

* `ludo-frontend/src/hooks/useLocalLudo.js`
* `ludo-frontend/src/components/LudoBoard.jsx`
* `ludo-frontend/src/pages/LocalGamePage.jsx`

### Simplified Rule Set (Demo Mode)

* Each colour has **4 tokens**.
* Token state per colour: `[p1, p2, p3, p4]` where:

  * `0`   = in house
  * `1…N` = on path
  * `N`   = goal (end of path)
* Dice is rolled and the current player’s first non-finished token is moved.
* When all 4 tokens of a colour reach goal, that colour **wins** and the banner is shown.
* Turn order cycles:

  `GREEN → YELLOW → RED → BLUE → (repeat)`

This logic is intentionally clean and easy to explain during viva.

---

## 🔮 Scope for Future Enhancements

The project is designed so that these features can be added on top:

* Full **52-cell Ludo path** exactly like Ludo King
* **Safe cells** and **capture (kill)** rules
* Multi-token stacking & blocking
* Fully functional online multiplayer rooms using Socket.io
* Persistent **leaderboard & match history** in MongoDB
* Responsive redesign for mobile devices

These items can be mentioned as **“Future Work”** in project reviews.

---

## 👨‍💻 Author

**Darshan A**
Final year CSE student
Project: *Advanced Ludo – Real-Time Multiplayer Ready Web Game*

````
