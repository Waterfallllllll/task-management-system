const axios = require("axios");

const authServiceURL = "http://auth-service:5000/auth"; // URL вашего микросервиса

// Функция для регистрации пользователя
async function registerUser(userData) {
	try {
		const response = await axios.post(`${authServiceURL}/register`, userData);
		return response.data; // Возвращаем данные о новом пользователе
	} catch (error) {
		console.error("Ошибка при регистрации пользователя:", error);
		throw error; // Это нужно для обработки ошибки в бэкенде
	}
}

// Функция для логина
async function loginUser(userData) {
	try {
		const response = await axios.post(`${authServiceURL}/login`, userData);
		return response.data; // Возвращаем данные (например, токен)
	} catch (error) {
		console.error("Ошибка при логине:", error);
		throw error; // Это нужно для обработки ошибки в бэкенде
	}
}

// Функция для получения списка пользователей
async function getUsers(token) {
	try {
		const response = await axios.get(`${authServiceURL}/users`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data; // Возвращаем список пользователей
	} catch (error) {
		console.error("Ошибка при получении списка пользователей:", error);
		throw error; // Это нужно для обработки ошибки в бэкенде
	}
}

module.exports = { registerUser, loginUser, getUsers };
