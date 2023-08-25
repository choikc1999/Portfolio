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
    
    // menulist 시작

    var lastClickedMenu = null;

    // 초기화: 처음에는 menu1이 활성화되도록 설정
    $(".menu.menu1").addClass("active-menu"); // menu1을 활성화된 메뉴로 표시
    $(".background.background1").addClass("animate-background"); // background1을 활성화된 배경으로 표시
    $(".menu[data-background!='.background1']").each(function() {
        var backgroundSelector = $(this).data("background");
        $(backgroundSelector).removeClass("animate-background"); // menu1 이외의 배경들을 비활성화된 상태로 초기화
    });

    function resetMenu1() {
        var targetBackground = $(".menu.menu1").data("background");
        $(targetBackground).css("display", "inline-block");
        $(".menu.menu1").find("a").css("color", "#fff"); // menu1의 색상을 활성화된 상태로 초기화
    }

    $(".menu").mouseover(function() {
        var targetBackground = $(this).data("background");
        $(".background").css("display", "none");
        $(targetBackground).css("display", "inline-block").addClass("animate-background");
        $(".menu a").css("color", "#065549"); // 모든 메뉴의 색상을 기본 값으로 초기화
        $(this).find("a").css("color", "#fff"); // 마우스 오버한 메뉴의 색상을 활성화된 상태로 변경
    });

    $(".menu").click(function() {
        var targetBackground = $(this).data("background");
        $(targetBackground).removeClass("animate-background");
        $(targetBackground).css("display", "inline-block");
        lastClickedMenu = $(this);
        $(".menu").not(this).each(function() {
            var backgroundSelector = $(this).data("background");
            $(backgroundSelector).removeClass("animate-background");
            $(this).find("a").css("color", "#065549"); // 클릭한 메뉴 이외의 메뉴의 색상을 기본 값으로 초기화
        });
    });

    $(".menu").mouseout(function() {
        if (lastClickedMenu && lastClickedMenu.is($(this))) {
            return; // 클릭한 메뉴인 경우 아무것도 하지 않음
        }

        resetMenu1();
        $(".background").css("display", "none"); // 배경을 숨김
        $(".menu a").css("color", "#065549"); // 모든 메뉴의 색상을 기본 값으로 초기화

        if (lastClickedMenu) {
            var lastBackground = lastClickedMenu.data("background");
            $(lastBackground).css("display", "inline-block");
            lastClickedMenu.find("a").css("color", "#fff"); // 마지막으로 클릭한 메뉴의 색상을 활성화된 상태로 변경
        }
    });

    $(".menulist").mouseout(function(e) {
        if (!$(e.relatedTarget).closest(".menulist").length) {
            if (!lastClickedMenu) {
                resetMenu1(); // 메뉴리스트를 빠져나갈 때, 클릭한 메뉴가 없으면 menu1을 활성화
            }
            
            if (lastClickedMenu) {
                var lastBackground = lastClickedMenu.data("background");
                $(lastBackground).css("display", "inline-block");
                lastClickedMenu.find("a").css("color", "#fff"); // 클릭한 메뉴의 색상을 활성화된 상태로 변경
            }
        }
    });

    // menulist 끝

    function getPosts() {
        $.ajax({
            type: "GET",
            url: "/get-posts", // 서버의 해당 경로로 요청 보내기
            success: (response) => {
                console.log("Server Response:", response);
                displayPosts(response.posts); // 받아온 데이터로 게시글 목록 표시
            },
            error: (error) => {
                console.error("Error getting posts:", error);
            }
        });
    }

    // 게시글 목록을 화면에 출력하는 함수
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);
        return formattedDate;
    }
    
    function displayPosts(posts) {
        if (!Array.isArray(posts)) {
            console.error("Error: posts is not an array");
            return;
        }

        const tableBody = $("#boardTableBody");
        tableBody.empty(); // 기존의 내용 비우기
    
        posts.forEach((post) => {
            const formattedDate = formatDate(post.modify_date);
            const tr = `
                <tr>
                    <td>${post.board_ID}</td>
                    <td>${post.title}</td>
                    <td>${formattedDate}</td>
                    <td>${post.name}</td>
                </tr>
            `;
            tableBody.append(tr); // 새로운 게시글 추가
        });
    }
    
    const itemsPerPage = 10; // 페이지당 게시글 수
    let currentPage = 1; // 현재 페이지
    
    function getPostsByPage(page, selectedBoard) {
        let url = `/get-posts?page=${page}`;
        
        if (selectedBoard) {
            url += `&selectboard=${selectedBoard}`;
        }
        
        $.ajax({
            type: "GET",
            url: url,
            success: (response) => {
                if (Array.isArray(response.posts)) {
                    const filteredPosts = selectedBoard ? response.posts.filter(post => post.selectboard === selectedBoard) : response.posts;
                    displayPosts(filteredPosts);
                    displayPagination(Math.ceil(response.totalPosts / itemsPerPage), currentPage);
                    updatePaginationStyle();
                } else {
                    console.error("Error: Response.posts is not an array");
                }
            },
            error: (error) => {
                console.error("Error getting posts:", error);
            }
        });
    }
    
    // 초기 페이지 로딩 시 첫 번째 페이지의 게시글 목록 가져오기
    getPostsByPage(currentPage);

    // 페이지네이션을 표시하는 함수
    function displayPagination(totalPages, currentPage) {
        const pagination = $("#pagination");
        pagination.empty();
    
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = i;
            a.href = "#";
            if (i === currentPage) {
                a.classList.add("active");
            }
            
            // 클로저 문제 해결: 클릭 이벤트 핸들러 내에서 i 값을 저장
            a.addEventListener("click", (event) => {
                event.preventDefault();
                currentPage = i;
                getPostsByPage(currentPage); // 수정된 부분: getPosts 대신 getPostsByPage 호출
                updatePaginationStyle();
            });
            
            li.appendChild(a);
            pagination.append(li);
        }
        
    }
    
    // 페이지 번호에 따라 스타일 업데이트
    function updatePaginationStyle() {
        const pageLinks = $("#pagination a");
    
        pageLinks.each((index, link) => {
            const pageNumber = parseInt(link.textContent);
            console.log(`Page Number: ${pageNumber}, Current Page: ${currentPage}`);
            if (pageNumber === currentPage) {
                $(link).addClass("active");
            } else {
                $(link).removeClass("active");
            }
        });
    }

    // 페이지 이동 처리
    $("#pagination").on("click", "a", function(event) {
        event.preventDefault();
        const pageNumber = parseInt($(this).text());
        if (!isNaN(pageNumber)) {
            currentPage = pageNumber;
            getPostsByPage(currentPage);
        }
    });
    
    // "menu2" 클래스명을 가진 li를 클릭할 때의 이벤트 핸들러
    $(".menu2").click(function () {
        const selectedBoard = "NOTICE"; // 선택한 게시판 값 (여기서는 NOTICE로 고정)
        currentPage = 1; // 선택한 게시판에서 첫 번째 페이지부터 보여줄 것이므로 currentPage를 1로 초기화
        getPostsByPage(currentPage, selectedBoard); // 선택한 게시판 값도 함께 전송
    });

    // 게시글 목록에서 각각의 게시글을 클릭했을 때의 이벤트 처리
    $("#boardTableBody").on("click", "tr", function() {
        const boardID = $(this).find("td:first").text(); // 첫 번째 td에 있는 board_ID 가져오기
        window.location.href = `/boardview?boardID=${boardID}`; // 해당 게시글 페이지로 이동
    });

});
