# sysmon-ui

A simple dashboard built using [react](https://facebook.github.io/react/), [d3](http://d3js.org/), [most](https://github.com/cujojs/most) and [webpack](http://webpack.github.io). This is designed to be a front end for [sysmon-mqtt](https://github.com/wolfeidau/sysinfo-mqtt).

The aims of this project are:

* Provide a simple system monitor which uses very few resources on the server
* Illustrate how to use react.js with d3
* Build a UI that is entirely stream based using cujojs most library.

![ScreenShot](/docs/sysmon-react.gif)

# Building

```
npm install
npm run build
```

# Running

Navigate to the sysmon-mqtt source code.

```
make
bin/sysmon-mqtt --debug
```

Then back in the sysmon-ui project.

```
foreman start
```

# disclaimer

This is a very early prototype of the service, once it is finished I will provide a packaged version for download.

# License

This code is Copyright (c) 2014 Mark Wolfe and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
