var api_url 	  = 'https://critiquehallapi.herokuapp.com/api/admin/';
var api_key 	  = 1234;
var authorization = 'Basic Y2Fwc3RvbmUyMDIxOjEyMzQ=';
var maxRows = 10;
var totalNum;

$('document').ready(function(){
	let url = window.location.href;	

	if(url.includes('%242y%'))
		reset_pass();
	else
		login();
});

function login() {
	if (Cookies.get('id') === undefined || Cookies.get('token') === undefined) {
		$('#main_div').css('display', 'block');

		$('#nav').html('');
		$('#logo').html('<img src="img/critiquehall-dark.png" id="logo_img" style="width: 400px; height: 250px; margin-top: 3%; display: none">');
		$('#main_div').html(
			'<br><form id="login" style=" margin-top: -2%; width: 60%; padding: 2% 0 2% 0; display: none">'+
				'<div class="form-floating" style="width:60%">'+
					'<input type="email" name="email" id="email" class="form-control" placeholder="Email" autocomplete="off">'+
					'<label for="email">Email</label>'+
				'</div><br>'+
				'<div class="form-floating" style="width:60%">'+
					'<input type="password" name="password" id="pass" class="form-control" placeholder="Password">'+
					'<label for="email">Password</label>'+
					'<a href="#" class="forgot_password link-light">Forgot your password?</a>'+
				'</div><br>'+
				'<button id="login_btn" type="submit" class="btn btn-outline-light btn-lg" style="width:60%"><i class="bi bi-box-arrow-in-right"></i></button>'+
			'</form>'
		);

		$('#logo_img').toggle('slow');
		$('#login').toggle('slow');
	} else {
		get_reports();
	}
}

$('#main_div').on('click', '.forgot_password', function(e) {
	e.preventDefault();

	$('.forgot_password').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'forgot_password',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization},
		method: "POST",
		data: {'email':$('#email').val()},
		dataType: "json",
		success:function(data) {
			$('#email').attr('class', 'form-control is-valid');

			$('#flashdata').html(data.message);

			$('#flashdata').attr('class', 'alert alert-primary');

			$('#flashdata').toggle('slow', function() {
				$('.forgot_password').html('Forgot your password?');

				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		},
		error:function(data) {
			$('#email').attr('class', 'form-control is-invalid');
			$('#email').focus();

			if(data.responseJSON.status === null)
				$('#flashdata').html('Error');
			else
				$('#flashdata').html(data.responseJSON.Message);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				$('.forgot_password').html('Forgot your password?');

				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	})
});

function reset_pass() {
	$('#logo').html('<img src="img/critiquehall-dark.png" id="logo_img" style="width: 400px; height: 250px; margin-top: 3%; display: none">');
	$('#main_div').html(
			'<br><form id="reset_pass" style=" margin-top: -2%; width: 60%; padding: 2% 0 2% 0; display: none">'+
				'<div class="form-floating" style="width:60%">'+
					'<input type="password" name="new_password" class="form-control" placeholder="New Password">'+
					'<label for="new_password">New Password</label>'+
				'</div><br>'+
				'<div class="form-floating" style="width:60%">'+
					'<input type="password" name="confirm_new_password" class="form-control" placeholder="Confirm New Password">'+
					'<label for="confirm_new_password">Confirm New Password</label>'+
				'</div><br>'+
				'<button id="reset_pass_button" class="btn btn-outline-light btn-lg" style="width:60%"><i class="bi bi-box-arrow-in-right"></i></button>'+
			'</form>'
		);

	$('#logo_img').toggle('slow');
	$('#reset_pass').toggle('slow');
}

$('#main_div').on('submit', '#reset_pass', function(e) {
	e.preventDefault();

	$('#reset_pass_button').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	var data = $(this).serializeArray();
	data.push({
		name: 'token', 
		value: GetURLParameter('token')
	});

	data.push({
		name: 'admin_id', 
		value: GetURLParameter('admin_id')
	});

	$.ajax({
		url: api_url+'reset_password',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization},
		method: "POST",
		data: data,
		dataType: "json",
		success:function(data) {
			$('#reset_pass_button').html('<i class="bi bi-box-arrow-in-right"></i>');

			$('#flashdata').html(data.message+'. Will be redirected to login page after 3 seconds.');

			$('#flashdata').attr('class', 'alert alert-primary');

			setTimeout(() => { 
			        window.location.replace(window.location.origin);
			    }, 3000);

			$('#flashdata').toggle('slow', function() {
				$('.forgot_password').html('<i class="bi bi-box-arrow-in-right"></i>');

				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		},
		error:function(data) {
			$('#reset_pass_button').html('<i class="bi bi-box-arrow-in-right"></i>');
			
			if(data.responseJSON.message === null)
				$('#flashdata').html('Error');
			else
				$('#flashdata').html(data.responseJSON.message);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				$('.forgot_password').html('<i class="bi bi-box-arrow-in-right"></i>');

				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	})
});

//OTP
$('#main_div').on('submit', '#login', function(e) {
	e.preventDefault();

	$('#login_btn').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	Cookies.set('email', $('#email').val());
	Cookies.set('password', $('#pass').val());	

	$.ajax({
		url: api_url+'login',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) {
			Cookies.set('id', data.encrypted_id);
			$('#login').toggle('slow', function() {
				$('#main_div').html(
					'<form id="otp" style="width: 60%; padding: 2% 0 2% 0; display: none">'+
						'<div class="form-group" style="width:60%">'+
							'<h5 style="color: white; -webkit-appearance: none">OTP expiration: <span id="timer">60</span></h5>'+
							'<input type="text" name="encrypted_id" value="'+Cookies.get('id')+'" hidden>'+
							'<div class="form-floating" style="width:60%">'+
								'<input type="number" name="otp" class="form-control" placeholder="OTP">'+
								'<label for="otp">OTP</label>'+
							'</div>'+
						'</div><br>'+
						'<div class="btn-group" style="width:35%">'+
							'<button type="submit" id="submit_otp" class="btn btn-outline-light btn-lg" style="width:50%"><i class="bi bi-box-arrow-in-right"></i></button>'+
							'<button type="button" id="resend" class="btn btn-secondary btn-lg" style="width:50%" disabled><i class="bi bi-arrow-clockwise"></i></button>'+
						'</div>'+
					'</form>'
				);

				$('#flashdata').html('The OTP has been sent to your email');
				$('#flashdata').attr('class', 'alert alert-primary');
				$('#flashdata').toggle('slow', function() {
					setTimeout(() => { 
				        $('#flashdata').toggle('slow');
				    }, 3000);
				});

				var timer = setInterval(function() {
					$('#timer').html($('#timer').html()-1);
				}, 1000);

				setTimeout(() => {
					clearInterval(timer);
					$('#resend').removeAttr('disabled');
					$('#resend').attr('class', 'btn btn-outline-light btn-lg');

				}, 60500);

				$('#otp').toggle('slow');
			});
		},
		error:function(data) {
			$('#login_btn').html('<i class="bi bi-box-arrow-in-right"></i>');

			if (data.responseJSON.status === false)
				$('#flashdata').html('Minute lock ongoing');
			else if (data.responseJSON.status === 'Error')
				$('#flashdata').html(data.responseJSON.message);
			else			
				$('#flashdata').html(data.responseJSON.status);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	})
});

$('#main_div').on('click', '#resend', function() {
	$('#resend').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'login',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization},
		method: "POST",
		data: {'email': Cookies.get('email'), 'password': Cookies.get('password')},
		async: true,
		dataType: "json",
		success:function(data) {
			$('#timer').html('60');

			$('#resend').attr('disabled', true);
			$('#resend').attr('class', 'btn btn-secondary btn-lg');

			timer = setInterval(function() {
				$('#timer').html($('#timer').html()-1);
			}, 1000);

			setTimeout(() => {
				clearInterval(timer);
				$('#resend').removeAttr('disabled');
				$('#resend').attr('class', 'btn btn-outline-light btn-lg');

			}, 60500);

			$('#resend').html('<i class="bi bi-arrow-clockwise"></i>');
		}
	});
});

