var gulp = require('gulp')
var watch= require('gulp-watch')
var bs = require('./bs')

gulp.task('watch', async function(){
    
    bs.init({
        notify:false,
        server:{
            baseDir:"./"
        }
    })

    watch('./resources/script/**/script.js' ,gulp.series('js'));
    watch('./resources/css/cssparts/**/*.css' ,gulp.series('cssCompile','cssInject'));
    watch('./**/*.html' ,gulp.series('html'));
   
})

