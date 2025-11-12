// Бот Алиса для системы Hamburger Chat
class AliceBot {
    constructor() {
        this.name = "Алиса";
        this.sessionData = {};
    }

    async onStart(context) {
        await context.reply({
            text: "Здравствуйте! Я ваш персональный помощник."
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();
        const userId = context.userId;
        
        // Получаем или создаем сессию пользователя
        let session = this.sessionData[userId];
        if (!session) {
            session = {
                userId: userId,
                userName: context.userName,
                messageCount: 0,
                lastActivity: Date.now()
            };
            this.sessionData[userId] = session;
        }
        
        session.messageCount++;
        session.lastActivity = Date.now();

        // Обработка команд как в оригинальном боте
        if (text.includes('привет')) {
            await this.greetUser(session, context);
        } 
        else if (text.includes('помощь')) {
            await this.helpUser(session, context);
        }
        else {
            await this.defaultResponse(session, context);
        }
    }

    // Приветствие пользователя
    async greetUser(session, context) {
        await context.reply({
            text: `Здравствуйте${session.userName ? ', ' + session.userName : ''}! Я ваш персональный помощник.`
        });
    }

    // Помощь пользователю
    async helpUser(session, context) {
        await context.reply({
            text: 'Я могу помочь с различными задачами. Просто спросите меня.'
        });
    }

    // Ответ по умолчанию
    async defaultResponse(session, context) {
        await context.reply({
            text: 'Не совсем поняла вас. Попробуйте спросить по-другому.'
        });
    }
}

// Экспорт для системы Hamburger Chat
if (typeof module !== 'undefined') {
    module.exports = AliceBot;
}
