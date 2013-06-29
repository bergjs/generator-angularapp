# generator-angularapp
====================

A yo generator for the angular-app project structure by petebacondarwin

## Installation

Get generator-angularapp from npm (it's not there yet):
    
    npm install generator-angularapp

Create a directory for your app:

    mkdir myApp
    cd myApp

Create client and server folders (optional):

    mkdir client && mkdir server
    cd client

Run yo command:

    yo angularapp

## Directory Layout

    client ------------- main folder for this generator (optional)
      src -------------- your app   
        app ------------ contains your app's code divided into subfolders that represent parts of your app
        assets --------- favicon and images
        common --------- angular files shared between different parts of your app
        styles --------- ...
      test ------------- the tests for your app
        config --------- configuration files
        e2e ------------ end to end tests
        unit ----------- unit tests      
      vendor ----------- 3rd party packages installed by bower (bower components folder)


