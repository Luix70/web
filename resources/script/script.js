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

                console.log("descansos: " + no_descansos);
                $.ajax({
                    url:  'vistas/itemColeccion.html',
                    success : function(html){
                        //en caso de exito iteramos por los resultados de la API
                        // y vamos construyendo el html de la galeria
                        var ihtml = new String();
                        result.forEach((element, index) => {
                            //console.log(index);
                            var item= new String(html);
                            ihtml += item.replace(/:thumb:/ , element.thumbnail).
                                            replace(/:mod:/g, element.mod).
                                            replace(/:caption:/g, element.captions.es).
                                            replace(/:description:/g, element.desc.es)
                            if ((index -1 ) % Math.ceil((result.length / (no_descansos + 1))) == 0) {
                                ihtml += htmlDescanso.replace(/:no_descanso:/, Math.round((index +1 ) / no_descansos)+1);
                            }
                            
                        });
                        //ahora localizamos la galeria e insertamos el html creado

                        document.getElementById("listaColecciones").innerHTML = ihtml;

                         /*Añadimos las animaciones de la galeria*/ 
    
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

                        });
                    }
                });


            }
   
        });
       
    };

    cargarcolecciones();
   
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
        console.log('a colecciones');
        $('html, body').animate({scrollTop: $('.js--productos').offset().top}, 1000);
        return false;
    });  

    $('.js--scroll--to--nuestraEmpresa').click(function(){
        console.log('a colecciones');
        $('html, body').animate({scrollTop: $('.js--nuestraEmpresa').offset().top}, 1000);
        return false;
    });  


    $('.js--scroll--to--usuarios').click(function(){
        console.log('a colecciones');
        $('html, body').animate({scrollTop: $('.js--usuarios').offset().top}, 1000);
        return false;
    });  


    $('.js--scroll--to--blog').click(function(){
        console.log('a colecciones');
        $('html, body').animate({scrollTop: $('.js--blog').offset().top}, 1000);
        return false;
    });  

    $('.js--scroll--to--configurador').click(function(){
        console.log('a configurador');
        $('html, body').animate({scrollTop: $('.js--configurador').offset().top}, 1000);
        return false;
    }); 

    $('.js--scroll--to--contacto').click(function(){
        console.log('a colecciones');
        $('html, body').animate({scrollTop: $('.js--contacto').offset().top}, 1000);
        return false;
    });  

    $('.js--scroll--to--header').click(function(){
        console.log('a colecciones');
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


    $("#gallery").unitegallery(
        {
            tile_enable_textpanel:true,
            tile_textpanel_title_text_align: "center",
        }
    );

    //el codigo está manipulado para que solo se 
    //ejecute cuando hemos terminado de cambiar el 
    //tamaño de la ventana, no a cada paso
    var resizeId;
    $(window).on('resize',function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(cargarcolecciones, 500);
    });
      
});
        
            
      