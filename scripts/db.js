var db;
let dbReq = indexedDB.open("metroDatabase", 1);
dbReq.onupgradeneeded = function(event) {
  db = event.target.result;
  let notes = db.createObjectStore("timetables", { autoIncrement: true });
};
dbReq.onsuccess = function(event) {
  db = event.target.result;
};
dbReq.onerror = function(event) {
  alert("error opening db " + event.target.errorCode);
};

function addTimeTable(db, schedule, url) {
  let tx = db.transaction(["timetables"], "readwrite");
  let store = tx.objectStore("timetables");
  let timetable = { url: url, object: schedule, timestamp: Date.now() };
  store.add(timetable);
  tx.oncomplete = function() {
    console.log("stored timetable!");
  };
  tx.onerror = function(event) {
    alert("error storing timetable " + event.target.errorCode);
  };
}

function submitSchedule(schedule, url) {
  addTimeTable(db, schedule, url);
}

function getTimetables() {
  return new Promise(function(resolve, reject) {
    let tx = db.transaction(["timetables"], "readonly");
    let objectStore = tx.objectStore("timetables");
    // Create a cursor request to get all items in the store, which
    // we collect in the allNotes array
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
      resolve(request.result);
    };
    request.onerror = function(event) {
      alert("error in cursor request " + event.target.errorCode);
    };
  });
}
