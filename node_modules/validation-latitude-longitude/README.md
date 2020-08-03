# Validation Latitude & Longtitude

<br>

### What this package does? 🤔

Tiny package for validating latitude & longitude string format.

```js
/* example */
const isValidStrings = ["40.6892", "74.0445"];
validationLatitudeLongitude.latLong(...isValidStrings); // true 🗽
```

#

<br>

### Results 🙋

1. Valid Latitude and/or Longitude returns `true`.
2. Invalid returns `false`.

#

<br>

### Size 🔬

Less-than < 1.5 kilobytes

#

<br>

### OK! Lets Get Started 💥

### Npm or Yarn installion

```bash
npm install validation-latitude-longitude

yarn add validation-latitude-longitude
```

<br>

### Import Module 📦

```js
import { validationLatitudeLongitude } from "validation-latitude-longitude";
```

<br>

### Methods ⚙️

```js
/* Valid Latitude Format? */
validationLatitudeLongitude.latitude(MY_LATITUDE);

/* Valid Longitude Format? */
validationLatitudeLongitude.longitude(MY_LONGITUDE);

/* Valid Latitude & Longitude Formats? */
validationLatitudeLongitude.latLong(MY_LATITUDE, MY_LONGITUDE);
```

<br>

### The End 🏝️

#

<br>
<br>
<br>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png" width=200>

<br>
<br>

### We could use your help! Please share your experience & code if you got a solution 🛠️to a unique problem 🚀. The community needs your support! ❤️

### Working with npm packages

##### \*\*\* New package

1. Setup an npm account. (if not done aleardy)
2. Create a `package.json` (snippet below) at application root and set version `1.0.0` to start. \*\*\* If open source, set the license to `MIT`. 🤟
3. Push changes to your git repo.
4. `npm login`
5. `npm publish`

```json
{
  "name": "unique-npm-project-name",
  "version": "1.0.0",
  "description": "Descripton of my application",
  "main": "index.min.js",
  "license": "MIT",
  "keywords": ["list", "of", "searchable", "key", "words"]
}
```

##### \*\*\* update package

1. Push changes to your git repo
2. `npm login`
3. `npm version` with new number
4. `npm publish`

```bash
# updating version example
npm verison 1.0.1
```

##### \*\*\* am i still logged in?

1. `npm whoami`

#
