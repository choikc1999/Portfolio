const path = require("path");
const User = require("../model/User"); // User 모델을 가져오는 부분
const bcrypt = require('bcrypt');

// join id checking
exports.index = (req, res) => {
    const filePath = path.join(__dirname, "../src/views", "index.html");
    res.sendFile(filePath);    
};

exports.checkDuplicateId = (req, res) => {
    const { id } = req.body;
    User.checkDuplicateId(id, function (err, isDuplicate) {
        if (err) {
            console.error("Error checking duplicate ID", err);
            return res.status(500).json({ error: "Error checking duplicate ID" });
        }
        res.json({ isDuplicate: isDuplicate });
    });
};

exports.check_duplicate_id = (req, res) => {
    const id = req.body.id;

    User.checkDuplicateId(id, function (err, isDuplicate) {
        if (err) {
            console.error("Error checking duplicate ID in MySQL", err);
            return res.status(500).json({ error: "Error checking duplicate ID in the database" });
        }

        if (isDuplicate) {
            return res.status(200).json({ isDuplicate: true });
        } else {
            return res.status(200).json({ isDuplicate: false });
        }
    });
};

// user information save (비밀번호암호화작업)
exports.post_user = (req, res) => {
    const userData = req.body;

    bcrypt.hash(userData.password.slice(0, 20), 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        userData.password = hashedPassword;

        User.insert(userData, function (err, result) {
            if (err === "Duplicate ID") {
                return res.status(400).json({ error: "Duplicate ID. Please choose a different ID." });
            } else if (err) {
                console.error("UserController - Error inserting user data", err);
                return res.status(500).json({ error: "Error saving user data to the database" });
            }

            // 클라이언트에 회원가입 성공 메시지를 전달하고 로그인 페이지로 이동
            const message = "회원가입에 성공했습니다. 로그인 페이지로 이동합니다.";
            res.status(200).json({ message: message, redirectTo: "/login" });
        });
    });
};

exports.login = (req, res) => {
    const filePath = path.join(__dirname, "../src/views", "index.html"); // login.html 파일로 수정
    res.sendFile(filePath);
};

// login 시도
// login 시도
exports.post_login = (req, res) => {
    const { id, password } = req.body;

    User.select(id, password, function (result) {
        if (!result || !result.password) {
            return res.send({ result: result, flag: false });
        }

        bcrypt.compare(password, result.password, (err, passwordMatch) => {
            if (err) {
                console.error('Error comparing passwords', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (passwordMatch) {
                req.session.user = {
                    id: result.id,
                    name: result.name
                };
                return res.send({ result: result, flag: true });
            } else {
                return res.send({ result: result, flag: false });
            }
        });
    });
};

exports.getUserInfo = (req, res) => {
    // 세션에서 사용자 정보 가져오기
    const user = req.session.user;

    if (user) {
        // 데이터베이스에서 사용자 이름 가져오기
        User.select(user.id, user.password, function (result) {
            if (result) {
                return res.json({ name: result.name });
            } else {
                return res.status(401).json({ error: "User not found" });
            }
        });
    } else {
        return res.status(401).json({ error: "User not authenticated" });
    }
};

// 로그아웃 페이지
exports.logoutPage = (req, res) => {
    const filePath = path.join(__dirname, "../src/views", "index.html");
    res.sendFile(filePath);
};

// 로그아웃 처리
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Error destroying session" });
        }
        
        // 쿠키도 삭제
        res.clearCookie('connect.sid');
        
        // 로그아웃 후 로그인 페이지로 리디렉션
        res.redirect("/login");
    });
};