$("#id").on("focusout", function (){
    // 아이디 유효성 검사
    const id = $(this).val();
    const idRegex = /^[a-z0-9]{6,10}$/;
    if (id && !id.match(idRegex)) {
        showError("idError", "아이디는 6자에서 10자의 영문 소문자와 숫자만 가능합니다.");
    } else {
        showError("idError", "", false);

        if (id) {
            $.ajax({ // 아이디중복검사
                url: "/user/check_duplicate_id",
                method: "POST",
                data: { id: id },
                success: function (data) {
                    if (data.isDuplicate) {
                        showError("idError", "이미 사용 중인 아이디입니다", true);
                    } else {
                        showError("idError","",false);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error("Error checking duplicate ID", errorThrown);
                    showError("idError", "서버 오류가 발생했습니다.", true);
                },
            });
        }
    }
});

    // 비밀번호 유효성 검사
    $("#password").on("focusout", function(){
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#\$%\^&\*])[a-zA-Z\d@!#\$%\^&\*]{10,20}$/;
        if (!password.match(passwordRegex)) {
            showError("passwordError", "비밀번호는 10자에서 20자의 영문 대소문자, 숫자, 특수문자 조합이어야 합니다.");
        } else {
            showError("passwordError", "", false);
        }
    });

    // 이름 유효성 검사
    $("#name").on("focusout", function () {
        const name = $(this).val();
        const nameRegex = /^[a-zA-Z가-힣]{2,6}$/;
        if (!name.match(nameRegex)) {
            showError("nameError", "이름은 2자에서 6자의 한글 또는 영문(대,소문자)만 가능합니다.");
        } else {
            showError("nameError", "", false);
        }
    });

    // 이메일 유효성 검사
    $("#email").on("focusout", function (){
        const email = $(this).val();
        const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;
        if (!email.match(emailRegex)) {
            showError("emailError", "이메일 형식이 올바르지 않습니다.");
        } else {
            showError("emailError", "", false);
        }
    });

    // 휴대폰 유효성 검사
    $("#phoneNumber").on("focusout", function (){
        const phoneNumber = $(this).val();
        const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
        if (!phoneNumber.match(phoneNumberRegex)) {
            showError("phoneNumberError", "전화번호는 숫자만 입력 가능합니다.");
        } else {
            showError("phoneNumber", "", false);
        }
    });

    $("#id, #password, #name, #email, #phoneNumber").on("input", function(){
        // const id = $("#id").val(); // 여기서 val()은 인풋의 입력값
        // const password = $("#password").val();
        // const name = $("#name").val();
        // const email = $("#email").val();
        // const phoneNumber = $("#phoneNumber").val();

    //오류메시지 초기화
    $(".error").text("");

    // Enter evenet 잠금기능
    $("#registrationForm").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });
    }); // 유효성 검사 종료

// 전화번호에 하이폰 자동입력
$("#phoneNumber").on("input", function(){
    const phoneNumber = $("#phoneNumber")
    .val()
    .replace(/(\d{3})(\d{4,4})\d{0,4}/, "$1-$2-");
    
    $("#phoneNumber").val(phoneNumber);
});

// 이메일 드롭 다운메뉴
function getEmailDomain(email) {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
        return email.slice(atIndex + 1);
    }
    return "";
}
$("#email").on("input", function () {
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

function showError(elementId, errorMessage, isError) {
    // const errorDiv = $("#" + elementId);
    // errorDiv.text(errorMessage);

    // if (isError) {
    //     errorDiv.addClass("error-message");
    // } else {
    //     errorDiv.removeClass("error-message");
    // }
    $("#" + elementId).text(errorMessage);
}

function showEmailDropdown(matchedDomains) {
    const dropdown = $("#emailDropdown");
    dropdown.empty();
    for (const domain of matchedDomains) {
        const item = $("<div>").addClass("dropdown-item").attr("tabindex", "0").text(domain);
        item.on("click", function () {
            const emailValue = $("#email").val();
            const atIndex = emailValue.indexOf("@");
            if (atIndex !== -1) {
                const username = emailValue.slice(0, atIndex);
                $("#email").val(username + "@" + domain);
                hideEmailDropdown();
            }
        });
        dropdown.append(item);
    }
    dropdown.show();

    // 키보드 이벤트 리스너 추가
    // 크롬자동완성과 겹쳐서 미작동
    dorpdown.off("keydown").on("keydown", function(e){
        const items = $(this).find(".active");
        const activeItem = $(this).find(".active");
        if (e.key === "ArrowDown" || e.key === "Tab"){
            e.preventDefault();
            if (activeItem.length){
                const nextItem = activeItem.next();
                if(nextItem.length){
                    activeItem.removeClass("active");
                    nextItem.addClass("active");
                }
            }else {
                items.first().addClass("active");
            }
        }else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeItem.length) {
                const prevItem = activeItem.prev();
                if(prevItem.length) {
                    activeItem.removeClass("active");
                    prevItem.addClass("active");
                }
            }else {
                items.last().addClass("active");
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeItem.length) {
                const emailValue = $("#email").val();
                const atIndex = emailValue.indexOf("@");
                if (atIndex !== -1) {
                    const username = emailValue.slice(0, atIndex);
                    $("#email").val(username + "@" + activeItem.text());
                    hideEmailDropdown();
                }
            }
        }else if (e.key === "Escape") {
            e.preventDefault();
            hideEmailDropdown();
        }
        e.stopPropagation();
    });
}

