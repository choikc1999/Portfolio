$(".btn_change").click(function () {
    const id = $(".changeInputID").val();
    const newPassword = $(".newPassword").val();
    const newName = $(".changeInputName").val();
    const newEmail = $(".changeInputEmail").val();
    const newPhoneNumber = $(".changeInputPN").val();

    $.ajax({
        url: "/edit-profile", // 수정: 회원 정보 수정 라우트 경로
        method: "POST",
        data: {
            id: id,
            newPassword: newPassword,
            newName: newName,
            newEmail: newEmail,
            newPhoneNumber: newPhoneNumber
        },
        success: function(response) {
            alert(response.message);
            window.location.href = "/main"; // 수정: 수정 완료 후 이동할 경로
        },
        error: function(error) {
            console.error("Error updating profile:", error);
            alert("회원 정보 수정 중 오류가 발생했습니다.");
        }
    });
});

// css
$(document).ready(function(){
    $(".changeInputID").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputID").css("background", "#076355");
    });
    $(".changeInputPw").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputPw").css("background", "#076355");
    });
    $(".changeInputName").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputName").css("background", "#076355");
    });
    $(".changeInputEmail").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputEmail").css("background", "#076355");
    });
    $(".changeInputPN").click(function (e) {
        $(".changeInput").css("background", "#0b9882");
        $(".changeInputPN").css("background", "#076355");
    });

    $(".changeInput").css("transition", "background-color 0.2s");
});