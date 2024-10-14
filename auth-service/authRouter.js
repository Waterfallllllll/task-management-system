const Router = require("express");
const router = new Router();
const { loginUser, registerUser, getUsers } = require("./authController");


router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/users", getUsers);

module.exports = router;