$('#main_div').on('submit', '#otp', function(e) {
	e.preventDefault();

	$('#submit_otp').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'confirm_otp',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization},
		method: "POST",
		data: $(this).serializeArray(),
		async: true,
		dataType: "json",
		success:function(data) {
			$('#logo_img').toggle('slow');

			Cookies.set('token', data.token);
			Cookies.set('is_super_admin', data.is_super_admin);
			Cookies.set('first_name', data.first_name);
			Cookies.set('last_name', data.last_name);
			Cookies.set('password', null);

			get_reports();
		},
		error:function(data) {
			$('#submit_otp').html('<i class="bi bi-box-arrow-in-right"></i>');

			$('#flashdata').html(data.responseJSON.message);
			$('#flashdata').attr('class', 'alert alert-danger');
			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	})
});

$('#nav').on('click', '.nav-link', function() {
	$(this).siblings().attr('class', 'nav-link');
	$(this).attr('class', 'nav-link active');
});

$('#nav').on('click', '#reports', function() {
	$('#main_div').toggle('slow', function () {
		$('#table_body').html('');

		$('#main_div').toggle('slow', function () {
			get_reports();
		});
	});
});

function get_reports(type) {
	$('#otp').toggle('slow');

	if (type === undefined)
		type = 'unread';

	$('#nav').html(
		'<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="navbar">'+
		  '<div class="container-fluid">'+
		    '<a class="navbar-brand"><img src="img/critiquehall-dark.png" style="width: 100px; height: 60px"></a>'+
		    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">'+
		      '<span class="navbar-toggler-icon"></span>'+
		    '</button>'+
		    '<div class="collapse navbar-collapse" id="navbarNavAltMarkup">'+
		      '<div class="navbar-nav">'+
		        '<span id="reports" class="nav-link active" style="cursor: pointer">Reports</span>'+
		        '<span id="users" class="nav-link" style="cursor: pointer">User Management</span>'+
		        '<span id="activtiy_log" class="nav-link" style="cursor: pointer">Activity Logs</span>'+
		      '</div>'+
		      '<ul class="navbar-nav ms-auto mb-2 mb-lg-0">'+
		      	'<span class="nav-link disabled" style="color: #e7decc">'+Cookies.get('first_name')+' '+Cookies.get('last_name')+'</span>'+
		      	'<span class="nav-link disabled"></span>'+
		      	'<span class="nav-link disabled"></span>'+
		      	'<span class="nav-link disabled"></span>'+
		        '<span id="logout" class="nav-link" style="cursor: pointer"><i class="bi bi-box-arrow-right"></i></span>'+
		      '</ul>'+
		    '</div>'+
		  '</div>'+
		'</nav>'
	);

	$('#main_div').html(
		'<br><div style="width: 80%">'+
			'<div class="btn-group" style="width:100%">'+
				'<button id="unread" class="types btn btn-light btn-lg" style="width: 33%">Unread</button>'+
				'<button id="read" class="types btn btn-outline-light btn-lg" style="width: 33%">Read</button>'+
				'<button id="notified" class="types btn btn-outline-light btn-lg" style="width: 33%">Resolved</button>'+
			'</div>'+
			'<table style="text-align: center; border: 1px solid white" class="table table-dark table-borderless" id="reports_table">'+
			  '<thead>'+
			    '<tr>'+
			      '<th scope="col">Report Id</th>'+
			      '<th scope="col">Reporter Id</th>'+
			      '<th scope="col">Reportee Id</th>'+
			      '<th scope="col">Reportee Display Name</th>'+
			      '<th scope="col">Type</th>'+
			      '<th scope="col">Date/Time</th>'+
			    '</tr>'+
			  '</thead>'+
			  '<tbody id="table_body">'+
			  	'<tr><td colspan="6"><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...</td></tr>'+
			  '</tbody>'+
			'</table>'+
			'<ul class="pagination btn-group" id="pagination"></ul>'+
		'</div>'
	);

	$.ajax({
		url: api_url+'get_reports/'+type,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "GET",
		dataType: "json",
		success:function(data) {
			$('#table_body').html('');
			$('.pagination').html('');

			if (data.Reports == '')
				$('#table_body').append(
					'<tr>'+
				    	'<td colspan="6">No Reports Found</td>'+
				    '</tr>'
				);
			else
				$.each(data.Reports, function(index, value){
					if (value.post_id !== null)
						var type = 'Post';
					else if(value.critique_id !== null)
						var type = 'Critique';
					else if(value.reply_id !== null)
						var type = 'Reply';
					else
						var type = 'User';

					$('#table_body').append(
						'<tr id="'+index+'tr" class="view_reports" style="display: none" data-bs-toggle="modal" data-bs-target="#modal">'+
					    	'<td class="report_id" id="'+value.report_id+'">'+value.report_id+'</td>'+
					    	'<td class="reporter_id">'+value.reporter_id+'</td>'+
					    	'<td class="user_id">'+value.user_id+'</td>'+
					    	'<td class="offense_type">'+value.display_name+'</td>'+
					    	'<td class="offense_type">'+type+'</td>'+
					    	'<td class="created_at">'+value.created_at+'</td>'+
					    '</tr>'
					);

					$('#'+index+'tr').toggle('slow');
				});

			pagination();
		},
		error:function() {
			Cookies.remove('id');
			Cookies.remove('token');

			login();
		}
	});
}

