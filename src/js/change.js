$(document).ready(function() {
    // 사용자 정보 가져오는 AJAX 요청
    $.ajax({
        url: "/get-user-info",
        method: "GET",
        success: function(response) {
            $(".userName").text(response.name); // 이름을 <span> 요소에 표시
            $("input[name='newName']").val(response.name); // 입력 필드에 기본값으로 설정
        },
        error: function() {
            $(".userName").text("Unknown");
        }
    });

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
                        // 정보 수정 성공 시 서버에서 받은 이름 표시
                        $.ajax({
                            url: "/get-user-info",
                            method: "GET",
                            success: function(nameResponse) {
                                $("input[name='newName']").val(nameResponse.name);
                                alert(response.message);  // 수정 완료 메시지
                                window.location.href = '/login';
                            },
                            error: function() {
                                $(".userName").text("Unknown");
                                alert('서버에서 이름을 가져오지 못했습니다.');
                            }
                        });
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

    // 기타 css 변경 코드
    $(".changeInputID, .changeInputPw, .changeInputName, .changeInputEmail, .changeInputPN").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(this).css("background", "#076355");
    });
    
    $(".changeInput").css("transition", "background-color 0.2s");
    

    $(".userName").click(function (e) {
        alert("이름은 변경할 수 없습니다.");
    });
});
