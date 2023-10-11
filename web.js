const express = require("express");
const path = require("path");
const session = require("express-session"); // express-session 미들웨어 추가
const bodyParser = require("body-parser");
const userController = require("./controller/UserController");
const { BoardModel, Board } = require('./model/User');


const app = express();

// 파비콘 추가
app.use('/favicon.ico', express.static(path.join(__dirname, 'src', 'favicon.png')));

app.use(session({ // express-session 설정
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); 
//body-parser모듈에서 지원하는 옵션으로 false값일 시 node.js에서 기본으로 내장된 쿼리스트링을 사용하고, true값일 시 따로 설치가 필요한 npm qs라이브러리를 사용한다,
app.use(express.static(path.join(__dirname, "src")));
// path = node.js에 기본제공되는 모듈로서 디렉터리등의 경로를 편리하게 설정할 수 있는 기능을 제공함
// 안전하게 경로를 설정하기 위해 join,resolve라는 매서드를 활용하는게 좋음
// __는 자바스크립트에서 기본적으로 정의된 변수에 붙는것이며 위 해석은 src라는 폴더를 절대경로로 사용하겠다는 뜻이다.

// set the view engine
// ejs를 사용할 수 있게 해주는 구문
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// __dirname = 절대 경로를 알려주는 변수
// __는 기본적으로 정의된 변수에 붙음

// 미들웨어: 로그인 여부 체크
app.use((req, res, next) => {
    // 메인 페이지(main)와 변경 페이지(change)에 대해서만 로그인 여부를 체크하고 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!req.session.user && (req.originalUrl === "/main" || req.originalUrl === "/editProfilePage" || req.originalUrl === "/write" || req.originalUrl === "/board" || req.originalUrl === "/boardview" || req.originalUrl === "/ModifyWrite" || req.originalUrl === "/introduce")) {
        console.error("Unauthorized access to main or change page. Redirecting to login page.");
        return res.redirect("/login");
    }

    next();
});

//Routes
app.get("/", userController.index);
app.post("/user", userController.post_user);

app.get("/edit-profile", userController.editProfile); // 회원 정보 수정 페이지 렌더링
app.post("/edit-profile", userController.editProfile);    // 회원 정보 수정 처리

app.get('/delete-account', userController.deleteAccount); //회원 탈퇴
app.post('/delete-account', userController.deleteAccount); //회원탈퇴

app.get("/logout", userController.logout);

app.get("/login", userController.login);
app.post("/login", userController.post_login);
// getUserInfo 핸들러에 대한 라우트 설정
app.get("/get-user-info", userController.getUserInfo);

app.post("/user/check_duplicate_id", userController.checkDuplicateId); // 아이디 중복검사 하는 경로 설정

    // 로그인 여부를 체크하고 로그인하지 않은 경우 로그인 페이지로 리디렉션
    // /main 경로에 대한 GET 핸들러 추가

// 메인 NOTICE부분 렌더링
app.get('/get-recent-posts', userController.getRecentPosts);

    
// 게시글 작성 페이지 렌더링
app.get('/write', userController.renderWritePage);

// 게시글 작성 요청 처리
app.post('/create-post', userController.createPost);

// 게시물 목록을 가져오는 경로
app.get('/get-posts', userController.getPosts);

// 게시글 상세페이지
app.get("/boardview", userController.renderBoardViewPage);
app.get('/get-post-by-id', (req, res) => {
    const boardID = req.query.boardID;

    BoardModel.getPostByID(boardID, (err, post) => {
        if (err) {
            console.error("Error getting post:", err);
            res.status(500).json({ error: "Error getting post" });
        } else {
            res.json(post);
        }
    });
});

// 댓글
// POST 요청을 통해 댓글 저장
app.post('/save-reply', userController.saveReply);

// GET 요청을 통해 해당 게시글의 모든 댓글을 가져옴
app.get('/get-replies', userController.getReplies);

// 게시판 조회수 업데이트와 게시글 정보 조회를 처리하는 라우트 핸들러
app.get('/board/:boardID', userController.getBoardById);
app.get('/update-view-count/:boardID', userController.updateViewCount);

// 게시글 삭제기능
app.post('/delete-post', userController.deletePost);

// 게시글 수정
app.get('/getBoardInfo', userController.getBoardInfo);
app.post('/update-post', userController.updatePost);

// 검색기능
app.get('/search-posts', userController.searchPosts);
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm; // POST 요청에서 검색어 가져오기
    
    // 검색어를 이용하여 게시글을 찾는 로직 (BoardModel.searchPosts 함수 활용)
    Board.searchPosts(searchTerm, (err, searchResults) => {
    if (err) {
        console.error('Error searching posts:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }     
        res.json({ searchTerm: searchTerm, searchResults: searchResults });
    });
});

app.get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "main.html"));
});
app.get("/join", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "join.html"));
});
app.get("/editProfilePage", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "information.html"));
});
app.get("/write", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "writeboard.html"));
});
app.get("/board", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "bulletinboard.html"));
});
app.get("/boardview", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "boardview.html"));
});
app.get("/ModifyWrite", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "ModifyWriteBoard.html"));
});
app.get("/answer", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "answer.html"));
});
app.get("/portfolio", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "portfolio.html"));
});
app.get("/introduce", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "introduce.html"));
});


const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});