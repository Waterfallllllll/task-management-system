# Указываем базовый образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Открываем порт для доступа
EXPOSE 5001

# Запуск приложения
CMD ["npm", "start"]