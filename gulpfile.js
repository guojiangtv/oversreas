var gulp = require('gulp'),
    webpack = require('webpack'),
    fs = require('fs'),
    debug = require('gulp-debug');


gulp.task('webpack', function(callback) {
    var webpackConfig = require('./webpack.config.js');
    var compileLogger = require('./webpack-config/compileLogger.js');

    var myConfig = Object.create(webpackConfig);

    webpack(
        myConfig,
        function(err, stats) {
            compileLogger(err, stats);
            callback();
        });
});

/***************** 移动待到测试文件beta ***********************/

var file = './joylive_file.txt';
gulp.task('copybeta', function() {
    fs.readFile(file, function(err, obj) {
        //console.log('err:', err)
        obj = obj.toString().replace(/\s{2,}/g, '\n').replace(/(^\s+)|(\s+$)/g, '').split('\n');

        if (obj == '') {
            console.log('空文件');
            return;
        }

        for (var i = 0; i < obj.length; i++) {

            var srcFile = obj[i].replace(/\s+/g, '');

            if (srcFile.indexOf('.') == -1) {
                srcFile = srcFile + '/**/*.*';
            }

            console.log('dir:', srcFile);

            if (srcFile.indexOf('static_cblive') != -1) {
                srcFile = srcFile.replace(/static_cblive\//, '');

                gulp.src(srcFile, { base: '.' })
                    .pipe(debug({ title: 'static:' }))
                    .pipe(gulp.dest(fs.realpathSync('./beta/static_cblive/')));

            } else {
                srcFile = srcFile.replace('cblive/web/', '');

                gulp.src(srcFile, { base: './html' })
                    .pipe(debug({ title: 'cblive:' }))
                    .pipe(gulp.dest(fs.realpathSync('./beta/html')));
            }

        }

    });


});

/***************** 移动待发布文件到trunk ***********************/
gulp.task('copytrunk', function() {
    fs.readFile(file, function(err, obj) {
        //console.log('err:', err)
        obj = obj.toString().replace(/\s{2,}/g, '\n').replace(/(^\s+)|(\s+$)/g, '').split('\n');

        if (obj == '') return;

        for (var i = 0; i < obj.length; i++) {

            var srcFile = obj[i].replace(/\s+/g, '');

            if (srcFile.indexOf('.') == -1) {
                srcFile = srcFile + '/**/*.*';
            }
            if (obj == '') {
                console.log('空文件');
                return;
            }

            if (srcFile.indexOf('maps') != -1) continue;

            if (srcFile.indexOf('static_cblive') != -1) {
                srcFile = srcFile.replace('static_cblive/', '');

                gulp.src(srcFile, { base: '.' })
                    .pipe(debug({ title: 'static_cblive:' }))
                    .pipe(gulp.dest(fs.realpathSync('./trunk/static_cblive/')));
            } else {
                srcFile = srcFile.replace('cblive/web/', '');
                gulp.src(srcFile, { base: './html' })
                    .pipe(debug({ title: 'cblive:' }))
                    .pipe(gulp.dest(fs.realpathSync('./trunk/html')));
            }

        }

    });


});
