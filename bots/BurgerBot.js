class BurgerImageBot {
    constructor() {
        this.name = "БургерБот";
        this.greetings = ["привет", "hello", "здравствуй", "хай", "ку"];
        this.farewells = ["пока", "до свидания", "прощай", "bye"];
        this.burgerImage = "https://raw.githubusercontent.com/hamburgerchat/hamburgerchat.github.io/refs/heads/main/images/Burger.png";
    }

    async onStart(context) {
        await context.reply({
            text: "🍔 Привет! Я БургерБот!\n\n" +
                  "Отправь мне любое сообщение, и я покажу тебе вкусный бургер! 🍔"
        });
    }

    async onMessage(message, context) {
        const text = message.text.toLowerCase().trim();

        // Приветствие
        if (this.greetings.some(greet => text.includes(greet))) {
            await context.reply({
                text: `👋 Привет, ${context.userName}! Вот тебе бургер! 🍔`
            });
            
            // Отправляем изображение ОТДЕЛЬНЫМ сообщением
            await context.reply({
                image: this.burgerImage
            });
            return;
        }

        // Прощание
        if (this.farewells.some(farewell => text.includes(farewell))) {
            await context.reply({
                text: "👋 Пока! На прощание - вот тебе бургер! 🍔"
            });
            
            await context.reply({
                image: this.burgerImage
            });
            return;
        }

        // Помощь
        if (text.includes("помощь") || text.includes("что ты умеешь")) {
            await this.showHelp(context);
            return;
        }

        // Любое другое сообщение - отправляем бургер
        await context.reply({
            text: "🍔 Вот твой бургер! Приятного аппетита! 😊"
        });
        
        await context.reply({
            image: this.burgerImage
        });
    }

    async showHelp(context) {
        await context.reply({
            text: "🍔 **Помощь по БургерБоту**\n\n" +
                  "**Что я умею:**\n" +
                  "• Показывать вкусные бургеры! 🍔\n\n" +
                  "**Как использовать:**\n" +
                  "Просто напиши мне ЛЮБОЕ сообщение, и я отправлю тебе бургер!\n\n" +
                  "**Команды:**\n" +
                  "• \"привет\" - поздороваться с бургером\n" +
                  "• \"пока\" - попрощаться с бургером\n" +
                  "• \"помощь\" - показать эту справку\n\n" +
                  "Напиши что-нибудь и получи свой бургер! 🍔"
        });
        
        // После помощи тоже отправляем бургер
        await context.reply({
            image: this.burgerImage
        });
    }
}

// Версия с кнопками для большего интерактива
class BurgerImageBotWithButtons extends BurgerImageBot {
    constructor() {
        super();
        this.name = "БургерБот+";
    }

    async onStart(context) {
        await context.reply({
            text: "🍔 Привет! Я Продвинутый БургерБот!\n\n" +
                  "Нажми на кнопку или напиши что-нибудь, чтобы получить бургер!",
            buttons: [
                [
                    { type: "text", label: "🍔 Дать бургер!", payload: "get_burger" },
                    { type: "text", label: "🔁 Еще бургер!", payload: "more_burger" }
                ],
                [
                    { type: "text", label: "❓ Помощь", payload: "help" },
                    { type: "text", label: "👋 Привет", payload: "hello" }
                ]
            ]
        });
    }

    async onMessage(message, context) {
        // Обработка кнопок
        if (context.buttonPayload) {
            await this.handleButton(context.buttonPayload, context);
            return;
        }

        // Любое текстовое сообщение
        await context.reply({
            text: this.getRandomBurgerMessage()
        });
        
        await context.reply({
            image: this.burgerImage
        });
    }

    async handleButton(payload, context) {
        switch(payload) {
            case 'get_burger':
            case 'more_burger':
                await context.reply({
                    text: this.getRandomBurgerMessage()
                });
                
                await context.reply({
                    image: this.burgerImage
                });
                break;

            case 'help':
                await this.showHelp(context);
                break;

            case 'hello':
                await context.reply({
                    text: `👋 Привет, ${context.userName}! Вот тебе бургер! 🍔`
                });
                
                await context.reply({
                    image: this.burgerImage
                });
                break;
        }
    }

    getRandomBurgerMessage() {
        const messages = [
            "🍔 Вот твой свежий бургер! Приятного аппетита!",
            "🍔 Держи горячий бургер! Только из печи!",
            "🍔 Сочный бургер специально для тебя!",
            "🍔 Вкуснейший бургер готов! Наслаждайся!",
            "🍔 Бургер мечты! Как раз для тебя!",
            "🍔 Заказывал бургер? Пожалуйста!",
            "🍔 Фирменный бургер от шеф-повара!",
            "🍔 Идеальный бургер для идеального дня!"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    async showHelp(context) {
        await context.reply({
            text: "🍔 **Продвинутый БургерБот**\n\n" +
                  "Я всегда рад угостить тебя вкусным бургером! 🍔\n\n" +
                  "Просто нажимай на кнопки или пиши сообщения - и получай бургеры!",
            buttons: [
                [
                    { type: "text", label: "🍔 Хочу бургер!", payload: "get_burger" },
                    { type: "text", label: "🔁 И еще один!", payload: "more_burger" }
                ]
            ]
        });
        
        await context.reply({
            image: this.burgerImage
        });
    }
}

// Супер-простая версия - только бургеры
class SimpleBurgerBot {
    constructor() {
        this.name = "ПростойБургерБот";
        this.burgerImage = "https://raw.githubusercontent.com/hamburgerchat/hamburgerchat.github.io/refs/heads/main/images/Burger.png";
    }

    async onStart(context) {
        // Сразу отправляем бургер при старте
        await context.reply({
            text: "🍔 Добро пожаловать! Вот ваш бургер!"
        });
        
        await context.reply({
            image: this.burgerImage
        });
    }

    async onMessage(message, context) {
        // На любое сообщение - отправляем бургер
        await context.reply({
            text: "🍔 Вот еще один бургер для вас!"
        });
        
        await context.reply({
            image: this.burgerImage
        });
    }
}

// Экспорт всех версий бота
if (typeof module !== 'undefined') {
    module.exports = { 
        BurgerImageBot, 
        BurgerImageBotWithButtons,
        SimpleBurgerBot 
    };
}
