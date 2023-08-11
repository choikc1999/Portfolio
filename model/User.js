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

// 아이디 중복 확인
exports.checkDuplicateId = (id, cb) => {
    const sql = `SELECT id FROM user WHERE id = '${id}' LIMIT 1;`;

    connection.query(sql, (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for checking duplicate ID", err);
            return cb(err);
        }
        cb(null, rows.length > 0);
    });
};

// 회원가입 정보 저장
exports.insert = (data, cb) => {
    exports.checkDuplicateId(data.id, (err, isDuplicate) => {
        if (err) {
            cb(err);
        } else if (isDuplicate) {
            cb("Duplicate ID");
        } else {
            const sql = `INSERT INTO user (id, name, email, phoneNumber, password) VALUES ('${data.id}', '${data.name}', '${data.email}', '${data.phoneNumber}', '${data.password}');`;

            connection.query(sql, (err, result) => {
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
exports.update = (id, newData, cb) => {
    const { name, email, phoneNumber, password } = newData;

    if (password) {
        // 비밀번호 암호화
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password', err);
                return cb(err);
            }

            console.log('Hashed password:', hashedPassword); // 추가

            const sql = `UPDATE user
                         SET name = '${name}', email = '${email}', phoneNumber = '${phoneNumber}', password = '${hashedPassword}'
                         WHERE id = '${id}';`;

            connection.query(sql, (err, result) => {
                if (err) {
                    console.error("Error executing MySQL query for updating user data", err);
                    return cb(err);
                }
                cb(null, result);
            });
        });
    } else {
        const sql = `UPDATE user
                     SET name = '${name}', email = '${email}', phoneNumber = '${phoneNumber}'
                     WHERE id = '${id}';`;

        connection.query(sql, (err, result) => {
            if (err) {
                console.error("Error executing MySQL query for updating user data", err);
                return cb(err);
            }
            cb(null, result);
        });
    }
};

// 로그인 정보 읽기
exports.select = (id, password, cb) => {
    const sql = `SELECT * FROM user WHERE id = '${id}' LIMIT 1;`;

    connection.query(sql, (err, rows) => {
        if (err) {
            console.error("Error executing MySQL query for selecting user data", err);
            throw err;  // 에러를 던지고 예외 처리를 상위로 위임
        }
        cb(rows[0]);  // 결과를 콜백으로 전달
    });
};


// throw = 사용자가 정의한 '예외'를 발생시킬 수 있다, '예외'가 발생하면 함수가 중지되고 catch문으로 전달된다. catch문이 없다면 프로그램이 종료된다.
// 우리가 정해놓은 규칙에 벗어난 결괏값이 나올 경우 예외로 지정하고 에러를 발생시킬 수  있다.
// err = error객체를 뒤에 붙여 사용한 이유는 콜 스택정보가 같이 출력되어 어디서 에러가 발생했는지에 대한 정보를 받기위해서다.
