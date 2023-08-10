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