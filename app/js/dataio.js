const fs = require('fs')
const os = require('os')
const path = require('path')
const walk = require('walk')
//const exec = require('child_process').exec;
const hash = require('./hash')
const utils = require('./utils')

const home = os.homedir()
const data_dir = path.join(home, '.muriel')

// Create storage directory if not present
if (!fs.existsSync(data_dir)){
    fs.mkdirSync(data_dir)
}

// Save an object into a json file
function save(filename, obj, callback) {
  var json = JSON.stringify(obj)
  file_path = path.join(data_dir, filename)
  fs.writeFile(file_path, json, 'utf8', function (err) {
    if (err) throw err
  });
  console.log('saved')
  if (callback) callback()
}

// Get value associated with key
function load(filename, callback) {
  file_path = path.join(data_dir, filename)
  fs.readFile(file_path, 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err)
    } else {
      obj = JSON.parse(data) // now it an object
      if (callback) callback(obj)
    }
  })
}

// Remove a key
function remove(key) {

}

// Reset entire database
function reset() {
}

function add_new_series(new_series, callback) {
  root_dir = new_series.path

  series_id = hash(root_dir)

  if (fs.existsSync(path.join(data_dir, series_id + '.json'))) {
    alert('Series already exists in record!')
  } else {

    var walker  = walk.walk(root_dir, { followLinks: false });
    var files = []
    walker.on('file', function(root_dir, stat, next) {
      // Add this file to the list of files
      file = root_dir + '/' + stat.name
      file_stats = fs.statSync(file)
      filesize = file_stats.size / 1000000.0
      // Ignore files with size less than 1 MB. Not the media file we are looking for
      if (filesize > 1)
          files.push(file)
      next()
    })

    walker.on('end', function() {
      // Time to shuffle the array
      files = utils.shuffle(files)
      // A list of episodes
      var list_of_episodes = {}
      for (var i=1; i<=files.length; i++) {
        list_of_episodes[i] = files[i - 1]
      }

      // https://github.com/OrkoHunter/Muriel/wiki/Storage
      var series = {}
      series.name = new_series.name
      series.id = series_id
      series.root_dir = root_dir
      series.no_of_episodes = files.length
      series.list_of_episodes = list_of_episodes
      series.last_watched_index = 0
      series.date_added = new Date().toDateString()

      save(series_id + '.json', series, console.log)

      callback(series)
    })
  }

}

function delete_series(id) {
  fs.unlink(path.join(data_dir, id + '.json'), console.log)
}

function play_next(id) {
  // Open JSON, get next episode's path and update JSON
  var next_path = ''
  load(id + '.json', function(obj) {
    console.log(obj)
    if (obj.last_watched_index === obj.no_of_episodes) {
      obj.last_watched_index = 1
    } else {
      obj.last_watched_index = obj.last_watched_index + 1
    }
    next_path = obj.list_of_episodes[obj.last_watched_index]
    save(id + '.json', obj)
    play_file(next_path)
  })
  // Play video
}

function play_file(loc) {
  var platform = os.platform()
  // Escape characters
  loc = loc.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  loc = loc.replace("\'", "\\'")
  loc = loc.replace('\"', '\\"')
  if (platform == 'darwin') {
    console.log('Its macos')
    exec_shell('open ' + loc)
  } else if (platform == 'linux') {
    console.log('it is linux baby')
    exec_shell('xdg-open ' + loc)
  } else if (['win32', 'win64'].indexOf(platform) !== -1) {
    console.log('windows meh')
    exec_shell('cmd /c ' + '"' + loc + '"')
  } else {
    alert('Sorry! Platform not supported.\n\n' + 'os.platform() return ' + platform)
  }
}

/*
function exec_shell(cmd) {
  var child = exec(cmd, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}
(/)
exports.add_new_series = add_new_series
exports.delete_series = delete_series
exports.play_next = play_next

