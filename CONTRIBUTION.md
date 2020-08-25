
### Setting up DEV environment
- use node 10.x
- run `npm install`
- (no need of bower install)
- run `gulp doc-dev` and that's it !!

You are ready to make changes to src/ttbSdk.js and .css as well. The "dist" and "docs" directories will automatically be generated/updated on each change. 

### Serve Docs locally
- run `npm run serve`

This would serve the "docs" directory over `localhost:8000`, and so you can keep looking at it while you have above "dev env" running.

### Tagging

#### Add a Tag

###### 1. Commit your changes
`git commit -m "Made some awesome new changes, now its even more awesome."`

###### 2. Tag the commit - e.g. '0.3.0'
`git tag -a 0.3.0 -m "Release version 0.3.0"`

###### 3. Push to GitHub
`git push origin master --tags`


#### Delete a Tag

###### 1. Delete local tag - e.g. '0.3.0'
`git tag -d 0.3.0`

###### 2. Delete remote tag - e.g. '0.3.0'
`git push origin :refs/tags/0.3.0`

