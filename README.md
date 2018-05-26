#Sleep Planing Mobile App

*Mobile app use [napchart](https://github.com/larskarbo/napchart) library to create, save and share napcharts.*

Written using a `cordova` and `reactjs`. Can fetch data from [napchart.com](http://napchart.com)

## Installation

⚠️ Sleep Planing uses `node-canvas` as a dependency to render charts server-side. It needs some specific programs in order to work. Go to [Automattic/node-canvas](https://github.com/Automattic/node-canvas) to see instructions for you OS

Then try to install dependencies using npm
````
yarn
````

Then build the reactjs bundle
````
yarn build
````
Start on mobile device (platform can be either ios or android)
````
cordova run platform
````


You can also see the web site by using `serve`

````
yarn global add serve
serve www
````

##References
[napchart](https://github.com/larskarbo/napchart)
[napchart-website](https://github.com/larskarbo/napchart-website)