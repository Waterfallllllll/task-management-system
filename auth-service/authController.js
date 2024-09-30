// const User = require("./models/User");
// const Role = require("./models/Role");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator");
// const { secret } = require("./config");

// const generateAccessToken = (id, roles) => {
// 	const payload = {
// 		id,
// 		roles
// 	};
// 	return jwt.sign(payload, secret, {expiresIn: "24h"} );
// };

// class authController {
// 	async registration(req, res) {

// 	}

// 	async login(req, res) {
// 		try {
// 			const {username, password} = req.body;
// 			const user = await User.findOne({username});
// 			if (!user) {
// 				return res.status(400).json({message: `Пользователь ${username} не найден`});
// 			}
// 			const validPassword = bcrypt.compareSync(password, user.password);
// 			if (!validPassword) {
// 				return res.status(400).json({message: "Введен неверный пароль"});
// 			}
// 			const token = generateAccessToken(user._id, user.roles);
// 			return res.json({token});
// 		} catch (e) {
// 			console.log(e);
// 			res.status(400).json({message: "Login error"});
// 		}
// 	}

// 	async getUsers(req, res) {
// 		try {
// 			const users = await User.find();
// 			res.json(users);
// 		} catch (e) {
			
// 		}
// 	}
// }

// module.exports = new authController();

const User = require("./models/User"); // Модель пользователя из базы данных
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("./models/Role");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

// Логин пользователя
exports.loginUser = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });
	res.json({ token });
};

exports.registerUser = async (req, res) => {
	try {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	return res.status(400).json({message: "Ошибка при регистрации", errors});
		// }
		const {username, password} = req.body;
		const candidate = await User.findOne({username});
		if (candidate) {
			return res.status(400).json({message: "Пользователь с таким именем уже существует"});
		}
		const hashPassword = bcrypt.hashSync(password, 7);
		const userRole = await Role.findOne({value: "USER"});
		const user = new User({username, password: hashPassword, roles: [userRole.value]});
		await user.save();
		return res.json({message: "Пользователь успешно зарегистрирован"});
	} catch (e) {
		console.log(e);
		res.status(400).json({message: "Registration error"});
	}
};

// Получение списка пользователей
exports.getUsers = async (req, res) => {
	const users = await User.find().select("-password"); // Исключаем пароли из вывода
	res.json(users);
};
