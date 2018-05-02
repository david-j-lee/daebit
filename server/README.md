# Daebit Server

This is the WebAPI for [daebit.com](https://daebit.com) and can be accessed via [api.daebit.com](https://api.daebit.com).

This WebAPI is developed with ASP Core 2 in C#.

## WebAPI

This project uses JWT and expects there to be a token in the header of each request.

## Hosting

This application is fully hosted on Amazons Web Services.

* Uses AWS CodeStar and is published via a git push to AWS CodeCommit.
  * AWS CodeDeploy deploys this project to AWS EC2 and runs on Ubuntu v16.04.
* The database runs on AWS RDS with MS SQL Server.
* Emails are sent via SMTP on AWS SES.

## TODO

* [ ] Add comments
* [ ] Integration Tests

---

## Folder Structure

This project uses the features/modules folder structure. Shared code is placed in the folder `Shared`.

```text
server
|-- Data
|-- Modules
|   |-- Module 1
|   |   |-- Sub Module 1
|   |   |   |-- ViewModels
|   |   |   |-- Model.cs
|   |   |   `-- Controller.cs
|   |   `-- Sub Module 2
|   `-- Module 2
|       |-- ViewModels
|       |-- Model.cs
|       `-- Controller.cs
|-- Properties
|   `-- launchSettings.json
|-- Shared
|   |-- Enums
|   |-- Helpers
|   `-- Utilities
|-- wwwroot
|   `-- Templates
|-- appsettings.json
|-- appspec.yml
|-- buildspec.yml
|-- Daebit.csproj
|-- Daebit.sln
|-- package.json
|-- Program.cs
|-- README.md
`-- Startup.cs
```