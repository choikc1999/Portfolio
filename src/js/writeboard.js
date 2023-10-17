$(document).ready(function() {
    let username; // username 변수 선언

    $.ajax({
        method: 'GET',
        url: '/get-user-info', // 사용자 정보를 가져오는 경로
        success: function (response) {
            // 사용자 정보에서 이름 가져와서 표시
            document.getElementById("userName").textContent = response.name;

            const username = response.name;
            if (username) {
                const nameInput = document.getElementById('nameInput');
                nameInput.value = username;
                nameInput.readOnly = true; // 읽기 전용으로 설정
            }
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
    
    const areaTextarea = document.querySelector(".area");
    const writeButton = document.querySelector(".write");

    writeButton.addEventListener("click", function(event) {
        event.preventDefault();
    
        const title = document.querySelector(".title_input").value;
        const password = document.querySelector(".password_input").value;
        const selectedOption = document.querySelector(".dropdown_content .selected");
        const selectedBoard = selectedOption ? selectedOption.textContent : null; // 선택한 게시판 가져오기
        const text = areaTextarea.value;
    
        $.ajax({
            method: 'GET',
            url: '/get-user-info',
            success: function(response) {
                const loggedInUserId = response.id;

            // 특정 카테고리를 제외한 경우에만 작성이 가능하도록 체크
            const restrictedCategories = ["NOTICE", "HTML", "CSS", "WEB"];
            if (restrictedCategories.includes(selectedBoard) && loggedInUserId !== 'admin') {
                alert("해당 카테고리는 작성권한이 없습니다. 방문객은 INQUIRY만 작성가능합니다.");
                return;
            }

            const notrestrictedCategories = ["--게시판 선택--"];
            if (notrestrictedCategories.includes(selectedBoard)){
                alert("게시판을 선택해주세요.");
                return;
            }

            if (!selectedBoard) {
                alert("게시판을 선택해주세요.");
                return;
            }
        
            if (!title) {
                alert("제목을 입력해주세요.");
                return;
            }
        
            if (!text) {
                alert("내용을 입력해주세요.");
                return;
            }
        
            if (!password) {
                alert("비밀번호를 입력해주세요.");
                return;
            }
    
        const post = {
            title: title,
            name: username,
            password: password,
            selectedBoard: selectedBoard,
            text: text
        };
    
        // AJAX를 사용하여 서버에 데이터 전송
        $.ajax({
            method: "POST",
            url: "/create-post",
            data: post,
            success: function (response) {
                console.log(response); // 서버 응답 출력
                if (response.success) {
                    const postId = response.postId; // 생성된 게시글의 아이디
                    const redirectUrl = `/boardview?boardID=${postId}`; // 생성된 게시글의 아이디를 포함한 URL
                    window.location.href = redirectUrl; // 작성 완료 후 생성된 게시글로 리다이렉션
                } else {
                    alert("게시글 작성 실패");
                }
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    },
    error: function(error) {
        console.error("Error:", error);
    }
        });
    });  
    
    $('#pictureInput').change(function () {
        const files = this.files;
        if (files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('picture', files[i]);
            }
    
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('파일 업로드 성공');
                    const imageId = response.id;
    
                    // 이미지 정보를 가져오는 함수 호출
                    getImageInfo(imageId);
                },
                error: function () {
                    console.error('파일 업로드 실패');
                }
            });
        }
    });
    function getImageInfo(imageId) {
        $.ajax({
            url: '/getImageInfo',
            type: 'GET',
            success: function (response) {
                console.log('이미지 정보 가져오기 성공');
                if (response.originalFilename) {
                     // 이미지 태그를 생성
                    const imgTag = document.createElement('img');
                    imgTag.src = `../userimages/${response.originalFilename}`;
                    imgTag.alt = '이미지';
                    imgTag.style.width = '100px';
                    imgTag.style.height = '100px';

                    // 이미지를 textarea에 추가
                    const textareaContent = $('#textareaContent');
                    textareaContent.append(imgTag);
                    const currentText = textareaContent.val();
                    textareaContent.val(currentText + '\n' + imgTag);
                    
                    // 세션을 삭제하는 요청
                    $.ajax({
                        url: '/clearSession',
                        type: 'GET',
                        success: function () {
                            console.log('세션 삭제 성공');
                            // 이미지 정보를 가져온 후 세션 삭제
                        },
                        error: function () {
                            console.error('세션 삭제 중 오류 발생');
                        }
                    });
                }
            },
            error: function () {
                console.error('이미지 정보를 가져오는 중 오류 발생');
            }
        });
    }
    

});
