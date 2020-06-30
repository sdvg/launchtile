# <img src="media/logo.svg" width="32" height="32" alt=""> LaunchTile

Browser extension for swiftly opening bookmarks and running snippets

<img src="media/screenshot-640x400.png" width="320" align="left" alt="Screenshot of LaunchTile">
<img src="media/screenshot-options.png" width="320" alt="Screenshot of the LaunchTile options page">

* Open the LaunchTile window with Ctrl+Q and start searching
* Results can be navigated using the keyboard (arrow keys + enter)
* Bookmarklets are detected as such and run in the context of the currently open tab
* Additionally, larger JavaScript snippets can be managed on the options page
* Initially, without search query, the most recently created bookmarks are shown
* Dark and light theme, automatically toggled by system preferences

## Install

[Chrome](https://chrome.google.com/webstore/detail/launchtile/jmcdhjepahpchldnembnbejniokgbbln)
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/launchtile/)

## Change Hotkeys

Chrome:  
Go to chrome://extensions/shortcuts and look for _LaunchTile_.

Firefox:  
Open about:addons, click on the cogwheel symbol, choose "Manage Extension Shortcuts" and look for LaunchTile.

## Build

Chrome:

```
# npm install
# npm run build:chrome
```

Firefox: 

```
# npm install
# npm run build:firefox
```

## Development

```
# npm install
# npm run serve:chrome # or npm run serve:firefox 
```
