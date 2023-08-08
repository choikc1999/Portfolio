function loginUser() {
    var form = $("#login"); // 로그인 폼 가져오기

    // 서버로 로그인 요청 보내기
    $.ajax({
        method: 'POST',
        url: 'http://localhost:4080/login',
        data: {
            id: form.find("#id").val(),
            password: form.find("#password").val()
        },
        success: function(response) {
            console.log("Response data:", response);

            if (!response.flag) {
                // 메시지 띄우기
                alert("로그인 실패");
            } else {
                alert("로그인 성공");
            }
        },
        error: function(error) {
            console.error("Error:", error);
        }
    });
}
