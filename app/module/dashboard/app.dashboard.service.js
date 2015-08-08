(function () {
    'use strict';

    function ApplicationService($q, $rootScope) {

        var self = this;

    	var URL_APPLICATIONS = "applications";
    	var URL_USERS = "users_replicat";

    	var dbUsers = new PouchDB(URL_USERS);
    	var dbApplications = new PouchDB(URL_APPLICATIONS);

    	this.getCurrentUser = function(){
    		var currentUserName = "org.couchdb.user:"+$rootScope.user.username;
    		var defered  = $q.defer();

    		dbUsers.get(currentUserName).then(function (user) {
    			defered.resolve(user);
    		}, function(){app
                defered.reject();
            });
        	return defered.promise;
    	}

        this.getApplication = function(appId){

        	var defered  = $q.defer();

            var localDB = new PouchDB('applications'); 
            localDB.get(appId).then(function(docs){
                console.log('docs', docs);
                defered.resolve(docs);
            });

        	return defered.promise;
        }

        this.downloadZip = function (app){
            var defered  = $q.defer();
            alert('downloadZip');

            var LOCAL_BASE = cordova.file.applicationStorageDirectory;//"cdvfile://localhost/persistent/Download/";
            var url = app.zipUrl;//celui de filepicker zipUrl/iconUrl
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(url);
            var localFile = LOCAL_BASE+app.name;

            fileTransfer.download(
                            uri,  
                            localFile,
                            function(entry) {
                                console.log("download complete: " + entry.toURL());
                                app.nativeURL = entry.toNativeURL();

                                self.unzipFile(app, entry).then(function(){
                                    defered.resolve(entry);
                                });

                            },

                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code" + error.code);

                                defered.reject();
                            }
                        );
            return defered.promise;
        }

        this.unzipFile = function(app, entry){
            var defered  = $q.defer();
            var outputDir = cordova.file.applicationStorageDirectory+"Documents/WebApps/"+app.name+"/";

            var nativeURL = app.nativeURL;
            //Unzip the local Zip file
            alert('unzipFile '+nativeURL );

            zip.unzip(nativeURL, outputDir, function(result){
                    defered.resolve();
                    // function onError(error){
                    //   alert('error '+JSON.stringify(error))
                    // }
                    // function onSuccess(fileEntry) {
                    //    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
                       
                    //    function gotFS(fs) {
                    //      //copy file system to global scope
                    //      window.resolveLocalFileSystemURL(outputDir, addFileToDirectory, function(error){
                    //        alert('Error getDirectory ==> '+error.code)
                    //      });
                    //    }
                       
                    //    function addFileToDirectory(directory){
                         
                    //    }

                    // }
                    // window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+"www/cordova.js", onSuccess, onError);
                  });
             return defered.promise;
        }

        this.openApp = function(app){
            
            window.open(cordova.file.applicationStorageDirectory+"Documents/WebApps/"+app.name+"/index.html", '_self', 'localtion=yes');
        }

        this.downloadIcon = function(app){
            //from remote to local
            alert('downloadIcon')
        }

        this.launchApp = function(app){
            //start a new cordova
            alert('launchApp') 
        }

        this.isAppDownloaded = function(app){
            //true vs false
            alert('isAppDownloaded');
        }



       

    }

    ApplicationService.$inject = ["$q", "$rootScope"];

    angular
        .module('app.dashboard')
        .service('ApplicationService', ApplicationService);

})();
