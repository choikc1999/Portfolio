// // 검색 함수를 정의합니다.
// function searchPosts(searchTerm) {
//     // AJAX를 사용하여 서버에 검색 요청을 보냅니다.
//     $.ajax({
//         url: '/search', // 검색 요청을 처리하는 서버 엔드포인트 URL로 수정해야 합니다.
//         method: 'POST', // GET 또는 POST 방식을 선택할 수 있습니다.
//         data: { searchTerm: searchTerm }, // 검색어를 서버로 보냅니다.
//         success: function (data) {
//             // 검색 결과를 처리합니다.
//             console.log('검색 결과:', data);
//             displaySearchResults(data);
//         },
//         error: function (err) {
//             console.error('검색 오류:', err);
//         },
//     });
// }

// // 검색 결과를 HTML에 표시하는 함수
// function displaySearchResults(results) {
//     const resultList = document.querySelector('.answerbox');
//     resultList.innerHTML = ''; // 이전 결과를 지웁니다.

//     // 검색 결과를 반복하여 리스트에 추가합니다.
//     results.forEach(function (result) {
//         const listItem = document.createElement('li');
//         listItem.textContent = `- ${result.title}: ${result.content}`;
//         resultList.appendChild(listItem);
//     });
// }