### Install deps
```sh
npm install
```

### Start Server
```sh
PORT=4567 npm start
```


## Run Postgres

```sh
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

## Connect to Postgres Client

```sh
psql postgresql://postgres:password@0.0.0.0:5432/testdb 
```

## Create Schema

psql testdb < sql/schema.sql -h localhost -U postgres

## Importa data

psql testdb < sql/seed.sql -h localhost -U postgres

## Verify

```sh
psql postgresql://postgres:password@0.0.0.0:5432/testdb 
```

```sql
SELECT * FROM questions;
```
