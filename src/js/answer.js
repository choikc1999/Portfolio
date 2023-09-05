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