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
  name = new_series.name
  root_dir = new_series.path

  series_id = hash(root_dir)

  if (fs.existsSync(path.join(data_dir, series_id + '.json'))) {
    throw('Series already exists in record!')
  }

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
  })


}

exports.add_new_series = add_new_series
//save('himanshu.json', ['sita', 'ram'])
//load('himanshu.json', console.log)

