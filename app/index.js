'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var AngularappGenerator = module.exports = function AngularappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
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
    type: 'confirm',
    name: 'appName',
    message: 'How would you like to call your angular app?'
  }];

  this.prompt(prompts, function (props) {
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
  this.mkdir('src/less');

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('_bootstrap.less', 'src/less/bootstrap.less');
  this.copy('_variables.less', 'src/less/variables.less');
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
};
