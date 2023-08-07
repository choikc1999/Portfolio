const mysql = require("mysql");

// sql 연결문
const cnn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'choikc0901!',
    database: 'portfolio',
    port: 3306,
});

// 아이디 중복 확인
exports.checkDuplicateId = (id, cb) => {
    let sql = `SELECT id FROM user WHERE id = '${id}' LIMIT 1;`;

    cnn.query(sql, function(err, rows){
        if(err){
            console.error("Error executing MySQL query", err);
            return cb(err);
        }
        cb(null, rows.length > 0);
    });
};

// 회원가입 정복 입력
exports.insert = (data, cb) => {
    exports.checkDuplicateId(data.id, function (err, isDuplicate){
        if(err){
            cb(err);
        }else if(isDuplicate){
            cb("Duplicate ID");
        }else{
            var sql = `INSERT INTO user VALUES ('${data.id}', '${data.name}', '${data.email}', '${data.phoneNumber}','${data.password}';)`;

            cnn.query(sql, (err, rows) => {
                if(err){
                    console.error("Error executing MySQL query", err);
                    return cb(err);
                }
                cb(null, {id: data.id});
            });
        }
    }); 
}

// throw = 사용자가 정의한 '예외'를 발생시킬 수 있다, '예외'가 발생하면 함수가 중지되고 catch문으로 전달된다. catch문이 없다면 프로그램이 종료된다.
// 우리가 정해놓은 규칙에 벗어난 결괏값이 나올 경우 예외로 지정하고 에러를 발생시킬 수  있다.
// err = error객체를 뒤에 붙여 사용한 이유는 콜 스택정보가 같이 출력되어 어디서 에러가 발생했는지에 대한 정보를 받기위해서다.

// 로그인 정보 읽기
exports.select = (id, password, cb) => {
    var sql = `SELECT * FROM user WHERE id = '${id}'limit 1`;

    cnn.query(sql, (err, rows) => {
        if(err) throw err;
        cb(rows[0]);
    });
}

// 회원정보
exports.get_user = (id, cb) => {
    let sql = `SELECT * FROM user WHERE id = '${id}' limit 1`;

    cnn.query(sql, function(err, rows){
        if (err) throw err;
        cb(rows);
    });
}

// 회원 정보 수정
exports.update = (data, cb) => {
    var sql = `UPDATE user SET name = '${data.name}', email = '${data.email}', phoneNumber = '${data.phoneNumber}', password = '${data.password}' WHERE id = '${data.id}';`;
    
    cnn.query(sql, (err, rows) => {
        if(err) throw err;
        cb(rows);
    });
}

// 회원탈퇴
exports.delete = (id, cb) => {
    var sql = `DELETE FROM user WHERE id = '${id}';`;

    cnn.query(sql, (err, rows) => {
        if(err) throw err;
        cb(rows);
    });
}