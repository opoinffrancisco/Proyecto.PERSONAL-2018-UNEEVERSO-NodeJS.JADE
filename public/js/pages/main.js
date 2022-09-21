/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';



 
const applicationServerPublicKey = 'BDwbtf6rYaokG3obQ8Z4k2wFOObkRE3QWb-Ss9Mupb-P3XSPt09-UWxZYo43LbSEfKXUfNvgwvVOjll2DfNf7Y0';

let isSubscribed = false;
let swRegistration = null;

var main = function () {

  var urlB64ToUint8Array = function (base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  var subscribeUser = function () {
    var applicationServerKey = main.urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log('User is subscribed.');

      main.gestion_json_push(subscription);

      isSubscribed = true;

    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
    });
  }
  var unsubscribeUser = function () {
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error);
    }).then(function() {
      main.gestion_json_push(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

    });
  }

  var gestion_json_push = function (subscription) {

       if(sesion.validar()==false){
        return false;
      }
      sesion.datos_sesion(function (result_datos_sesion) {
        var datos_token = result_datos_sesion;
        var id_usuario = datos_token.nombre_steem;
        //steem.api.getAccounts([id_usuario], function(err, result) {
          $.ajax({
            url: window.location.origin+'/add-token-push',
            type:'POST', 
            data:{  
                nombre_steem:id_usuario,
                suscripcion_push:(subscription!=null)?JSON.stringify(subscription):"",
              },
              beforeSend: function () {
              },
              success:  function (result) {

                if (result==false) {

                } else{
                  
                };

                  
              },
              error:  function(error) {
                console.log(JSON.stringify(error));
              }  
          });         
      });
  }


  return{
    Iniciar:function () {

      /***********************************************************/
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        //console.log('Service Worker and Push is supported');

        navigator.serviceWorker.register(window.location.origin+'/sw.js')
          .then(function(swReg) {
            //console.log('Service Worker is registered', swReg);
            
            swRegistration = swReg;
            swRegistration.pushManager.getSubscription()
            .then(function(subscription) {
              isSubscribed = !(subscription === null);

              if (isSubscribed) {
                //console.log('User IS subscribed.');
                main.subscribeUser();
              } else {
                console.log('User is NOT subscribed.');
                if(Notification.permission=="granted"){
                  main.subscribeUser();
                }else if(Notification.permission=="default"){
                  main.unsubscribeUser()
                  main.subscribeUser();
                }else{
                  $('#notificacion-block').show();
                  $('[data-toggle="popover1"]').popover({
                    delay: { "show": 100, "hide": 100 },
                    html:true,
                    placement:'bottom',
                    title:'Notificación de escritorio bloqueada',
                    content:' <b>Para habilitar: </b><center><span> Presione</span><img src="/img/btn-https.png"><span> y cambie </span><img src="/img/btn-https-notificacion-bloqueada.png" style="width:  100%;"><span> a </span><img src="/img/btn-https-notificacion-permitir.png" style="width:  100%;"></center>',
                  });
                  $('[data-toggle="popover1"]').popover('show');
                };                  
              }
            });

          }).catch(function(error) {
            console.error('Service Worker Error', error);
          });

      } else {
        console.warn('Push messaging is not supported');
      }
      /***********************************************************/

    },
    urlB64ToUint8Array : urlB64ToUint8Array,
    gestion_json_push:gestion_json_push,
    subscribeUser:subscribeUser,
    unsubscribeUser:unsubscribeUser,
  }
}();




