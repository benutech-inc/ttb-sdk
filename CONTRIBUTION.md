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

