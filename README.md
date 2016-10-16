# binge-watcher
How to watch a series over and over again, without being bored.

<img src="http://geekandsundry.com/wp-content/uploads/2015/05/binge-watching-3.jpg">

# Why to use?
I have been watching the TV Series called <a href="http://www.thetoptens.com/sitcoms/" target="_blank">F.R.I.E.N.D.S.</a> for over two years now. I watch one or more random episode nearly every day. But while I think what I'm doing, I am not watching it "randomly". There's a fixed pattern in which I click the Season number directory and Episode number file. It's not random at all. And now, I feel that I must have watched some episodes only few times but others *(as chandler would say)* gazillion times.

So, from now on, I use this little python script which lets helps me distribute my times equally on the entire series.

# How to use
Put the script 'play.py' in the root directory of the series to watch.

For example, I'll have the directory stucture like this -

    TV -
        Series A -
            *play.py*
            Season 1 -
                S01E01 -
                S01E02 -
            Season 2 -
                S02E01 -
                S02E02
        Series B -

 - Make a symlink of it on your desktop and execute from there.
 - If you always have a terminal open, put an alias to the script file.

