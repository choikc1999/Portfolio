// routes/index.js
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();
const bcrypt = require('bcrypt');

// 회원가입 요청 처리
router.post('/join', UserController.post_user);

// 회원정보 수정 페이지 렌더링
router.get("/edit-profile", UserController.editProfilePage);

// 회원정보 수정
router.post('/edit-profile', async (req, res) => {
    try {
      const { name, email, phoneNumber, password } = req.body;
  
      // 이전 코드에서 복사한 비밀번호 해시 코드
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 데이터베이스에서 해당 유저 정보 가져오기
      const user = await User.findOne({ email });
  
      // 새로운 정보로 업데이트
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.password = hashedPassword;
  
      // 변경된 정보 저장
      await user.save();
  
      console.log('Updated user:', user); // 업데이트된 유저 정보 로깅
  
      res.redirect('/main'); // 수정한 경로로 변경
  
    } catch (error) {
      console.error('Error editing profile:', error);
      res.status(500).send('Error editing profile');
    }
  });

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

module.exports = router;