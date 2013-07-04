/* jshint node:true */

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var bowerPackages;

var AngularappGenerator = module.exports = function AngularappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
 
    this.on('end', function () {
      
      // this.bowerInstall(bowerPackages, { 
      //   save: true 
      // });

      // this.installDependencies({ skipInstall: options['skip-install'] });
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
    name: 'bootstrap',
    message: 'Would you like to use Twitter Bootstrap?',
    default: true
  },
  {
    type: 'confirm',
    name: 'angularui',
    message: 'If so, would you like to use Angular-Bootstrap (if not, jQuery is used instead)?',
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
  this.mkdir('src/images');
  
  this.mkdir('src/common/directives');
  this.mkdir('src/common/resources');
  this.mkdir('src/common/security');
  this.mkdir('src/common/services');
  
  this.mkdir('src/styles');
  this.mkdir('src/styles/fonts');
  this.mkdir('src/styles/bootstrap');

  this.copy('_header.tpl.html', 'src/app/header.tpl.html');
  this.copy('_main.tpl.html', 'src/app/main.tpl.html');

  this.template('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  
  this.template('_main.scss', 'src/styles/main.scss');

  if(this.bootstrap) {
    this.copy('_bootstrap.scss', 'src/styles/bootstrap/bootstrap.scss');
    this.copy('_bootstrap-responsive.scss', 'src/styles/bootstrap/bootstrap-responsive.scss');
    this.copy('_bootstrap-variables.scss', 'src/styles/bootstrap/bootstrap-variables.scss');
  }

  this.template('_index.html', 'src/index.html');
  this.copy('_app.js', 'src/app/app.js');
};

AngularappGenerator.prototype.test = function test() {
  this.mkdir('test/config');
  this.mkdir('test/unit/app');
  this.mkdir('test/unit/common/directives');
  this.mkdir('test/unit/common/security');
  this.mkdir('test/unit/common/services');
  this.mkdir('test/e2e');

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
    bowerPackages.push('sass-bootstrap');
  }
  bowerPackages.push('angular');
  bowerPackages.push('angular-mocks');
};
