const path = require("path");
const { User, BoardModel } = require("../model/User"); // User 모델을 가져오는 부분  
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

    // 유효성 검사 (정규식)
    const idRegex = /^[a-z0-9]{6,10}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#\$%\^&\*])[a-zA-Z\d@!#\$%\^&\*]{10,20}$/;
    const nameRegex = /^[a-zA-Z가-힣]{2,6}$/;
    const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;
    const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;

    if (!userData.id.match(idRegex)) {
        return res.status(400).json({ error: "아이디는 6자에서 10자의 영문 소문자와 숫자만 가능합니다." });
    }

    if (!userData.password.match(passwordRegex)) {
        return res.status(400).json({ error: "비밀번호는 10자에서 20자의 영문 대소문자, 숫자, 특수문자 조합이어야 합니다." });
    }

    if (!userData.name.match(nameRegex)) {
        return res.status(400).json({ error: "이름은 2자에서 6자의 한글 또는 영문(대,소문자)만 가능합니다." });
    }

    if (!userData.email.match(emailRegex)) {
        return res.status(400).json({ error: "이메일 형식이 올바르지 않습니다." });
    }

    if (!userData.phoneNumber.match(phoneNumberRegex)) {
        return res.status(400).json({ error: "전화번호는 숫자만 입력 가능합니다." });
    }

    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
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
        // 데이터베이스에서 사용자 정보 가져오기
        User.select(user.id, user.password, function (result) {
            if (result) {
                // result에 사용자 정보가 들어있다고 가정합니다. 필요한 정보를 적절하게 가져와서 사용합니다.
                const userName = result.name; // 사용자 이름 가져오기
                res.json({ name: userName });
            } else {
                return res.status(401).json({ error: "User not found" });
            }
        });
    } else {
        return res.status(401).json({ error: "User not authenticated" });
    }
};

// 회원정보 수정기능
exports.editProfile = (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    const { newId, newEmail, newPhoneNumber, newPassword } = req.body;

    const userData = {
        id: newId, // 이 부분 추가
        email: newEmail,
        phoneNumber: newPhoneNumber,
    };

    if (newPassword) {
        // 비밀번호 암호화
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            userData.password = hashedPassword;

            // 수정할 회원 정보 업데이트
            User.update(user.id, userData, (err, result) => {
                if (err) {
                    console.error("Error updating user profile:", err);
                    return res.status(500).json({ error: "Error updating user profile" });
                }

                // 정보 업데이트 성공 시
                const successMessage = "회원 정보가 성공적으로 업데이트되었습니다.";
                res.json({ success: true, message: successMessage });
            });
        });
    } else {
        // 수정할 회원 정보 업데이트
        User.update(user.id, userData, (err, result) => {
            if (err) {
                console.error("Error updating user profile:", err);
                return res.status(500).json({ error: "Error updating user profile" });
            }

            // 정보 업데이트 성공 시
            const successMessage = "회원 정보가 성공적으로 업데이트되었습니다.";
            res.json({ success: true, message: successMessage });
        });
    }
};

// 회원탈퇴
exports.deleteAccount = (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    // 회원 정보 삭제
    User.delete(user.id, (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Error deleting user" });
        }

        // 세션 삭제
        req.session.destroy();

        // 회원 탈퇴 성공 시
        res.json({ success: true });
    });
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

// 게시글 작성 페이지 렌더링
exports.renderWritePage = (req, res) => {
    // 로그인된 사용자의 이름 가져오기
    const username = req.session.user ? req.session.user.username : 'Unknown User';

    // writeboard.html 파일을 읽어서 전송
    res.sendFile(path.join(__dirname, '../src/views/writeboard.html'));
};

exports.getPosts = (req, res) => {
    BoardModel.getPosts((err, posts) => {
        if (err) {
            console.error("Error getting posts:", err);
            return res.status(500).json({ message: '서버 에러' });
        }
        res.json(posts);
    });
};

// 게시글 작성 요청 처리
exports.createPost = async (req, res) => {
    const { title, text, password, selectedBoard } = req.body;
    const sessionUser = req.session.user;

    if (!sessionUser) {
        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    User.getUserNameByUsername(sessionUser.name, (error, name) => {
        if (error) {
            console.error("Error getting user name:", error);
            return res.status(500).json({ success: false, message: "사용자 이름을 가져오는 중 오류 발생" });
        }

        BoardModel.createPost(title, text, name, password, selectedBoard, (error, postId) => {
            if (error) {
                console.error("Error creating post:", error);
                res.status(500).json({ success: false, message: "게시글 작성 중 오류 발생" });
            } else {
                res.json({ success: true, message: "게시글이 성공적으로 작성되었습니다.", postId });
            }
        });
    });
};

// 게시판리스트 갯수 제한
exports.getPostsByPage = (page, itemsPerPage, selectboard, callback) => {
    const startIndex = (page - 1) * itemsPerPage;
    let sql = `SELECT * FROM board WHERE selectboard = ?`;
    sql += ` ORDER BY modify_date DESC LIMIT ?, ?`;
    const values = [selectboard, startIndex, itemsPerPage];

    User.query(sql, values, (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for getting posts by page", err);
            return callback(err, null);
        }

        const sqlTotal = `SELECT COUNT(*) AS total FROM board WHERE selectboard = ?`;
        const totalValues = [selectboard];

        User.query(sqlTotal, totalValues, (err, result) => {
            if (err) {
                console.error("Error executing MySQL query for getting total post count", err);
                return callback(err, null);
            }

            const totalPosts = result[0].total;
            callback(null, { posts: rows, totalPosts });
        });
    });
};


exports.getTotalPostCount = (callback) => {
    const sql = `SELECT COUNT(*) AS count FROM board`;

    User.query(sql, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        const totalCount = result[0].count;
        callback(null, totalCount);
    });
};

exports.getPosts = (req, res) => {
    const page = parseInt(req.query.page) || 1; // parseInt를 사용하여 정수로 변환
    const itemsPerPage = 10; // 페이지당 게시글 수
    const selectboard = req.query.selectboard; // 선택한 게시판 필터링 값을 가져옴

    BoardModel.getPostsByPage(page, itemsPerPage, selectboard, (err, posts) => {
        if (err) {
            console.error("Error getting posts:", err);
            res.status(500).json({ error: "Error getting posts" });
        } else {
            res.status(200).json(posts);
        }
    });
};