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
});
