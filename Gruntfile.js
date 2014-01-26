module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['js/src/**/*.js'],
                dest: 'js/dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'js/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        buster: {
            test: {
                server: {
                    port: 1112
                }
            }
        },
        watch: {
            files: ['js/src/**/*.js'],
            tasks: ['concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-buster');


    grunt.registerTask('default', ['concat', 'uglify']);

};