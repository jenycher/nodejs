## Задание 1 - Docker CLI

### Цель
Загрузить образ `busybox:latest`, запустить контейнер с командой ping, проанализировать логи, повторно запустить контейнер, удалить контейнер и образ.

### Выполненные команды и результаты

#### 1. Загрузка образа busybox последней версии
```bash
docker pull busybox:latest
```
**Результат:**
```
latest: Pulling from library/busybox
aecba0016ef2: Download complete
481282afbc43: Pull complete
Digest: sha256:1487d0af5f52b4ba31c7e465126ee2123fe3f2305d638e7827681e7cf6c83d5e
Status: Downloaded newer image for busybox:latest
docker.io/library/busybox:latest
```

#### 2. Запуск контейнера с 7 пингами netology.ru
```bash
docker run -d --name pinger busybox ping -c 7 netology.ru
```
**Результат:**
```
e57f8ab80dd600ed5e58341c59a517778180c470b552971ff474d384fdf32f0d
```

#### 3. Список всех контейнеров (первый раз)
```bash
docker ps -a
```
**Результат:**
```
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS     NAMES
e57f8ab80dd6   busybox   "ping -c 7 netology.…"   18 seconds ago   Exited (0) 11 seconds ago             pinger
```

#### 4. Логи контейнера после первого запуска
```bash
docker logs pinger
```
**Результат:**
```
PING netology.ru (51.250.51.8): 56 data bytes
64 bytes from 51.250.51.8: seq=0 ttl=63 time=27.715 ms
64 bytes from 51.250.51.8: seq=1 ttl=63 time=28.933 ms
64 bytes from 51.250.51.8: seq=2 ttl=63 time=25.553 ms
64 bytes from 51.250.51.8: seq=3 ttl=63 time=28.766 ms
64 bytes from 51.250.51.8: seq=4 ttl=63 time=25.319 ms
64 bytes from 51.250.51.8: seq=5 ttl=63 time=36.447 ms
64 bytes from 51.250.51.8: seq=6 ttl=63 time=26.221 ms

--- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 25.319/28.422/36.447 ms
```

#### 5. Повторный запуск контейнера pinger
```bash
docker start pinger
```
**Результат:**
```
pinger
```

#### 6. Список всех контейнеров (второй раз)
```bash
docker ps -a
```
**Результат:**
```
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS                     PORTS     NAMES
e57f8ab80dd6   busybox   "ping -c 7 netology.…"   About a minute ago   Exited (0) 9 seconds ago             pinger
```

#### 7. Логи контейнера после повторного запуска
```bash
docker logs pinger
```
**Результат:**
```
PING netology.ru (51.250.51.8): 56 data bytes
64 bytes from 51.250.51.8: seq=0 ttl=63 time=27.715 ms
64 bytes from 51.250.51.8: seq=1 ttl=63 time=28.933 ms
64 bytes from 51.250.51.8: seq=2 ttl=63 time=25.553 ms
64 bytes from 51.250.51.8: seq=3 ttl=63 time=28.766 ms
64 bytes from 51.250.51.8: seq=4 ttl=63 time=25.319 ms
64 bytes from 51.250.51.8: seq=5 ttl=63 time=36.447 ms
64 bytes from 51.250.51.8: seq=6 ttl=63 time=26.221 ms

--- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 25.319/28.422/36.447 ms
PING netology.ru (51.250.51.8): 56 data bytes
64 bytes from 51.250.51.8: seq=0 ttl=63 time=26.561 ms
64 bytes from 51.250.51.8: seq=1 ttl=63 time=26.336 ms
64 bytes from 51.250.51.8: seq=2 ttl=63 time=26.496 ms
64 bytes from 51.250.51.8: seq=3 ttl=63 time=28.023 ms
64 bytes from 51.250.51.8: seq=4 ttl=63 time=28.918 ms
64 bytes from 51.250.51.8: seq=5 ttl=63 time=27.379 ms

--- netology.ru ping statistics ---
7 packets transmitted, 6 packets received, 14% packet loss
round-trip min/avg/max = 26.336/27.285/28.918 ms
```

#### 8. Анализ логов

| Параметр | Значение |
|:---|:---|
| Общее количество запусков команды `ping` | **2** |
| Отправлено запросов в 1-м запуске | 7 |
| Отправлено запросов в 2-м запуске | 7 |
| **Общее количество отправленных запросов** | **14** |

> *Примечание:* во втором запуске получено 6 ответов из 7 (14% потери пакетов), но отправлено было 7 запросов, как указано в статистике.

#### 9. Остановка и удаление контейнера
```bash
docker stop pinger
docker rm pinger
```
**Результат:**
```
pinger
pinger
```

#### 10. Удаление образа busybox
```bash
docker rmi busybox:latest
```
**Результат:**
```
Untagged: busybox:latest
Deleted: sha256:1487d0af5f52b4ba31c7e465126ee2123fe3f2305d638e7827681e7cf6c83d5e
```

### Вывод
Все шаги задания выполнены успешно. Контейнер создан, запущен, перезапущен, логи проанализированы. В конце выполнена полная очистка: удален контейнер и образ BusyBox.