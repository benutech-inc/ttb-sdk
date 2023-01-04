
### Setting up DEV environment
- use node 10.x
- run `npm install`
- (no need of bower install)
- run `npm start` and that's it !!

You are ready to make changes to src/ttbSdk.js and .css as well. The "dist" and "docs" directories will automatically be generated/updated on each change. 

### Serve Docs locally
- run `npm run serve:docs`

This would serve the "docs" directory over `localhost:8000`, and so you can keep looking at it while you have above "dev env" running.

### Tagging

#### Add a Tag
Make sure to rename all the mentions of current version with the new version. 
E.g. The ttbSdk.js, and ttbSdk.css files inside Src.

###### 1. Commit your changes
`git commit -m "Release version 1.20.0"`

###### 2. Tag the commit - e.g. '1.20.0'
`git tag -a 1.20.0 -m "Release version 1.20.0"`

###### 3. Push to GitHub
`git push origin master --tags`


#### Delete a Tag

###### 1. Delete local tag - e.g. '0.3.0'
`git tag -d 0.3.0`

###### 2. Delete remote tag - e.g. '0.3.0'
`git push origin :refs/tags/0.3.0`

