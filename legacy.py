#!/usr/bin/env python

'''
This is the first version of Muriel, a stand alone script.
See https://github.com/OrkoHunter/Muriel/blob/master/legacy.md

Use this if you aren't GUI-friendly or love Python way too much.
'''

from glob import glob
from subprocess import call
import json
import os
import random
import sys
if sys.platform in ['win32', 'win64']:
    import itertools


'''Load or create the file with mapping, map.json'''
# Script location
s_path = os.path.realpath(__file__)
os.chdir(os.path.sep.join(s_path.split(os.path.sep)[:-1]))

if not os.path.exists("map.json"):

    # Remove files of size less than 10 MB (Subtitles, etc.)
    for vid in list(files):
        if os.stat(vid).st_size < 10e7:
            files.remove(vid)

    # A dictionary with key as episode and value as a unique index
    counts = dict()

    # Read the file list
    files = None
    if sys.platform in ['win32', 'win64']:
        files = list(itertools.chain.from_iterable([glob('*'), glob('*\\*')]))
    else:
        files = list(glob('*' + os.path.sep + '*'))

    random.shuffle(files)
    # Initialize the dictionary
    index = 0
    for vid in files:
        counts[index] = vid
        index += 1

    # Initialize map.json
    with open('map.json', 'w') as f:
        f.write(json.dumps(counts))
    last_watched = -1
    with open('last_watched.txt', 'w') as f:
        f.write(str(last_watched))

else:
    with open('map.json', 'r') as f:
        counts = json.loads(f.read())
    with open('last_watched.txt', 'r') as f:
        last_watched = int(f.read())


'''Find out what next to watch'''
if last_watched == 233:
    last_watched = 0
else:
    last_watched += 1

try:
    new = counts[last_watched]
except KeyError:
    new = counts[str(last_watched)]

with open('last_watched.txt', 'w') as f:
    f.write(str(last_watched))

'''Play the episode'''
if sys.platform == 'darwin':
    call(['open', new])
elif sys.platform in ['linux', 'linux2']:
    # Can also use xdg-open
    call(['xdg-open', os.path.join(os.path.abspath('.'), new)])
elif sys.platform in ['win32', 'win64']:
    # raise Exception(
    #    "If you're nerd enough to use this, why still on windows?")
    # If you're still stuck in your parents basement and don't know it,
    # some people are stuck with windows... and hate it
    os.system('cmd /c ' + '"' + new + '"')
else:
    raise Exception("Platform not recognized. Maybe too much nerd for this?")

sys.exit(0)
