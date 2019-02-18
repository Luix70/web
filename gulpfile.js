var gulp = require('gulp')
var watch= require('gulp-watch')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssvars = require('postcss-simple-vars')
var nested = require('postcss-nested')


gulp.task('default', async function(){
    console.log('hello Gulp')
})

gulp.task('js',async function(){
    console.log('hemos modificado el código')
})

gulp.task('css',async function(){
    return gulp.src('./resources/css/principal.css')
        .pipe(postcss([cssvars, nested, autoprefixer]))
        .pipe(gulp.dest('./_styles.css'))
})

gulp.task('watch', async function(){

    watch('./resources/script/**/script.js' ,gulp.series('js'));
    watch('./resources/css/**/*.css' ,gulp.series('css'));
   
})