const storage = require('electron-json-storage');
const hash = require('./hash.js')

// Save a key value pair
exports.save = function save_to_storage(key, value) {
  storage.set(key, value, function(error) {
    if (error) throw error
  })
}

// Get value associated with key
exports.load = function get_from_storage(key) {
  storage.get(key, function (error) {
    if (error) throw error
  })
}

// Remove a key
exports.remove = function remove_from_stograge(key) {
  storage.remove(key)
}

// Reset entire database
exports reset_all = function reset_entire_database() {
  storage.clear(function(error) {
    if (error) throw error
  })
}
