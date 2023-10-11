$(document).ready(function() {
    let isUpdatingViewCount = false; // 중복 요청 여부를 나타내는 변수
    // 서버에서 사용자 정보를 가져와서 이름 표시
    $.ajax({
        method: 'GET',
        url: '/get-user-info', // 사용자 정보를 가져오는 경로
        success: function (response) {
            // 사용자 정보에서 이름 가져와서 표시
            document.getElementById("userName").textContent = response.name;

            // 댓글 작성 버튼 클릭 이벤트 처리
            $(".write_btn").click(function () {
                submitReply(response.name); // 사용자 이름을 넘겨줍니다.
                $(".reply_textarea").val("");
            });

            const urlParams = new URLSearchParams(window.location.search);
            const boardID = urlParams.get("boardID");

            // boardID가 유효하면 해당 게시글 정보를 불러와 화면에 표시합니다.
            if (boardID) {
                loadBoardInfo(boardID);
                loadRepliesFromDatabase(boardID); // 이 부분을 추가하여 댓글을 미리 가져옵니다.
            }
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });

    $.ajax({
        method: 'GET',
        url: '/get-user-info', // 사용자 정보를 가져오는 경로
        success: function (response) {
            // 사용자 정보에서 이름 가져와서 표시
            document.getElementById("m_userName").textContent = response.name;
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

    document.querySelector(".m_signout").addEventListener("click", function () {
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

    function displayBoardInfo(post) {
        // 게시글 정보를 화면에 표시하는 작업을 수행합니다.
        $(".title").text(post.title);
        $(".name").text(post.name);
        const date = new Date(post.modify_date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        $(".date").text(formattedDate);
        $(".select").text(post.selectboard);
        $(".text").text(post.text);
        $(".view_count span").text(post.views); // 조회수 출력
    }

    const urlParams = new URLSearchParams(window.location.search);
    const boardID = urlParams.get("boardID");

    // boardID가 유효하면 해당 게시글 정보를 불러와 화면에 표시합니다.
    if (boardID) {
        loadBoardInfo(boardID);
        loadRepliesFromDatabase(boardID); // 이 부분을 추가하여 댓글을 미리 가져옵니다.
    }

    // 댓글 저장 및 로딩
    function submitReply(nickname) {
        const replyTextarea = document.querySelector(".reply_textarea");
        const newReply = replyTextarea.value;
        
        if (newReply.trim() !== "") {
            const urlParams = new URLSearchParams(window.location.search);
            const boardID = urlParams.get("boardID");
            saveReplyToDatabase(boardID, nickname, newReply);
        }
    }

    let replyData = [];

    function saveReplyToDatabase(boardID, nickname, reply) {
        $.ajax({
            type: "POST",
            url: "/save-reply",
            data: { boardID: boardID, nickname: nickname, reply: reply },
            success: function (response) {
                if (response.success) {
                    // 새로운 댓글을 추가하고 화면 업데이트
                    const newReply = { nickname: nickname, reply: reply };
                    replyData.push(newReply);
                    updateReplyBox();
                    updateReplyCount();
    
                    // 서버에서 댓글 목록 다시 가져와서 업데이트
                    loadRepliesFromDatabase(boardID);
                } else {
                    console.error("Error saving reply:", response.error);
                }
            },
            error: function (error) {
                console.error("Error saving reply:", error);
            }
        });
    }

    function loadRepliesFromDatabase(boardID) {
        $.ajax({
            type: "GET",
            url: `/get-replies?boardID=${boardID}`,
            success: function (replies) {
                replyData = replies;
                updateReplyBox();
                updateReplyCount();
            },
            error: function (error) {
                console.error("Error getting replies:", error);
            }
        });
    }

    // 댓글 표시 업데이트
    function updateReplyBox() {
        const replyBox = document.querySelector(".reply_box");
        replyBox.innerHTML = ""; // 기존 댓글 내용 초기화

        for (const reply of replyData) {
            const replyElement = document.createElement("div");
            replyElement.className = "reply_item";
            replyElement.innerHTML = `
                <span class="nickname">${reply.nickname}</span>
                <span class="reply">${reply.reply}</span>
            `;
            replyBox.appendChild(replyElement);
        }
    }

    // 댓글 수 업데이트
    function updateReplyCount() {
        const replyCountElement = document.querySelector(".reply_count span");
        replyCountElement.textContent = replyData.length.toString();
    }


    function loadBoardInfo(boardID) {
        // 서버에 해당 게시글 정보를 요청하는 AJAX 요청을 보냅니다.
        $.ajax({
            type: "GET",
            url: `/board/${boardID}`,
            success: function (response) {
                if (response) {
                    displayBoardInfo(response); // 서버로부터 받아온 게시글 정보를 화면에 표시

                    if (!isUpdatingViewCount) { // 중복 요청이 아닌 경우에만 처리
                        isUpdatingViewCount = true; // 요청 중 상태로 변경
                        updateViewCount(boardID); // 조회수 업데이트 함수 호출
                    }

                    // 댓글 불러오기
                    loadRepliesFromDatabase(boardID);
                } else {
                    console.error("Error: No post found with boardID", boardID);
                }
            },
            error: function (error) {
                console.error("Error getting post:", error);
            }
        });
    }

    function updateViewCount(boardID) {
        $.ajax({
            type: "GET",
            url: `/update-view-count/${boardID}`, // 서버에서 조회수 업데이트 처리하는 경로
            success: function (response) {
                // 업데이트 성공하면 아무 작업도 하지 않음
            },
            error: function (error) {
                console.error("Error updating view count:", error);
            },
            complete: function() {
                isUpdatingViewCount = false; // 요청 완료 후 상태 초기화
            }
        });
    }

    // 게시글삭제기능
    function getBoardIDFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("boardID");
    }

    $(".delete_btn").click(function() {
        const boardID = getBoardIDFromURL();
        const password = prompt("게시글 삭제를 위해 작성할때 입력한 비밀번호를 입력하세요:");

        if (password !== null && password.trim() !== "") {
            deletePost(boardID, password);
        }
    });

    function deletePost(boardID, password) {
        $.ajax({
            type: "POST",
            url: "/delete-post",
            data: { boardID: boardID, password: password },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    window.location.href = "/board"; // 삭제 후 목록 페이지로 이동
                } else {
                    alert(response.message);
                }
            },
            error: function (error) {
                console.error("Error deleting post:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        });
    }

    // 수정 버튼 클릭 이벤트 처리
    $(".modify_btn").click(function() {
        const boardID = getBoardIDFromURL();
        window.location.href = `/ModifyWrite?boardID=${boardID}`; // 수정 페이지로 이동
    });
});