# rfa-habit-tracker

## Setup


```zsh
$ curl -X POST https://pixe.la/v1/users -d '{"token":"thisissecret", "username":"yuseiito", "agreeTermsOfService":"yes", "notMinor":"yes"}'
{"message":"Success. Let's visit https://pixe.la/@yuseiito, it is your profile page!","isSuccess":true}%
$ curl -X POST https://pixe.la/v1/users/yuseiito/graphs -H 'X-USER-TOKEN:thisissecret' -d '{"id":"rfa","name":"RingFit Adventure","unit":"minute(s)","type":"int","color":"shibafu","timezone":"Asia/Tokyo"}'
{"message":"Success.","isSuccess":true}
```

## Development

Start the developemnt shell with the following command.

```zsh
$ nix shell
```

### Build

```zsh
$ npm install
$ npm run build
```

### Deploy

1. Create a terraform.tfvars file with the following content.

```hcl
aws_access_key=""
aws_secret_key=""
pixela_username="yuseiito"
pixela_token="thisissecret"
pixela_graph_id="rfa"
```

2. Run the following commands.

```zsh
$ terraform init
$ terraform plan
```


## License

MIT. See [LICENSE](LICENSE) for more information.
