$(document).ready(function() {
    var slideIndex = 0;
    var slideInterval = setInterval(slide, 3000); // 슬라이드 간격을 조정하세요
    var $pictureLeft = $('.picture_left');
    var $pictureRight = $('.picture_right');

    function slide() {
        slideIndex++;
        var $clonedItem = $pictureLeft.find('.table_item:first').clone();

        $pictureLeft.append($clonedItem);

        $pictureLeft.animate({ 'top': '-=40.0rem' }, 1500, function() {
            $pictureLeft.find('.table_item:first').remove();
            $pictureLeft.css('top', '0');
        });

        var $clonedItem = $pictureRight.find('.table_item:last').clone();
    
        $pictureRight.prepend($clonedItem);
    
        $pictureRight.animate({ 'top': '+=40.0rem' }, 3500, function() {
            $pictureRight.find('.table_item:last').remove();
            $pictureRight.css('top', '-40.0rem');
        });
    }
});