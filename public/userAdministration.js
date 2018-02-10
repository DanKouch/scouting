function deleteUser(id){
	if(!confirm("Are you sure you want to delete this user?")){
		return;
	}
	$.ajax({
		url: "/api/user?id=" + id,
		type: "DELETE",
		success: (data) => {
			if(!data.success){
				alert("Could not change password. (Server Error)")
			}
			location.reload();
		},
		error: (err) => {
			alert("Could not delete user.");
		}
	})
}

function changePassword(id){
	var newPassword = $("#" + id).val();
	if(newPassword.length < 6){
		alert("Password must be atleast six characters.");
		return;
	}
	if(!confirm("Are you sure you want to change this password?")){
		return;
	}
	$.ajax({
		url: "/api/user/password?id="+id+"&password="+newPassword,
		type: "PUT",
		success: (data) => {
			if(!data.success){
				alert("Could not change password. (Server Error)")
			}
			location.reload()
		},
		error: () => {
			alert("Could not change user password.");
		}
	})
}

