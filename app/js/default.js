const electron = require('electron')
const remote = electron.remote
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
      // var div = this.parentElement;
      // div.style.display = "none";
      data.delete_series(div.id)
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
  document.getElementById("add-btn-i").classList.remove('fa-plus')
  document.getElementById("add-btn-i").classList.add('fa-spinner')
  document.getElementById("add-btn-i").classList.add('fa-spin')
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
    document.getElementById("add-btn-i").classList.add('fa-plus')
    document.getElementById("add-btn-i").classList.remove('fa-spinner')
    document.getElementById("add-btn-i").classList.remove('fa-spin')
  });
}

// Add new element to the list
function add_new(series) {
  var li = document.createElement("li");
  var t = document.createTextNode(series.name);
  li.appendChild(t);
  li.setAttribute('series_id', series.id)
  li.setAttribute('root_dir', series.root_dir)
  li.setAttribute('no_of_episodes', series.no_of_episodes)
  li.setAttribute('list_of_episodes', series.list_of_episodes)
  li.setAttribute('last_watched_index', series.last_watched_index)
  li.setAttribute('date_added', series.date_added)
  li.onclick = function() {
    data.play_next(this.getAttribute('series_id'))
  }
  document.getElementById("list").appendChild(li);

  var span = document.createElement("SPAN");
  var icon = document.createElement("i")
  icon.classList.add('fa')
  icon.classList.add('fa-info')
  icon.setAttribute('aria-hidden', 'true')
  span.className = "info";
  span.appendChild(icon);
  span.onclick = function() {
   show_stats(this.parentElement.getAttribute('series_id'))
  }
  span.addEventListener("click", function(e) {
    e.stopPropagation()
  })
  li.appendChild(span);

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].addEventListener("click", function(e) {
      e.stopPropagation()
    })

    close[i].onclick = function() {
      if (confirm("Are you sure to remove? \n\nAll the settings and database will be lost.")) {
        var div = this.parentElement;
        div.style.display = "none";
        data.delete_series(div.getAttribute('series_id'))
      }
    }
  }
}


function show_stats(id) {
  // alert("I'll show you some stats")
  // can access at window.__args__ from scripts
  file_path = path.join(data_dir, id + '.json')
  fs.readFile(file_path, 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err)
    } else {
      obj = JSON.parse(data)
      console.log(obj)
      var alert_text = "\
      Statistics for " + obj.name + "\n\n\
      Number of episodes :\t" + obj.no_of_episodes + "\n\
      Last watched episode : " + obj.list_of_episodes[obj.last_watched_index] + "\n\
      Date Added : \t" + obj.date_added + "\n\
      Path : " + obj.root_dir + "\n"
      alert(alert_text)
    }
  })
}

