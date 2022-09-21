var seguidores = function () {



	var lista = function (id_usuario) {

			steem.api.getFollowers(id_usuario, 0, 'blog', 1000, function(err, result) {
				console.log(err, result);
				$('#ctlgSeguidores').html('');				
				$(result).each(function (index, result_2) {

					var is_following_user = false;
					var is_following_user_txt = "No te sigue";
					//Forma incorrecta
					steem.api.getFollowing(id_usuario, 0, 'blog', 100, function(err_2, result_2) {
						console.log(err_2, result_2);
						$(result_2).each(function (index_2, result_3) {

							if (result_2[index_2].following==result[index].follower) {
								is_following_user = true;
								is_following_user_txt = "Te sigue";
								$('#ctlgSeguidores').append('<tr class="row">'+
															'<td class="col-md-6">'+
																'<a href="/@'+result[index].follower+'" target="_blank" style="color:blue;"><h5>@'+result[index].follower+'</h5></a>'+
															'</td>'+
															'<td class="col-md-3">'+
																is_following_user_txt+
															'</td>'+
															'<td class="col-md-3">'+
																'<input type="button" class="btn bg-blue btn-block" value="Seguir" >'+
															'</td>'
														+'<tr>');
							}
							

						});


					}).then(function () {
						

					});


				});


			});
	}
	
	var seguir_usuario = function (usuario_steem_2) {


		   /** Follow an user */ 
		   var follower = localStorage.getItem("usuario_steem"); // Your username 
		   var following = usuario_steem_2; // User to follow 

		   var postingWif = localStorage.getItem("priwif_steem");

		  
		   var json = JSON.stringify( 
		     ['follow', { 
		       follower: follower, 
		       following: following, 
		       what: ['blog'] 
		     }] 
		   ); 
		  
		   steem.broadcast.customJson( 
		     postingWif, 
		     [], // Required_auths 
		     [follower], // Required Posting Auths 
		     'follow', // Id 
		     json, // 
		     function(err, result) { 
		       console.log(err, result); 
		     } 
		   ); 
		  
		
	}

	return{
		Iniciar: function () {
			if (sesion.validar()==true) {
				sesion.extraerDatos(localStorage.getItem("usuario_steem"));
				lista(localStorage.getItem("usuario_steem"));
			};
		},
	}
}();
seguidores.Iniciar();
