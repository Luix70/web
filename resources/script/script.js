sessionStorage.setItem('listaColecciones', 'null')
sessionStorage.setItem('listaImagenes', 'null')
sessionStorage.setItem('JSONListaColecciones', 'null')
var galeriaMostrada=''

userHasScrolled = false

var textContent = {
    motto:{
        es: "<p>INDESAN ES CALIDAD Y DISEÑO.</p><p>ORIGINALIDAD Y PASIÓN POR LAS COSAS BIEN HECHAS.</p>",
        en: "<p>INDESAN MEANS QUALITY AND DESIGN.</p><p>ORIGINALITY AND PASSION FOR WELL DONE THINGS.</p>",
        fr: "<p>INDESAN VEUT DIRE QUALITÉ ET DESIGN.</p><p>ORIGINALITÉ ET PASSION POUR DES CHOSES BIEN FAITES.</p>"
    },

    menu:{
        colecciones: {
            es:"Colecciones",
            en:"Collections",
            fr:"Collections"
        }
    },

    warning:{
            es:"Esta página se encuentra en proceso de actualizacion. En dias sucesivos se irá incorporando funcionalidad adicional",
            en:"This page is in the process of being updated. In the next days, additional functionality will be added",
            fr:"Cette page est en cours de mise à jour. Au cours des jours suivants, des fonctionnalités supplémentaires seront ajoutées"
    }
}

window.onscroll = function (e)
{
    userHasScrolled = true
}
var lang = (localStorage.getItem('idioma.indesan.com') || sessionStorage.getItem('idioma.indesan.com') || navigator.language || navigator.userLanguage).substring(0,2) 

if (lang !=="es" && lang !=='fr' && lang !=='en') lang = 'es'

//console.log (lang)


