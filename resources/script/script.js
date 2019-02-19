sessionStorage.setItem('listaColecciones', 'null');
sessionStorage.setItem('listaImagenes', 'null');
sessionStorage.setItem('JSONListaColecciones', 'null');

userHasScrolled = false;

window.onscroll = function (e)
{
    userHasScrolled = true;
}
var lang = (navigator.language || navigator.userLanguage).substring(0,2) ;
//console.log (lang);


$(document).ready(function(){

    function generarGaleriaColecciones(){
        cargarcolecciones().then(function(response){
            asignarComportamientosColecciones();
           
        });

       
    }
    function generarGaleriaImagenes(coleccion, index, html){

        cargarImagenes(coleccion, index, html).then(function(response){
            asignarComportamientosImagenes();
            $('html, body').animate({scrollTop: $('.js--productos').offset().top-50}, 1000);
        });
        
    }
    var  cargarcolecciones = function(){
        return new Promise( function(resolve, reject){
            var listaColecciones = sessionStorage.getItem('listaColecciones');
            var JSONListaColecciones = sessionStorage.getItem('JSONListaColecciones');

            if (!(listaColecciones == "null")){
                //console.log("listaColecciones recuperada");
                document.getElementById("listaColecciones").innerHTML = listaColecciones;
                sessionStorage.setItem('listaImagenes', 'null');
                
                resolve("ok");
            } else {
                $.ajax({
                    //Primero consultamos la api para recuperar las colecciones
                    url:  'https://indesan.org:3001/colecciones/web',
                    success :
                        function (result) {
                        //En caso de éxito, recuperamos la plantilla de cada coleccion
                        //con otra llamada de ajax 
                        
                         
                        var no_columns = 1;
                        if (window.innerWidth >= 480 ) no_columns=2;
                        if (window.innerWidth >= 768 ) no_columns=3;
                        if (window.innerWidth >= 1024 ) no_columns=4;
                           
                        var no_descansos = no_columns - (result.length % no_columns);
        
                        var htmlDescanso="<li><figure class = 'descanso'><img src='/resources/images/descanso_:no_descanso:.jpg' alt='Descanso'></figure></li>";
        
                        //console.log("descansos: " + no_descansos);
                        $.ajax({
                            url:  'vistas/itemColeccion.html',
                            success : function(html){
                                //en caso de exito iteramos por los resultados de la API
                                // y vamos construyendo el html de la galeria
                                var ihtml = "<ul>";
                                var itemsProcesados =0;
                                var itemsDescanso = Math.floor(result.length / (no_descansos + 1));
                                result.forEach((element, index) => {
                                    //console.log(index)
                                    
                                    var item= new String(html);
                                    ihtml += item.replace(/:thumb:/g , element.thumbnail).
                                                    replace(/:mod:/g, element.mod).
                                                    replace(/:caption:/g, element.captions[lang]).
                                                    replace(/:description:/g, element.desc[lang]).
                                                    replace(/:index:/g, index)
        
                                    //vemos si hay que insertar un descanso en la galeria
                                    itemsProcesados += 1;
                                    if (itemsProcesados > itemsDescanso){
                                        itemsProcesados=0;
                                        ihtml += htmlDescanso.replace(/:no_descanso:/, Math.round(index / (no_descansos+1)));
                                    }
                                   
                                    
                                });
        
                                ihtml += "</ul>";
        
                                //ahora localizamos la galeria e insertamos el html creado
        
                                document.getElementById("listaColecciones").innerHTML = ihtml;
                                //console.log("listaColecciones construida");
                                //guardamos el archivo de colecciones
                                sessionStorage.setItem('listaColecciones', ihtml);
                                
                                sessionStorage.setItem('JSONListaColecciones', JSON.stringify(result));
                                //y limpiamos el de imagenes

                                sessionStorage.setItem('listaImagenes', 'null');
                                resolve("ok");

                            }
                        });
                        
        
                    },
                    error: function(err){
                        reject(err);
                    }
    
                });
            }

        });
    }
    function asignarComportamientosColecciones (){

        //Crear waypoints
        $('.galeria li').each(function(index){

            $(this).addClass('js--li--wp' + index);

            $('.js--li--wp' + index).waypoint(function(direction){
                if (direction == 'down'){
                    $('.js--li--wp' + index).addClass('animated fadeIn');
                    $('.js--li--wp' + index).removeClass('fadeOut');
                } else {
                    $('.js--li--wp' + index).addClass('animated fadeOut');
                    $('.js--li--wp' + index).removeClass('fadeIn');
                }
            
            },{offset:'80%'});

            $(this).mouseenter(aseguraVisible)
            $(this).click(aseguraVisible)

        });

        //
        $('.galeria li .detalleFigura').each(function(index){
            $(this).click(function(){
                var coleccion = this.dataset.coleccion
                var indice = this.dataset.colindex
                generarDatosColeccion(indice).then(function(response){
                    generarGaleriaImagenes(coleccion, indice, response);    
                })
                
            });
        });
    };
    
    function aseguraVisible(){
        var rect = this.getBoundingClientRect()
        var menu = document.getElementsByClassName('sticky')[0]
        var limSup=0
        var limInf = rect.bottom
        if (menu) limSup = menu.getBoundingClientRect().bottom

        //console.log(rect.top, limSup, rect.bottom, limInf)

        if (rect.top <= limSup) return  window.scrollBy({top: rect.top - limSup, left: 0, behavior: 'smooth'})

        if(window.innerHeight < limInf) return this.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})

    }

    function generarDatosColeccion(indice){
        return new Promise( function(resolve, reject){
            var JSONData = JSON.parse(sessionStorage.getItem('JSONListaColecciones'))[indice]
            console.log(JSONData)
            //tenemos los datos. Leemos la plantilla y los mezclamos
            $.ajax({
                url:  'vistas/coleccion.html',
                success : function(html){

                    var html2 = html.replace(/:mod:/g,JSONData.mod)
                                    .replace(/:tag:/g, JSONData.tags[lang] || "")
                                    .replace(/:thn:/g,JSONData.tec_thumbnail || "") 
                                    .replace(/:slogan:/g, JSONData.desc[lang] || "")

                    resolve(html2)
                },
                error: function(){
                    resolve('<ul>:galeria:</ul>')
                }
            })

           
        })
    }

    function  cargarImagenes(coleccion, indice, htmlParent){
        
        return new Promise(function(resolve, reject){

            //console.log("cargar imagenes de " + coleccion)
            if(coleccion) {
                var listaImagenes = sessionStorage.getItem('listaImagenes');


                if (!(listaImagenes == "null")){
                    //console.log("listaImagenes recuperada");
                    document.getElementById("listaColecciones").innerHTML = listaImagenes;
                    resolve('ok');
                } else {
                    $.ajax({
                        url:  'https://indesan.org:3001/imagenes/' + coleccion,
                        success : function(imgs){
                            $.ajax({
                                url:  'vistas/itemFoto.html',
                                success : function(html){
        
        
                                    //la
                                    var ihtml="";
                                    var galeria = document.getElementById("listaColecciones");
                                   
                                    imgs.forEach((element, index) => {
                                        ihtml += html.
                                                    replace(/:thumb:/g, element.folder + "/" + element.nombre_tn).
                                                    replace(/:img:/g, element.folder + "/" + element.nombre_img).
                                                    replace(/:caption:/g, element.pieFoto[lang]).
                                                    replace(/:alt:/g, element.pieFoto[lang]).
                                                    replace(/:description:/g, element.pieFoto[lang]).
                                                    replace(/:mod:/g, coleccion)
                                                   
        
                                    });
                                    
                                    htmlParent = htmlParent.replace(':galeria:', ihtml)
        
                                    sessionStorage.setItem('listaImagenes', ihtml);
                                    galeria.innerHTML=htmlParent;
                                    
                                    resolve('ok');
    
                                }
                            });
         
                        }
                    });


                }
   
    
            }


        });
    }
   function asignarComportamientosImagenes(){
        $('.galeria li .ion-ios-undo').each(function(index){
            $(this).click(function(){
                generarGaleriaColecciones();
                $('html, body').animate({scrollTop: $('.js--productos').offset().top-50}, 1000);
            });

            
        });

        $('.galeria li').each(function(index){
             $(this).mouseenter(aseguraVisible)
             $(this).click(aseguraVisible)
        });
   }
    


    var wp1 = new Waypoint({
        element: document.getElementsByClassName('js--productos')[0],
        handler: function(direction) {
            
            if (direction =='down'){
                $('nav').removeClass('row').addClass('sticky');
            }else{
                $('nav').removeClass('sticky').addClass('row');
            }
  
  
        },
            offset: '10%'
        });



    /*puntos de scroll*/
    $('.js--scroll--to--colecciones').click(function(){
        generarGaleriaColecciones();
        
        return false;
    });  

 

    $('.js--scroll--to--nuestraEmpresa').click(function(){
       
        $('html, body').animate({scrollTop: $('.js--nuestraEmpresa').offset().top}, 1000);
        return false;
    });  


    $('.js--scroll--to--usuarios').click(function(){
        
        $('html, body').animate({scrollTop: $('.js--usuarios').offset().top}, 1000);
        return false;
    });  


    $('.js--scroll--to--blog').click(function(){
      
        $('html, body').animate({scrollTop: $('.js--blog').offset().top}, 1000);
        return false;
    });  

    $('.js--scroll--to--configurador').click(function(){
       
        $('html, body').animate({scrollTop: $('.js--configurador').offset().top}, 1000);
        return false;
    }); 

    $('.js--scroll--to--contacto').click(function(){
     
        $('html, body').animate({scrollTop: $('.js--contacto').offset().top}, 1000);
        return false;
    });  

    $('.js--scroll--to--header').click(function(){
       
        $('html, body').animate({scrollTop: $('.js--header').offset().top}, 1000);
        return false;
    });  
      


   



    /* Mobile navigation */

    $('.js--nav--icon').click(function(){
        $('#icon-nav').toggle();
        $('#icon-nav-expanded').toggle();
        $('.navegacion').removeClass('contraido');
        $('.navegacion').addClass('expandido');
        return false;
        
    });

    $('.js--nav--icon--exp').click(function(){
        $('#icon-nav').toggle();
        $('#icon-nav-expanded').toggle();
        $('.navegacion').removeClass('expandido');
        $('.navegacion').addClass('contraido');
        return false;
    });



    //RECALCULAR NUMERO DE COLUMNAS
    //el codigo está manipulado para que solo se 
    //ejecute cuando hemos terminado de cambiar el 
    //tamaño de la ventana (y solo el ancho), no a cada paso
    var resizeId;
    $(window).on('resize',function() {
        var new_ww = window.innerWidth;
        var old_ww = sessionStorage.getItem('old_ww');
        if (!old_ww || old_ww != new_ww){
           // console.log("colecciones recargadas")
            sessionStorage.setItem('old_ww', new_ww);
            clearTimeout(resizeId);
            resizeId = setTimeout(cargarcolecciones, 500);
        }

    });


    generarGaleriaColecciones();

      
});
        

setTimeout(function(){
    //Saltamos a los productos a los 5 segundos
    if (userHasScrolled) return false;
    
    $('html, body').animate({scrollTop: $('.js--productos').offset().top-50}, 1000);
    return false;
},5000);    