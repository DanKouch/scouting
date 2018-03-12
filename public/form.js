$("#successAlert").fadeTo(2000, 500).slideUp(500, function(){});

$("#driveTrainInput").change(() => {
	$("#customDriveTrainInput").prop("disabled", !($("#driveTrainInput").val() == "Other"));
	if($("#driveTrainInput").val() != "Other"){
		$("#customDriveTrainInput").val("");
	}
});

$("#climberTypeInput").change(() => {
	$("#customClimberTypeInput").prop("disabled", !($("#climberTypeInput").val() == "Other"));
	if($("#climberTypeInput").val() != "Other"){
		$("#customClimberTypeInput").val("");
	}
});