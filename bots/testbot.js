class SimpleBot {
    constructor() {
        this.name = "ПростойБот";
        this.greetings = ["привет", "hello", "здравствуй", "хай", "ку"];
        this.farewells = ["пока", "до свидания", "прощай", "bye"];
    }

    async onStart(context) {
        await context.reply({
            text: "👋 Привет! Я простой тестовый бот.\nНапиши мне что-нибудь, и я отвечу!",
            buttons: [
                [
                    { type: "text", label: "❓ Помощь", payload: "help" },
                    { type: "text", label: "ℹ️ Инфо", payload: "info" }
                ],
                [
                    { type: "text", label: "🎲 Случайное число", payload: "random" },
                    { type: "text", label: "🕐 Время", payload: "time" }
                ]
            ]
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();

        // Приветствие
        if (this.greetings.some(greet => text.includes(greet))) {
            await context.reply({
                text: `👋 Привет, ${context.userName}! Рад тебя видеть! Чем могу помочь?`,
                buttons: [
                    [
                        { type: "text", label: "❓ Помощь", payload: "help" }
                    ]
                ]
            });
            return;
        }

        // Прощание
        if (this.farewells.some(farewell => text.includes(farewell))) {
            await context.reply({
                text: "👋 Пока! Возвращайся скорее! 😊"
            });
            return;
        }

        // Простые команды
        if (text.includes("как дела") || text.includes("как ты")) {
            await context.reply({
                text: "🤖 У меня всё отлично! Спасибо, что спросил! А у тебя как?"
            });
            return;
        }

        if (text.includes("что ты умеешь") || text.includes("помощь")) {
            await this.showHelp(context);
            return;
        }

        if (text.includes("погода")) {
            await context.reply({
                text: "☀️ Сегодня отличная погода для общения! (К сожалению, я не умею показывать реальную погоду)"
            });
            return;
        }

        // Обработка кнопок
        if (context.buttonPayload) {
            await this.handleButton(context.buttonPayload, context);
            return;
        }

        // Ответ по умолчанию
        if (text) {
            const responses = [
                "Интересно! Расскажи подробнее? 🤔",
                "Понял тебя! Что ещё хочешь узнать? 😊",
                "Хм... А что ты об этом думаешь? 💭",
                "Спасибо за сообщение! Чем ещё могу помочь? 🛠️",
                "Записал! Есть что-то ещё? 📝"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            await context.reply({
                text: randomResponse
            });
        }
    }

    async handleButton(payload, context) {
        switch(payload) {
            case 'help':
                await this.showHelp(context);
                break;
                
            case 'info':
                await context.reply({
                    text: "ℹ️ **Информация о боте:**\n\n🤖 Имя: ПростойБот\n💻 Создан: для тестирования\n⭐ Функции: базовое общение\n\nЭто демонстрационный бот для проверки работы системы ботов в Hamburger Chat.",
                    buttons: [
                        [
                            { type: "text", label: "❓ Помощь", payload: "help" },
                            { type: "text", label: "⬅️ Назад", payload: "back" }
                        ]
                    ]
                });
                break;
                
            case 'random':
                const randomNum = Math.floor(Math.random() * 100) + 1;
                await context.reply({
                    text: `🎲 Случайное число: **${randomNum}**\n\nПопробуй ещё раз!`,
                    buttons: [
                        [
                            { type: "text", label: "🎲 Ещё число", payload: "random" },
                            { type: "text", label: "⬅️ Назад", payload: "back" }
                        ]
                    ]
                });
                break;
                
            case 'time':
                const now = new Date();
                const timeString = now.toLocaleTimeString('ru-RU');
                const dateString = now.toLocaleDateString('ru-RU');
                await context.reply({
                    text: `🕐 **Текущее время:**\n\n📅 Дата: ${dateString}\n⏰ Время: ${timeString}`,
                    buttons: [
                        [
                            { type: "text", label: "🔄 Обновить", payload: "time" },
                            { type: "text", label: "⬅️ Назад", payload: "back" }
                        ]
                    ]
                });
                break;
                
            case 'back':
                await this.onStart(context);
                break;
        }
    }

    async showHelp(context) {
        await context.reply({
            text: "❓ **Помощь по боту:**\n\n📝 **Что я умею:**\n• Отвечать на приветствия\n• Показывать случайные числа\n• Показывать текущее время\n• Простые беседы\n\n🛠️ **Команды:**\n• \"Привет\" - поздороваться\n• \"Как дела?\" - спросить о настроении\n• \"Пока\" - попрощаться\n• \"Погода\" - шуточный ответ\n\n🎛️ **Используй кнопки** для быстрого доступа к функциям!",
            buttons: [
                [
                    { type: "text", label: "🎲 Случайное число", payload: "random" },
                    { type: "text", label: "🕐 Время", payload: "time" }
                ],
                [
                    { type: "text", label: "ℹ️ Инфо", payload: "info" },
                    { type: "text", label: "⬅️ Назад", payload: "back" }
                ]
            ]
        });
    }
}
