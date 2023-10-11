const path = require("path");
const { User, BoardModel, ReplyModel, Board } = require("../model/User"); // User 모델을 가져오는 부분  
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

    if (!userData.checkbox) {
        return res.status(400).json({ error: "Privacy Terms(개인정보 이용약관)을 읽어보신 후 동의하셔야 가입가능합니다." });
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
                const userId = result.id; // 사용자 아이디 가져오기
                const userName = result.name; // 사용자 이름 가져오기
                res.json({ id: userId, name: userName });
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

// 게시글삭제
exports.deletePost = (req, res) => {
    const { boardID, password } = req.body;

    // 게시글 정보 가져오기
    BoardModel.getPostByID(boardID, (err, post) => {
        if (err) {
            console.error("Error getting post:", err);
            return res.status(500).json({ success: false, message: "게시글 삭제 중 오류 발생" });
        }

        if (!post) {
            return res.json({ success: false, message: "해당 게시글이 존재하지 않습니다." });
        }

        if (post.password !== password) {
            return res.json({ success: false, message: "비밀번호가 일치하지 않습니다." });
        }

        BoardModel.deletePost(boardID, (err, success) => {
            if (err) {
                console.error("Error deleting post:", err);
                return res.status(500).json({ success: false, message: "게시글 삭제 중 오류 발생" });
            }
            if (success) {
                res.json({ success: true, message: "게시글이 성공적으로 삭제되었습니다." });
            } else {
                res.json({ success: false, message: "게시글 삭제 실패" });
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

// 게시글 보기 페이지 렌더링
exports.renderBoardViewPage = (req, res) => {
    const boardID = req.query.boardID;

    // boardID를 이용하여 게시글 정보를 데이터베이스에서 가져오기
    BoardModel.getPostByID(boardID, (err, post) => {
        if (err) {
            console.error("Error getting post:", err);
            res.status(500).json({ error: "Error getting post" });
        } else {
            // 게시글 정보를 가져와서 클라이언트에 보내는 대신에 파일을 클라이언트로 전송합니다.
            const filePath = path.join(__dirname, "../src/views", "boardview.html");
            res.sendFile(filePath);
        }
    });
};

// 댓글 렌더링
exports.saveReply = (req, res) => {
    const { boardID, nickname, reply } = req.body;

    // ReplyModel을 이용하여 댓글을 저장하는 함수 호출
    ReplyModel.saveReply(boardID, nickname, reply, (error, result) => {
        if (error) {
            console.error("Error saving reply:", error);
            return res.status(500).json({ success: false, error: "Error saving reply" });
        }
        res.json({ success: true });
    });
};

exports.getReplies = (req, res) => {
    const boardID = req.query.boardID;

    // ReplyModel을 이용하여 해당 게시글의 댓글을 가져오는 함수 호출
    ReplyModel.getRepliesByBoardID(boardID, (error, replies) => {
        if (error) {
            console.error("Error getting replies:", error);
            return res.status(500).json({ error: "Error getting replies" });
        }
        res.json(replies);
    });
};

// 게시글 조회수 업데이트 컨트롤러
// const viewCountLocks = {}; // 각 게시글의 조회수 업데이트 상태를 저장하는 객체

// 게시글 조회수 업데이트 함수
exports.updateViewCount = (req, res) => {
    const boardID = req.params.boardID;

    // 게시글 정보 가져오기
    Board.findById(boardID, (err, board) => {
        if (err) {
            console.error("Error fetching board:", err);
            res.status(500).json({ error: "Error fetching board" });
        } else {
            if (board) {
                // 게시글 조회수 업데이트
                Board.updateViewCount(boardID, (updateErr, updatedViewCount) => { // 수정: 두 번째 인자로 업데이트된 조회수 받음
                    if (updateErr) {
                        console.error("Error updating view count:", updateErr);
                        res.status(500).json({ error: "Error updating view count" });
                    } else {
                        // 업데이트된 조회수 값을 클라이언트에 반환
                        res.status(200).json({ views: updatedViewCount });
                    }
                });
            } else {
                res.status(404).json({ error: "Board not found" });
            }
        }
    });
};

// 게시글 조회 함수
exports.getBoardById = (req, res) => {
    const boardID = req.params.boardID; // 요청의 경로 매개변수에서 게시글 ID 가져오기

    Board.findById(boardID, (err, board) => {
        if (err) {
            console.error('Error fetching board:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (!board) {
            res.status(404).json({ error: 'Board not found' });
        } else {
            res.json(board);
        }
    });
};

// 게시글 수정
exports.getBoardInfo = (req, res) => {
    const boardID = req.query.boardID;

    BoardModel.getPostByID(boardID, (err, post) => {
        if (err) {
            return res.status(500).json({ success: false, message: "An error occurred" });
        }

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // 여기서 post 객체의 속성들을 가져와서 필요한 데이터를 클라이언트로 응답합니다.
        const responseData = {
            title: post.title,
            author: post.name, // 작성자명이 저장된 속성을 사용합니다.
            content: post.text, // 게시글 내용이 저장된 속성을 사용합니다.
            selectboard: post.selectboard
        };

        res.json({ success: true, post: responseData });
    });
};

exports.updatePost = (req, res) => {
    const boardID = req.body.boardID;
    const updatedPost = {
        title: req.body.title,
        text: req.body.text,  // Make sure 'text' property is provided in the request
        name: req.body.name,
        password: req.body.password,
        selectboard: req.body.selectboard
    };

    // Check if 'text' property is provided and not null
    if (updatedPost.text === null || updatedPost.text === undefined) {
        return res.status(400).json({ success: false, message: "'text' is required" });
    }

    // Fetch the original post data to compare the password
    BoardModel.getPostByID(boardID, (err, originalPost) => {
        if (err) {
            console.error("Error fetching original post data:", err);
            return res.status(500).json({ success: false, message: "An error occurred" });
        }

        // If the provided password matches the original post's password,
        // proceed with the update; otherwise, show an alert
        if (updatedPost.password === originalPost.password) {
            BoardModel.updatePost(boardID, updatedPost, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "An error occurred" });
                }
                res.json({ success: true, message: "Post updated successfully" });
            });
        } else {
            // 비밀번호가 틀릴 경우에 클라이언트 측에서 알림을 보여줌
            res.json({ success: false, message: "Invalid password" });
        }
    });
};

exports.getPostsPerPage = (req, res) => {
    const page = req.query.page;
    const itemsPerPage = req.query.itemsPerPage;
    const selectboard = req.query.selectboard;

    BoardModel.getPostsByPage(page, itemsPerPage, selectboard, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "An error occurred" });
        }

        res.json({ success: true, data });
    });
};

// 메인 NOTICE
exports.getRecentPosts = (req, res) => {
    const selectboard = 'NOTICE'; // 필터링할 게시판
    User.getRecentPosts(selectboard, (err, posts) => {
        if (err) {
            console.error('Error getting recent posts:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(posts);
    });
};

// 검색기능
exports.searchPosts = (req, res) => {
    const searchTerm = req.query.searchTerm; // 검색어 가져오기
    
    // 검색어를 이용하여 게시글을 찾는 로직
    Board.searchPosts(searchTerm, (err, searchResults) => {
        if (err) {
            console.error('Error searching posts:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json(searchResults);
    });
};
