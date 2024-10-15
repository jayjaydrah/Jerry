const TelegramBot = require('node-telegram-bot-api');  
const axios = require('axios');

const token = '6285443423:AAGdj-MWqf2a4jkd1igkNuxUFIqtxa2bCRo';  

const bot = new TelegramBot(token, {
    polling: {
        interval: 100,  // Interval between each poll (in milliseconds)
        autoStart: true, // Automatically start polling
        params: {
            timeout: 10   // Timeout for long polling requests (in seconds)
        }
    }
});
let userStates = {};

const inlineButton = (chatId) => {
    const opts = {
        reply_markup: {
            keyboard: [
                [{ text: 'Register' }, { text: 'Login' }]
            ],
            resize_keyboard: true, // Resize the keyboard to fit
            one_time_keyboard: true // Hide the keyboard after use
        }
    };

    return bot.sendMessage(chatId, 'Choose an option:', opts);
}

// Display the initial menu with Register and Login buttons
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    inlineButton(chatId);
});
bot.on('polling_error', (error) => {
    console.error(`[polling_error] ${error.code}: ${error.message}`);
});
// Handle Register button click
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    if (userInput === 'Register') {
        bot.sendMessage(chatId, 'Please enter your registration details:');
        userStates[chatId] = 'awaiting_registration';
    } else if (userStates[chatId] === 'awaiting_registration') {
        axios.post('https://fruitbackend-5rhh.onrender.com/api/users/register', {
            name: userInput // Sending user input as registration details
        })
        .then(response => {
            bot.sendMessage(chatId, 'Register Success!!!');
            inlineButton(chatId);
            userStates[chatId] = null; // Reset the user state
        })
        .catch(error => {
            bot.sendMessage(chatId, "Failed Registry");
            inlineButton(chatId);
            userStates[chatId] = null; // Reset the user state
        });
    } else if (userInput === 'Login') {
        bot.sendMessage(chatId, 'Please enter your login details:');
        userStates[chatId] = 'awaiting_login';
    } else if (userStates[chatId] === 'awaiting_login') {
        axios.post('https://fruitbackend-5rhh.onrender.com/api/users/login', {
            name: userInput // Sending user input as login details
        })
        .then(response => {
            const token = response.data.token;
            const options = {  
                reply_markup: {  
                    inline_keyboard: [  
                        [  
                            { 
                                text: 'Open Web App', 
                                web_app: { 
                                    url: `https://fruitfarmmer.onrender.com?token=${token}` 
                                } 
                            }  
                        ]  
                    ]  
                }  
            };
    
            bot.sendMessage(chatId, `Login successful! You can now access your account via the Web App:`, options);
            userStates[chatId] = null; // Reset the user state
        })
        .catch(error => {
            bot.sendMessage(chatId, 'There was an error during login.');
            userStates[chatId] = null; // Reset the user state
        });
    } else {
        bot.sendMessage(chatId, 'Please select "Register" or "Login" from the menu.');
    }
});