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
* One of the following SQL systems:
    * Postgres (tested)
    * MySQL
    * SQLite3

**DO NOT** use your root AWS account information. Use [IAM](http://aws.amazon.com/iam/).

Installation
------------
1. Clone the directory: `git clone git@github.com:daleee/giffy.git`
2. Navigate to the `/api/` directory in the terminal and install Node dependencies with `npm install`
3. Navigate to `/api/conf`, and create local copies of the configuration files: `cp api.js.example api.js && cp aws.js.example aws.js`
4. Run the API with `node server.js`

To Do
-----
[ ] Tests!