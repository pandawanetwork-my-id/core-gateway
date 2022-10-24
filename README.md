# OWN Gateway

## Requirements
- nodejs >= v14.19.1

## syarat wajib request melalui gateway(authentication)
    - x-client-id
    - x-api-key

## authorization (ripple10)
    - headers.authorization(Bearer Token)
        > jika di extract {data: {c: Number, p: [Array Project]}}