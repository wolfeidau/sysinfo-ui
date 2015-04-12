# sysmon-ui

A simple dashboard built using react, d3 and webpack. This is designed to be a front end for [sysmon-mqtt](https://github.com/wolfeidau/sysinfo-mqtt).

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
