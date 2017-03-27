<h1 align="center">
  <br>
  <img src="app/img/icons/bing.png" alt="Muriel" width="200">
  <img src="app/img/muriel.png" alt="Muriel" width="200">
  <br>
  <br>
</h1>

<h3 align="center">Powered by <a href="http://electron.atom.io">Electron</a></h3>

**Muriel** is a cross platform app for watching a long series (TV, Documentaries, etc.) in a random order such that no video is repeated until all the others have been watched already.

## Why would you use it?

There are some TV series with over hundreds of episodes. After completing the whole thing once (and if
we like it), we often watch one random episode anytime we feel like it. In this pseudo-random
process of ours, there is a high chance of recurrence of episodes in short duration, which
ultimately makes us bored and we quit.

## So how does this work?

Muriel keeps a shuffled order of episodes and doesn't let any episode repeat unless all the others
have been watched the same number of times.

## Show me a cool GIF

<h3 align="center"><img src="app/img/demo.gif"></h3>

## How to use?

Go to the [release page](https://github.com/OrkoHunter/Muriel/releases), download the one for your
platform (Windows, Linux or Mac OS). Run `chmod +x Muriel` on the executable. Create a shortcut to
the executable from where you want to use it.

Confession 1 : Sorry about the large release size. Electron packaging is not lightweight.<br>
Confession 2 : Again sorry for no standalone executables or app. I couldn't figure out how to make one.

## Can I make changes and contribute?

Yes please !

```sh
$ git clone https://github.com/OrkoHunter/Muriel
$ cd Muriel
$ npm install
$ npm start
```

If you don't have npm, use [nvm](https://github.com/creationix/nvm) to install it.
