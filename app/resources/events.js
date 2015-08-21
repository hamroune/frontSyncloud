var sendEvent=function(key,value,username,password,appId,openApp){
  var db = new PouchDB('http://'+username+':'+password+'@195.154.223.114:5984/events');
  var event = {
     _id:     uuid.v1(),
     key:     key,
     value:   value,
     userId:  "org.couchdb.user:"+username,
     appId:   appId,
     at:      new Date()
  };
  db.put(event)
  .then(function (response) {
    console.log(response);
    if(openApp) openApp();
  }).catch(function (err) {
    console.log(err);
  });
}
