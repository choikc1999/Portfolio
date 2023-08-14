$(document).ready(function(event){
    // 정보 수정 폼 유효성 검사
    $('#changeForm').submit(function(event) {
        event.preventDefault();

        const newId = $('#newId').val();
        const newEmail = $('#newEmail').val();
        const newPhoneNumber = $('#newPhoneNumber').val();
        const newPassword = $('#newPassword').val();

        if (!idRegex.test(newId)) {
            alert('아이디는 영문 소문자와 숫자 조합으로 6~10자리로 입력해주세요.');
            return;
        }

        if (!emailRegex.test(newEmail)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }

        if (!phoneNumberRegex.test(newPhoneNumber)) {
            alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
            return;
        }

        if (newPassword && !passwordRegex.test(newPassword)) {
            alert('올바른 비밀번호 형식을 입력해주세요.');
            return;
        }

        // AJAX 요청
        $.ajax({
            url: '/edit-Profile',
            method: 'POST',
            data: {
                newId: newId,
                newEmail: newEmail,
                newPhoneNumber: newPhoneNumber,
                newPassword: newPassword
            },
            success: function(response) {
                if (response.error) {
                    alert('오류가 발생했습니다: ' + response.error);
                } else {
                    if (response.success) {
                        alert(response.message);
                        window.location.href = '/login';
                    } else {
                        alert('회원 정보 업데이트 실패');
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        });
    });
        


// function showSuccessPopupAndRedirect(message, redirectTo) {
//     alert(message);
//     window.location.href = redirectTo;
// };

// css

    $(".changeInputID").click(function (e) {
        $(".changeInput").css("background", "#0b9882");``
        $(".changeInputID").css("background", "#076355");
    });
    $(".changeInputPw").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputPw").css("background", "#076355");
    });
    $(".changeInputName").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputName").css("background", "#076355");
    });
    $(".changeInputEmail").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputEmail").css("background", "#076355");
    });
    $(".changeInputPN").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputPN").css("background", "#076355");
    });

    $(".changeInput").css("transition", "background-color 0.2s");
});