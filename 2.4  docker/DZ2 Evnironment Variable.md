```markdown
# Задание 2 - Environment Variables

## Цель
Загрузить образ Node.js 15.14, запустить контейнер в интерактивном режиме с передачей переменных окружения, выполнить JavaScript-скрипт, использующий эти переменные, затем остановить контейнер и удалить образ.

## Выполненные команды и результаты

### 1. Загрузка образа node версии 15.14

```bash
docker pull node:15.14
```

**Результат:**
```
15.14: Pulling from library/node
4b57d41e8391: Pull complete
dc05be471d51: Pull complete
787f5e2f1047: Pull complete
bd821d20ef8c: Pull complete
6041b69671c6: Pull complete
bfde2ec33fbc: Pull complete
55fab5cadd3c: Pull complete
7b6173a10eb8: Pull complete
989c5d2d2313: Pull complete
Digest: sha256:608bba799613b1ebf754034ae008849ba51e88b23271412427b76d60ae0d0627
Status: Downloaded newer image for node:15.14
docker.io/library/node:15.14
```

### 2. Запуск контейнера node в интерактивном режиме с переменными окружения

```bash
docker run -it --name mynode -e NAME="Evgenia" -e SURNAME="Ant" node:15.14
```

**Результат:**
```
Welcome to Node.js v15.14.0.
Type ".help" for more information.
>
```

### 3. Выполнение скрипта в интерактивной среде Node.js

После появления приглашения `>` введена команда:

```javascript
> console.log(`Привет, ${process.env.NAME} ${process.env.SURNAME}!`);
```

**Результат:**
```
Привет, Evgenia Ant!
undefined
```

### 4. Выход из интерактивной среды Node.js

Для выхода из Node.js REPL использовано сочетание клавиш:

```
Ctrl + D
```

После выхода контейнер автоматически остановился, так как основной процесс (Node.js REPL) завершился.

### 5. Проверка статуса контейнера

```bash
docker ps -a
```

**Результат:**
```
CONTAINER ID   IMAGE        COMMAND                  CREATED              STATUS                      PORTS     NAMES
7aa353a414fd   node:15.14   "docker-entrypoint.s…"   About a minute ago   Exited (0) 12 seconds ago             mynode
```

### 6. Удаление контейнера

```bash
docker rm mynode
```

**Результат:**
```
mynode
```

### 7. Удаление образа node версии 15.14

```bash
docker rmi node:15.14
```

**Результат:**
```
Untagged: node:15.14
Deleted: sha256:608bba799613b1ebf754034ae008849ba51e88b23271412427b76d60ae0d0627
```

## Альтернативный способ (однострочный скрипт)

Если выполнить скрипт без входа в интерактивный режим, можно использовать команду:

```bash
docker run -it --name mynode -e NAME="Evgenia" -e SURNAME="Ant" node:15.14 node -e "console.log(`Привет, ${process.env.NAME} ${process.env.SURNAME}!`)"
```

**Результат:**
```
Привет, Evgenia Ant!
```

## Вывод

Все шаги задания выполнены успешно:

| Шаг | Описание | Статус |
|:---|:---|:---:|
| 1 | Загружен образ `node:15.14` | ✅ |
| 2 | Запущен контейнер `mynode` с переменными NAME="Evgenia", SURNAME="Ant" | ✅ |
| 3 | Скрипт вывел приветствие "Привет, Evgenia Ant!" | ✅ |
| 4 | Выход из Node.js через Ctrl+D | ✅ |
| 5 | Контейнер остановлен | ✅ |
| 6 | Контейнер удален | ✅ |
| 7 | Образ `node:15.14` удален | ✅ |
```


