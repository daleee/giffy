giffy-api
=========

**WARNING: Still in development! Not ready for production use.**

Prerequisites
-------------
* Node.js
* An AWS S3 bucket with the following credentials:
    * User Access Key
    * Secret Key
    * Bucket name
* One of the following
    * Postgres (tested)
    * MySQL
    * SQLite3

**DO NOT** use your root AWS account information. Use [IAM](http://aws.amazon.com/iam/).

Installation
------------
1. Clone the directory: `git clone git@github.com:daleee/giffy.git`
2. Navigate to `/conf`, and create local copies of the configuration files: `cp api.js.example api.js && cp aws.js.example aws.js && cp db.js.example db.js`
3. Navigate to `/public/js/services` and `ConstantService.js` to point to the URL of your server/API location.
4. Install dependencies and build static assets:
```sh
cd giffy
npm install
cd public
bower install
cd ../ # back to root of giffy dir
gulp build
```
5. Run the API with `node server.js`

To Do
-----
- [ ] Automated install process for install/build steps!
- [ ] Centralized config for entire application!
- [ ] Tests!
