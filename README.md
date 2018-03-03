# Тестовое задание

Результат выполнения [тестового задания](task.txt) с использованием Node.js, Redis и Vue.js.

## Запуск

Приложение для работы требует локально запущенный сервер Redis.

Выполните в терминале:
```
git clone https://github.com/sgtpep/pharmhub.git
cd ./pharmhub
npm install
npm start
```

Чтобы наполнить базу данных информацией о товарах, выполните в терминале:
```
curl -v -X POST http://localhost:3000/{10x10,niko-opt}
```

Перейдите в браузере по адресу http://localhost:3000/.

## Пояснения к стилю кода

В данный момент нахожусь под впечатлением от функционального подхода в программировании, поэтому некоторые особенности стиля кода могут показаться непривычными и, например, отличающимися от стиля, скажем, примеров кода в документации к Express. Могу переключиться на соглашения и стиль, более привычные вашей команде. Просто перечислю то, что у лично у меня сложилось под влиянием функционального программирования:
- в модуле в верхнем уровне только функции, никаких переменных и вызовов
- вместо скалярных констант — тоже функции, возвращающие значения
- все require() инлайн в теле функций по мере использования
- минимум объявлений переменных/констант, только там, где без них нельзя, или это урощает читаемость (субъективно)
- предпочтение цепочкам вызовов (чейнингу) там, где это возможно
- предпочтение лямбда-функциям с одним возвращающим выражением
- оптимизация повторных вызовов функций с помощью мемоизации
- использование map, reduce, filter, some, any и т.д. вместо циклов

Интегрированы prettier и eslint. Для их запуска использовать команду: `npm run lint`.

## Возможные улучшения

- реализовать удаление неактуальных записей о товарах из БД в случае, если раннее существующий товар в прайс-листе исчез из него
- обрабатывать ошибки запроса и парсинга прайс-листа
- реализовать поточное скачивание, перекодировку, парсинг и обновление прайс-листа
- добавить навигацию через адресную строку для UI
- использовать JSON Schema для валидации ответов при тестировании API