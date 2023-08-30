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

    // 게시글 수정
    function getBoardIDFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('boardID'); // URL 쿼리 매개변수에서 boardID 값을 가져옴
    }
    
    const boardID = getBoardIDFromURL(); // 게시글 고유 ID 가져오기
    
    // 기존 게시글 정보 가져와서 폼 채우기
    $.ajax({
        url: `/getBoardInfo?boardID=${boardID}`,
        type: "GET",
        success: function(response) {
            // 가져온 정보로 폼 채우기
            $(".title_input").val(response.post.title);
            $(".name_input").val(response.post.author);
            $(".area").val(response.post.content);
            // Dropdown에서 선택한 값을 설정해주는 코드 (예시)
            $(".dropdown_content li").text(response.post.selectboard);
        },
        error: function(error) {
            console.log("Error:", error);
        }
    });
    
    // 수정 폼 제출 이벤트 핸들러
    $(".write").click(function(event) {
        event.preventDefault();
    
        const title = $(".title_input").val();
        const content = $(".area").val();
        const name = $(".name_input").val(); // 추가: 작성자 이름 값
        const password = $(".password_input").val(); // 추가: 비밀번호 값
        const selectboard = $(".dropdown_content li").text(); // 추가: 선택한 게시판 값

        const modifiedPost = {
            title: title,
            text: content,
            name: name, // 추가: 작성자 이름
            password: password, // 추가: 비밀번호
            selectboard: selectboard, // 추가: 선택한 게시판
            boardID: boardID // 수정 대상 게시글의 고유 ID
        };
    
        $.ajax({
            url: "/update-post",
            type: "POST",
            data: modifiedPost,
            success: function(response) {
                console.log(response);
                if (response.success) {
                    console.log("게시글이 성공적으로 수정되었습니다.");
                    // 수정 완료 후 게시글 상세 페이지로 이동
                    window.location.href = `/boardview?boardID=${boardID}`;
                } else {
                    if (response.message === "Invalid password") {
                        alert("비밀번호가 틀렸습니다. 다시 확인해주세요.");
                    } else {
                        alert("게시글 수정 실패");
                    }
                }
            },
            error: function(error) {
                console.log("Error:", error);
            }
        });
    });
});
