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
                const searchTerm = $(".search_input").val(); // 검색어 들고오기
                searchPosts(searchTerm);
                // window.location.href = `/answer?searchTerm=${searchTerm}`;
                console.log("검색 실행: " + inputValue);
            }
        }
    });

    // 검색 함수를 정의합니다.
function searchPosts(searchTerm) {
    // AJAX를 사용하여 서버에 검색 요청을 보냅니다.
    $.ajax({
        url: '/search', // 검색 요청을 처리하는 서버 엔드포인트 URL로 수정해야 합니다.
        method: 'POST', // GET 또는 POST 방식을 선택할 수 있습니다.
        data: { searchTerm: searchTerm }, // 검색어를 서버로 보냅니다.
        success: function (data) {
            // 검색 결과를 처리합니다.
            console.log('검색 결과:', data);
            window.location.href = '/answer';
            displaySearchResults(data);
        },
        error: function (err) {
            console.error('검색 오류:', err);
        },
    });
}
function displaySearchResults(results) {
    const resultList = document.querySelector('.answerbox');
    resultList.innerHTML = ''; // 이전 결과를 지웁니다.

    // 검색 결과를 반복하여 리스트에 추가합니다.
    if (results.searchResults && Array.isArray(results.searchResults)) {
        results.searchResults.forEach(function (result) {
            const listItem = document.createElement('li');
            listItem.textContent = `- ${result.title}: ${result.text}`;
            resultList.appendChild(listItem);
        });
    } else {
        console.error('검색 결과가 올바르지 않습니다.');
    }
}
});