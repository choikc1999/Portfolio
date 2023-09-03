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
                const searchTerm = $(".search_input").val(); // 검색어 가져오기
                window.location.href = `/answer?searchTerm=${searchTerm}`;
                // 검색을 실행하고 결과를 표시하는 부분
                searchPosts(searchTerm); // 검색을 실행하도록 추가
                console.log("검색 실행: " + inputValue);
            }
        }
    });

    // /answer 페이지에서 검색어 처리 및 결과 표시
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('searchTerm'); // URL에서 검색어 가져오기

    if (searchTerm) {
        // 검색어가 존재하는 경우 처리
        $('.search_input').val(searchTerm); // 검색어를 검색 입력 필드에 설정
        searchPosts(searchTerm);
    }

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

    const questionElement = document.querySelector('.question');
    const qNumberElement = document.querySelector('.q_number');

    // 검색 결과를 반복하여 리스트에 추가합니다.
    if (results.searchResults && Array.isArray(results.searchResults)) {
        results.searchResults.forEach(function (result) {
            const listItem = document.createElement('li');
            listItem.textContent = `- ${result.title}: ${result.text}`;
            listItem.classList.add('searchResult'); // 검색 결과 항목에 클래스 추가
            listItem.dataset.boardid = result.board_ID; // 검색 결과 항목에 board_ID 데이터 속성 추가
            resultList.appendChild(listItem);
        });

        // 검색 결과 수 업데이트
        qNumberElement.textContent = results.searchResults.length;
    } else {
        console.error('검색 결과가 올바르지 않습니다.');
        qNumberElement.textContent = '0'; // 검색 결과가 없을 경우 '0'으로 설정
    }

    // 검색어 표시
    questionElement.textContent = `검색어: ${results.searchTerm}`;

}

$(document).on('click', '.searchResult', function () {
    const boardID = $(this).data('boardid'); // 클릭한 결과의 board_ID 값을 가져옵니다.
    window.location.href = `/boardview?boardID=${boardID}`; // 해당 게시글의 페이지로 이동합니다.
});

});