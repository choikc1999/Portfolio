const path = require("path");
const User = require("../model/User"); // User 모델을 가져오는 부분

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

// user information save
exports.post_user = (req, res) => {
    const userData = req.body;

    User.insert(userData, function (err, result) {
        if (err) {
            console.error("UserController - Error inserting user data", err);
            if (err === "Duplicate ID") {
                return res.status(400).json({ error: "Duplicate ID. Please choose a different ID." });
            } else {
                console.error("Error saving user data to MySQL", err);
                return res.status(500).json({ error: "Error saving user data to the database" });
            }
        }
        return res.status(200).json({ id: result.id });
    });
};

exports.login = (req, res) => {
    const filePath = path.join(__dirname, "../src/views", "index.html"); // login.html 파일로 수정
    res.sendFile(filePath);
};

// login 시도
exports.post_login = (req, res) => {
    User.select(req.body.id, req.body.password, function (result) {
        if (result == null || req.body.password != result.password) {
            return res.send({ result: result, flag: false });
        } else {
            // 로그인에 성공한 경우 세션에 사용자 정보 저장
            req.session.user = {
                id: result.id,
                name: result.name
            };

            return res.send({ result: result, flag: true });
        }
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