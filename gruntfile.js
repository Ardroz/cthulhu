module.exports = function ( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      start_server: {
        command: 'mongod&'
      }
    },

    jshint: {
      uses_defaults: [],
      /*special files that don't will be linted with override options */
      with_overrides: {
          options: {
              "jshintrc": true
          },
          files: {
              src: ['app.js',
                    'gruntfile.js',
                    'mongo-queries.js',
                    'config/*.js',
                    'mongoose_models/*.js',
                    'sections/*.js'
              ]
          }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: ['dev'],
          ignoredFiles: ['node_modules/**'],
          watchedExtensions: ['js'],
          delayTime: 1
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'test/test-report.html'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('init', ['exec', 'nodemon']);
  grunt.registerTask('test', 'mochaTest');
};