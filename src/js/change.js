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

    // Enter event 잠금기능
    $("#editform").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

    // 아이디 중복 체크 함수
    function checkDuplicateId(id, callback) {
        if (id) {
            $.ajax({
                url: "/user/check_duplicate_id",
                method: "POST",
                data: { id: id },
                success: function(response) {
                    callback(response.isDuplicate);
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    }

    // 아이디 입력란 변경 이벤트
    $('#newId').on('input', function(event) {
        const newId = $(this).val();
        validateAndCheckId(newId);
    });
    
    // 아이디 유효성 검사 함수
    function validateId(id) {
        const idError = $('#idError');
        const idRegex = /^[a-z0-9]{6,10}$/;

        if (!idRegex.test(id)) {
            idError.text('아이디는 6자에서 10자의 영문 소문자와 숫자만 가능합니다.');
        } else {
            idError.text('');
        }
    }

    // 유효성 검사 및 아이디 중복 체크
    function validateAndCheckId(newId) {
        validateId(newId);
        
        if ($('#idError').text() === '') {
            checkDuplicateId(newId, function(isDuplicate) {
                if (isDuplicate) {
                    $('#idError').text('이미 사용 중인 아이디입니다.');
                } else {
                    $('#idError').text('');
                }
            });
        }
    }

    // 정보 수정 폼 유효성 검사
    $('#editform').on('input', function(event) {
        const inputId = event.target.id;
        const inputValue = event.target.value;

        switch (inputId) {
            case 'newId':
                validateId(inputValue);
                break;
            case 'newPassword':
                validatePassword(inputValue);
                break;
            case 'newEmail':
                validateEmail(inputValue);
                break;
            case 'newPhoneNumber':
                validatePhoneNumber(inputValue);
                break;
            default:
                break;
        }
    });

    // 아이디 입력란 변경 이벤트
    $('#newId').on('input', function(event) {
        const newId = $(this).val();
        validateAndCheckId(newId);
    });


    function validatePassword(password) {
        const passwordError = $('#passwordError');
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#\$%\^&\*])[a-zA-Z\d@!#\$%\^&\*]{10,20}$/;

        if (!passwordRegex.test(password)) {
            passwordError.text('비밀번호는 10자에서 20자의 영문 대소문자, 숫자, 특수문자 조합이어야 합니다.');
        } else {
            passwordError.text('');
        }
    }

    function validateEmail(email) {
        const emailError = $('#emailError');
        const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;

        if (!emailRegex.test(email)) {
            emailError.text('이메일 형식이 올바르지 않습니다.');
        } else {
            emailError.text('');
        }
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneNumberError = $('#phoneNumberError');
        const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;

        if (!phoneNumberRegex.test(phoneNumber)) {
            phoneNumberError.text('전화번호는 숫자만 입력 가능합니다.');
        } else {
            phoneNumberError.text('');
        }
    }

    // 유효성 검사 함수
    function validateFormData(newId, newEmail, newPhoneNumber, newPassword) {
        validateId(newId);
        validateEmail(newEmail);
        validatePhoneNumber(newPhoneNumber);

        if (newPassword) {
            validatePassword(newPassword);
        }

        // 유효성 검사 실패 시
        if ($('#idError').text() || $('#emailError').text() || $('#phoneNumberError').text() || $('#passwordError').text()) {
            return false;
        }

        return true;
    }
    

    // AJAX 요청
    $('#editform').submit(function(event) {
        event.preventDefault();

        const newId = $('#newId').val();
        const newEmail = $('#newEmail').val();
        const newPhoneNumber = $('#newPhoneNumber').val();
        const newPassword = $('#newPassword').val();

        // 아이디 중복 체크를 위한 변수
        let isIdValid = false;

        // 유효성 검사 추가
        if (!validateFormData(newId, newEmail, newPhoneNumber, newPassword)) {
            return;
        }

        // 아이디 중복 체크
        checkDuplicateId(newId, function(isDuplicate) {
            if (isDuplicate) {
                $('#idError').text('이미 사용 중인 아이디입니다.');
            } else {
                $('#idError').text('');
                isIdValid = true;
            }

            // 모든 조건 충족 시 서버로 요청 보냄
            if (isIdValid) {
                $.ajax({
                    url: '/edit-profile',
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
                        } else if (response.success) {
                            // 정보 수정 성공 시 서버에서 받은 메시지 표시
                            alert(response.message);  // 수정 완료 메시지
                            window.location.href = '/login';
                        } else {
                            alert('회원 정보 업데이트 실패');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', error);
                        alert('서버와 통신 중 오류가 발생했습니다.');
                    }
                });
            }
        });
    });

    // 전화번호에 하이폰 자동입력
    $("#newPhoneNumber").on("input", function(){
        const phoneNumber = $("#newPhoneNumber")
        .val()
        .replace(/(\d{3})(\d{4,4})\d{0,4}/, "$1-$2-");

        $("#newPhoneNumber").val(phoneNumber);
    });

    // 이메일 드롭다운메뉴
    $("#newEmail").on("input", function () {
        const emailValue = $(this).val();
        const atIndex = emailValue.indexOf("@");
        if (atIndex !== -1) {
            const domain = emailValue.slice(atIndex + 1);
            const domains = ["naver.com", "kakao.com", "google.com"];
            const matchedDomains = domains.filter((d) => d.startsWith(domain));
            if (matchedDomains.length > 0) {
                showEmailDropdown(matchedDomains);
            } else {
                hideEmailDropdown();
            }
        } else {
            hideEmailDropdown();
        }
    });

    // 추가: 이메일 입력란을 벗어날 때 도메인 자동완성 메뉴 숨기기
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#emailDropdown").length && !$(e.target).is("#newEmail")) {
            hideEmailDropdown();
        }
    });

    // 이메일 드롭다운메뉴
    function showEmailDropdown(matchedDomains) {
        const dropdown = $("#emailDropdown");
        dropdown.empty();

        // 매칭된 도메인들을 드롭다운 메뉴 아이템으로 생성
        for (const domain of matchedDomains) {
            const item = $("<div>").addClass("dropdown-item").attr("tabindex", "0").text(domain);

            // 각 메뉴 아이템 클릭 시 도메인을 이메일에 적용하고 드롭다운 숨김
            item.on("click", function () {
                const emailValue = $("#newEmail").val();
                const atIndex = emailValue.indexOf("@");
                if (atIndex !== -1) {
                    const username = emailValue.slice(0, atIndex);
                    $("#newEmail").val(username + "@" + domain);
                } else {
                    $("#newEmail").val(domain);
                }
                hideEmailDropdown();
            });

            dropdown.append(item);
        }
        dropdown.show();
    }

    function hideEmailDropdown() {
        $("#emailDropdown").empty().hide();
    }

    // 기타 css 변경 코드
    $(".changeInputID, .changeInputPw, .changeInputName, .changeInputEmail, .changeInputPN").on('focus', function (e) {
        $(".changeInput").css("background", "#ffcc00");
        $(this).css("background", "#f19839");
    });

    $(".changeInput").css("transition", "background-color 0.2s");

    $(".userName").click(function (e) {
        alert("이름은 변경할 수 없습니다.");
    });

    $("#deleteAccountBtn").click(function () {
        if (confirm("정말로 회원 탈퇴하시겠습니까?")) {
            // 서버에 회원 탈퇴 요청 전송
            $.ajax({
                url: "/delete-account",
                method: "POST",
                success: function (response) {
                    if (response.success) {
                        alert("회원 탈퇴가 성공적으로 처리되었습니다.");
                        window.location.href = '/login'; // 로그인 페이지로 리다이렉션
                    } else {
                        alert("회원 탈퇴에 실패하였습니다. 다시 시도해주세요.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', error);
                    alert('서버와 통신 중 오류가 발생했습니다.');
                }
            });
        }
    });
});