$('#main_div').on('click', '.types', function() {
	var type = $(this).attr('id');

	$('#table_body').html('<tr><td colspan="6"><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...</td></tr>');

	$('#filter').html(type);

	$(this).attr('class', 'types btn btn-light btn-lg');
	$(this).siblings('.types').attr('class', 'types btn btn-outline-light btn-lg');

	$.ajax({
		url: api_url+'get_reports/'+type,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "GET",
		dataType: "json",
		success:function(data) {
			$('#table_body').html('');
			$('.pagination').html('');

			if (data.Reports == '')
				$('#table_body').append(
					'<tr>'+
				    	'<td colspan="6">No Reports Found</td>'+
				    '</tr>'
				);
			else
				$.each(data.Reports, function(index, value){
					if (value.post_id !== null)
						var type = 'Post';
					else if(value.critique_id !== null)
						var type = 'Critique';
					else if(value.reply_id !== null)
						var type = 'Reply';
					else
						var type = 'User';

					$('#table_body').append(
						'<tr id="'+index+'tr" class="view_reports" style="display: none" data-bs-toggle="modal" data-bs-target="#modal">'+
					    	'<td class="report_id" id="'+value.report_id+'">'+value.report_id+'</td>'+
					    	'<td class="reporter_id">'+value.reporter_id+'</td>'+
					    	'<td class="user_id">'+value.user_id+'</td>'+
					    	'<td class="offense_type">'+value.display_name+'</td>'+
					    	'<td class="offense_type">'+type+'</td>'+
					    	'<td class="created_at">'+value.created_at+'</td>'+
					    '</tr>'
					);

					$('#'+index+'tr').toggle('slow');
				});

			pagination()
		},
		error:function(data) {
			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}
		}
	});
});

