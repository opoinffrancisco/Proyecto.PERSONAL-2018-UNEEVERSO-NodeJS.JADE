var seguidores = function () {



	var lista = function () {

			var id_usuario = sesion.url_extrar_usuario('user_seguidores');
			var usuario_steem = localStorage.getItem("usuario_steem");

			steem.api.getFollowers(id_usuario, 0, 'blog', 1000, function(err, result) {
				//console.log(err, result);
				$('#ctlgSeguidores').html('');				
				$(result).each(function (index, result_2) {

					//Forma incorrecta
					steem.api.getFollowing(usuario_steem, 0, 'blog', 100, function(err_2, result_2) {
						//console.log(err_2, result_2);
						$(result_2).each(function (index_2, result_3) {

							if (result_2[index_2].following==result[index].follower) {
								sessionStorage.setItem("verificacion-seguimiento", "Lo sigues");
								$('#list_seg_txt_'+result[index].follower).html(sessionStorage.getItem("verificacion-seguimiento"));
								//$('#list_seg_btn_'+result[index].follower).attr("disabled",true);
								$('#list_seg_btn_'+result[index].follower).val("Dejar de seguir");
								$('#list_seg_btn_'+result[index].follower).attr("onclick","siguiendo.dejar_seguir_usuario('"+result[index].follower+"')");
							}else if(result[index].follower==localStorage.getItem("usuario_steem")){

								sessionStorage.setItem("verificacion-seguimiento", "Lo estas siguiendo");
								$('#list_seg_txt_'+result[index].follower).html(sessionStorage.getItem("verificacion-seguimiento"));
								$('#list_seg_btn_'+result[index].follower).attr("disabled",true);
								$('#list_seg_btn_'+result[index].follower).val("Eres tu");
								$('#list_seg_btn_'+result[index].follower).attr("onclick","");
							}
						});


					});
						
						$('#ctlgSeguidores').append('<tr class="row">'+
															'<td class="col-md-6">'+
																'<a href="/@'+result[index].follower+'" target="_blank" style="color:blue;"><h5>@'+result[index].follower+'</h5></a>'+
															'</td>'+
															'<td class="col-md-3">'+
																'<a id="list_seg_txt_'+result[index].follower+'"></a>'+
															'</td>'+
															'<td class="col-md-3">'+
																'<input type="button" id="list_seg_btn_'+result[index].follower+'" onclick="seguidores.seguir_usuario(&#39;'+result[index].follower+'&#39;)" class="btn bg-blue btn-block" value="Seguir" >'+
															'</td>'
														+'<tr>');

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

			lista(localStorage.getItem("usuario_steem"));
		},
		lista : lista,
		seguir_usuario : seguir_usuario,
	}
}();
$(window).load(function () {
	seguidores.Iniciar();
});