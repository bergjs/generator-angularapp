'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var bowerPackages;

var AngularappGenerator = module.exports = function AngularappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
 
    this.on('end', function () {
      this.bowerInstall(bowerPackages, { 
        save: true 
    });

    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AngularappGenerator, yeoman.generators.Base);

AngularappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'appName',
    message: 'How do you want to call your app?',
    default: path.basename(process.cwd())
  },
  {
    type: 'confirm',
    name: 'angularui',
    message: 'Would you like to use Angular-UI?',
    default: true
  },
  {
    type: 'confirm',
    name: 'bootstrap',
    message: 'Would you like to use Twitter Bootstrap?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.angularui = props.angularui;
    this.bootstrap = props.bootstrap;
    this.appName = props.appName;

    cb();
  }.bind(this));
};

AngularappGenerator.prototype.src = function src() {
  this.mkdir('src/app');
  this.mkdir('src/assets/img');
  this.mkdir('src/common/directives');
  this.mkdir('src/common/resources');
  this.mkdir('src/common/security');
  this.mkdir('src/common/services');
  this.mkdir('src/stylesheets');

  this.template('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  if(this.bootstrap) {
    this.copy('_bootstrap.less', 'src/stylesheets/bootstrap.less');
    this.copy('_variables.less', 'src/stylesheets/variables.less');
    this.copy('_prefixer.less', 'src/stylesheets/prefixer.less');
  }
  // general stylesheet
  this.template('_styles.less', 'src/stylesheets/styles.less');
};

AngularappGenerator.prototype.test = function test() {
  this.mkdir('test/config');
  this.mkdir('test/unit/app');
  this.mkdir('test/unit/common/directives');
  this.mkdir('test/unit/common/security');
  this.mkdir('test/unit/common/services');

  this.copy('_unit.js', 'test/config/unit.js');
};

AngularappGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('bowerrc', '.bowerrc');
};

AngularappGenerator.prototype.bowerFiles = function bowerFiles() {
  bowerPackages = [];
  if(this.angularui){
    bowerPackages.push('angular-ui-bootstrap-bower');
  }
  if(this.bootstrap){
    bowerPackages.push('bootstrap');
  }
  bowerPackages.push('angular');
  bowerPackages.push('angular-mocks');
};
