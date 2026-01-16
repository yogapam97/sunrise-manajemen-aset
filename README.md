> [!WARNING]
> Fixed Asset collection name inconsistency!

After upgrade to latest version you might be surprise that your data do not appear.  
But don't worry, we just fixing some inconsistency issue.  
In version 1.1.0 we change the fixed asset collection name to fixed_assets.  
If you using older version and try to upgrade, make sure to rename your mongodb collection to **fixed_assets** .
Related commit referring to this issue: [ce2e658](https://github.com/garda-dafi/stageholder/commit/ce2e658)

# Stageholder Monorepo

This is an official Stageholder centralize monorepo

## Preparing Development

```sh
yarn install
```

## Setup Environment Variables

In apps directory, there is .env.example file, you can fill the existing environment.

```sh
cp .env.example .env
```

If the environment require secret key, you can manually generate using the following command

```sh
openssl rand -base64 32
```

## Staring Development

After you make sure the required environment variable filled, you can run

```sh
yarn dev
```

## Useful Links

You can check current update:

- [Nightly Update](https://labs.stageholder.com)

## More Info

You can contact me directly:
garda.dafi@gmail.com
