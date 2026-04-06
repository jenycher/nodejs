# Задание 3 - Volumes (Тома)

## Цель
Научиться работать с монтированием томов (volumes) в Docker — подключать папку хост-машины в контейнеры, обмениваться файлами между контейнерами через общую директорию на хосте, управлять файлами внутри контейнеров.

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
6041b69671c6: Pull complete
55fab5cadd3c: Pull complete
989c5d2d2313: Pull complete
bd821d20ef8c: Pull complete
787f5e2f1047: Pull complete
bfde2ec33fbc: Pull complete
7b6173a10eb8: Pull complete
Digest: sha256:608bba799613b1ebf754034ae008849ba51e88b23271412427b76d60ae0d0627
Status: Downloaded newer image for node:15.14
docker.io/library/node:15.14
```

### 2. Запуск контейнера first_node

```bash
docker run -d --name first_node -v ${PWD}/data:/var/first/data node:15.14 sleep infinity
```

**Результат:**
```
45b1c922586bc34d929bbccfbeccc341d7f26578f55fab3e4a5b48d2b9550e71
```

### 3. Запуск контейнера second_node

```bash
docker run -d --name second_node -v ${PWD}/data:/var/second/data node:15.14 sleep infinity
```

**Результат:**
```
d3b768a56c360c446c8551fce7a1b5c5f81091bed07add51ee1c747cffc4321c
```

### 4. Создание файла через контейнер first_node

Подключение к контейнеру `first_node` и создание текстового файла:

```bash
docker exec -it first_node sh
```

**Внутри контейнера first_node:**
```bash
# echo "Hello from first_node container" > /var/first/data/file1.txt
# exit
```

### 5. Файл на хостовой машине

На хосте в папке `data` уже присутствовал файл `file2.txt` (создан ранее) с содержимым:
```
This file was created on host machine
```

### 6. Просмотр файлов через контейнер second_node

Подключение к контейнеру `second_node` и просмотр содержимого смонтированной директории:

```bash
docker exec -it second_node sh
```

**Внутри контейнера second_node — список файлов:**
```bash
# ls -la /var/second/data/
```

**Результат:**
```
total 4
drwxrwxrwx 1 root root 4096 Apr  6 11:42 .
drwxr-xr-x 3 root root 4096 Apr  6 11:42 ..
-rw-r--r-- 1 root root   32 Apr  6 11:42 file1.txt
-rwxrwxrwx 1 root root   37 Apr  6 11:36 file2.txt
```

**Внутри контейнера second_node — содержимое file1.txt:**
```bash
# cat /var/second/data/file1.txt
```

**Результат:**
```
Hello from first_node container
```

**Внутри контейнера second_node — содержимое file2.txt:**
```bash
# cat /var/second/data/file2.txt
```

**Результат:**
```
This file was created on host machine
```

**Выход из контейнера:**
```bash
# exit
```

### 7. Остановка обоих контейнеров

```bash
docker stop first_node second_node
```

**Результат:**
```
first_node
second_node
```

### 8. Удаление обоих контейнеров

```bash
docker rm first_node second_node
```

**Результат:**
```
first_node
second_node
```

### 9. Удаление образа node версии 15.14

```bash
docker rmi node:15.14
```

**Результат:**
```
Untagged: node:15.14
Deleted: sha256:608bba799613b1ebf754034ae008849ba51e88b23271412427b76d60ae0d0627
```

## Схема работы томов

```
Хост-машина (Windows)                Контейнер first_node
┌─────────────────────────┐          ┌─────────────────────────┐
│  ${PWD}/data/           │          │  /var/first/data/       │
│  ├── file1.txt (32 б)   │◄─────────│    file1.txt            │
│  └── file2.txt (37 б)   │          │    (создан здесь)       │
└─────────────────────────┘          └─────────────────────────┘
           │                                      │
           │     Одна и та же физическая папка     │
           │                                      │
           ▼                                      ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│  Контейнер second_node  │          │  Хост-машина            │
│  /var/second/data/      │          │  ${PWD}/data/           │
│    file1.txt            │─────────►│    file1.txt            │
│    file2.txt            │          │    file2.txt            │
│    (видит оба файла)    │          │    (создан на хосте)    │
└─────────────────────────┘          └─────────────────────────┘
```

## Сводная таблица результатов

| Файл | Создан в | Размер | Содержимое |
|:---|:---|:---:|:---|
| `file1.txt` | Контейнер `first_node` | 32 байта | `Hello from first_node container` |
| `file2.txt` | Хост-машина | 37 байт | `This file was created on host machine` |

## Вывод

| Шаг | Описание | Статус |
|:---|:---|:---:|
| 1 | Загружен образ `node:15.14` | ✅ |
| 2 | Запущен контейнер `first_node` с монтированием `data` → `/var/first/data` | ✅ |
| 3 | Запущен контейнер `second_node` с монтированием `data` → `/var/second/data` | ✅ |
| 4 | В контейнере `first_node` создан файл `file1.txt` | ✅ |
| 5 | На хосте имеется файл `file2.txt` | ✅ |
| 6 | В контейнере `second_node` просмотрены оба файла | ✅ |
| 7 | Контейнеры остановлены | ✅ |
| 8 | Контейнеры удалены | ✅ |
| 9 | Образ `node:15.14` удален | ✅ |

### Ключевые выводы

1. **Общая папка:** Оба контейнера имеют доступ к одной и той же папке на хосте.
2. **Синхронизация в реальном времени:** Файл `file1.txt`, созданный в `first_node`, мгновенно стал доступен в `second_node`.
3. **Двустороннее взаимодействие:** Файл `file2.txt`, созданный на хосте, также виден в обоих контейнерах.
4. **Монтирование томов:** Используется опция `-v` (volume) для связи директории хоста с директорией контейнера.
5. **Важное правило:** Внутри контейнера используются **Linux-пути** (`/var/...`), а не Windows-пути (`C:\...`).
```
