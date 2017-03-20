// 1. import gulp
var gulp = require('gulp');

// 2. import gulp-nodemon
var nodemon = require('gulp-nodemon');


// 3. create a gulp default task
gulp.task('default', function() {
    // 4. start nodemon and pass config to it
    nodemon({
        script: 'server.js',
        ext: 'js',
        env: {
            PORT: 8000
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function() {
        console.log('Restarting server...');
    })
})

// 4. importing gulp-mocha
var gulpMocha = require('gulp-mocha');

// 5. end-to-end integration testing using supertest (to execute HTTP calls) 
// and gul-env to manipulate environment variables (to build test environment)
var env = require('gulp-env');
var supertest = require('supertest');


// 4.1
gulp.task('test', function(){
    //5.1
    env({vars: {ENV: 'Test'}});

    // 4.2
    // get all test fiels in tests folder and pipe them all in gulpMocha.
    // gulpMocha takes a reporter and in this case I use 'nyan' repoter which looks nice.
    gulp.src('tests/*.js', {read: false})
        .pipe(gulpMocha({reporter: 'nyan'}));
});