$(document).ready(function(){

    function renderTexts(){
       $('#motto').html(textContent.motto[lang])
       $('.js--warning').html(textContent.warning[lang])
       $('.js--scroll--to--colecciones').html(textContent.menu.colecciones[lang])

       // señalamos el idioma usado
       $('.js--lang--fr').removeClass('lang_selected')
       $('.js--lang--es').removeClass('lang_selected')
       $('.js--lang--en').removeClass('lang_selected')
       switch(lang){
            case 'en':
                $('.js--lang--en').addClass('lang_selected')
                break
            case 'fr':
                $('.js--lang--fr').addClass('lang_selected')
                break
            default:
                 $('.js--lang--es').addClass('lang_selected')
       }
       
    }

    function generarGaleriaColecciones(){
        cargarcolecciones().then(function(response){
            asignarComportamientosColecciones()
            userHasScrolled=false //para que se mueva al comienzo de la galeria
            setTimeout(scroll, 2000)
            
        })

       
    }
    function generarGaleriaImagenes(coleccion, index, html){

        cargarImagenes(coleccion, index, html).then(function(response){
            asignarComportamientosImagenes()
            $('html, body').animate({scrollTop: $('.js--productos').offset().top-80}, 1000)
        })
        
    }
    var  cargarcolecciones = function(){
        return new Promise( function(resolve, reject){
            var listaColecciones = sessionStorage.getItem('listaColecciones')
            

            if (!(listaColecciones == "null")){
                //console.log("listaColecciones recuperada")
                document.getElementById("listaColecciones").innerHTML = listaColecciones
                sessionStorage.setItem('listaImagenes', 'null')
                
                resolve("ok")
            } else {
                $.ajax({
                    //Primero consultamos la api para recuperar las colecciones
                    url:  'https://indesan.com:3001/colecciones/web',
                    success :
                        function (result) {
                        //En caso de éxito, recuperamos la plantilla de cada coleccion
                        //con otra llamada de ajax 
                        
                         
                        var no_columns = 1
                        if (window.innerWidth >= 480 ) no_columns=2
                        if (window.innerWidth >= 768 ) no_columns=3
                        if (window.innerWidth >= 1024 ) no_columns=4
                           
                        var no_descansos = no_columns - (result.length % no_columns)
        
                        var htmlDescanso="<li><figure class = 'descanso'><img src='/resources/images/descanso_:no_descanso:.jpg' alt='Descanso'></figure></li>"
        
                        //console.log("descansos: " + no_descansos)
                        $.ajax({
                            url:  'vistas/itemColeccion.html',
                            success : function(html){
                                //en caso de exito iteramos por los resultados de la API
                                // y vamos construyendo el html de la galeria
                                var ihtml = "<ul>"
                                var itemsProcesados =0
                                var itemsDescanso = Math.floor(result.length / (no_descansos + 1))
                                result.forEach((element, index) => {
                                    //console.log(index)
                                    

                                    var item= new String(html)
                                    var estadocoleccion = (element.tec_thumbnail ? "completada":"faded" )
                                    ihtml += item.replace(/:thumb:/g , element.thumbnail).
                                                    replace(/:mod:/g, element.mod).
                                                    replace(/:caption:/g, element.captions[lang]).
                                                    replace(/:description:/g, element.desc[lang]).
                                                    replace(/:index:/g, index).
                                                    replace(/:estado:/g, estadocoleccion)
        
                                    //vemos si hay que insertar un descanso en la galeria
                                    itemsProcesados += 1
                                    if (itemsProcesados > itemsDescanso){
                                        itemsProcesados=0
                                        ihtml += htmlDescanso.replace(/:no_descanso:/, Math.round(index / (no_descansos+1)))
                                    }
                                   
                                    
                                })
        
                                ihtml += "</ul>"
        
                                //ahora localizamos la galeria e insertamos el html creado
        
                                document.getElementById("listaColecciones").innerHTML = ihtml
                                //console.log("listaColecciones construida")
                                //guardamos el archivo de colecciones
                                sessionStorage.setItem('listaColecciones', ihtml)
                                
                                sessionStorage.setItem('JSONListaColecciones', JSON.stringify(result))
                                //y limpiamos el de imagenes

                                sessionStorage.setItem('listaImagenes', 'null')
                                resolve("ok")

                            }
                        })
                        
                        galeriaMostrada='colecciones'
                    },
                    error: function(err){
                        reject(err)
                    }
    
                })
            }

        })
    }
    function asignarComportamientosColecciones (){

        //Crear waypoints
        $('.galeria li').each(function(index){

            $(this).addClass('js--li--wp' + index)

            $('.js--li--wp' + index).waypoint(function(direction){
                if (direction == 'down'){
                    $('.js--li--wp' + index).addClass('animated fadeIn')
                    $('.js--li--wp' + index).removeClass('fadeOut')
                } else {
                    $('.js--li--wp' + index).addClass('animated fadeOut')
                    $('.js--li--wp' + index).removeClass('fadeIn')
                }
            
            },{offset:'80%'})

            $(this).mouseenter(aseguraVisible)
            $(this).click(aseguraVisible)

        })

        //
        $('.galeria li .detalleFigura').each(function(index){
            $(this).click(function(){
                var coleccion = this.dataset.coleccion
                var indice = this.dataset.colindex
                generarDatosColeccion(indice).then(function(response){
                    generarGaleriaImagenes(coleccion, indice, response) 

                })
                
            })
        })
    }
    
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

    function setDefaultsColeccion(jsonColeccion){
        
        var njc= jsonColeccion
        njc.tags = njc.tags || {es:'notag' , en:'notag', fr:'notag' }
        njc.desc = njc.desc || {es:'nodesc' , en:'nodesc', fr:'nodesc' }
        njc.tec_thumbnail = njc.tec_thumbnail || 'no_thumb'

        return njc

    }



    function generarDatosColeccion(indice){
        return new Promise( function(resolve, reject){

            var JSONData = setDefaultsColeccion(JSON.parse(sessionStorage.getItem('JSONListaColecciones'))[indice])
            
            //tenemos los datos. Leemos la plantilla y los mezclamos
            $.ajax({
                url:  'vistas/coleccion_' + JSONData.mod  + '_' + lang + '.html',
                success : function(html){

                    var html2 = html.replace(/:mod:/g,JSONData.mod)
                                    .replace(/:tag:/g, JSONData.tags[lang] )
                                    .replace(/:thn:/g,JSONData.tec_thumbnail ) 
                                    .replace(/:slogan:/g, JSONData.desc[lang])
                                    .replace(/:captions:/g, JSONData.captions[lang])
                                    .replace(/:lang:/g, lang)
                                                                      

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
                var listaImagenes = sessionStorage.getItem('listaImagenes')


                if (!(listaImagenes == "null")){
                    //console.log("listaImagenes recuperada")
                    document.getElementById("listaColecciones").innerHTML = listaImagenes
                    resolve('ok')
                } else {



                    $.ajax({
                        url:  'https://indesan.com:3001/imagenes/' + coleccion,
                        success : function(imgs){

                            var no_columns = 1
                            if (window.innerWidth >= 480 ) no_columns=2
                            if (window.innerWidth >= 768 ) no_columns=3
                            if (window.innerWidth >= 1024 ) no_columns=4
                               
                            var no_descansos = no_columns - (imgs.length % no_columns)
            
                            var htmlDescanso="<li><figure class = 'descanso'><img src='/resources/images/descanso_:no_descanso:.jpg' alt='Descanso'></figure></li>"

                            $.ajax({
                                url:  'vistas/itemFoto.html',
                                success : function(html){
        
        
                                    //la
                                    var ihtml=""
                                    var galeria = document.getElementById("listaColecciones")
                                    var itemsProcesados =0
                                    var itemsDescanso = Math.floor(imgs.length / (no_descansos + 1))

                                    imgs.forEach((element, index) => {
                                        ihtml += html.
                                                    replace(/:thumb:/g, element.folder + "/" + element.nombre_tn).
                                                    replace(/:img:/g, element.folder + "/" + element.nombre_img).
                                                    replace(/:caption:/g, element.pieFoto[lang]).
                                                    replace(/:alt:/g, element.pieFoto[lang]).
                                                    replace(/:description:/g, element.pieFoto[lang]).
                                                    replace(/:mod:/g, coleccion)


                                                    //vemos si hay que insertar un descanso en la galeria
                                                    itemsProcesados += 1
                                                    if (itemsProcesados > itemsDescanso){
                                                        itemsProcesados=0
                                                        ihtml += htmlDescanso.replace(/:no_descanso:/, Math.round(index / (no_descansos+1)))
                                                    }
                                                   
        
                                    })
                                    
                                    htmlParent = htmlParent.replace(':galeria:', ihtml)
        
                                    sessionStorage.setItem('listaImagenes', htmlParent)
                                    galeria.innerHTML=htmlParent
                                    
                                    resolve('ok')
    
                                }
                            })

                            galeriaMostrada= {'coleccion':coleccion, 'indice':indice,}
         
                        }

                    })


                }

            }

        })
    }
   function asignarComportamientosImagenes(){
        $('.galeria li .ion-ios-undo').each(function(index){
            $(this).click(function(){
                generarGaleriaColecciones()
                
            })

            
        })

        $('.galeria li').each(function(index){
             $(this).mouseenter(aseguraVisible)
             $(this).click(aseguraVisible)
        })
   }
    


    var wp1 = new Waypoint({
        element: document.getElementsByClassName('js--splash')[0],
        handler: function(direction) {
            
            //if (direction =='down'){
                $('nav').removeClass('row').addClass('sticky')
           // }else{
           //     $('nav').removeClass('sticky').addClass('row')
           // }
  
  
        },
            offset: '10%'
        })



    /*puntos de scroll*/
    $('.js--scroll--to--colecciones').click(function(){

        closeMenu()

        generarGaleriaColecciones()

      
        return false
    })  

 

    $('.js--scroll--to--nuestraEmpresa').click(function(){
       
        closeMenu()

        $('html, body').animate({scrollTop: $('.js--nuestraEmpresa').offset().top}, 1000)
        return false
    })  


    $('.js--scroll--to--usuarios').click(function(){
        
        closeMenu()

        $('html, body').animate({scrollTop: $('.js--usuarios').offset().top}, 1000)
        return false
    })  


    $('.js--scroll--to--blog').click(function(){
      
        closeMenu()

        $('html, body').animate({scrollTop: $('.js--blog').offset().top}, 1000)
        return false
    })  

    $('.js--scroll--to--configurador').click(function(){
       
        closeMenu()

        $('html, body').animate({scrollTop: $('.js--configurador').offset().top}, 1000)
        return false
    }) 

    $('.js--scroll--to--contacto').click(function(){
     
        closeMenu()

        $('html, body').animate({scrollTop: $('.js--contacto').offset().top}, 1000)
        return false
    })  

    $('.js--scroll--to--header').click(function(){
       
        closeMenu()
        
        $('html, body').animate({scrollTop: $('.js--header').offset().top}, 1000)
        return false
    })  
      

    /* Mobile navigation */

    $('.js--nav--icon').click(function(){
        $('#icon-nav').toggle()
        $('#icon-nav-expanded').toggle()
        $('.navegacion').removeClass('contraido')
        $('.navegacion').addClass('expandido')
        return false
        
    })

    $('.js--nav--icon--exp').click(function(){
        $('#icon-nav').toggle()
        $('#icon-nav-expanded').toggle()
        closeMenu()
        return false
    })

    //Menu idiomas

    $('.js--lang--es').click(function(){
        $('.js--lang--es').addClass('lang_selected')
        $('.js--lang--fr').removeClass('lang_selected')
        $('.js--lang--en').removeClass('lang_selected')
        sessionStorage.setItem('idioma.indesan.com', 'es-es') 
        location.reload()
    })

    $('.js--lang--fr').click(function(){
        $('.js--lang--fr').addClass('lang_selected')
        $('.js--lang--es').removeClass('lang_selected')
        $('.js--lang--en').removeClass('lang_selected')
        sessionStorage.setItem('idioma.indesan.com', 'fr-fr')  
        location.reload()
    })

    $('.js--lang--en').click(function(){
        $('.js--lang--en').addClass('lang_selected')
        $('.js--lang--fr').removeClass('lang_selected')
        $('.js--lang--es').removeClass('lang_selected')
        sessionStorage.setItem('idioma.indesan.com', 'en-en') 
        location.reload()
    })



    function closeMenu(){
        $('.navegacion').removeClass('expandido')
        $('.navegacion').addClass('contraido')

        if (window.innerWidth >= 1024 )  {
            $('#icon-nav').hide()
            $('#icon-nav-expanded').hide()    

        }   else
        {
            $('#icon-nav').show()
            $('#icon-nav-expanded').hide() 
        }    
        return false
    }



    //RECALCULAR NUMERO DE COLUMNAS
    //el codigo está manipulado para que solo se 
    //ejecute cuando hemos terminado de cambiar el 
    //tamaño de la ventana (y solo el ancho), no a cada paso
    var resizeId

    $(window).on('resize',function() {
        
        var new_ww = window.innerWidth
        var old_ww = sessionStorage.getItem('old_ww')
        
        if (!old_ww || old_ww != new_ww){
           // console.log("colecciones recargadas")
            sessionStorage.setItem('old_ww', new_ww)
            clearTimeout(resizeId)
            if (galeriaMostrada=='colecciones'){
                sessionStorage.setItem('listaColecciones', null)
                resizeId = setTimeout(generarGaleriaColecciones, 500)
            } else {
                return //no redimensionamos
                resizeId = setTimeout(function(){
                    sessionStorage.setItem('listaImagenes', null)

                    generarDatosColeccion(galeriaMostrada.indice).then(function(response){
                    generarGaleriaImagenes(galeriaMostrada.coleccion, galeriaMostrada.indice, response) 
                    })

                }, 500) 
            }
        }
    })

    renderTexts()
    generarGaleriaColecciones()

    function scroll(){
        //Saltamos a los productos a los 5 segundos
        
        if (userHasScrolled) return false
        
    
        $('html, body').animate({scrollTop: $('.js--productos').offset().top-50}, 1000)
    
        return false
    }  


    setTimeout(scroll, 5000);
      
})
        

 