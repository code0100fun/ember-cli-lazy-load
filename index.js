/* jshint node: true */
'use strict';

var Funnel      = require('broccoli-funnel');
var treeJson    = require("broccoli-tree-to-json");
var MergeTrees  = require("broccoli-merge-trees")
var replace  = require("broccoli-replace")
module.exports = {
  name: 'ember-cli-bundle',

  included: function(app, parentAddon) {
    this._super.included(app);
    var target = (parentAddon || app);

    // Now you can modify the app / parentAddon. For example, if you wanted
    // to include a custom preprocessor, you could add it to the target's
    // registry:
    //

    var options;
    //shortcut for disable this
    if(this.app.options.bundles === false){
        options = false;
    }else {
      options = this.app.options.bundles = this.app.options.bundles || {};
    }

  },
  contentFor: function(type,config){
    console.log(type,config)
    if (type === 'head-footer') {
      return '<meta name="ember-asset-map" content="@@assetMap"/>';
    }
  },
  postprocessTree:function(type,tree){
    if(type != "all"){
      return tree;
    }

    var assets  = []
    var workingTree = new Funnel(tree, {
      getDestinationPath: function(relativePath) {
        assets.push(relativePath)
        return relativePath;
      }
    });

    var indexTree = replace(workingTree, {
      files: [
        '**/*.html' // replace only html files in src
      ],
      patterns: [
        {
          match: 'assetMap',
          replacement: function(){
            return JSON.stringify(assets).replace('"', "'")
          }
        }
      ]
    });

    return new MergeTrees([workingTree,indexTree], {
      overwrite: true
    });

  }
};
