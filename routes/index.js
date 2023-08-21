// routes/index.js
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    fs.readFile('/home/hosting_users/choikc1999/apps/choikc1999_jsblog/', (err, data) => {
      if(err) throw err;
      const results = JSON.parse(data.toString('utf8'));
      res.render('index', { title:"WEB Designer", results });
    });
  });

// 회원가입 요청 처리
router.post('/join', UserController.post_user);

// 회원 정보 수정 페이지 렌더링
router.get("/edit-profile", UserController.editProfile);

// 회원 정보 수정 처리
router.post("/edit-profile", UserController.editProfile);

// 회원탈퇴
router.get('/delete-account', UserController.deleteAccount);
router.post('/delete-account', UserController.deleteAccount);

// 로그아웃 페이지
router.get("/logout-page", user.logoutPage);

// 로그아웃 요청 처리
router.get("/logout", user.logout);
router.post("/logout", user.logout);

router.get("/", user.index);
// router.post("/join", user.post_user);

router.get("/login", user.login);
router.post("/login", user.post_login);


// 로그인 여부 체크 미들웨어를 이용해 접근 제어
router.use(checkLogin);

module.exports = router;