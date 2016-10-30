#!/usr/bin/env python

from glob import glob
from subprocess import call
import json
import os
import random
import sys
if sys.platform in ['win32', 'win64']:
    import itertools


'''Load or create the file with statistics, counts.json'''
# Script location
s_path = os.path.realpath(__file__)
os.chdir(os.path.sep.join(s_path.split(os.path.sep)[:-1]))

if not os.path.exists("counts.json"):
    # Read the file list

    # A dictionary with key as episode and value as number of times watched
    counts = dict()

    if sys.platform in ['win32', 'win64']:
        files = list(itertools.chain.from_iterable([glob('*'), glob('*\\*')]))
    else:
        files = list(glob('*' + os.path.sep + '*'))

    # Initialize the dict with files > 10MB in size
    for vid in files:
        # Remove files of size less than 10 MB (Subtitles, etc.)
        if os.stat(vid).st_size < 10e7:
            files.remove(vid)
        else:
            # Initialize the dictionary
            counts[vid] = 0

    # Initialize counts.json
    with open('counts.json', 'w') as f:
        f.write(json.dumps(counts))

else:
    with open('counts.json', 'r') as f:
        counts = json.loads(f.read())


'''Find out what next to watch'''

# Average number of times each episode has been watched
avg = sum(counts[i] for i in counts.keys()) / len(counts)

# New episode to watch
new = random.choice(list(counts.keys()))

# Don't watch an overwatched episode
while counts[new] > avg:
    new = random.choice(list(counts.keys()))

# Add the count of the new episode
counts[new] += 1

with open('counts.json', 'w') as f:
    f.write(json.dumps(counts))

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
    os.system('cmd /c ' + new)
else:
    raise Exception("Platform not recognized. Maybe too much nerd for this?")

sys.exit(0)
