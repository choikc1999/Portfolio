$(document).ready(function() {

    // 서치아이콘 효과부여
    $('.circle').hover(function() {
        var $searchicon = $(this).find('.searchicon');
        setTimeout(function() {
            $searchicon.css({
                'z-index': '2',
                'cursor': 'pointer'
            });
      }, 100);
    }, function() {
        var $searchicon = $(this).find('.searchicon');

            $searchicon.css({
                'z-index': 'auto',
                'cursor': 'default'
            }); 
    });

    $('.search_input').click(function(){
        $('.searchiconShow').css('filter', 'drop-shadow(0.2rem 0.2rem 0.2rem #0a0a0a)');
        $('.circle_click').css('background','#fff');
    })

    $('.searchicon, .searchiconShow').click(function(){
        if ($(this).hasClass("searchiconShow")) {
            $('.searchiconShow').addClass("searchicon");
            $(this).removeClass("searchiconShow");
            $('.searchicon').css('filter', 'drop-shadow(0.2rem 0.2rem 0.2rem #0a0a0a)');
            $('.circle_click').addClass('circle').css({"width": "65px","transition": "0.5s"});
            $('.circle_click').removeClass('circle_click');
        };

        // "searchiconShow" 클래스가 없는 경우 처리
        var inputValue = document.querySelector(".search_input").value;
        $('.circle').addClass('circle_click');
        $('.circle_click').removeClass('circle').css({"width": "300px", "transition": "0.5s"});

        if (inputValue === "") {
            $(this).addClass("searchiconShow");
            $('.searchiconShow').removeClass("searchicon");
            $('.searchiconShow').attr('type', 'button'); // 버튼 타입을 "button"으로 변경
            $('.circle_click').css('background','none');
            $('.searchiconShow').css('filter', 'none');
            console.log("검색어를 입력하세요");
        } else {
            // 입력값이 있는 경우
            $('.searchiconShow').attr('type', 'submit');// 버튼 타입을 "submit"으로 변경
            const searchTerm = $(".search_input").val(); // 검색어 가져오기
            searchPosts(searchTerm); // 검색을 실행하도록 추가
            window.location.href = `/answer?searchTerm=${searchTerm}`;
            // 검색을 실행하고 결과를 표시하는 부분
            console.log("검색 실행: " + inputValue);
        }
    });

    $('.m_search').click(function(){
            // "searchiconShow" 클래스가 없는 경우
            var inputValue = document.querySelector(".m_search_input").value;

            if (inputValue === "") {
                $('.m_search').attr('type', 'button'); // 버튼 타입을 "button"으로 변경
                console.log("검색어를 입력하세요");
            } else {
                // 입력값이 있는 경우 동작
                // $('.m_search').attr('type', 'submit');// 버튼 타입을 "submit"으로 변경
                const searchTerm = $(".m_search_input").val(); // 검색어 가져오기
                window.location.href = `/answer?searchTerm=${searchTerm}`;
                // 검색을 실행하고 결과를 표시하는 부분
                searchPosts(searchTerm); // 검색을 실행하도록 추가
                console.log("검색 실행: " + inputValue);
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

    if (searchTerm) {
        // 검색어가 존재하는 경우 처리
        $('.m_search_input').val(searchTerm); // 검색어를 검색 입력 필드에 설정
        searchPosts(searchTerm);
    }

    // 검색 함수를 정의합니다.
function searchPosts(searchTerm) {

    $.ajax({
        url: '/search',
        method: 'POST',
        data: { searchTerm: searchTerm }, // 검색어를 서버로 보냄.
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
    resultList.innerHTML = ''; // 이전 결과 삭제.

    const questionElement = document.querySelector('.question');
    const qNumberElement = document.querySelector('.q_number');

    // 검색 결과를 반복하여 리스트에 추가.
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
    const boardID = $(this).data('boardid'); // 클릭한 결과의 board_ID 값을 가져옴.
    window.location.href = `/boardview?boardID=${boardID}`; // 해당 게시글의 페이지로 이동.
});

// plus btn
if (document.body.animate) {
    document
    .querySelectorAll(".Plus")
    .forEach((Plus) => Plus.addEventListener("click", pop));
}

function pop(e) {
    for (let i = 0; i < 30; i++) {
    createParticle(e.clientX, e.clientY, e.target.dataset.type);
    }
}

function createParticle(x, y, type) {
    const particle = document.createElement("particle");
    document.body.appendChild(particle);

    const size = Math.floor(Math.random() * 20 + 5);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const destinationX = x + (Math.random() - 0.5) * 2 * 75;
    const destinationY = y + (Math.random() - 0.5) * 2 * 75;

    switch (type) {
    case "circle":
        particle.style.background = `hsl(${Math.random() * 48 + 53}, 54%, 100%)`;
        particle.style.borderRadius = "50%";
        break;
    default:
        particle.style.background = `hsl(${Math.random() * 48 + 56}, 100%, 91%)`;
    }

    const animation = particle.animate(
    [
        {
        // 원점 위치 설정.
        // 마우스 중심에 맞추기 위해 입자 크기의 절반으로 오프셋.
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        opacity: 1,
        },
        {
        // 최종 좌표를 두 번째 키프레임으로 정의.
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
        },
    ],
    {
        duration: 500 + Math.random() * 1000,
        easing: "cubic-bezier(0, .9, .57, 1)",
        delay: Math.random() * 200,
    }
    );

    animation.onfinish = () => {
    particle.removeParticle;
    };
}

function removeParticle(e) {
    e.srcElement.effect.target.remove();
}

$(".Plus").click(function(){
    $(".side_menu").css("right","0");
    $(".Plus").css("display","none");
    
    $(".close_btn").click(function(){
        $(".side_menu").css("right","-9999px");
        $(".Plus").css("display","inline-block");
    });
});

});