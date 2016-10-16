#!/usr/bin/env python

from glob import glob
from subprocess import call
import json
import os
import random
import sys


'''Load or create the file with statistics, counts.json'''
# Script location
s_path = os.path.realpath(__file__)
os.chdir('/'.join(s_path.split('/')[:-1]))

if not os.path.exists("counts.json"):
    # Read the file list
    files = glob('*/*')

    # Remove files of size less than 10 MB (Subtitles, etc.)
    for vid in list(files):
        if os.stat(vid).st_size < 10e7:
            files.remove(vid)

    # A dictionary with key as episode and value as number of times watched
    counts = dict()

    # Initialize the dictionary
    for vid in files:
        counts[vid] = 0

    # Initialize counts.json
    with open('counts.json', 'w') as f:
        f.write(json.dumps(counts))

else:
    with open('counts.json', 'r') as f:
        counts = json.loads(f.read())


'''Find out what to watch next'''

# Average number of times each episode has been watched
avg = sum(counts[i] for i in counts.keys()) / len(counts)

# New episode to watch
new = random.choice(counts.keys())

# Don't watch an overwatched episode
while counts[new] > avg :
    new = random.choice(counts.keys())

# Add the count of the new episode
counts[new] += 1

with open('counts.json', 'w') as f:
    f.write(json.dumps(counts))

'''Play the episode'''
if sys.platform == 'darwin':
    call(['open', new])
elif sys.platform == 'linux2':
    # Can also use xdg-open
    call(['gnome-open', new])
elif sys.platform in ['win32', 'win64']:
    raise Exception(
        "If you're nerd enough to use this, why still on windows?")
else:
    raise Exception("Platform not recognized. Maybe too much nerd for this?")

sys.exit(0)
