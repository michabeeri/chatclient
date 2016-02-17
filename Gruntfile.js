'use strict';

module.exports = function (grunt) {

    grunt.config.init({
        watch: {
            scripts: {
                files: 'public/*.js',
                tasks: 'babel'
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/',
                        src: ['*.js'],
                        dest: 'public/dist/',
                        ext: '.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['babel', 'watch']);
};
