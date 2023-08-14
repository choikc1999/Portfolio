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
        SET email = ?, phoneNumber = ?, password = ?
        WHERE id = ?
    `;
    const values = [userData.email, userData.phoneNumber, userData.password, id];
    
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

module.exports = User;
