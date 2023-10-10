$(document).ready(function () {
    var text1 = "안녕하세요"; // 첫 번째 텍스트
    var index1 = 0; // 첫 번째 텍스트의 현재 인덱스

    function typeText1(callback) {
        if (index1 < text1.length) {
            // 첫 번째 텍스트의 현재 인덱스의 글자를 #typing-text1 요소에 추가하고 인덱스를 증가
            $('#typing-text1').append(text1[index1]);
            $("#typing-text1").css("border-right","1px solid #000");
            index1++;
            setTimeout(function () {
                typeText1(callback);
            }, 150);
        } else {
            callback();
        }
    }

    // 첫 번째 텍스트 실행
    typeText1(function () {
        var text2 = "신입 웹개발자 최진호입니다."; // 두 번째 텍스트
        var index2 = 0; // 두 번째 텍스트의 현재 인덱스

        function typeText2() {
            if (index2 < text2.length) {
                $("#typing-text1").css("border-right","none");
                $("#typing-text2").css("border-right","1px solid #000");
                // 두 번째 텍스트의 현재 인덱스의 글자를 #typing-text2 요소에 추가하고 인덱스를 증가
                $('#typing-text2').append(text2[index2]);
                index2++;
                setTimeout(typeText2, 150);
                setTimeout(function(){
                    $("#typing-text2").css("border-right","none");
                },500);
            } setTimeout(function(){
                $(".me").css("right","0");
            }, 1000);
        }

        typeText2();
        setTimeout(function(){
            $(".p1").css("left","0");
            setTimeout(function(){
                $(".p2").css("left","0");
            }, 1000);
        }, 2500);
    });

    $(window).scroll(function(){
        var scrollY = $(this).scrollTop();
        var triggerScroll = 1000;

        $(".box2_item1").each(function () {
            var $this = $(this);
            var offsetTop = $this.offset().top;

            if (scrollY >= offsetTop - triggerScroll) {
                $this.addClass('scroll-up1');
            } setTimeout(function(){
                $(".box2_item2").each(function () {
                    var $this = $(this);
                    var offsetTop = $this.offset().top;
        
                    if (scrollY >= offsetTop - triggerScroll) {
                        $this.addClass('scroll-up2');
                    }
                });
                setTimeout(function(){
                    $(".box2_item3").each(function () {
                        var $this = $(this);
                        var offsetTop = $this.offset().top;
            
                        if (scrollY >= offsetTop - triggerScroll) {
                            $this.addClass('scroll-up3');
                        }
                    });
                }, 300);
            },300);
        });
    });

    $(".box2_item").click(function() {
        location.href = "/portfolio";
    });
});
