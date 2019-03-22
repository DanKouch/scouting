// Automatically hide alerts after 5 seconds
setTimeout(() => {
    // https://stackoverflow.com/a/23102317/3746623
    $(".alert").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert").slideUp(500);
    });
}, 5000)

// For some reason gets dropdowns working in mobile
$('.dropdown').click(() => {});