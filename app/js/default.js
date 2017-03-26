const remote = require('electron').remote
const dialog = remote.dialog
const fs = require('fs')
const os = require('os')
const path = require('path')

// These module are being loaded from the location of index.html
const data = require('./js/dataio')
const hash = require('./js/hash.js')
const prompt = require('./js/prompt.js')

const home = os.homedir()
const data_dir = path.join(home, '.binge_watcher')

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    if (confirm("Are you sure to remove? \n\nAll the settings and database will be lost.")) {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

// Function to populate list by stored records
fs.readdir(data_dir, function (err, files) {
  files.forEach(function(file) {
    file_path = path.join(data_dir, file)
    fs.readFile(file_path, 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err)
      } else {
        obj = JSON.parse(data) // now it an object
        add_new(obj)
      }
    })
  })
})

// Function to choose directory
function openDirectory () {
  var options = {
    'defaultPath': os.homedir(),
    'properties': ['openDirectory']
  }
  dialog.showOpenDialog(options, function (fileNames) {
    var fullPath = fileNames[0]
    var dirName = fullPath.replace(/^.*[\\\/]/, '')

    new_series = {}
    var name = prompt('Name of the series?', dirName)
    new_series.name = name
    new_series.path = fullPath
    data.add_new_series(new_series, add_new)
  });
}

// Add new element to the list
function add_new(series) {
  var li = document.createElement("li");
  var t = document.createTextNode(series.name);
  li.appendChild(t);
  li.setAttribute('root_dir', series.root_dir)
  li.setAttribute('no_of_episodes', series.no_of_episodes)
  li.setAttribute('list_of_episodes', series.list_of_episodes)
  li.setAttribute('last_watched_index', series.last_watched_index)
  li.setAttribute('date_added', series.date_added)
  li.setAttribute('hours_watched', series.hours_watched)
  document.getElementById("list").appendChild(li);

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}
