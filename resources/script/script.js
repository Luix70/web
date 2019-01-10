$(document).ready(function(){

    /* Cargamos la galeria */

    function cargarcolecciones(){
        
        $.ajax({
            //Primero consultamos la api para recuperar las colecciones
            url:  'https://indesan.org:3001/colecciones/web',
            success : function (result) {
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
                        var ihtml = new String();
                        var itemsProcesados =0;
                        var itemsDescanso = Math.floor(result.length / (no_descansos + 1));
                        result.forEach((element, index) => {
                            //console.log(index);
                            
                            var item= new String(html);
                            ihtml += item.replace(/:thumb:/g , element.thumbnail).
                                            replace(/:mod:/g, element.mod).
                                            replace(/:caption:/g, element.captions.es).
                                            replace(/:description:/g, element.desc.es)

                            //vemos si hay que insertar un descanso en la galeria
                            itemsProcesados += 1;
                            if (itemsProcesados > itemsDescanso){
                                itemsProcesados=0;
                                ihtml += htmlDescanso.replace(/:no_descanso:/, Math.round(index / (no_descansos+1)));
                            }
                           
                            
                        });
                        //ahora localizamos la galeria e insertamos el html creado

                        document.getElementById("listaColecciones").innerHTML = ihtml;

                         /*Añadimos las animaciones de la galeria*/ 
    
                        $('.galeria li').each(function(index){

                            $(this).addClass('js--li--wp' + index);
                            
                            $(this).click(function(){
                                cargarImagenes(this.dataset.coleccion);
                            });

                            $('.js--li--wp' + index).waypoint(function(direction){
                                if (direction == 'down'){
                                    $('.js--li--wp' + index).addClass('animated fadeIn');
                                    $('.js--li--wp' + index).removeClass('fadeOut');
                                } else {
                                    $('.js--li--wp' + index).addClass('animated fadeOut');
                                    $('.js--li--wp' + index).removeClass('fadeIn');
                                }
                            
                            },{offset:'80%'});

                        });
                    }
                });


            }
   
        });
       
    };

    cargarcolecciones();

    /* Funcion que carga las imagenes en la galeria */
    function cargarImagenes(coleccion){
        if(coleccion) {
            $.ajax({
                url:  'https://indesan.org:3001/imagenes/' + coleccion,
                success : function(imgs){

                    //nos desplazamos a la zona de imagenes
                    $('html, body').animate({scrollTop: $('.js--fotos').offset().top-50}, 1000);

                    $.ajax({
                        url:  'vistas/itemFoto.html',
                        success : function(html){


                            //la
                            var ihtml="";
                            var galeria = document.getElementById("gallery");
                            var titulo=document.getElementById("titColeccion");
                            imgs.forEach((element, index) => {
                                ihtml += html.
                                            replace(/:thumb:/g, element.folder + "/" + element.nombre_tn).
                                            replace(/:img:/g, element.folder + "/" + element.nombre_img).
                                            replace(/:pie:/g, element.pieFoto.es).
                                            replace(/:alt:/g, element.pieFoto.es)

                            });

                            galeria.innerHTML=ihtml;
                            titulo.innerHTML = `Coleccion: ${coleccion}`;
                            console.log (galeria.innerHTML);
                            $("#gallery").unitegallery(
                                {
                                    tile_enable_textpanel:true,
                                    tile_textpanel_title_text_align: "center",
                                }
                            );

                            

                        }
                    });
            
                    
                }
            });
        }
        
    }
    
   
    /* Aparicion del menu 'sticky' */

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
        
        $('html, body').animate({scrollTop: $('.js--productos').offset().top}, 1000);
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




    //el codigo está manipulado para que solo se 
    //ejecute cuando hemos terminado de cambiar el 
    //tamaño de la ventana, no a cada paso
    var resizeId;
    $(window).on('resize',function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(cargarcolecciones, 500);
    });
      
});
        
            
      