$(document).ready(function() {
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
});