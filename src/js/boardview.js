$(document).ready(function() {
    // 서버에서 사용자 정보를 가져와서 이름 표시
    $.ajax({
        method: 'GET',
        url: '/get-user-info', // 사용자 정보를 가져오는 경로
        success: function (response) {
            // 사용자 정보에서 이름 가져와서 표시
            document.getElementById("userName").textContent = response.name;
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
    

    function loadBoardInfo(boardID) {
        // 서버에 해당 게시글 정보를 요청하는 AJAX 요청을 보냅니다.
        $.ajax({
            type: "GET",
            url: `/get-post-by-id?boardID=${boardID}`, // 해당 경로로 요청 보내기
            success: function (response) {
                if (response) {
                    displayBoardInfo(response); // 서버로부터 받아온 게시글 정보를 화면에 표시
                } else {
                    console.error("Error: No post found with boardID", boardID);
                }
            },
            error: function (error) {
                console.error("Error getting post:", error);
            }
        });
    }

    function displayBoardInfo(post) {
        // 게시글 정보를 화면에 표시하는 작업을 수행합니다.
        $(".title").text(post.title);
        $(".name").text(post.name);
        const date = new Date(post.modify_date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        $(".date").text(formattedDate);
        $(".select").text(post.selectboard);
        $(".text").text(post.text);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const boardID = urlParams.get("boardID");

    // boardID가 유효하면 해당 게시글 정보를 불러와 화면에 표시합니다.
    if (boardID) {
        loadBoardInfo(boardID);
    }
    
});    