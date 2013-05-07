/*jshint node: true */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // JSHint

    jshint: {
      gruntfile: ['Gruntfile.js'],
      libs_n_tests: [],
      options: grunt.file.readJSON('.jshintrc')
    },

    // concat

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    // uglify

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  // NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Registered Tasks
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

  grunt.registerTask('default', ['test']);

};