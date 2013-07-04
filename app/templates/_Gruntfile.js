/* jshint node:true */

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('server', ['compass:server', 'connect:livereload:keepalive']);
  grunt.registerTask('default', ['jshint','build','karma:unit']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy:assets']);
  grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    vendordir: 'vendor',
    
    staticpath: '/static', //HTTP static path

    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%%= pkg.title || pkg.name %> - v<%%= pkg.version %> - <%%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author %>;\n' +
    ' * Licensed <%%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',


    src: {
      root: 'src',
      styles: 'src/styles',
      images: 'src/images',
      js: ['src/**/*.js', '<%%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      }
    },

    clean: ['<%%= distdir %>/*'],
    
    copy: {
      images: {
        files: [{ dest: '<%%= distdir %>', src : '**', expand: true, cwd: '<%%= src.images %>' }]
      }
    },

    compass: {
      options: {
        sassDir: '<%%= src.styles %>',
        specify: '<%%= src.styles %>/main.scss',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%%= src.images %>',
        fontsDir: '<%%= src.styles %>/fonts',
        importPath: '<%%= vendordir %>',
        httpImagesPath: '<%%= staticpath %>/images',
        httpGeneratedImagesPath: '<%%= staticpath %>/images/generated',
        httpFontsPath: '<%%= staticpath %>/styles/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
            debugInfo: true
        }
      }
    },
    
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src'),
              mountFolder(connect, 'vendor')
            ];
          }
        }
      }
    },

    karma: {
      unit: { options: karmaConfig('test/config/unit.js') },
      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },

    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%%= src.tpl.app %>'],
        dest: '<%%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%%= src.tpl.common %>'],
        dest: '<%%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    
    concat:{
      dist:{
        options: {
          banner: "<%%= banner %>"
        },
        src:['<%%= src.js %>'],
        dest:'<%%= distdir %>/<%%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.js'],
        dest: '<%%= distdir %>/angular.js'
      },
      ngBootstrap: {
        src:['vendor/angular-ui/bootstrap/*.js'],
        dest: '<%%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%%= distdir %>/jquery.js'
      }
    },
    
    uglify: {
      dist:{
        options: {
          banner: "<%%= banner %>"
        },
        src:['<%%= src.js %>'],
        dest:'<%%= distdir %>/<%%= pkg.name %>.js'
      },
      angular: {
        src:['<%%= concat.angular.src %>'],
        dest: '<%%= distdir %>/angular.js'
      },
      ngBootstrap: {
        src:['vendor/angular-bootstrap/*.js'],
        dest: '<%%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%%= distdir %>/jquery.js'
      }
    },

    watch:{
      all: {
        files:['<%%= src.js %>', '<%%= src.specs %>', '<%%= src.tpl.app %>', '<%%= src.tpl.common %>', '<%%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%%= src.js %>', '<%%= src.specs %>', '<%%= src.tpl.app %>', '<%%= src.tpl.common %>', '<%%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    
    jshint:{
      files:['gruntFile.js', '<%%= src.js %>', '<%%= src.specs %>', '<%%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
