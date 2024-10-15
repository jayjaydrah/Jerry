const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const { TELEGRAM_BOT_TOKEN, API_BASE_URL, FRONTEND_URL } = require("./config");
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: {
    interval: 100, // Interval between each poll (in milliseconds)
    autoStart: true, // Automatically start polling
    params: {
      timeout: 10, // Timeout for long polling requests (in seconds)
    },
  },
});
// Display the initial menu with Register and Login buttons
bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;
});
bot.on("polling_error", (error) => {
  console.error(`[polling_error] ${error.code}: ${error.message}`);
});
// Handle '/start' command
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;
  //   const userId = '123';
  const Id = msg.from.id;
  const userId = Id.toString();
  const fullname = msg.from.username;
  console.log(userId, fullname);
  
  
  if (userInput === "/start") {
    // Check if the user is already registered
    console.log(typeof(userId));
    
    axios
      .post(`${API_BASE_URL}/check`, { name: userId, fullname: fullname })
      .then((response) => {
        console.log(response.status);
        
        if (response.status === 200) {
          // User exists, proceed to login or other actions if needed
          // bot.sendMessage(chatId, `You are already registered.`);
          loginUser(chatId, userId, fullname);
        } else {
          // User does not exist, proceed to registration
          registerUser(chatId, userId, fullname);
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          registerUser(chatId, userId, fullname);
        }
        // console.error("Error checking user status:", error.message);
        // bot.sendMessage(chatId, "An error occurred. Please try again later.");
      });
  }
});

function registerUser(chatId, userId, fullname) {
  axios
    .post(`${API_BASE_URL}/register`, { name: userId, fullname: fullname })
    .then((response) => {
      if (response.status === 201) {
        loginUser(chatId, userId, fullname);
      }
    })
    .catch((error) => {
      console.error("Registration failed!", error.message);
      bot.sendMessage(chatId, "Registration failed! Please try again later.");
    });
}

function loginUser(chatId, userId, fullname) {
  axios
    .post(`${API_BASE_URL}/login`, { name: userId })
    .then((response) => {
      const token = response.data.token;

      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GO...",
                web_app: {
                  url: `${FRONTEND_URL}?token=${token}`,
                },
              },
            ],
          ],
        },
      };

      bot.sendMessage(chatId, `Are you Ready?`, options);
    })
    .catch((error) => {
      console.log(error);
      
      console.error("Login failed!", error.message);
      bot.sendMessage(chatId, "Login failed! Please try again later.");
    });
}
