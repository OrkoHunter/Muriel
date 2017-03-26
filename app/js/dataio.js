const fs = require('fs')
const os = require('os')
const path = require('path')
const walk = require('walk')
const hash = require('./hash')
const utils = require('./utils')

const home = os.homedir()
const data_dir = path.join(home, '.binge_watcher')

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

      // https://github.com/OrkoHunter/binge-watcher/wiki/Storage
      var series = {}
      series.name = new_series.name
      series.id = series_id
      series.root_dir = root_dir
      series.no_of_episodes = files.length
      series.list_of_episodes = list_of_episodes
      series.last_watched_index = 0
      series.date_added = new Date().toDateString()
      series.hours_watched = 0

      save(series_id + '.json', series, console.log)

      callback(series)
    })
  }

}


function delete_series(id) {
  fs.unlink(path.join(data_dir, id + '.json'), console.log)
}

exports.add_new_series = add_new_series
exports.delete_series = delete_series

