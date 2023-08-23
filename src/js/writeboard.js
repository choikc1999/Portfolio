$(document).ready(function() {
    let username; // username 변수 선언

    $.ajax({
        method: 'GET',
        url: '/get-user-info', // 사용자 정보를 가져오는 경로
        success: function (response) {
            // 사용자 정보에서 이름 가져와서 표시
            document.getElementById("userName").textContent = response.name;

            const username = response.name;
            if (username) {
                const nameInput = document.getElementById('nameInput');
                nameInput.value = username;
                nameInput.readOnly = true; // 읽기 전용으로 설정
            }
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });

    // 로그아웃 버튼 클릭 이벤트 처리
    document.querySelector(".signout").addEventListener("click", function () {
        // 로그아웃 요청 보내기
        $.ajax({
            method: 'GET',
            url: '/logout',
            success: function (response) {
                // 로그아웃 후 로그인 페이지로 리디렉션
                window.location.href = "/login";
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });

    const $dropdownButton = $('.dropdown_btn');
    const $listItems = $('.dropdown_content li');

    $dropdownButton.on('click', function() {
        $listItems.each(function(index) {
            if (index !== 0) {
                $(this).slideToggle(200 * (index - 1));
            }
        });
    });

    $listItems.on('click', function() {
        const index = $listItems.index(this);
        $listItems.each(function(innerIndex) {
            if (innerIndex !== index) {
                $(this).slideUp(200);
            }
        });

        $listItems.removeClass('selected');
        $(this).addClass('selected');
    });
    
    const areaTextarea = document.querySelector(".area");
    const writeButton = document.querySelector(".write");

    writeButton.addEventListener("click", function(event) {
        event.preventDefault();
    
        const title = document.querySelector(".title_input").value;
        const password = document.querySelector(".password_input").value;
        const selectedOption = document.querySelector(".dropdown_content .selected");
        const selectedBoard = selectedOption ? selectedOption.textContent : null; // 선택한 게시판 가져오기
        const text = areaTextarea.value;
    
        const post = {
            title: title,
            name: username,
            password: password,
            selectedBoard: selectedBoard,
            text: text
        };
    
        // AJAX를 사용하여 서버에 데이터 전송
        $.ajax({
            method: "POST",
            url: "/create-post",
            data: post,
            success: function (response) {
                console.log(response); // 서버 응답 출력
                if (response.success) {
                    window.location.href = "/"; // 작성 완료 후 메인 페이지로 리다이렉션
                } else {
                    alert("게시글 작성 실패");
                }
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });
});
