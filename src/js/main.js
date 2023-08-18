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
});
