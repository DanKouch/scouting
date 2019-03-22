// Javascript File for Data Page

$(document).ready(function() {
    $('.report-table').DataTable({
        scrollX: true,
        order: [[1, "desc"]]
    });
});