$('#main_div').on('click', '.view_reports', function() {
	$('#modal-label').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');
	$('.modal-body').html('');

	var report_id = $(this).children('.report_id').html();
	var tr_id 	  = $(this).attr('id');
	var type 	  = $('#filter').html();

	$.ajax({
		url: api_url+'get_report/'+report_id,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "GET",
		dataType: "json",
		success:function(data) {
			if(data.Report.is_resolved == 0) {
				var is_resolved = '<form id="reply_report">'+
									'<input type="text" name="report_id" value="'+data.Report.encrypted_report_id+'" hidden>'+
									'<div class="form-floating" style="color: #212121">'+
										'<select class="form-select" id="sanction" name="sanction_type"></select>'+
										'<label for="floatingSelect">Sanction</label>'+
									'</div><br>'+
									'<div id="sanction_until" class="input-group flex-nowrap">'+
									  '<span class="input-group-text" id="addon-wrapping">Sanction Until</span>'+
									  '<input type="datetime-local" name="sanction_exp" value="'+data.Report.sanction_exp+'" class="form-control"><br>'+
									'</div>'+
									'<div class="form-floating" id="warning_box" style="color: #212121; display: none">'+
										'<textarea class="form-control" name="msg" style="height: auto"></textarea>'+
										'<label for="floatingTextarea2">Message</label>'+
									'</div>'+
									'<input type="number" name="delete" class="delete" value="0" hidden>'+
									'<br><button type="submit" id="reply_report_btn" class="btn btn-outline-light btn-lg" style="float: right"><i class="bi bi-box-arrow-in-right"></i></button>'+
								'</form>';

				var report_obj   = '';
				var delete_obj   = '';
				var edit_history = '';
				if($.isNumeric(data.Report.post_id)) {
					var report_obj = '<h6>Post:</h6>'+ 
									'<div class="input-group">'+
										'<span id="https://critiquehall.vercel.app/post/'+data.Report.post_id+'" class="report_obj" style="width: 50px; height: 50px; font-size: 200%; cursor: pointer"><i class="bi bi-box-arrow-up-right"></i></span>'+
										'<span class="input-group-text">Id</span>'+
										'<input type="text" value="'+data.Report.post_id+'" class="form-control" disabled>'+
									'</div><br>';
					var delete_obj = 
							'<div class="form-check form-switch">'+
								'<label class="form-check-label">Delete Post</label>'+
								'<input class="form-check-input" type="checkbox" id="is_deleted">'+
							'</div><br>';
				} else if(($.isNumeric(data.Report.critique_id))) {
					$.each(data.Report.critique_vers, function(index, value){
						edit_history = edit_history+"Date: "+value.created_at+'&#13;&#10;Body: '+value.body+'&#13;&#10;&#13;&#10;';
					});

					if(edit_history == '')
						edit_history = '-';

					var report_obj = '<h6>Critique:</h6>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" style="height: auto" disabled>'+data.Report.critique_body+'</textarea>'+
										'<label for="floatingTextarea2">Critique Body:</label>'+
									'</div><br>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" class="edit_history" style="height: auto" disabled>'+edit_history+'</textarea>'+
										'<label for="floatingTextarea2">Edit History:</label>'+
									'</div><br>';

					var delete_obj = 
							'<div class="form-check form-switch">'+
								'<label class="form-check-label">Delete Critique</label>'+
								'<input class="form-check-input" type="checkbox" id="is_deleted">'+
							'</div><br>';
				} else if (($.isNumeric(data.Report.reply_id))) {
					$.each(data.Report.reply_vers, function(index, value){
						edit_history = edit_history+"Date: "+value.created_at+'&#13;&#10;Body: '+value.body+'&#13;&#10;&#13;&#10;';
					});

					if(edit_history == '')
						edit_history = '-';

					var report_obj = '<h6>Reply:</h6>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" style="height: auto" disabled>'+data.Report.reply_body+'</textarea>'+
										'<label for="floatingTextarea2">Reply Body:</label>'+
									'</div><br>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" class="edit_history" style="height: auto" disabled>'+edit_history+'</textarea>'+
										'<label for="floatingTextarea2">Edit History:</label>'+
									'</div><br>';
					
					var delete_obj = 
							'<div class="form-check form-switch">'+
								'<label class="form-check-label">Delete Reply</label>'+
								'<input class="form-check-input" type="checkbox" id="is_deleted">'+
							'</div><br>';
				}
			} else {
				var is_resolved = '<div class="form-floating" style="color: #212121">'+
										'<select class="form-select" id="sanction" disabled></select>'+
										'<label for="floatingSelect">Sanction</label>'+
									'</div><br>'+
									'<div class="input-group flex-nowrap">'+
									  '<span class="input-group-text" id="addon-wrapping">Sanction Until</span>'+
									  '<input type="datetime-local" value="'+data.Report.sanction_exp+'" class="form-control" disabled>'+
									'</div><br>';

				var report_obj   = '';
				var delete_obj   = '';
				var edit_history = '';
				if($.isNumeric(data.Report.post_id)) {
					var report_obj = '<h6>Post:</h6>'+ 
									'<div class="input-group">'+
										'<span id="https://critiquehall.vercel.app/post/'+data.Report.post_id+'" style="width: 50px; height: 50px; font-size: 200%; cursor: pointer"><i class="bi bi-box-arrow-up-right"></i></span>'+
										'<span class="input-group-text">Id</span>'+
										'<input type="text" value="'+data.Report.post_id+'" class="form-control" disabled>'+
									'</div><br>';
				} else if(($.isNumeric(data.Report.critique_id))) {
					$.each(data.Report.critique_vers, function(index, value){
						edit_history = edit_history+"Date: "+value.created_at+'&#13;&#10;Body: '+value.body+'&#13;&#10;&#13;&#10;';
					});

					if(edit_history == '')
						edit_history = '-';

					var report_obj = '<h6>Critique:</h6>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" style="height: auto" disabled>'+data.Report.critique_body+'</textarea>'+
										'<label for="floatingTextarea2">Critique Body:</label>'+
									'</div><br>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" style="height: auto" disabled>'+edit_history+'</textarea>'+
										'<label for="floatingTextarea2">Edit History:</label>'+
									'</div><br>';
				} else if (($.isNumeric(data.Report.reply_id))) {
					$.each(data.Report.reply_vers, function(index, value){
						edit_history = edit_history+"Date: "+value.created_at+'&#13;&#10;Body: '+value.body+'&#13;&#10;&#13;&#10;';
					});

					if(edit_history == '')
						edit_history = '-';

					var report_obj = '<h6>Reply:</h6>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" style="height: auto" disabled>'+data.Report.reply_body+'</textarea>'+
										'<label for="floatingTextarea2">Reply Body:</label>'+
									'</div><br>'+
									'<div class="form-floating" style="color: #212121">'+
										'<textarea class="form-control" class="edit_history" style="height: auto" disabled>'+edit_history+'</textarea>'+
										'<label for="floatingTextarea2">Edit History:</label>'+
									'</div><br>';
				}
			}

			$('#modal-label').html('Report Id <span id="report_id">'+report_id+'</span>');
			$('.modal-body').html(
				'<div class="input-group">'+
				  '<span class="input-group-text">Date/Time</span>'+
				  '<input class="form-control" value="'+data.Report.created_at+'" disabled>'+
				'</div><br>'+
				'<div class="form-floating" style="color: #212121">'+
					'<textarea class="form-control" name="reply" style="height: auto" disabled>'+data.Report.message+'</textarea>'+
					'<label for="floatingTextarea2">Description</label>'+
				'</div><br>'+
				'<h6>Reporter:</h6>'+
				'<div class="input-group">'+
				    '<img class="reportee_pp" src="'+data.Report.reporter_pp+'" style="width: 50px; height: 50px; border-radius: 5px">&nbsp'+
					'<span class="input-group-text">Id/Display Name</span>'+
					'<input type="text" value="'+data.Report.reporter_id+'" class="form-control" disabled>'+
					'<input type="text" value="'+data.Report.reporter_dn+'" class="reportee_dn form-control" disabled>'+
				'</div><br>'+
				'<h6>Reportee:</h6>'+
				'<div class="input-group">'+
					'<img class="reportee_pp" src="'+data.Report.reportee_pp+'" style="width: 50px; height: 50px; border-radius: 5px">&nbsp'+
					'<span class="input-group-text">Id/Display Name</span>'+
					'<input type="text" value="'+data.Report.reportee_id+'" class="form-control" disabled>'+
					'<input type="text" value="'+data.Report.reportee_dn+'" class="reportee_dn form-control" disabled>'+
				'</div><br>'+
				report_obj+
				'<hr>'+
				delete_obj+
				is_resolved
			);
		
			if(data.Report.sanction_type == 'Suspend')
				$('#sanction').append(
					'<option disabled>Choose a Type</option>'+
					'<option value="None">None</option>'+
					'<option value="Warning">Warn</option>'+
					'<option value="Mute">Mute</option>'+
					'<option value="Suspend" selected>Suspend</option>'+
					'<option value="Duplicate">Duplicate Report</option>'
				);
			else if (data.Report.sanction_type == 'Mute')
				$('#sanction').append(
					'<option disabled>Choose a Type</option>'+
					'<option value="None">None</option>'+
					'<option value="Warning">Warn</option>'+
					'<option value="Mute" selected>Mute</option>'+
					'<option value="Suspend">Suspend</option>'+
					'<option value="Duplicate">Duplicate Report</option>'
				);
			else
				$('#sanction').append(
					'<option selected disabled>Choose a Type</option>'+
					'<option value="None">None</option>'+
					'<option value="Warning">Warn</option>'+
					'<option value="Mute">Mute</option>'+
					'<option value="Suspend">Suspend</option>'+
					'<option value="Duplicate">Duplicate Report</option>'
				);

			if(type == 'unread')
				$('#reports_table').find('#'+tr_id).toggle('slow', function() {
					$('#reports_table').find('#'+tr_id).remove();

					if ($('#table_body tr').length < 1)
						$('#table_body').append('<tr>'+
												    	'<td colspan="6">No Reports Found</td>'+
												    '</tr>'
												    );
				});
		},
		error:function(data) {
			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}
		}
	});
});

$('.modal-body').on('click', '#is_deleted', function() {
	if($('.delete').val() == 0)
		$('.delete').val(1);
	else
		$('.delete').val(0);
});

