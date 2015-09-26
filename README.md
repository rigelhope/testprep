# testprep

This is a browser-based app that is intended to provide local, offline access to a user's multiple-choice question banks, such as those used to study for FCC ham radio licensing, LSAT, MCAT, USMLE, bar exam, etc. It requires the user to already have a qbank of some kind in their posession.

While the format of the 'generated.json' file included may be used to convert a qbank into testprep's json-based file format, I intend to (eventually) write another tool that can be used for conversion from e.g. XML based formats.

# What it does
testprep uses AngularJS as well as JQuery and Bootstrap. it also uses the excellent angular-localForage package to save sessions to your browser's local storage. The amount of local storage available depends on your browser, as discussed on [this HTML5Rocks page](http://www.html5rocks.com/en/features/storage).

# Installation

As a webapp, there are multiple ways to install testprep:

##Webserver-based
Download the files from the dist directory to wherever your webserver is. A convenient way to do this uses Python's SimpleHTTPServer. Run 'python -m SimpleHTTPServer' from the files' root directory, and then navigate your browser to (typically) localhost:9000. You can also drop the files on a remote server running apache or nginx, of course.
##Convert to an offline webapp
I have had some success in previous iterations packaging testprep as a self-contained chrome app, which will allow it to run on Chrome/Chromium browsers as well as ChromeOS. It will need a manifest.xml file, and angular requires an additional .csp file to run correctly as a Chrome app. Detailed instructions or a prepackaged app will be (eventually) forthcoming.
##Convert to a mobile app using Cordova
I have also successfully used Apache Cordova (formerly PhoneGap) to create a mobile app for Android from the files in the dist directory. Again, further details will be forthcoming, eventually. However, I have not attempted this since fleshing out the localStorage/sessions functionality.

#UI
The UI is inspired by several of the multiple-choice-question (MCQ) tests administered by test centers such as ProMetric in the US.

#Building testprep
I've used this project to familiarize myself with a fair number of recent, I guess theyre called "DevOps" tools. Specifically, yeoman, bower, and Grunt, all of which require node.js. Where possible, I have attempted to ensure that using the typical build commands will result in a working version of the app.

#Ongoing development
I have only intermittently been able to work on this project thus far, and it has been mainly for my own personal use. There may be quirks that I am either not aware of or unconsciously avoid. No Warranty expressed or implied, etc etc.

I intend to develop this further though, so I would appreciate suggestions, or even better, help with development. The time I can allot to development is pretty strictly limited for much of the year. 

#License
yes, i need a LICENSE file to do this officially, but except where the copyright is held by some other entity (the libraries I used), this software is made available under the terms of the GPLv3.

#etc.
There's no reason why this cant be used as a simple flash card program (ignoring the multiple choice aspect) nor is there any reason why text must be used for the qbank (e.g. pictures of text work too).
