# OCI PiCluster Simulator

## Deployment on OCI

```
cp deploy/terraform/terraform.tfvars.template deploy/terraform/terraform.tfvars
```

Edit `deploy/terraform/terraform.tfvars`.

```
./start.sh
```

## Run locally

```
cd generator
```

```
cp .env.template .env
```

Edit `.env`

```
npm install
```

```
npm start
```
