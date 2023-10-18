const mysql = require("mysql");
const bcrypt = require('bcrypt');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'choikc0901!',
    database: 'portfolio',
    port: 3306,
});

const User = {};

// 아이디 중복 확인
User.checkDuplicateId = (id, cb) => {
    const sql = `SELECT id FROM user WHERE id = ? LIMIT 1;`;

    connection.query(sql, [id], (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for checking duplicate ID", err);
            return cb(err);
        }
        cb(null, rows.length > 0);
    });
};

// 회원가입 정보 저장
User.insert = (data, cb) => {
    User.checkDuplicateId(data.id, (err, isDuplicate) => {
        if (err) {
            cb(err);
        } else if (isDuplicate) {
            cb("Duplicate ID");
        } else {
            const sql = `INSERT INTO user (id, name, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?);`;
            const values = [data.id, data.name, data.email, data.phoneNumber, data.password];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Error executing MySQL query for inserting user data", err);
                    return cb(err);
                }
                cb(null, { id: data.id });
            });
        }
    });
};

// 회원정보수정
User.update = (id, userData, callback) => {
    const query = `
        UPDATE user
        SET id = ?, email = ?, phoneNumber = ?, password = ?
        WHERE id = ?
    `;
    const values = [userData.id, userData.email, userData.phoneNumber, userData.password, id];
    
    // 데이터베이스 업데이트 쿼리 실행
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return callback(err, null);
        }
        // 성공적으로 업데이트되었을 때 콜백 실행
        callback(null, result);
    });
};

// 회원정보수정페이지 닉네임표시
User.selectName = (id, callback) => {
    const sql = `SELECT name FROM user WHERE id = ?`;

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error selecting user name:", err);
            return callback(null);
        }
        
        if (result.length > 0) {
            const userName = result[0].name;
            callback(userName);
        } else {
            callback(null);
        }
    });
};

// 로그인 정보 읽기
User.select = (id, password, cb) => {
    const sql = `SELECT * FROM user WHERE id = ? LIMIT 1;`;

    connection.query(sql, [id], (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for selecting user data", err);
            throw err;  // 예외 처리
        }
        cb(rows[0]);  // 결과를 콜백으로 전달
    });
};

// 회원탈퇴
User.delete = (id, callback) => {
    const query = `
        DELETE FROM user
        WHERE id = ?
    `;
    const values = [id];

    // 데이터베이스 쿼리 실행
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return callback(err, null);
        }
        // 성공적으로 삭제되었을 때 콜백 실행
        callback(null, result);
    });
};

// 게시글 닉네임불러오는 문
User.getUserNameByUsername = (username, callback) => {
    const selectQuery = `SELECT name FROM user WHERE name = ?`;
    connection.query(selectQuery, [username], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            const name = results.length > 0 ? results[0].name : 'Unknown User';
            callback(null, name);
        }
    });
};

// 메인 NOTICE
User.getRecentPosts = (selectboard, callback) => {
    const sql = 'SELECT * FROM board WHERE selectboard = ? ORDER BY modify_date DESC LIMIT 6';
    connection.query(sql, [selectboard], (err, rows) => {
        if (err) {
            console.error('Error executing MySQL query for getting recent posts', err);
            return callback(err, null);
        }
        callback(null, rows);
    });
};

const BoardModel = {};

BoardModel.createPost = (title, text, name, password, selectboard, callback) => {
    const sql = `
        INSERT INTO board (title, text, name, password, selectboard)
        VALUES (?, ?, ?, ?, ?);
    `;
    const values = [title, text, name, password, selectboard];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error executing MySQL query for creating a post:", err);
            return callback(err);
        }
        callback(null, result.insertId); // 삽입된 게시글의 ID 반환
    });
};

BoardModel.getPosts = (callback) => {
    const sql = `SELECT * FROM board ORDER BY modify_date DESC`;

    connection.query(sql, (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for getting posts", err);
            return callback(err, null);
        }
        callback(null, rows);
    });
};

BoardModel.getPostsByPage = (page, itemsPerPage, selectboard, callback) => {
    const startIndex = (page - 1) * itemsPerPage;
    let sql = `
        SELECT * FROM board 
        ORDER BY modify_date DESC 
        LIMIT ?, ?;
    `;
    let values = [startIndex, itemsPerPage];

    if (selectboard) {
        // 필터링 값을 사용하여 SQL 쿼리 수정
        sql = `
            SELECT * FROM board
            WHERE selectboard = ?
            ORDER BY modify_date DESC
            LIMIT ?, ?;
        `;
        values = [selectboard, startIndex, itemsPerPage];
    }

    connection.query(sql, values, (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for getting posts by page", err);
            return callback(err, null);
        }

        let sqlTotal = `SELECT COUNT(*) AS total FROM board;`;

        if (selectboard) {
            // 필터링 값을 사용하여 총 게시글 수 쿼리 수정
            sqlTotal = `SELECT COUNT(*) AS total FROM board WHERE selectboard = ?;`;
        }

        connection.query(sqlTotal, [selectboard], (err, result) => {
            if (err) {
                console.error("Error executing MySQL query for getting total post count", err);
                return callback(err, null);
            }

            const totalPosts = result[0].total;
            callback(null, { posts: rows, totalPosts });
        });
    });
};
// 게시글수정
BoardModel.updatePost = (boardID, updatedPost, callback) => {
    const sql = `
        UPDATE board 
        SET title = ?, text = ?, name = ?, password = ?, selectboard = ? 
        WHERE board_ID = ?
    `;

    const { title, text, name, password, selectboard } = updatedPost;

    // Ensure that the 'text' property has a valid value
    if (text === null || text === undefined) {
        return callback(new Error("Invalid 'text' value"), null);
    }

    // Fetch the original post data to compare the password
    BoardModel.getPostByID(boardID, (err, originalPost) => {
        if (err) {
            console.error("Error fetching original post data:", err);
            return callback(err, null);
        }

        // If the provided password matches the original post's password,
        // proceed with the update; otherwise, return an error
        if (password === originalPost.password) {
            connection.query(sql, [title, text, name, password, selectboard, boardID], (err, result) => {
                if (err) {
                    console.error("Error executing MySQL query for updating post", err);
                    return callback(err, null);
                }
                callback(null, result);
            });
        } else {
            return callback(new Error("Invalid password"), null);
        }
    });
};

