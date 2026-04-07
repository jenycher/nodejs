# Используем официальный образ Node.js 24 (последняя версия)
FROM node:24

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Создаём папку для загружаемых файлов
RUN mkdir -p public/uploads

# Открываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]