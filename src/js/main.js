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

    // 마우스 돋보기 기능
    // 커스텀 커서 아이콘 생성
    const customCursor = document.createElement("div");
    customCursor.className = "custom-cursor";

    // SVG 파일 내용 가져와서 커스텀 커서에 삽입
    fetch("../images/plus.svg")
    .then(response => response.text())
    .then(svgData => {
        customCursor.innerHTML = svgData;

        initializeCursor();
    });

    function initializeCursor() {
        document.body.appendChild(customCursor);

        const cursorSize = 40; // 커서 크기 조절
        let isInsideIcon = false; // 아이콘 영역 내에 있는지 여부

        const workIcons = document.querySelectorAll(".it_contents2");

        document.addEventListener("mousemove", e => {
            // 커서 위치를 이미지 중심으로 설정
            const cursorX = e.clientX - cursorSize / 2;
            const cursorY = e.clientY - cursorSize / 2;

            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;

            isInsideIcon = false;

            workIcons.forEach(icon => {
                const iconRect = icon.getBoundingClientRect();

                if (
                    cursorX >= iconRect.left && cursorX <= iconRect.right &&
                    cursorY >= iconRect.top && cursorY <= iconRect.bottom
                ) {
                    isInsideIcon = true;
                    return;
                }
            });

            if (isInsideIcon) {
                customCursor.style.display = "block";
                document.body.style.cursor = "none"; // 기존 마우스 커서 숨기기
            } else {
                customCursor.style.display = "none";
                document.body.style.cursor = "auto"; // 기존 마우스 커서 복구
            }
        });

        workIcons.forEach(icon => {
            icon.addEventListener("mouseover", () => {
                customCursor.style.transform = `scale(${cursorSize / 24})`;
            });

            icon.addEventListener("mouseout", () => {
                customCursor.style.transform = "";
            });
        });
    }

    // 슬라이드
    var $slides = $('.slide'); // 각 슬라이드
    var $slidesContainer = $('.slides'); // 슬라이더 컨테이너
    
    // 원본 슬라이드를 복제하여 슬라이드를 더 추가 (원하는 개수만큼)
    for (var i = 0; i < 100; i++) {
        $slides.clone().appendTo('.slides');
    }
    
    var $allSlides = $('.slide'); // 모든 슬라이드 (원본 및 복제된)
    var slideCount = $allSlides.length; // 슬라이드 개수
    
    $slidesContainer.css('width', '100%'); // 슬라이더 컨테이너의 너비를 100%로 설정
    $slidesContainer.css('overflow', 'hidden'); // 너비를 벗어나는 내용 감춤
    
    $allSlides.css('margin-right', '10px'); // 모든 슬라이드의 여백 설정
    $allSlides.css('width', '100vw'); // 모든 슬라이드의 너비를 창의 너비만큼으로 설정
    
    var slideWidth = $allSlides.width(); // 각 슬라이드의 너비
    var currentIndex = 0; // 현재 슬라이드 인덱스
    
    $slidesContainer.css('width', slideWidth * slideCount + 'px'); // 슬라이더 컨테이너의 너비 설정
    
    // 각 슬라이드를 부드럽게 이동하는 함수
    function moveSlides() {
        var position = -1 * currentIndex * slideWidth;
        $slidesContainer.css({
            'transform': 'translateX(' + position + 'px)',
            'transition': 'transform 0.5s ease-in-out' // 부드러운 애니메이션 적용
        });
    }
    
    // 자동 슬라이드를 시작하는 함수
    function startSliderInterval() {
        interval = setInterval(function() {
            currentIndex++;
            if (currentIndex >= slideCount) {
                currentIndex = 0;
            }
            moveSlides();
        }, 2000); // 2초 간격으로 슬라이드 이동
    }
    
    var touchStartX = 0;
    var touchEndX = 0;
    var touchThreshold = 100; // 터치 이동 감지 임계값
    var interval = startSliderInterval(); // 초기 슬라이드 이동 시작
    
    // 슬라이더 컨테이너에 터치 및 마우스 이벤트 추가
    $('.portfolio_slider').on({
        mouseenter: function() {
            clearInterval(interval); // 슬라이더 이동 멈춤
            interval = null; // interval을 초기화하여 중복 실행 방지
        },
        mouseleave: function() {
            if (!interval) { // interval이 없을 때만 다시 시작
                interval = startSliderInterval(); // 슬라이더 이동 다시 시작
            }
        },
        touchstart: function(e) {
            touchStartX = e.touches[0].clientX;
        },
        touchmove: function(e) {
            touchEndX = e.touches[0].clientX;
        },
        touchend: function() {
            var touchDiff = touchStartX - touchEndX;
    
            if (touchDiff > touchThreshold) {
                currentIndex++;
            } else if (touchDiff < -touchThreshold) {
                currentIndex--;
            }
    
            if (currentIndex < 0) {
                currentIndex = slideCount - 1;
            } else if (currentIndex >= slideCount) {
                currentIndex = 0;
            }
    
            moveSlides();
    
            touchStartX = 0;
            touchEndX = 0;
        },
        mousedown: function(e) {
            touchStartX = e.clientX;
            $(this).on('mousemove', function(e) {
                touchEndX = e.clientX;
            });
            $(this).on('mouseup', function() {
                var touchDiff = touchStartX - touchEndX;
    
                if (touchDiff > touchThreshold) {
                    currentIndex++;
                } else if (touchDiff < -touchThreshold) {
                    currentIndex--;
                }
    
                if (currentIndex < 0) {
                    currentIndex = slideCount - 1;
                } else if (currentIndex >= slideCount) {
                    currentIndex = 0;
                }
    
                moveSlides();
    
                $(this).off('mousemove mouseup');
                touchStartX = 0;
                touchEndX = 0;
            });
        }
    });
    
    // 자동 슬라이드를 시작하는 함수
    function startSliderInterval() {
        return setInterval(function() {
            currentIndex++;
            if (currentIndex >= slideCount) {
                currentIndex = 0;
            }
            moveSlides();
        }, 2000); // 2초 간격으로 슬라이드 이동
    }
    
    // 각 슬라이드를 부드럽게 이동하는 함수
    function moveSlides() {
        var position = -1 * currentIndex * slideWidth;
        $slidesContainer.css({
            'transform': 'translateX(' + position + 'px)',
            'transition': 'transform 0.5s ease-in-out' // 부드러운 애니메이션 적용
        });
    }
});