$('.modal-body').on('change', '#sanction', function() {
	if ($(this).val() == 'Warning')
		$('#warning_box').toggle('slow');
	else if ($('#warning_box').css('display') == 'block')
		$('#warning_box').toggle('slow');

	if ($(this).val() == 'Mute' || $(this).val() == 'Suspend') {
		if ($('#sanction_until').css('display') == 'none')
			$('#sanction_until').toggle('slow');
	}
	else if ($('#sanction_until').css('display') == 'flex') {
		$('#sanction_until').toggle('slow');
		console.log($('#sanction_until').css('display'));
	}
});

$('#modal').on('click', '.reportee_pp, .report_obj', function() {
	if($(this).attr('class') == 'report_obj')
		window.open($(this).attr('id'));
	else
		window.open('https://critiquehall.vercel.app/profile/'+$(this).siblings('.reportee_dn').val());
});

$('#modal').on('submit', '#reply_report', function(e) {
	e.preventDefault();
	
	$('#reply_report_btn').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');
	var report_id = $(this).parent().siblings('.modal-header').find('#report_id').html();

	$.ajax({
		url: api_url+'reply_report',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) {
			if (data.status === true) {
				$('#reply_report_btn').html('<i class="bi bi-box-arrow-in-right"></i>');

				$('#reports_table').find('#'+report_id).parent().toggle('slow', function() {
					$('#reports_table').find('#'+report_id).parent().remove();

					if ($('#table_body tr').length < 1)
						$('#table_body').append('<tr>'+
												    	'<td colspan="6">No Reports Found</td>'+
												    '</tr>'
												    );
				});

				$('#btn-close').trigger('click');

				$('#flashdata').html('Report Resolved');
				$('#flashdata').attr('class', 'alert alert-success');
				$('#flashdata').toggle('slow', function() {
					setTimeout(() => { 
				        $('#flashdata').toggle('slow');
				    }, 3000);
				});
			}
		},
		error:function(data) {
			$('#reply_report_btn').html('<i class="bi bi-box-arrow-in-right"></i>');

			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			} else if (data.responseJSON.status != null) {
				$('#flashdata').html(data.responseJSON.status);
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	})
});

$('#nav').on('click', '#users', function() {
	$('#main_div').toggle('slow', function() {
		var admin_func;

		if(Cookies.get('is_super_admin') == 1)
			admin_func = 
					'<div class="btn-group" style="width:100%">'+
						'<button id="user" class="user_type btn btn-light btn-lg" style="width: 33%">User</button>'+
						'<button id="admin" class="user_type btn btn-outline-light btn-lg" style="width: 33%">Admin</button>'+
						'<button id="add_admin" data-bs-toggle="modal" data-bs-target="#modal" class="btn btn-outline-light btn-lg" style="width: 33%" hidden><i class="bi bi-person-plus"></i></button>'+
					'</div>';
		else
			admin_func = '';

		$('#main_div').html(
			'<br><div style="width: 80%">'+
				admin_func+
				'<table style="text-align: center; border: 1px solid white" class="table table-dark table-borderless" id="reports_table">'+
				  '<thead>'+
				    '<tr>'+
				      '<th scope="col" id="user_th">User Id</th>'+
				      '<th scope="col" id="admin_th" hidden>Admin Id</th>'+
				      '<th scope="col">Full Name</th>'+
				      '<th scope="col" id="display_name">Display Name</th>'+
				      '<th scope="col">Registration Date</th>'+
				    '</tr>'+
				  '</thead>'+
				  '<tbody id="table_body"></tbody>'+
				'</table>'+
				'<ul class="pagination btn-group" id="pagination"></ul>'+
			'</div>'
		);

		$('#main_div').toggle('slow');

		get_accs('user');
	});
});

$('#main_div').on('click', '.user_type', function() {
	$(this).attr('class', 'user_type btn btn-light btn-lg');

	$(this).siblings('.user_type').attr('class', 'user_type btn btn-outline-light btn-lg');

	get_accs($(this).attr('id'));
});

function get_accs(user_type) {
	if (user_type == 'admin') {
		$('#admin_th').removeAttr('hidden');
		$('#user_th').attr('hidden', true);
	} else {
		$('#user_th').removeAttr('hidden');
		$('#admin_th').attr('hidden', true);
	}

	$('#table_body').html('<tr><td colspan="6"><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...</td></tr>');
	
	$.ajax({
		url: api_url+'get_accs/'+user_type,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "GET",
		dataType: "json",
		success:function(data) {
			$('#table_body').html('');
			$('.pagination').html('');

			if (user_type == 'admin') {
				$('#display_name').attr('hidden', true);
				$('#add_admin').removeAttr('hidden');
			} else {
				$('#display_name').removeAttr('hidden');
				$('#add_admin').attr('hidden', true);
			}

			if (data.Accs == '') {
				$('#table_body').append(
					'<tr>'+
				    	'<td colspan="6">No Accounts Found</td>'+
				    '</tr>'
				);
			} else {
				if(user_type == 'admin') {
					$.each(data.Accs, function(index, value){
						$('#table_body').append(
							'<tr id='+value.admin_id+' class="admin" style="display: none"  data-bs-toggle="modal" data-bs-target="#modal">'+
						    	'<td class="user_id">'+value.admin_id+'</td>'+
						    	'<td class="full_name">'+value.first_name+' '+value.last_name+'</td>'+
						    	'<td class="created_at">'+value.created_at+'</td>'+
						    '</tr>'
						);

						$('#'+value.admin_id).toggle('slow');
					});
				} else if (user_type == 'user') {
					$.each(data.Accs, function(index, value){
						$('#table_body').append(
							'<tr id='+value.id+' class="user" style="display: none" data-bs-toggle="modal" data-bs-target="#modal">'+
						    	'<td class="user_id">'+value.id+'</td>'+
						    	'<td class="full_name">'+value.first_name+' '+value.last_name+'</td>'+
						    	'<td class="display_name">'+value.display_name+'</td>'+
						    	'<td class="created_at">'+value.created_at+'</td>'+
						    '</tr>'
						);

						$('#'+value.id).toggle('slow');
					});
				}
			}

			pagination();
		},
		error:function() {
			Cookies.remove('id');
			Cookies.remove('token');

			login();
		}
	});
}

