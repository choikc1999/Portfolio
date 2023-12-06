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

    const dragBar = $(".drag_bar");
    const pointer = $(".pointer");
    let isDragging = false;

    dragBar.on("mousedown", function(e) {
        isDragging = true;
        const startX = e.clientX;
        const initialLeft = pointer.position().left;

        $(document).on("mousemove", function(e) {
            if (isDragging) {
                const offsetX = e.clientX - startX;
                let newLeft = initialLeft + offsetX;

                // 영역을 벗어나지 않도록 제한
                const minLeft = 0;
                const maxLeft = dragBar.width() - pointer.width();
                newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

                pointer.css("left", newLeft);

                const thirtyPercent = dragBar.width() * 0.4;
                const fiftyPercent = dragBar.width() * 0.8;

                // 각 구간에 따른 CSS 스타일 적용
                if (newLeft <= thirtyPercent) {
                    $(".SHOWBOX .item2").css("opacity","0");
                    $(".SHOWBOX .item3").css("opacity","0");
                    setTimeout(function(){
                        $(".SHOWBOX .item2").css("display","none");
                        $(".SHOWBOX .item3").css("display","none");
                        setTimeout(function(){
                            $(".SHOWBOX .item1").css("display","block");
                            setTimeout(function(){
                                $(".SHOWBOX .item1").css("opacity","1");
                            }, 100);
                        },100);
                    }, 100);
                
                } else if (newLeft > thirtyPercent && newLeft <= fiftyPercent) {
                    $(".SHOWBOX .item1").css("opacity","0");
                    $(".SHOWBOX .item3").css("opacity","0");
                    setTimeout(function(){
                        $(".SHOWBOX .item1").css("display","none");
                        $(".SHOWBOX .item3").css("display","none");
                        setTimeout(function(){
                            $(".SHOWBOX .item2").css("display","block");
                            setTimeout(function(){
                                $(".SHOWBOX .item2").css("opacity","1");
                            }, 100);
                        },100);
                    }, 100);

                } else {
                    $(".SHOWBOX .item2").css("opacity","0");
                    $(".SHOWBOX .item1").css("opacity","0");
                    setTimeout(function(){
                        $(".SHOWBOX .item2").css("display","none");
                        $(".SHOWBOX .item1").css("display","none");
                        setTimeout(function(){
                            $(".SHOWBOX .item3").css("display","block");
                            setTimeout(function(){
                                $(".SHOWBOX .item3").css("opacity","1");
                            }, 100);
                        },100);
                    }, 100);

                }
            }
        });
    });

    $(document).on("mouseup", function() {
        isDragging = false;
        $(document).off("mousemove");
    });

    $(".tooltip").click(function(){
        window.open("https://github.com/choikc1999/Portfolio", "_blank");
    });    
});
