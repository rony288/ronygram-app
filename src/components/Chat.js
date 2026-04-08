import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Chat.css';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_AVATAR = 'https://via.placeholder.com/40';

// Singleton socket — created once, reused across renders
let socket = null;

const Chat = () => {
    const { userId: paramUserId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    // --- Connect socket once, register current user ---
    useEffect(() => {
        if (!user || !token) return;

        // Connect to the backend (same host, different port handled by proxy)
        socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] });

        socket.on('connect', () => {
            socket.emit('register', user.id);
        });

        socket.on('receive_message', (msg) => {
            // Only add message if it belongs to the currently open conversation
            setMessages(prev => {
                const isInConversation =
                    (msg.senderId === user.id && msg.receiverId === selectedUserRef.current?.id) ||
                    (msg.senderId === selectedUserRef.current?.id && msg.receiverId === user.id);
                if (!isInConversation) return prev;
                // Deduplicate (sender gets an echo back)
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        return () => {
            socket.disconnect();
            socket = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // Keep a ref to selectedUser so the socket callback can read the latest value
    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // --- Load user list ---
    useEffect(() => {
        if (!token) return;
        fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    // If a userId is in the URL, open that conversation
                    if (paramUserId) {
                        const found = data.find(u => u.id === paramUserId);
                        if (found) setSelectedUser(found);
                    }
                }
            })
            .catch(console.error);
    }, [token, paramUserId]);

    // --- Load message history when a user is selected ---
    useEffect(() => {
        if (!selectedUser || !token) return;
        setLoadingMessages(true);
        fetch(`/api/chat/${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(console.error)
            .finally(() => setLoadingMessages(false));
    }, [selectedUser, token]);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const openConversation = (u) => {
        setSelectedUser(u);
        setMessages([]);
        navigate(`/chat/${u.id}`);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socket || !selectedUser) return;
        socket.emit('send_message', {
            senderId: user.id,
            receiverId: selectedUser.id,
            content: input.trim()
        });
        setInput('');
    };

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-container">
            {/* Sidebar — user list */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h3>Messages</h3>
                </div>
                {users.length === 0 ? (
                    <div className="chat-no-users">
                        <p>No other users yet.</p>
                        <small>Register a second account to start chatting!</small>
                    </div>
                ) : (
                    <ul className="chat-user-list">
                        {users.map(u => (
                            <li
                                key={u.id}
                                className={`chat-user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                                onClick={() => openConversation(u)}
                            >
                                <img
                                    src={u.avatar || DEFAULT_AVATAR}
                                    alt={u.username}
                                    className="chat-user-avatar"
                                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                                />
                                <span className="chat-user-name">{u.username}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Main conversation area */}
            <div className="chat-main">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="chat-header">
                            <button className="chat-back-btn" onClick={() => { setSelectedUser(null); navigate('/chat'); }}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <img
                                src={selectedUser.avatar || DEFAULT_AVATAR}
                                alt={selectedUser.username}
                                className="chat-header-avatar"
                                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                            />
                            <span className="chat-header-name">{selectedUser.username}</span>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {loadingMessages && <p className="chat-loading">Loading messages…</p>}
                            {!loadingMessages && messages.length === 0 && (
                                <div className="chat-empty">
                                    <p>No messages yet.</p>
                                    <small>Say hello to {selectedUser.username}! 👋</small>
                                </div>
                            )}
                            {messages.map((msg) => {
                                const isMine = msg.senderId === user.id;
                                return (
                                    <div key={msg.id} className={`chat-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                                        <div className={`chat-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                                            <p>{msg.content}</p>
                                            <span className="chat-time">{formatTime(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form className="chat-input-bar" onSubmit={sendMessage}>
                            <input
                                type="text"
                                placeholder={`Message ${selectedUser.username}…`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" disabled={!input.trim()} className="chat-send-btn">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat-placeholder">
                        <h3>Select a conversation</h3>
                        <p>Choose a user from the left to start chatting in real-time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
