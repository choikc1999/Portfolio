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
                    hideEmailDropdown();
                }
            });
    
            dropdown.append(item);
        }
        dropdown.show();
    
        // 키보드 이벤트 리스너 추가
        dropdown.off("keydown").on("keydown", function (e) {
            const items = $(this).find(".dropdown-item");
            const activeItem = $(this).find(".active");
    
            if (e.key === "ArrowDown" || e.key === "Tab") {
                e.preventDefault();
                if (activeItem.length) {
                    const nextItem = activeItem.next();
                    if (nextItem.length) {
                        activeItem.removeClass("active");
                        nextItem.addClass("active");
                    }
                } else {
                    items.first().addClass("active");
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (activeItem.length) {
                    const prevItem = activeItem.prev();
                    if (prevItem.length) {
                        activeItem.removeClass("active");
                        prevItem.addClass("active");
                    }
                } else {
                    items.last().addClass("active");
                }
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (activeItem.length) {
                    const emailValue = $("#newEmail").val();
                    const atIndex = emailValue.indexOf("@");
                    if (atIndex !== -1) {
                        const username = emailValue.slice(0, atIndex);
                        $("#newEmail").val(username + "@" + activeItem.text());
                        hideEmailDropdown();
                    }
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                hideEmailDropdown();
            }
            e.stopPropagation();
        });
    }
    

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
