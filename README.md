
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

# Small proof-of-concept quiz app meant for straightforward deployment with ElasticBeanstalk

## Install deps
```sh
npm install
```

## Run Postgres

```sh
cd ../
docker copmpose up
```

## Install the Postgres Client

```
sudo apt install postgres
```

## Create the database

```sh
createdb testdb -h localhost -U postgres
```

### Start Server
```sh
PORT=4567 npm start
```
  - The app checks the database and seeds it automatically if required.



###  Deploying to Elastic Beanstalk  ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
  - 'app.zip' is deployment-ready zipped version of the app because CodeSource is no-longer available for new users
  - will integrate CI/CD pipeline with git later
