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


    var slideIndex = 0;
    var slideInterval = setInterval(slide, 3000); // 슬라이드 간격을 조정하세요
    var $pictureLeft = $('.picture_left');
    var $pictureRight = $('.picture_right');

    function slide() {
        slideIndex++;
        var $clonedItem = $pictureLeft.find('.table_item:first').clone();

        $pictureLeft.append($clonedItem);

        $pictureLeft.animate({ 'top': '-=40.0rem' }, 1500, function() {
            $pictureLeft.find('.table_item:first').remove();
            $pictureLeft.css('top', '0');
        });

        var $clonedItem = $pictureRight.find('.table_item:last').clone();
    
        $pictureRight.animate({ 'top': '+=40.0rem' }, 1500, function() {
            $pictureRight.prepend($clonedItem);
            $pictureRight.find('.table_item:last').remove();
            $pictureRight.css('top', '-40.0rem');
        });
    }
});

$(document).on('click', '.iteminner1', function(){
    $(".ViewDetails").css({
        'opacity': '0',
        'top': '100%' // 시작 위치를 페이지 아래로 설정
    }).animate({
        'opacity': '1',
        'top': '30.0rem'
    }, 100, function(){
        $(".Dt_item2").css("display","none");
        $(".ViewDetails").css({'width':'100%','height':'60.0rem','top':'0','border-radius':'3.0rem','background':'none','border':'3px solid #ff9000'});
        setTimeout(function(){
            $(".Dt_item1").css("display","block"); 
        }, 800);
    });
});

$(document).on('click', '.iteminner2', function(){
    $(".ViewDetails").css({
        'opacity': '0',
        'top': '100%' // 시작 위치를 페이지 아래로 설정
    }).animate({
        'opacity': '1',
        'top': '30.0rem'
    }, 100, function(){
        $(".Dt_item1").css("display","none");
        $(".ViewDetails").css({'width':'100%','height':'60.0rem','top':'0','border-radius':'3.0rem','background':'none','border':'3px solid #ff9000'});
        setTimeout(function(){
            $(".Dt_item2").css("display","block"); 
        }, 800);
    });
});