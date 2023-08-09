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
        if (result == null) {
            return res.send({ result: result, flag: false });
        } else {
            if (req.body.password != result.password) {
                return res.send({ result: result, flag: false });
            } else {
                return res.send({ result: result, flag: true });
            }
        }
    });
};
