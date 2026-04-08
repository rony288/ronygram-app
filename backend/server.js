require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'ronygram_secret_key_2024';

if (!process.env.JWT_SECRET) {
    console.warn('[WARN] JWT_SECRET is not set. Using an insecure default. Set the JWT_SECRET environment variable before deploying to production.');
}

// --- Monotonic ID counter (avoids same-millisecond collisions) ---
let _idCounter = 0;
const nextId = () => `${Date.now()}-${++_idCounter}`;

// --- In-Memory Stores ---
const users = new Map(); // id -> user object
const messages = []; // { id, senderId, receiverId, content, timestamp }

// --- Uploads Directory ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir));

// --- Rate Limiters ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// --- Multer Config (avatar uploads, max 5 MB) ---
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${nextId()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

// --- Auth Middleware ---
const authMiddleware = require('./middleware/auth');

// --- Helpers ---
const publicUser = (u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    bio: u.bio || '',
    avatar: u.avatar || null
});

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    for (const u of users.values()) {
        if (u.username === username) return res.status(400).json({ error: 'Username already taken' });
        if (u.email === email) return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = nextId();
    const user = { id, username, email, password: hashedPassword, bio: '', avatar: null };
    users.set(id, user);
    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: publicUser(user) });
});

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    const user = Array.from(users.values()).find(u => u.username === username);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
app.get('/api/auth/me', apiLimiter, authMiddleware, (req, res) => {
    const user = users.get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(publicUser(user));
});

// ============================================================
// USER / PROFILE ROUTES
// ============================================================

// GET /api/users  — list all users except self (for chat)
app.get('/api/users', apiLimiter, authMiddleware, (req, res) => {
    const list = Array.from(users.values())
        .filter(u => u.id !== req.user.id)
        .map(publicUser);
    res.json(list);
});

// PUT /api/users/profile  — update bio / username / email
app.put('/api/users/profile', apiLimiter, authMiddleware, (req, res) => {
    const { username, bio, email } = req.body;
    const user = users.get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (username && username !== user.username) {
        for (const u of users.values()) {
            if (u.username === username && u.id !== user.id) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }
        user.username = username;
    }
    if (bio !== undefined) user.bio = bio;
    if (email !== undefined) user.email = email;
    users.set(user.id, user);
    res.json(publicUser(user));
});

// POST /api/users/avatar  — upload profile picture
app.post('/api/users/avatar', apiLimiter, authMiddleware, upload.single('avatar'), (req, res) => {
    const user = users.get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    user.avatar = `/uploads/${req.file.filename}`;
    users.set(user.id, user);
    res.json(publicUser(user));
});

// ============================================================
// CHAT ROUTES
// ============================================================

// GET /api/chat/:userId  — message history between me and userId
app.get('/api/chat/:userId', apiLimiter, authMiddleware, (req, res) => {
    const myId = req.user.id;
    const otherId = req.params.userId;
    const conversation = messages
        .filter(m =>
            (m.senderId === myId && m.receiverId === otherId) ||
            (m.senderId === otherId && m.receiverId === myId)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
    res.json(conversation);
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running!', users: users.size });
});

// ============================================================
// SOCKET.IO — Real-Time Chat
// ============================================================
const connectedUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
    });

    socket.on('send_message', (data) => {
        const { senderId, receiverId, content } = data;
        if (!senderId || !receiverId || !content) return;
        const message = {
            id: nextId(),
            senderId,
            receiverId,
            content,
            timestamp: Date.now()
        };
        messages.push(message);

        const receiverSocket = connectedUsers.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receive_message', message);
        }
        socket.emit('receive_message', message);
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            connectedUsers.delete(socket.userId);
        }
    });
});

// ============================================================
// START
// ============================================================
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});