// Основной класс бота
class AliceBot {
    constructor() {
        // Инициализация бота
        this.sessionData = {};
    }

    // Обработчик входящего запроса
    handleRequest(request) {
        // ФИКС: Добавлена проверка на структуру запроса Алисы
        const { request: { command, type } = {}, session: { session_id, user_id } = {} } = request;
        
        // ФИКС: Проверка на новый сеанс (если type === 'SimpleUtterance' или 'ButtonPressed')
        if (type === 'SimpleUtterance' || type === 'ButtonPressed') {
            // Получаем или создаем данные сессии
            let session = this.sessionData[session_id] || { session_id, user_id };
            this.sessionData[session_id] = session;

            // Обрабатываем команду
            // ФИКС: Приводим команду к нижнему регистру для унификации
            const normalizedCommand = command.toLowerCase();
            
            switch (normalizedCommand) {
                case 'привет':
                    return this.greetUser(session);
                case 'помощь':
                    return this.helpUser(session);
                default:
                    return this.defaultResponse(session);
            }
        } else {
            // ФИКС: Обработка других типов запросов (например, начало сессии)
            return this.greetUser({});
        }
    }

    // Приветствие пользователя
    greetUser(session) {
        return {
            // ФИКС: Добавлен version для соответствия API Алисы
            version: '1.0',
            response: {
                text: 'Здравствуйте! Я ваш персональный помощник.',
                end_session: false
            },
            session: session
        };
    }

    // Помощь пользователю
    helpUser(session) {
        return {
            version: '1.0',
            response: {
                text: 'Я могу помочь с различными задачами. Просто спросите меня.',
                end_session: false
            },
            session: session
        };
    }

    // Ответ по умолчанию
    defaultResponse(session) {
        return {
            version: '1.0',
            response: {
                text: 'Не совсем поняла вас. Попробуйте спросить по-другому.',
                end_session: false
            },
            session: session
        };
    }
}

// Пример использования
const bot = new AliceBot();

// Обработчик входящих запросов (для сервера)
function handleIncomingRequest(req, res) {
    try {
        const requestBody = req.body;
        const response = bot.handleRequest(requestBody);
        res.status(200).json(response);
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.status(500).json({ 
            version: '1.0',
            response: {
                text: 'Произошла ошибка, попробуйте позже.',
                end_session: false
            }
        });
    }
}

// Экспорт для использования в Express или другом фреймворке
module.exports = {
    AliceBot,
    handleIncomingRequest
};
