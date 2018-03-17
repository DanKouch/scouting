$(document).ready(function() {
    $('#report-table').DataTable({
    	"columnDefs": [ {
	    	"targets": 0,
	    	"orderable": ($("#deleteReportButton").length == 0)
    	} ],
    	"order": [[ 1, "desc" ]]
    });
} );

function deleteMatchScoutingReport(id){
	if(!confirm("Are you sure you want to delete this report?")){
		return;
	}
	$.ajax({
		url: "/match-scouting-report?id=" + id,
		type: "DELETE",
		success: (data) => {
			if(!data){
				alert("Could not delete report. (Server Error)")
			}else{
				alert("Successfully deleted report.")
			}
			location.reload();
		},
		error: (err) => {
			alert("Could not delete report.");
		}
	})
}

function deletePitScoutingReport(id){
	if(!confirm("Are you sure you want to delete this report?")){
		return;
	}
	$.ajax({
		url: "/pit-scouting-report?id=" + id,
		type: "DELETE",
		success: (data) => {
			if(!data){
				alert("Could not delete report. (Server Error)")
			}else{
				alert("Successfully deleted report.")
			}
			location.reload();
		},
		error: (err) => {
			alert("Could not delete report.");
		}
	})
}