$('#main_div').on('click', '.user, .admin', function() {
	$('#modal-label').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');
	$('.modal-body').html('');

	var id   = $(this).attr('id');
	var type = $(this).attr('class');

	$.ajax({
		url: api_url+'get_acc',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		data: {'id':id, 'type':type},
		method: "GET",
		dataType: "json",
		success:function(data) {
			if (type == 'user') {
				$('#modal-label').html('User Id <span id="id">'+id+'</span>');
				$('.modal-body').html(
					'<form id="update_user">'+
						'<input name="id" value="'+data.user.encrypted_id+'"hidden>'+
						'<div class="input-group">'+
						  '<span class="input-group-text">Registration Date</span>'+
						  '<input class="form-control" value="'+data.user.created_at+'" disabled>'+
						'</div><br>'+
						'<div class="input-group">'+
						  '<span class="input-group-text">First Name/Last Name</span>'+
						  '<input type="text" id="fn" name="first_name" value="'+data.user.first_name+'" class="form-control">'+
						  '<input type="text" id="ln" name="last_name" value="'+data.user.last_name+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Display Name</span>'+
						  '<input type="text" id="dn" name="display_name" value="'+data.user.display_name+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Email</span>'+
						  '<input type="email" name="email" value="'+data.user.email+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">About Me</span>'+
						  '<input type="text" name="about_me" value="'+data.user.about_me+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Reputation Stars</span>'+
						  '<input type="number" name="reputation_points" value="'+data.user.reputation_points+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Specialization</span>'+
						  '<input type="text" name="specialization" value="'+data.user.specialization+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Profile Picture</span>'+
						  '<input type="text" name="profile_photo" value="'+data.user.profile_photo+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Cover Picture</span>'+
						  '<input type="text" name="cover_photo" value="'+data.user.cover_photo+'" class="form-control">'+
						'</div><br>'+
						'<button class="btn btn-outline-light btn-lg" style="float: right"><i class="bi bi-save"></i></button>'+
					'</form><br><br><hr>'+

					'<form id="sanction_user">'+
						'<input name="id" value="'+data.user.encrypted_id+'"hidden>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Sanction Type</span>'+
						  '<select id="sanction" class="form-select" name="sanction_type" name="sanction" placeholder="Sanction"></select>'+
						'</div><br>'+
						'<div class="input-group flex-nowrap" id="sanction_until">'+
						  '<span class="input-group-text" id="addon-wrapping">Sanction Expiration</span>'+
						  '<input type="datetime-local" name="sanction_exp" value="'+data.user.sanction_exp+'" class="form-control">'+
						'</div>'+
						'<div class="form-floating" id="warning_box" style="color: #212121; display: none">'+
							'<textarea class="form-control" name="msg" style="height: auto"></textarea>'+
							'<label for="floatingTextarea2">Message</label>'+
						'</div>'+
						'<br><button class="btn btn-outline-light btn-lg" style="float: right"><i class="bi bi-save"></i></button>'+
					'</form>'
				);

				if(data.user.sanction_type == 'Suspend')
					$('#sanction').append(
						'<option disabled>Choose a Type</option>'+
						'<option value="Warning">Warn</option>'+
						'<option value="Suspend" selected>Suspend</option>'+
						'<option value="Mute">Mute</option>'
					);
				else if (data.user.sanction_type == 'Mute')
					$('#sanction').append(
						'<option disabled>Choose a Type</option>'+
						'<option value="Warning">Warn</option>'+
						'<option value="Suspend">Suspend</option>'+
						'<option value="Mute" selected>Mute</option>'
					);
				else
					$('#sanction').append(
						'<option selected disabled>Choose a Type</option>'+
						'<option value="Warning">Warn</option>'+
						'<option value="Suspend">Suspend</option>'+
						'<option value="Mute">Mute</option>'
					);
			} else if (type == 'admin') {
				if (data.admin.is_super_admin == 1)
					var is_super_admin = 
						'<div class="form-check form-switch">'+
							'<label class="form-check-label">Super Admin</label>'+
							'<input class="form-check-input" type="checkbox" id="is_super_admin" checked>'+
						'</div>';
				else
					var is_super_admin = 
						'<div class="form-check form-switch">'+
							'<label class="form-check-label">Super Admin</label>'+
							'<input class="form-check-input" type="checkbox" id="is_super_admin">'+
						'</div>';

				if (data.admin.is_disabled == 1)
					var is_disabled = 
						'<div class="form-check form-switch">'+
							'<label class="form-check-label">Disabled</label>'+
							'<input class="form-check-input" type="checkbox" id="is_disabled" checked>'+
						'</div>';
				else
					var is_disabled = 
						'<div class="form-check form-switch">'+
							'<label class="form-check-label">Disabled</label>'+
							'<input class="form-check-input" type="checkbox" id="is_disabled">'+
						'</div>';

				$('#modal-label').html('Admin Id <span id="id">'+id+'</span>');
				$('.modal-body').html(
					'<form id="update_admin">'+
						'Registration Date: '+data.admin.created_at+'<br><br>'+
						'<input name="id" value="'+data.admin.encrypted_id+'"hidden>'+
						'<div class="input-group">'+
						  '<span class="input-group-text">First Name/Last Name</span>'+
						  '<input type="text" id="fn" name="first_name" value="'+data.admin.first_name+'" class="form-control">'+
						  '<input type="text" id="ln" name="last_name" value="'+data.admin.last_name+'" class="form-control">'+
						'</div><br>'+
						'<div class="input-group flex-nowrap">'+
						  '<span class="input-group-text" id="addon-wrapping">Email</span>'+
						  '<input type="email" name="email" value="'+data.admin.email+'" class="form-control">'+
						'</div>'+
						'<br><button class="btn btn-outline-light btn-lg" style="float: right"><i class="bi bi-save"></i></button><br><br>'+
					'</form>'+
					'<br>'+is_super_admin+'<br>'+
					is_disabled
				);
			}
		}
	});
});

$('#modal').on('submit', '#sanction_user', function (e) {
	e.preventDefault();

	var tr_id = $(this).parent().siblings('.modal-header').find('#id').html();
	$('#sanction_user').children('button').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'sanction_user',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) {
			$('#btn-close').trigger('click');
			
			if(data.status === true) {
				$('#flashdata').html('User id# '+tr_id+': Sanction Updated'); 
				$('#flashdata').attr('class', 'alert alert-success');
			} else {
				$('#flashdata').html('Error'); 
				$('#flashdata').attr('class', 'alert alert-danger');
			}

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			$('#sanction_user').children('button').html('<i class="bi bi-save"></i>');

			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			if(data.responseJSON.Error !== false)
				$('#flashdata').html(data.responseJSON.Error);
			else
				$('#flashdata').html('No changes made');

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	});
});

