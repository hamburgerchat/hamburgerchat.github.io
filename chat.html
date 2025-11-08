class AIChatBot {
    constructor() {
        this.name = "ИИБот";
        this.greetings = ["привет", "hello", "здравствуй", "хай", "ку"];
        this.farewells = ["пока", "до свидания", "прощай", "bye"];
        this.chatHistory = [];
        this.currentModel = 'llama-3.1-8b-instruct-fast';
    }

    async onStart(context) {
        await context.reply({
            text: "🤖 Привет! Я ИИ бот, основанный на нейросетях.\n\n" +
                  "Модель: " + this.currentModel + "\n" +
                  "Можем поговорить на любые темы!\n\n" +
                  "Просто напиши мне сообщение, и я постараюсь дать интересный ответ."
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();

        // Приветствие
        if (this.greetings.some(greet => text.includes(greet))) {
            await context.reply({
                text: `👋 Привет, ${context.userName}! Рад общению с тобой! Задавай любой вопрос или просто поболтаем. 😊`
            });
            return;
        }

        // Прощание
        if (this.farewells.some(farewell => text.includes(farewell))) {
            await context.reply({
                text: "👋 До свидания! Было приятно пообщаться! Возвращайся ещё! ✨"
            });
            this.chatHistory = []; // Очищаем историю при прощании
            return;
        }

        // Очистка истории
        if (text.includes("очисти историю") || text.includes("новый разговор")) {
            this.chatHistory = [];
            await context.reply({
                text: "🔄 История разговора очищена! Начинаем новый диалог!"
            });
            return;
        }

        // Смена модели (просто информационно)
        if (text.includes("какая модель") || text.includes("какая нейросеть")) {
            await context.reply({
                text: `🧠 Текущая модель: ${this.currentModel}\n\n` +
                      "Это одна из современных языковых моделей, обученная на огромном количестве текстов."
            });
            return;
        }

        // Помощь
        if (text.includes("помощь") || text.includes("что ты умеешь")) {
            await context.reply({
                text: "❓ **Что я умею:**\n\n" +
                      "• Общаться на любые темы\n• Отвечать на вопросы\n• Помогать с идеями\n• Обсуждать книги, фильмы, науку\n• Поддерживать беседу\n\n" +
                      "Просто напиши что-нибудь, и я постараюсь дать интересный и полезный ответ!\n\n" +
                      "**Команды:**\n" +
                      "• \"очисти историю\" - начать новый разговор\n" +
                      "• \"какая модель\" - информация о нейросети"
            });
            return;
        }

        // Основной ИИ ответ
        try {
            await context.reply({
                text: "🤔 Думаю..."
            });

            const response = await this.generateAIResponse(text, context.userName);
            await context.reply({
                text: response
            });

        } catch (error) {
            console.error("Ошибка ИИ:", error);
            await context.reply({
                text: "❌ Извини, произошла ошибка при обращении к нейросети. Попробуй ещё раз немного позже."
            });
        }
    }

    async generateAIResponse(userMessage, userName) {
        // Добавляем контекст для более персонализированного ответа
        const enhancedPrompt = `${userName} написал(а): "${userMessage}"\n\nПожалуйста, ответь естественно и дружелюбно, как в обычной беседе.`;
        
        // Используем API из расширения
        const API_URL = "https://freeai.logise1123.workers.dev/";
        
        // Формируем сообщения с историей для контекста
        const messages = [
            ...this.chatHistory,
            { role: 'user', content: enhancedPrompt }
        ];

        const body = {
            model: this.currentModel,
            messages: messages
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data?.choices?.[0]?.message?.content || "Извини, не смог обработать твой запрос.";

        // Обновляем историю (ограничиваем размер для экономии памяти)
        this.chatHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        );

        // Ограничиваем историю последними 10 сообщениями
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }

        return aiResponse;
    }

    // Альтернативный метод для простых ответов без истории
    async generateSimpleAIResponse(prompt) {
        const API_URL = "https://freeai.logise1123.workers.dev/";
        
        const body = {
            model: this.currentModel,
            messages: [{ role: 'user', content: prompt }]
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "Нет ответа от ИИ";
    }
}
