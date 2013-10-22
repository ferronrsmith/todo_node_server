/*global module*/
module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta : {
            bin : {
                lintFiles : ['Gruntfile.js', 'app.js', 'test/*.js', 'routes/*.js', 'coverage/*.js']
            }
        },
        jslint: {
            all : {
                src: '<%= meta.bin.lintFiles %>',
                options: { }
            }
        },
        karma: {
            options: {
                singleRun: true,
                browsers: ['PhantomJS']
            },
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            files: '<%= meta.bin.lintFiles %>',
            tasks: ['jslint', 'mochaTest']
        },
        coveralls: {
            options: {
                coverage_dir: 'coverage'
            }
        },
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    colors: true,
                    require: 'coverage/blanket'
                },
                src: ['test/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src: ['test/*.js']
            },
//            The travis-cov reporter will fail the tests if the
//            coverage falls below the threshold configured in package.json
            'travis-cov': {
                options: {
                    reporter: 'travis-cov'
                },
                src: ['test/*.js']
            }
        },
        mochacov: {
            unit: {
                options: {
                    reporter: 'spec',
                    colors : true
                }
            },
            coverage: {
                options: {
                    coveralls: {
                        serviceName: 'travis-ci'
                    }
                }
            },
            options: {
                files: 'test/*.js',
                colors : true
            }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('test', ['mochacov']);


};
