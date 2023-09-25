const BAD_REQUEST = "Некорректные данные.";
const BAD_REQUEST_ROLE = "Возможна только роль USER.";
const CONFLICT = "Конфликт данных.";
const CONFLICT_EMAIL = "E-mail уже используется.";
const FORBIDDEN = "Отказано в доступе.";
const INTERNAL_SERVER = "Что-то пошло не так.";
const NOT_FOUND = "Запрашиваемая информация не найдена.";
const UNAUTHORIZED = "Необходима авторизация.";
const UNAUTHORIZED_LOGIN = "Неправильные почта и/или пароль.";

const SUCCESS = "Успех!";

const errorMessages = {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT_EMAIL,
  UNAUTHORIZED_LOGIN,
  SUCCESS,
  BAD_REQUEST_ROLE,
};

module.exports = errorMessages;
