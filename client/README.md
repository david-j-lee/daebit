# Daebit Client

This is the front end client.

This client is developed with Angular 5 in TypeScript.

## TODO

* [x] Dynamically set the WebAPI url in config.service.ts
* [x] Put totals for balances, revenues and expenses on both graph and calendar views.
* [x] Create another layer of services to separate business logic from components
* [ ] Lazy Load Modules
* [ ] Unit Tests
* [ ] Integration Tests

## Hosting

This project is hosted on AWS S3 and served via AWS CloudFront.

## Folder Structure

This project users a feature/module folder structure. Shared code is placed in the folder `core`.

```text
client
|-- e2e
|-- node_modules
|-- src
|   |-- app
|   |   |-- core
|   |   |   |-- animations
|   |   |   |-- directives
|   |   |   |-- guards
|   |   |   |-- imports
|   |   |   |-- pipes
|   |   |   |-- services
|   |   |   `-- core.module.ts
|   |   `-- modules
|   |       |-- module 1
|   |       |   |-- components
|   |       |   |   |-- component 1
|   |       |   |   |   |-- component 1.component.html
|   |       |   |   |   |-- component 1.component.scss
|   |       |   |   |   `-- component 1.component.ts
|   |       |   |   `-- component 2
|   |       |   |-- interfaces
|   |       |   |   `-- interface 1.interface.ts
|   |       |   |-- services
|   |       |   |   `-- service 1.service.ts
|   |       |   |-- module 1.module.ts
|   |       |   `-- module 1.routing.ts
|   |       `-- module 2
|   |-- assets
|   |   |-- images
|   |   `-- json
|   |-- environments
|   |-- sass
|   |-- favicon.png
|   |-- index.html
|   |-- main.ts
|   |-- polyfills.ts
|   |-- test.ts
|   |-- tsconfig.app.json
|   |-- tsconfig.spec.json
|   `-- typings.d.ts
|-- .angular-cli.json
|-- karma.conf.js
|-- package.json
|-- protractor.conf.js
|-- proxy.config.json
|-- README.md
`-- tsconfig.json
```
