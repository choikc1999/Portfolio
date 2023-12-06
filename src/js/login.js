function showError(elementId, errorMessage, isError) {
    var errorElement = $("#" + elementId);

    if (isError) {
        errorElement.html(errorMessage).show();
    } else {
        errorElement.hide();
    }
}

function loginUser() {
    var form = $("#login"); // 로그인 폼 가져오기

    // 서버로 로그인 요청 보내기
    $.ajax({
        method: 'POST',
        url: '/login',
        data: {
            id: form.find("#id").val(),
            password: form.find("#password").val()
        },
        success: function(response) {
            console.log("Response data:", response);

            if (!response.flag) {
                if (response.result) {
                    // 비밀번호가 틀렸을 경우
                    showError("errorElement", "비밀번호를 확인해주세요.", true);
                } else {
                    // 아이디가 틀렸을 경우
                    showError("errorElement", "아이디를 확인해주세요.", true);
                }
            } else {
                // 로그인 성공 페이지이동
                window.location.href = "/main";
            }
        },
        error: function(error) {
            console.error("Error:", error);
        }
    });
}