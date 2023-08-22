$(document).ready(function() {
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
});