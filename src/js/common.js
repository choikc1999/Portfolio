$(document).ready(function(){
    $(".searchicon").click(function () {
        $(".hover").css("display", "none");
        $(".searchicon").addClass("searchIconClickoff");

        const searchIcon = document.querySelector('.searchicon');

        searchIcon.addEventListener('animationend', () => {
            searchIcon.style.display = 'none';
            $(".c_1").css("display", "none");
            $(".btn_search").addClass("searchIconClickon");
            $(".c_2").css("display","block");
            $(".inputback").css("display","inline-block");
            
            const searchIconClickon = document.querySelector('.searchIconClickon');

            // 애니메이션 완료 후 처리
            searchIconClickon.addEventListener('animationend', () => {
                searchIconClickon.style.opacity = 1;
                searchIconClickon.style.transform = 'scale(1)'; // 확대 애니메이션 완료 후 크기 복원
            });
            searchIconClickon.addEventListener("click", function() {
                var inputValue = document.querySelector(".search_input").value;
                
                if (inputValue === "") {
                    $(".c_2").css("display", "none");
                    $(".c_1").css("display", "block");
                    $(".searchicon").removeClass("searchIconClickoff").css("display","block")
                    console.log("검색어를 입력하세요");
                } else {
                    // 입력값이 있는 경우의 동작을 여기에 구현
                    console.log("검색 실행: " + inputValue);
                }
            });
        });
    });
});
