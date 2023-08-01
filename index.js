const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const userController = require("./controller/UserController");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); 
//body-parser모듈에서 지원하는 옵션으로 false값일 시 node.js에서 기본으로 내장된 쿼리스트링을 사용하고, true값일 시 따로 설치가 필요한 npm qs라이브러리를 사용한다,
app.use(express.static(path.join(__dirname, "src")));
// path = node.js에 기본제공되는 모듈로서 디렉터리등의 경로를 편리하게 설정할 수 있는 기능을 제공함
// 안전하게 경로를 설정하기 위해 join,resolve라는 매서드를 활용하는게 좋음
// __는 자바스크립트에서 기본적으로 정의된 변수에 붙는것이며 위 해석은 src라는 폴더를 절대경로로 사용하겠다는 뜻이다.

//Routes
app.get("/", userController.index);
app.post("/user", userController.post_user);
/* 
app.get("/login", userController.login);
app.get("/join", userController.join);
app.post("/login", userController.post_login);
app.post("/edit", userController.edit);
app.patch("/user", userController.patch_user);
app.delete("/user", userController.delete_user);
*/
app.post("/user/check_duplicate_id", userController.checkDuplicateId); // 아이디 중복검사 하는 경로 설정

const PORT = 4080;
app.listen(PROT, () => {
    console.log(`Server started on port ${PORT}`);
});