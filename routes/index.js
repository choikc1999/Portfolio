// routes/index.js
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();
const bcrypt = require('bcrypt');
const ReplyModel = require('../models/ReplyModel');

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

// 게시글 작성 페이지 렌더링
router.get('/write', UserController.renderWritePage);

// 게시글 작성 요청 처리
router.post('/write', UserController.createPost);

// 게시글리스트 랜더링
router.get('/getPosts', UserController.getPosts);

router.get("/get-posts", UserController.getPosts);

// 게시글 상세 페이지 렌더링
router.get('/boardview', (req, res) => {
  const boardID = req.query.boardID;

  // boardID를 이용하여 게시글 정보를 데이터베이스에서 가져오기
  BoardModel.getPostByID(boardID, (err, post) => {
      if (err) {
          console.error("Error getting post:", err);
          res.status(500).json({ error: "Error getting post" });
      } else {
          res.render("boardview", { post }); // 게시글 정보를 boardview 페이지에 전달하여 렌더링
      }
  });
});

// 게시글 조회 수 업데이트와 게시글 정보 조회를 처리하는 라우트 핸들러
router.get('/board/:boardId', UserController.getBoardById);
router.get('/update-view-count/:boardID', userController.updateViewCount);

// 게시글 수정
router.get('/getBoardInfo', UserController.getBoardInfo);
router.post('/update-post', UserController.updatePost);

// POST 요청을 통해 댓글 저장
router.post('/save-reply', UserController.saveReply);

// GET 요청을 통해 해당 게시글의 모든 댓글을 가져옴
router.get('/get-replies', UserController.getReplies);

// 게시글 삭제
router.post('/delete-post', UserController.deletePost);

module.exports = router;