function hideEmailDropdown() {
    $("#emailDropdown").empty().hide();
}

$("#registrationForm").submit(function(e){
    e.preventDefault(); // event.preventDefault = a태그나 submit태그 클릭시 창이 리프레시되는 현상을 막기 위해 사용

    const id = $("#id").val(); // 여기서 val()은 인풋의 입력값
    const password = $("#password").val();
    const name = $("#name").val();
    const email = $("#email").val();
    const phoneNumber = $("#phoneNumber").val();
    const emailDomain = getEmailDomain(email);

    // 유효성 검사 (정규식)
    const idRegex = /^[a-z0-9]{6,10}$/; //아이디
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#\$%\^&\*])[a-zA-Z\d@!#\$%\^&\*]{10,20}$/; //비밀번호
    const nameRegex = /^[a-zA-Z가-힣]{2,6}$/; //이름
    const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/; //이메일
    const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/; //전화번호

    // match = 조건값과 입력값이 동일한지 확인 후 작동하는 메서드
    // 아이디 유효성 검사
    if (!id.match(idRegex)) {
        showError("idError", "아이디는 6자에서 10자의 영문 소문자와 숫자만 가능합니다.");
        return;
    }
    
    // 아이디 중복확인 유효성 검사
    $.ajax({
        url: "/user/check_duplicate_id",
        method: "POST",
        data: { id: id },
        success: function (data) {
            if (data.isDuplicate) {
                showError("idError", "이미 사용 중인 아이디입니다", true);
            } else {
                showError("idError", "사용 가능한 아이디입니다.", false);
                $("#registrationForm")[0].submit();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error("Error checking duplicate ID", errorThrown);
            showError("idError", "서버 오류가 발생했습니다.", true);
        },
    });

    // 비밀번호 유효성 검사
    if (password && !password.match(passwordRegex)) {
        showError("passwordError", "비밀번호는 10자에서 20자의 영문 대소문자, 숫자, 특수문자 조합이어야 합니다.");
        return;
    }

    // 이름 유효성 검사
    if (name && !name.match(nameRegex)) {
        showError("nameError", "이름은 2자에서 6자의 한글 또는 영문(대,소문자)만 가능합니다.");
        return;
    }

    // 이메일 유효성 검사
    if ((email && !email.match(emailRegex))) {
        showError("emailError", "이메일 형식이 올바르지 않습니다.");
        return;
    }

    // 전화번호 유효성 검사 (하이픈 자동 입력)
    if (phoneNumber && !phoneNumber.match(phoneNumberRegex)) {
        showError("phoneNumberError", "전화번호는 숫자만 입력 가능합니다.");
        return;
    }
    // 유효성 검사 통과 시 user 객체 생성
    const userData = {
        id: id,
        password: password,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
    };
    // user data send
    // ajax는 원래 모듈로 사용해야하는데 jquery에 포함되어있어서 바로 사용가능. 
    $.ajax({
        url: "user",
        type: "POST",
        data: userData,
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log("Error: ", error);
        },
    }); 
}); // 유효성 검사 종료

// css
$(document).ready(function(){
    $(".input1").click(function(e){
        $(".lb_h").css("color","#ccc");
        $(".lb_h1").css("color","#333");
    });
    $(".input2").click(function(e){
        $(".lb_h").css("color","#ccc");
        $(".lb_h2").css("color","#333");
    });
    $(".input3").click(function(e){
        $(".lb_h").css("color","#ccc");
        $(".lb_h3").css("color","#333");
    });
    $(".input4").click(function(e){
        $(".lb_h").css("color","#ccc");
        $(".lb_h4").css("color","#333");
    });
    $(".input5").click(function(e){
        $(".lb_h").css("color","#ccc");
        $(".lb_h5").css("color","#333");
    });
});