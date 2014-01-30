module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {      
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    },
    jasmine:{
      memento:{
        src: [          
          '<%= pkg.name %>.js'
        ],
        options:{
          specs: 'spec/javascripts/*.spec.js',
          vendor: [
            'public/javascripts/jquery.js',
            'public/javascripts/underscore.js',
            'public/javascripts/backbone.js'
          ],
          helpers: 'spec/javascripts/helpers/sample.backbone.app.js'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};