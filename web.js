const express = require("express");
const path = require("path");
const session = require("express-session"); // express-session 미들웨어 추가
const bodyParser = require("body-parser");
const userController = require("./controller/UserController");
const { BoardModel, Board } = require('./model/User');
const multer = require('multer'); // multer 미들웨어 추가
const fs = require('fs'); // node 내장 모듈 File System약자


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
    if (!req.session.user && (req.originalUrl === "/main" || req.originalUrl === "/editProfilePage" || req.originalUrl === "/write" || req.originalUrl === "/board" || req.originalUrl === "/boardview" || req.originalUrl === "/ModifyWrite" || req.originalUrl === "/answer" || req.originalUrl === "/portfolio" || req.originalUrl === "/introduce" || req.originalUrl === "/career" || req.originalUrl.match(/\/boardview\?boardID=[1-9][0-9]{0,3}$/))) {
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

// 게시글 이미지
// 라우트: 파일 업로드 양식을 제공하는 페이지
app.get('/upload', (req, res) => {
    res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="picture" accept=".jpg, .png, .gif" multiple><input type="submit" value="upload"></form>');
    res.render('upload');
});
// 파일 업로드를 처리하는 엔드포인트
app.post('/upload', userController.uploadImage);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/userimages/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// 이미지 업로드 및 이미지 ID 저장
app.post('/uploadImage', upload.single('picture'), (req, res) => {
    const { originalname, path } = req.file;

    // 이미지 정보를 데이터베이스에 저장
    Image.create(originalname, path, (dbErr, imageId) => {
        if (dbErr) {
            console.error('이미지 정보를 데이터베이스에 저장할 수 없습니다.');
            return res.status(500).send('파일 업로드에 실패했습니다.');
        }

        // 이미지 ID를 세션에 저장
        req.session.imageId = imageId;

        // 이미지 ID를 클라이언트에 반환하고 이미지 정보 저장이 완료된 후 세션과 로그 메시지를 처리합니다.
        res.status(200).json({ id: imageId });
        console.log(`이미지 ID ${imageId}가 세션에 저장되었습니다.`);
        console.log('파일 업로드 및 데이터베이스 저장이 성공했습니다.');
    });
});


// 이미지 정보를 가져올 라우트를 정의
app.get('/getImageInfo', userController.getImageInfo);

app.get('/getTopImages', userController.getTopImages);

app.get('/updateImageId', userController.updateImageId);
app.post('/updateImageId', userController.updateImageId);


// 세션을 삭제하는 라우트
app.get('/clearSession', (req, res) => {
    delete req.session.imageId; // 이미지 ID를 세션에서 삭제
    res.send('세션이 성공적으로 삭제되었습니다.');
});


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

// 게시글 상세페이지 이미지
app.get('/getBoardImage/:boardID', userController.getBoardImage);

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
app.get("/career", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "views", "career.html"));
});


const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});