$('#modal').on('click', '#is_super_admin', function() {
	var tr_id = $(this).parent().parent().siblings('.modal-header').find('#id').html();
	$('#is_super_admin').siblings().html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'super_admin/'+tr_id,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) { 
			$('#btn-close').trigger('click');

			if(data.msg === false) {
				$('#flashdata').html('Error'); 
				$('#flashdata').attr('class', 'alert alert-danger');
			} else {
				$('#flashdata').html(data.msg); 
				$('#flashdata').attr('class', 'alert alert-success');
			}

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	})
});

$('#modal').on('click', '#is_disabled', function() {
	var tr_id = $(this).parent().parent().siblings('.modal-header').find('#id').html();
	$('#is_disabled').siblings().html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'disable_acc/'+tr_id,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) {
			$('#btn-close').trigger('click');

			if(data.msg === false) {
				$('#flashdata').html('Error'); 
				$('#flashdata').attr('class', 'alert alert-danger');
			} else {
				$('#flashdata').html(data.msg); 
				$('#flashdata').attr('class', 'alert alert-success');
			}

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	})
});

$('#modal').on('submit', '#update_user', function(e) {
	e.preventDefault();

	$('#update_user').children('button').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');
	var tr_id = $(this).parent().siblings('.modal-header').find('#id').html();
	var fn 	  = $(this).find('#fn').val();
	var ln    = $(this).find('#ln').val();
	var dn    = $(this).find('#dn').val();

	$.ajax({
		url: api_url+'edit_user',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) { 
			$('#btn-close').trigger('click');

			$('#'+tr_id).find('.full_name').html(fn+' '+ln);
			$('#'+tr_id).find('.display_name').html(dn);

			$('#flashdata').html(data.status);

			$('#flashdata').attr('class', 'alert alert-success');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			$('#update_user').children('button').html('<i class="bi bi-save"></i>');

			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	})
});

$('#modal').on('submit', '#update_admin', function(e) {
	e.preventDefault();

	var tr_id = $(this).parent().siblings('.modal-header').find('#id').html();
	var fn 	  = $(this).find('#fn').val();
	var ln    = $(this).find('#ln').val();

	$('#update_admin').children('button').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	$.ajax({
		url: api_url+'edit_admin',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) { 
			$('#btn-close').trigger('click');

			$('#'+tr_id).find('.full_name').html(fn+' '+ln);

			$('#flashdata').html(data.status);

			$('#flashdata').attr('class', 'alert alert-success');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			$('#update_admin').children('button').html('<i class="bi bi-save"></i>');

			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	})
});

$('#nav').on('click', '#activtiy_log', function() {
	$('#main_div').toggle('slow', function() {
		$('#main_div').toggle('slow');

		if (Cookies.get('is_super_admin') == 1)
			var admin_func = 
					'<div class="btn-group" style="width:100%">'+
						'<button id="user" class="log_type btn btn-light btn-lg" style="width: 33%">User</button>'+
						'<button id="admin" class="log_type btn btn-outline-light btn-lg" style="width: 33%">Admin</button>'+
					'</div>';
		else
			var admin_func = '';

		$('#main_div').html(
			'<br><div style="width: 80%">'+
				admin_func+
				'<table style="text-align: center; border: 1px solid white" class="table table-dark table-borderless" id="logs_table">'+
				  '<thead>'+
				    '<tr>'+
				      '<th scope="col">Log Id</th>'+
				      '<th scope="col" id="user_id">User Id</th>'+
				      '<th scope="col" id="admin_id">Admin Id</th>'+
				      '<th scope="col">Action</th>'+
				      '<th scope="col">Date</th>'+
				    '</tr>'+
				  '</thead>'+
				  '<tbody id="table_body">'+
				  	'<tr><td colspan="6"><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...</td></tr>'+
				  '</tbody>'+
				'</table>'+
				'<ul class="pagination btn-group" id="pagination"></ul>'+
			'</div>'
		);

		get_activity_logs('user');
	});
});

$('#main_div').on('click', '.log_type', function() {
	$('#table_body').html('<tr><td colspan="6"><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...</td></tr>');

	$(this).attr('class', 'log_type btn btn-light btn-lg');

	$(this).siblings().attr('class', 'log_type btn btn-outline-light btn-lg');

	get_activity_logs($(this).attr('id'));
});

function get_activity_logs(type) {
	$.ajax({
		url: api_url+'audit_logs/'+type,
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "GET",
		dataType: "json",
		success:function(data) {
			$('#table_body').html('');
			$('.pagination').html('');

			if(type == 'admin') {
				$('#user_id').attr('hidden', true);
				$('#admin_id').removeAttr('hidden');
				
				$.each(data.logs, function(index, value){
					$('#table_body').append(
						'<tr id="'+index+'tr" style="display: none">'+
					    	'<td class="audit_log_id">'+value.audit_log_id+'</td>'+
					    	'<td class="admin_id">'+value.admin_id+'</td>'+
					    	'<td class="action">'+value.action+'</td>'+
					    	'<td class="created_at">'+value.created_at+'</td>'+
					    '</tr>'
					);

					$('#'+index+'tr').toggle('slow');
				});
			} else if (type == 'user') {
				$('#admin_id').attr('hidden', true);
				$('#user_id').removeAttr('hidden');

				$.each(data.logs, function(index, value){
					$('#table_body').append(
						'<tr id="'+index+'tr" style="display: none">'+
					    	'<td class="audit_log_id">'+value.audit_log_id+'</td>'+
					    	'<td class="user_id">'+value.user_id+'</td>'+
					    	'<td class="action">'+value.action+'</td>'+
					    	'<td class="created_at">'+value.created_at+'</td>'+
					    '</tr>'
					);

					$('#'+index+'tr').toggle('slow');
				});
			}

			pagination();
		},
		error:function(data) { 
			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.Error);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	});
}

function pagination() {
	var trNum = 0;

	var table_id  = $('.table').attr('id');
	var totalRows = $('#'+table_id+' tbody tr').length;

	$('#pagination').html('');

	$('#'+table_id+' tr:gt(0)').each(function() {
		trNum++;

		if (trNum > maxRows)
			$(this).hide();

		if (trNum <= maxRows)
			$(this).show();
	});

	if (totalRows > maxRows) {
		totalNum = Math.ceil(totalRows/maxRows);
		
		$('.pagination').append('<li data-page="1" class="btn btn-outline-light"><i class="bi bi-chevron-bar-left"></i></li>').show();
		
		var pageNum = totalNum
		if(totalNum > 3)
			pageNum = 3;

		for (var i = 1; i<=pageNum;)
			$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light">'+ i++ +'</li>').show();
		
		$('.pagination').append('<li data-page="'+totalNum+'" class="btn btn-outline-light"><i class="bi bi-chevron-bar-right"></i></li>').show();
	}
	$('.pagination li:nth-child(2)').addClass('active');
}

