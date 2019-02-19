var gulp = require('gulp')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssvars = require('postcss-simple-vars')
var cssnested = require('postcss-nested')
var cssimport = require('postcss-import')
var mixins = require('postcss-mixins')
var concat = require('gulp-concat')

var bs = require('./bs')

gulp.task('cssCompile',async function(){
    return gulp.src( "./resources/css/cssparts/**/*.css").
    pipe(concat("principal.css")).
    pipe(postcss([cssimport, mixins, autoprefixer, cssvars, cssnested])).
    pipe(gulp.dest( "./resources/css"));
})

gulp.task('cssInject', async function(){
    gulp.src('./resources/css/principal.css').pipe(bs.stream())
})

