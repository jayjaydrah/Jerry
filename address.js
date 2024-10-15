const TelegramBot = require('node-telegram-bot-api');  

// Replace with your bot token obtained from BotFather  
const token = '6285443423:AAGdj-MWqf2a4jkd1igkNuxUFIqtxa2bCRo';  

const bot = new TelegramBot(token, { polling: true });  

// Start command to send a welcome message  
bot.onText(/\/start/, (msg) => {  
    const chatId = msg.chat.id;  
    bot.sendMessage(chatId, 'Welcome to Tetris! Type /play to start.');  
});  

// Start command to send a welcome message  
bot.onText(/\/play/, (msg) => {  
    const chatId = msg.chat.id;  
    const options = {  
        reply_markup: {  
            inline_keyboard: [  
                [  
                    { text: 'Open Web App', web_app: { url: 'https://fruitfarmmer.onrender.com' } }  
                ]  
            ]  
        }  
    };  
    
    bot.sendMessage(chatId, 'Click below to open the web app!', options); 
});