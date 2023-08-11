// routes/index.js
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();

// 로그인 여부 체크 미들웨어
function checkLogin(req, res, next) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!req.session.user && req.originalUrl !== "/login" && req.originalUrl !== "/join" && req.originalUrl !== "/main") {
        console.error("Unauthorized access. Redirecting to login or join page.");
        return res.redirect("/login");
    }

    next();
}
// 회원가입 요청 처리
router.post('/join', UserController.post_user);

// 로그아웃 페이지
router.get("/logout-page", user.logoutPage);

// 로그아웃 요청 처리
router.get("/logout", user.logout);
router.post("/logout", user.logout);

router.get("/", user.index);
router.post("/join", user.post_user);

router.get("/login", user.login);
router.post("/login", user.post_login);


// 로그인 여부 체크 미들웨어를 이용해 접근 제어
router.use(checkLogin);

router.post("/edit", user.edit);
router.patch("/edit", user.patch_user);
router.delete("/delete", user.delete_user);

module.exports = router;
