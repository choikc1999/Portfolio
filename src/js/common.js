$(document).ready(function() {

    // 서치아이콘 효과부여
    $('.circle').hover(function() {
        var $searchicon = $(this).find('.searchicon');
        setTimeout(function() {
            $searchicon.css({
                'z-index': '2',
                'cursor': 'pointer'
            });
      }, 100); // 0.1초 (100ms) 지연 실행
    }, function() {
        var $searchicon = $(this).find('.searchicon');

            $searchicon.css({
                'z-index': 'auto',
                'cursor': 'default'
            }); 
    });

    $('.searchicon, .searchiconShow').click(function(){
        if ($(this).hasClass("searchiconShow")) {
            // 이미 "searchiconShow" 클래스가 있는 경우 처리
            $('.searchiconShow').addClass("searchicon");
            $(this).removeClass("searchiconShow");
            $('.circle_click').addClass('circle').css({"width": "65px","transition": "0.5s"});
            $('.circle_click').removeClass('circle_click');
        } else {
            // "searchiconShow" 클래스가 없는 경우 처리
            var inputValue = document.querySelector(".search_input").value;

            if (inputValue === "") {
                $('.circle').addClass('circle_click');
                $('.circle_click').removeClass('circle').css({"width": "300px", "transition": "0.5s"});
                $(this).addClass("searchiconShow");
                $('.searchiconShow').removeClass("searchicon");
                $('.searchiconShow').attr('type', 'button'); // 버튼 타입을 "button"으로 변경
                console.log("검색어를 입력하세요");
            } else {
                // 입력값이 있는 경우의 동작을 여기에 구현
                $('.searchiconShow').attr('type', 'submit');// 버튼 타입을 "submit"으로 변경
                alert("gg");
                console.log("검색 실행: " + inputValue);
            }
        }
    });
});
