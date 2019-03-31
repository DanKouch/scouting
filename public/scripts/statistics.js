// Javascript File for Statistics Page


function format (d) {
    let beginning = "" + 
    "<div style='display: flex; padding: 1em'>"
    +   "<div style='flex: 0 0 50%'>"
    + "<table><tbody>"  

    let middleOne = "" // Match Averages

    let middleTwo = ""
    + "</tbody></table></div>"
    +   "<div style='flex: 1'>"
    +   "<table><tbody>"

    let middleThree = "" // Pit Information

    let middleFour = ""
    +   "</table></tbody>"
    +   "</div></div>"
    
    let end = "<div style='padding: 1em; padding-top: 0'><table><tbody><td><b>Additional Match Comments</b><td><td>" + d["27"] + "</td></tbody></table></div>"

    let names = $("#MatchDataAverageNames").text().split(",")
    Object.keys(d).forEach((key) => {
        let index = parseInt(key)
        if(index > 4 && index < 16)
            middleOne += ("<tr><td><b>Avg " + names[index-5] + "</b></td><td style='padding-left: 2em'>" + Math.round(average(d[key].split(",").map(a => parseInt(a)))*100)/100 + "</td><td style='padding-left: 2em; color: grey'> σ = " + Math.round(stdev(d[key].split(",").map(a => parseInt(a)))*100)/100 + "</td></tr>")
    })

    middleThree += ("<tr><td><b>" + "Robot Speed (m/s)" + "</b></td><td style='padding-left: 2em'>" + (d["16"] == "0" || d["16"] == "-1" ? "" : d["16"]) + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Drive Train" + "</b></td><td style='padding-left: 2em'>" + d["17"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Sturdiness" + "</b></td><td style='padding-left: 2em'>" + d["18"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Aesthetics" + "</b></td><td style='padding-left: 2em'>" + d["19"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Sandstorm Ability" + "</b></td><td style='padding-left: 2em'>" + d["20"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Can Pick Up Balls From Ground" + "</b></td><td style='padding-left: 2em'>" + d["21"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Can Pick Up Hatches From Ground" + "</b></td><td style='padding-left: 2em'>" + d["22"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Highest Rocket Level Reachable" + "</b></td><td style='padding-left: 2em'>" + d["23"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Climb Level" + "</b></td><td style='padding-left: 2em'>" + d["24"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Can Carry Other Robots" + "</b></td><td style='padding-left: 2em'>" + d["25"] + "</td></tr>")
    middleThree += ("<tr><td><b>" + "Additional Comments" + "</b></td><td style='padding-left: 2em'>" + d["26"] + "</td></tr>")

    return beginning + middleOne + middleTwo + middleThree + middleFour + end;
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
        }, {}, {}, {}, {}, {visible: true}]
    }

    for(i = 0; i < parseInt($("#numOfMatchDataAverages").text()); i++){
        dtOptions.columns.push({visible: false})
    }

    // Manual fix
    for(i = 0; i < 11; i++){
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