BoardModel.getPostByID = (boardID, callback) => {
    const sql = `SELECT * FROM board WHERE board_ID = ?`;

    connection.query(sql, [boardID], (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for getting post by ID", err);
            return callback(err, null);
        }

        if (rows.length === 0) {
            return callback(null, null); // 해당 ID에 해당하는 게시글이 없을 경우 null 반환
        }

        const post = rows[0];
        callback(null, post);
    });
};

// 게시글 삭제
BoardModel.deletePost = (boardID, callback) => {
    const sql = `DELETE FROM board WHERE board_ID = ?`;
    
    connection.query(sql, [boardID], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query for deleting a post:", err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0); // 삭제된 행이 있을 경우 true 반환
    });
};

const ReplyModel = {};

// 댓글 저장
ReplyModel.saveReply = (boardID, nickname, reply, callback) => {
    const sql = `INSERT INTO reply (board_ID, nickname, reply) VALUES (?, ?, ?)`;
    const values = [boardID, nickname, reply];

    connection.query(sql, values, (error, result) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

// 해당 게시글의 모든 댓글 가져오기view
ReplyModel.getRepliesByBoardID = (boardID, callback) => {
    const sql = `SELECT * FROM reply WHERE board_ID = ?`;
    const values = [boardID];

    connection.query(sql, values, (error, replies) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, replies);
    });
};

// 게시글조회수
const Board = {};

const lockedBoards = new Set(); // 이미 잠긴 게시글 ID를 저장하는 Set 객체

Board.updateViewCount = (boardID, callback) => {
    // 이미 잠긴 게시글인지 확인
    if (lockedBoards.has(boardID)) {
        callback(new Error('View count update already in progress'));
        return;
    }

    const updateViewCountQuery = 'UPDATE board SET views = views + 1 WHERE board_ID = ?';

    // 수정: 쿼리 실행 전에 잠금 상태 설정
    lockedBoards.add(boardID);

    connection.query(updateViewCountQuery, [boardID], (err, result) => {
        // 업데이트 완료 후 잠금 해제
        lockedBoards.delete(boardID);

        if (err) {
            console.error('Error updating view count:', err);
            // 에러 발생 시 콜백 함수에 에러 전달
            if (typeof callback === 'function') {
                callback(err);
            }
        } else {
            if (result.affectedRows === 1) {
                // 업데이트 성공 시 업데이트된 조회수 값을 가져와서 콜백 함수에 전달
                connection.query('SELECT views FROM board WHERE board_ID = ?', [boardID], (selectErr, selectResult) => {
                    if (selectErr) {
                        console.error('Error fetching updated view count:', selectErr);
                        // 에러 발생 시 콜백 함수에 에러 전달
                        if (typeof callback === 'function') {
                            callback(selectErr);
                        }
                    } else {
                        // 업데이트 성공 및 업데이트된 조회수 값을 콜백 함수에 전달
                        if (typeof callback === 'function') {
                            callback(null, selectResult[0].views);
                        }
                    }
                });
            } else {
                // 업데이트 실패 시 콜백 함수에 에러 전달
                if (typeof callback === 'function') {
                    callback(new Error('Failed to update view count'));
                }
            }
        }
    });
};

Board.findById = (boardID, callback) => {
    // console.log("Fetching board by ID:", boardID);

    const selectBoardQuery = 'SELECT * FROM board WHERE board_ID = ?';

    connection.query(selectBoardQuery, [boardID], (err, results) => {
        if (err) {
            console.error("Error fetching board:", err);
            if (typeof callback === 'function') {
                callback(err, null);
            }
        } else {
            const board = results[0];
            if (!board) {
                if (typeof callback === 'function') {
                    callback(new Error('Board not found'), null);
                }
            } else {
                // console.log("Board fetched:", board);
                if (typeof callback === 'function') {
                    callback(null, board);
                }
            }
        }
    });
};

Board.searchPosts = (searchTerm, callback) => {
    const sql = `
        SELECT board.board_ID, board.title, board.text
        FROM board
        WHERE board.title LIKE ? OR board.text LIKE ?
        ORDER BY board.modify_date DESC;
    `;
    const searchPattern = `%${searchTerm}%`;
    const values = [searchPattern, searchPattern];

    connection.query(sql, values, (err, searchResults) => {
        if (err) {
            console.error('Error executing MySQL query for searching posts', err);
            return callback(err, null);
        }
        
        callback(null, searchResults);
    });
};


const Image = {};

Image.create = (filename, path, callback) => {
    const sql = 'INSERT INTO images (filename, path) VALUES (?, ?)';
    connection.query(sql, [filename, path], (err, result) => {
    if (err) {
        return callback(err, null);
    }
    return callback(null, result.insertId);
    });
}; 

Image.findById = (id, callback) => {
    const sql = 'SELECT * FROM images WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
    if (err) {
        return callback(err, null);
    }
  
    if (results.length === 0) {
        return callback('이미지를 찾을 수 없습니다.', null);
    }

        const image = results[0];
        return callback(null, image);
    });
};

module.exports = {
    User: User,
    BoardModel: BoardModel,
    ReplyModel: ReplyModel,
    Board: Board,
    Image: Image
};