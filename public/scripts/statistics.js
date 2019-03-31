// Javascript File for Statistics Page


function format (d) {
    let beginning = "" + 
    "<div style='display: flex; padding: 1em'>"
    +   "<div style='flex: 0 0 50%'>"
    + "<table><tbody>"  

    let end = ""
    + "</tbody></table></div>"
    +   "<div style='flex: 1'>"
    +   "</div>"
    + "</div>";

    let middle = "";

    let names = $("#MatchDataAverageNames").text().split(",")
    Object.keys(d).forEach((key) => {
        let index = parseInt(key)
        if(index > 4)
            middle += ("<tr><td>Avg " + names[index-5] + "</td><td style='padding-left: 2em'>" + Math.round(average(d[key].split(",").map(a => parseInt(a)))*100)/100 + "</td><td style='padding-left: 2em; color: grey'> σ = " + Math.round(stdev(d[key].split(",").map(a => parseInt(a)))*100)/100 + "</td></tr>")
    })

    return beginning + middle + end;
}

$(document).ready(function() {
    let dtOptions = {
        scrollX: true,
        pageLength: 100,
        order: [[2, "asc"]],
        columns: [
        {
            "class":          "details-control",
            "orderable":      false,
            "data":           null,
            "defaultContent": ""
        }, {}, {}, {}, {}]
    }

    for(i = 0; i < parseInt($("#numOfMatchDataAverages").text()); i++){
        dtOptions.columns.push({visible: false})
    }

    let dt = $('.report-table').DataTable(dtOptions);

    // Array to track the ids of the details displayed rows
    var detailRows = [];
 
    $('table.report-table tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );
 
        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
 
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();
 
            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    } );
 
    // On each draw, loop over the `detailRows` array and show any child rows
    dt.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    } );
});

const stdev = (array) => {
    let avg = average(array)
    let sqDiffs = array.map((a) => Math.pow(a - avg, 2))
    let avgDiff = average(sqDiffs)
    return Math.sqrt(avgDiff)
}

let average = (array) => {
    if(array.length == 0)
        return "Unknown"
    return (array.reduce((sum, val) => sum + parseInt(val)) / array.length)
};