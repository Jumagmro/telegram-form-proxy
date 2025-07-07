const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Telegram forwarding endpoint
app.post('/telegram-forward', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Get credentials from environment variables
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
    
    const text = `📬 New message!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));