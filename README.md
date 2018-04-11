# TTB SDK (Software Development Kit)

SDK to consume web-services of [Title ToolBox](https://www.demottb.com/).

### Installation

#### Include script file from a CDN (minified file ~9kbs)
`<script src="https://raw.githubusercontent.com/benutech-inc/ttb-sdk/0.6.5/dist/ttbSdk.min.js"></script>`

#### Bower
```sh
$ bower install ttb-sdk --save
```

#### NPM
Coming soon...

#### Usage

```js
// instantiate the TTB SDK class with minimum info required
var ttb = new TTB({
  partnerKey: '{your partner key}',
});

// build up your payload
var payload = {
  TbUser: {
    username: "awesomeuser99@domain.com",
    password: "secret_Password0"
  }
};

// call one of the SDK ready methods "login" to get user logged in
ttb.login(payload)
.done(function(res) {
  if (res.response.status === 'OK') {
    // user is successfully logged-in !!
    // your success code here to consume res.response.data for logged-in user info
    console.log(res.response.data);
  } else {
    // your failure code here to consume res.response.data for validation errors info
    console.log(res.response.data);
  }
})
.fail(function(err) {
  // your failure code here
})
.always(function() {
 // your on-complete code here as common for both success and failure
});
```

### Documentation

For a detailed documentation on available methods, their parameters, and examples. Check out the live documentation [over here.](http://sdk.titletoolbox.com/) 

### Sandbox (Playground)

For a detailed and working examples 3rd-party site consumption, please check out the Sandbox site [over here.](http://sandbox.titletoolbox.com/)

### Issues

Please feel free to file any defect you find, on [issue page](https://github.com/benutech-inc/ttb-sdk/issues) 

##### Contribution

(Private only) This package follows Company's needs and plans, and being developed by the internal development team only.
For Contribution, Please Check out private contribution guideline [over here](https://github.com/benutech-inc/ttb-sdk/blob/master/CONTRIBUTION.md).

###### Happy coding !
Thanks for trying Title Toolbox !
