// Бот Алиса для системы Hamburger Chat
class AliceBot {
    constructor() {
        this.name = "Алиса";
        this.version = "1.0";
        this.sessionData = new Map();
    }

    // Основной метод обработки сообщений для Hamburger Chat
    async onMessage(message, context) {
        const { userId, userName, chatId, reply, messageId } = context;
        
        // Получаем или создаем сессию пользователя
        let session = this.sessionData.get(userId);
        if (!session) {
            session = {
                userId: userId,
                userName: userName,
                chatId: chatId,
                messageCount: 0,
                lastActivity: Date.now()
            };
            this.sessionData.set(userId, session);
        }
        
        session.messageCount++;
        session.lastActivity = Date.now();
        
        const text = message.text.toLowerCase().trim();
        
        // Обработка команд как в оригинальном боте
        if (text.includes('привет')) {
            await this.greetUser(userId, userName, reply);
        } 
        else if (text.includes('помощь')) {
            await this.helpUser(userId, reply);
        }
        else {
            await this.defaultResponse(userId, reply);
        }
        
        // Очистка старых сессий
        if (session.messageCount % 10 === 0) {
            this.cleanupSessions();
        }
    }

    // Метод вызывается при старте бота
    async onStart(context) {
        const { userId, userName, chatId, reply } = context;
        
        console.log(`Бот Алиса запущен в чате ${chatId}`);
        
        // Приветственное сообщение при первом запуске
        await this.greetUser(userId, userName, reply);
    }

    // Приветствие пользователя
    async greetUser(userId, userName, reply) {
        await reply({
            text: `Здравствуйте${userName ? ', ' + userName : ''}! Я ваш персональный помощник.`,
            buttons: [
                [
                    { type: "text", label: "Помощь", payload: "help" }
                ]
            ]
        });
    }

    // Помощь пользователю
    async helpUser(userId, reply) {
        await reply({
            text: 'Я могу помочь с различными задачами. Просто спросите меня.',
            buttons: [
                [
                    { type: "text", label: "Привет", payload: "hello" }
                ]
            ]
        });
    }

    // Ответ по умолчанию
    async defaultResponse(userId, reply) {
        await reply({
            text: 'Не совсем поняла вас. Попробуйте спросить по-другому.',
            buttons: [
                [
                    { type: "text", label: "Помощь", payload: "help" },
                    { type: "text", label: "Привет", payload: "hello" }
                ]
            ]
        });
    }

    // Очистка старых сессий (старше 1 часа)
    cleanupSessions() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        for (let [userId, session] of this.sessionData.entries()) {
            if (now - session.lastActivity > oneHour) {
                this.sessionData.delete(userId);
            }
        }
    }
}

// Экспорт для системы Hamburger Chat
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AliceBot;
}
