$(document).ready(function(){
   
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
      


    /*animaciones de la galeria*/ 
    
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


      
});
        
            
      