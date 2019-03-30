// Javascript File for Users Page

$(document).ready(function() {
    $('.report-table').DataTable({
        scrollX: true,
        pageLength: 100,
        order: [[1, "desc"]],
        columns: [{}, {}, {},
            { "targets": [0], "searchable": false, "orderable": false, "visible": true },
            { "targets": [0], "searchable": false, "orderable": false, "visible": true }
        ]
    });
});