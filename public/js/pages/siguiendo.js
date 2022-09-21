var siguiendo = function () {



	var lista = function () {

			var id_usuario = sesion.url_extrar_usuario('user_siguiendo');
			var usuario_steem = localStorage.getItem("usuario_steem");

			steem.api.getFollowing(id_usuario, 0, 'blog', 100, function(err, result) {
				//console.log(err, result);
				$('#ctlgSiguiendo').html('');				
				$(result).each(function (index, result_2) {

					//Forma incorrecta -> falta paginacion
					steem.api.getFollowers(usuario_steem, 0, 'blog', 1000, function(err_2, result_2) {
						//console.log(err_2, result_2);
						$(result_2).each(function (index_2, result_3) {
							if (result_2[index_2].follower==result[index].following) {							
								sessionStorage.setItem("verificacion-seguimiento", "Te sigue");
								$('#list_seg_txt_'+result[index].following).html(sessionStorage.getItem("verificacion-seguimiento"));
							}else if(result[index].following==localStorage.getItem("usuario_steem")){
								$('#list_seg_btn_'+result[index].following).attr("disabled",true);
								$('#list_seg_btn_'+result[index].following).val("Eres tu");
							}
						});


					});
						$('#ctlgSiguiendo').append('<tr class="row">'+
															'<td class="col-md-6">'+
																'<a href="/@'+result[index].following+'" target="_blank" style="color:blue;"><h5>@'+result[index].following+'</h5></a>'+
															'</td>'+
															'<td class="col-md-3">'+
																'<a id="list_seg_txt_'+result[index].following+'"></a>'+
															'</td>'+
															'<td class="col-md-3">'+
																'<input type="button" id="list_seg_btn_'+result[index].following+'" onclick="siguiendo.dejar_seguir_usuario(&#39;'+result[index].following+'&#39;)" class="btn bg-blue btn-block" value="Dejar de seguir" onclick="siguiendo.dejar_seguir_usuario(&#39;'+result[index].follower+'&#39;)">'+
															'</td>'
														+'<tr>');

				});


			});


	}


	var dejar_seguir_usuario = function (usuario_steem_2) {
		
		
			/** Follow an user */ 
		   var follower = localStorage.getItem("usuario_steem"); // Your username 
		   var following = usuario_steem_2; // User to follow 

		   var postingWif = localStorage.getItem("priwif_steem");

		   /** Unfollow an user */ 
		   var json = JSON.stringify( 
		     ['follow', { 
		       follower: follower, 
		       following: following, 
		       what: [] 
		     }] 
		   ); 
			steem.api.login('', '', function(err, result) {
			  console.log(err, result);
			});		  
		   steem.broadcast.customJson( 
		     postingWif, 
		     [], // Required_auths 
		     [follower], // Required Posting Auths 
		     'follow', // Id 
		     json, // 
		     function(err, result) { 
		       console.log(err, result); 
		       if (!err) {
		       		if(/seguidores/.test(window.location)){
		       			seguidores.lista(localStorage.getItem("usuario_steem"));
		   			}
		       		if(/siguiendo/.test(window.location)){
		       			siguiendo.lista(localStorage.getItem("usuario_steem"));
		   			}					
		       };
		     } 
		   ); 		

	}


	return{
		Iniciar: function () {			
				lista();
		},
		lista : lista,
		dejar_seguir_usuario : dejar_seguir_usuario,
	}
}();
$(window).load(function () {
	siguiendo.Iniciar();
});