$('#main_div').on('click', '.pagination li', function() {
	var table_id  = $('.table').attr('id');

	var pageNum = $(this).attr('data-page');
	var trIndex = 0;
	$('.pagination li').removeClass('active');
	$(this).addClass('active');

	$('#'+table_id+' tr:gt(0)').each(function() {
		trIndex++;
	
		if(trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows))
			$(this).hide();
		else
			$(this).show();
	});

	var pageNumLess = parseInt(pageNum)-1;
	var pageNumMore = parseInt(pageNum)+1;
	
	if (pageNumLess < 1)
		pageNumLess = 1;

	if (pageNumMore > totalNum)
		pageNumMore = totalNum;

	if (pageNum != 1 && pageNum != totalNum) {
		$('.pagination').html('');

		$('.pagination').append('<li data-page="1" class="btn btn-outline-light"><i class="bi bi-chevron-bar-left"></i></li>').show();

		for (var i = pageNumLess; i <= pageNumMore;)
			if (pageNum == i)
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light active">'+ i++ +'</li>').show();
			else 
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light">'+ i++ +'</li>').show();
	
		$('.pagination').append('<li data-page="'+totalNum+'" class="btn btn-outline-light"><i class="bi bi-chevron-bar-right"></i></li>').show();
	} else if(pageNum == 1 && totalNum != 2) {
		$('.pagination').html('');
		$('.pagination').append('<li data-page="1" class="btn btn-outline-light"><i class="bi bi-chevron-bar-left"></i></li>').show();
		
		for (var i = 1; i<=3;)
			if (i == pageNum)	
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light active">'+ i++ +'</li>').show();
			else
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light">'+ i++ +'</li>').show();

		$('.pagination').append('<li data-page="'+totalNum+'" class="btn btn-outline-light"><i class="bi bi-chevron-bar-right"></i></li>').show();
	} else if (totalNum == 2) {
		$('.pagination').html('');
		$('.pagination').append('<li data-page="1" class="btn btn-outline-light"><i class="bi bi-chevron-bar-left"></i></li>').show();
		
		for (var i = 1; i<=totalNum;)				
			if (i == pageNum)	
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light active">'+ i++ +'</li>').show();
			else
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light">'+ i++ +'</li>').show();
		
		$('.pagination').append('<li data-page="'+totalNum+'" class="btn btn-outline-light"><i class="bi bi-chevron-bar-right"></i></li>').show();
	} else {
		$('.pagination').html('');
		$('.pagination').append('<li data-page="1" class="btn btn-outline-light"><i class="bi bi-chevron-bar-left"></i></li>').show();
		
		for (var i = totalNum-2; i<=totalNum;)				
			if (i == pageNum)	
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light active">'+ i++ +'</li>').show();
			else
				$('.pagination').append('<li data-page="'+i+'" class="btn btn-outline-light">'+ i++ +'</li>').show();
		
		$('.pagination').append('<li data-page="'+totalNum+'" class="btn btn-outline-light"><i class="bi bi-chevron-bar-right"></i></li>').show();
	}
});

$('#main_div').on('click', '#add_admin', function () {
	$('#modal-label').html('Register Admin');

	$('.modal-body').html(
		'<form id="add_admin">'+
			'<div class="input-group">'+
			  '<span class="input-group-text">First Name/Last Name</span>'+
			  '<input type="text" id="fn" name="first_name" class="form-control">'+
			  '<input type="text" id="ln" name="last_name" class="form-control">'+
			'</div><br>'+
			'<div class="input-group flex-nowrap">'+
			  '<span class="input-group-text" id="addon-wrapping">Email</span>'+
			  '<input type="email" name="email" class="form-control">'+
			'</div><br>'+
			'<div class="input-group flex-nowrap">'+
			  '<span class="input-group-text" id="addon-wrapping">Password</span>'+
			  '<input type="password" name="password" class="form-control">'+
			'</div>'+
			'<br><button class="btn btn-outline-light btn-lg" style="float: right"><i class="bi bi-save"></i></button><br><br>'+
		'</form>'
	);

	$('#main_div').find('#fn').focus();
});

$('#modal').on('submit', '#add_admin', function(e) {
	e.preventDefault();

	$('#modal').find('#add_admin').children('button').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbspLoading...');

	var fn = $(this).find('#fn').val();
	var ln = $(this).find('#ln').val();

	$.ajax({
		url: api_url+'register',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		data: $(this).serializeArray(),
		dataType: "json",
		success:function(data) {
			$('#btn-close').trigger('click');

			$('#table_body').prepend(
				'<tr id='+data.id+' class="admin" style="display: none" data-bs-toggle="modal" data-bs-target="#modal">'+
			    	'<td class="user_id">'+data.id+'</td>'+
			    	'<td class="full_name">'+fn+' '+ln+'</td>'+
			    	'<td class="created_at">'+data.date+'</td>'+
			    '</tr>'
			);

			$('#'+data.id).toggle('slow');

			$('#flashdata').html('Successfully registered Admin id# '+ data.id);

			$('#flashdata').attr('class', 'alert alert-success');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		},
		error:function(data) {
			$('#modal').find('#add_admin').children('button').html('<i class="bi bi-save"></i>');

			if (data.statusCode.statusText == "Unauthorized") {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			}

			$('#flashdata').html(data.responseJSON.message);

			$('#flashdata').attr('class', 'alert alert-danger');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 5000);
			});
		}
	})
});

$('#nav').on('click', '#logout', function() {
	$('#logout').html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>');

	$.ajax({
		url: api_url+'logout',
		headers: {'X-API-KEY':api_key, 'Authorization':authorization, 'Admin-Id':Cookies.get('id'), 'Token':Cookies.get('token')},
		method: "POST",
		dataType: "json",
		success:function(data) {
			$('#main_div').toggle('slow', function() {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			});

			$('#flashdata').html('Logged out');

			$('#flashdata').attr('class', 'alert alert-primary');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}, error:function(data) {
			$('#main_div').toggle('slow', function() {
				Cookies.remove('id');
				Cookies.remove('token');

				login();
			});

			$('#flashdata').html('Token Expired');

			$('#flashdata').attr('class', 'alert alert-primary');

			$('#flashdata').toggle('slow', function() {
				setTimeout(() => { 
			        $('#flashdata').toggle('slow');
			    }, 3000);
			});
		}
	});
});

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}