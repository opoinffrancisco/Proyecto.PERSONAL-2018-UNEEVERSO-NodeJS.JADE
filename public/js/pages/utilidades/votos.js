var votos = function () {

  var rewardBalance, recentClaims, steemPrice =null;
  var post=null;

  var cargar_votos_post = function (this_) {
      //console.log(this_.url_publicacion);
      if(!this_.url_publicacion || this_.url_publicacion==undefined){
        var url_publicacion = $(this_).data("url_publicacion");
        var usuario_steem_ = $(this_).data("usuario_steem");
      }else{
        var url_publicacion = this_.url_publicacion;
        var usuario_steem_ = this_.usuario_steem;
      }

      $('#lista_votos_post_contenedor').html('');
      $('#lista_votos_post_contenedor').append('<table id="lista_votos_post" class="display" width="100%" data-order="[[ 1, &quot;desc&quot; ]]"></table>');
      $('#lista_votos_post_url').attr('href', '');
      $('#lista_votos_post_url').text('');
      $('#lista_votos_post_panel_datos').hide();
      $('#lista_votos_post_url_separadora').hide();

       //var gestion_mostrar_url = '<td><a href="https://steemit.com/'+result_1.etiqueta+'/@'+result_1.nombre_steem+'/'+result_1.url+'" target="_blank">'+result_1.url+'<a></td>';
       $('#lista_votos_post').html('');
       animaciones_g.listaLoad('lista_votos_post',2,'activar');
       if (url_publicacion=="" || usuario_steem_=="") {
         animaciones_g.listaLoad('lista_votos_post',2,'desactivar');
         return false;
       }
       var datos_post_ = {
        user : usuario_steem_,
        url : url_publicacion,
       }
       animaciones_g.listaLoad('lista_votos_post',2,'activar');
       preparando_votos_post( datos_post_,function (datos_votantes_) {
        $('#lista_votos_post').html('');
        $('#lista_votos_post_url').attr('href',datos_votantes_.post.url);
        $('#lista_votos_post_url').text(datos_votantes_.post.title);
        $('#lista_votos_post_img_autor').attr('src',  'https://steemitimages.com/u/'+datos_votantes_.post.author+'/avatar')
        $('#lista_votos_post_autor').text(datos_votantes_.post.author+' '+'('+steem.formatter.reputation(datos_votantes_.post.author_reputation)+')');
        $('#lista_votos_post_autor').attr('href','/@'+datos_votantes_.post.author)
        $('#lista_votos_post_total').text(datos_votantes_.post.net_votes);
        if (datos_votantes_.post.pending_payout_value.toString().substring(0,5)!='0.000') {
          $('#lista_votos_post_ganancia').text(datos_votantes_.post.pending_payout_value);
          $('#lista_votos_post_fecha_pago').text(datos_votantes_.post.cashout_time);          
        }else{
          $('.content_datos_pagar_lvm').hide()
        };
        $('#lista_votos_post_panel_datos').show();
        $('#lista_votos_post_url_separadora').show();

        var cont_ctrl=0;
        var dataSet =[];
        datos_votantes_.post.active_votes.forEach(function(elt){
          if (elt.percent>0) {
               //console.log(elt)
               cont_ctrl++;
               var porcentaje_voto;
               var votante_post = '<a href="/@'+elt.voter+'" target="_blank">('+steem.formatter.reputation(elt.reputation)+') '+elt.voter+'</a>';
                if (elt.percent.toString().length==1) {
                  porcentaje_voto = '0,0'+elt.percent.toString().substring(0,1);
                }else if (elt.percent.toString().length==2) {
                  porcentaje_voto = '0,'+elt.percent.toString().substring(0,2);
                }else if (elt.percent.toString().length==3) {
                  porcentaje_voto = elt.percent.toString().substring(0,1)+','+elt.percent.toString().substring(1,3);
                }else if (elt.percent.toString().length==4) {
                  porcentaje_voto = elt.percent.toString().substring(0,2)+','+elt.percent.toString().substring(2,4);
                }else if (elt.percent.toString().length==5) {
                  porcentaje_voto = elt.percent.toString().substring(0,3)+','+elt.percent.toString().substring(3,5);
                };
                           
               var valor_voto = (elt.rshares* datos_votantes_.rewardBalance / datos_votantes_.recentClaims* datos_votantes_.steemPrice).toFixed(3)+'$';
               var fecha_votacion = moment(elt.time).tz("America/Bogota").subtract(30, 'minutes').format('YYYY-MM-DD HH:mm');

               dataSet.push([ votante_post, valor_voto, porcentaje_voto.toString(), fecha_votacion ])

               /*$('#lista_votos_post').append('<tr>'+
                 '<td>'+
                   '<center>'+
                     '<span class="badge "><b data-toggle="tooltip" title="Se emitierón los votos">'+votante_post+'</b></span>'+
                   '</center>'+
                 '</td>'+
                 /*'<td>'+
                   '<center>'+
                     '<span class="badge " ><b data-toggle="tooltip" title="Votos obtenidos">'+calcular_reputacion(reputacion_votante)+'</b></span>'+
                   '</center>'+
                 '</td>'+*/
                 /*'<td>'+
                   '<center>'+
                     '<span class="badge " ><b data-toggle="tooltip" title="Votos obtenidos">'+valor_voto+'</b></span>'+
                   '</center>'+
                 '</td>'+
               '<tr>');
               */
               if (cont_ctrl>=datos_votantes_.post.active_votes.length) {
                  //console.log(dataSet)
                  $('#lista_votos_post').DataTable( {
                    data: dataSet,
                    columns: [
                      { title: "Nombre de usuario" },
                      { title: "Valor de voto" },
                      { title: "Porcentaje de voto" },
                      { title: "Fecha de votación" },
                    ],
                    "language": {
                      "lengthMenu": "Mostrat _MENU_ resultados por pagina",
                      "zeroRecords": "No hay resultados",
                      "info": "Mostrando la pagina _PAGE_ de _PAGES_",
                      "infoEmpty": "No hay votos disponibles",
                      "infoFiltered": "(Existen _MAX_ resultados)",
                      "infoPostFix":    "",
                      "thousands":      ",",
                      "lengthMenu":     "Mostrar _MENU_ resultados",
                      "loadingRecords": "Cargando...",
                      "processing":     "Procesando...",
                      "search":         "Buscar:",
                      "zeroRecords":    "No se encontraron votos efectuados a la publicación",
                      "paginate": {
                          "first":      "Primero",
                          "last":       "Ultimo",
                          "next":       "Siguiente",
                          "previous":   "Anterior"
                      },              
                    }
                  });

               };
          }else{
            $('#lista_votos_post_total').text(parseInt($('#lista_votos_post_total').text())-1);
          };
        });
       });
  }
  var preparando_votos_post = function (datos_,callback) {
        $.ajax({
          url: 'https://api.steemjs.com/get_content',
          type:'GET', 
          data:{  
              author:datos_.user,
              permlink:datos_.url,
            },
            beforeSend: function () {
            },
            success:  function (result) {              
              post=result;
              //---------------------------
              sesion.rest_con_api_steem(0);
              steem.api.getRewardFund("post", function(e, t) {
                rewardBalance = parseFloat(t.reward_balance.replace(" STEEM", ""));
                recentClaims = t.recent_claims;
                //console.log(rewardBalance, recentClaims);
                //-------------------------
                $.ajax({
                  url: 'https://api.steemjs.com/get_current_median_history_price',
                  type:'GET',
                    beforeSend: function () {
                    },
                    success:  function (t) {                
                      //steem.api.getCurrentMedianHistoryPrice(function(e, t) {
                        steemPrice = parseFloat(t.base.replace(" SBD", "")) / parseFloat(t.quote.replace(" STEEM", ""));
                        //console.log( steemPrice);
                        callback({ 
                          "rewardBalance" : rewardBalance,
                          "recentClaims" : recentClaims,
                          "steemPrice" : steemPrice,
                          "post" : post,
                        });              
                      //});
                    },
                    error:  function(error) {
                      console.log(JSON.stringify(error));
                      }  
                  });                      
                //-----------
              });
              //-------------


          },
          error:  function(error) {
            console.log(JSON.stringify(error));
            }  
        });
/*        steem.api.getContent(datos_.user, datos_.url, function(err, result) {
          //console.log(err, result);

        });
*/}
  var calcular_reputacion = function (reputacion_) {
    return (reputacion_-9*9+25).toString().substring(0,2);
  }  
  return{
    Iniciar:function () {

    },
    calcular_reputacion : calcular_reputacion,
    cargar_votos_post : cargar_votos_post,
  }
}();
