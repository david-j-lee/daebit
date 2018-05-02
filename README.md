# README

This application is built with ASP Core 2 and Angular 5. Currently contains two applications within this project.

## Financial Forecasting

Quick financial forecasting. Manage your balances and set rules to model your revenues and expenses over the next 365 days. View your forecast with graphs on in a calendar.

* Client location: `client/src/app/modules/finance`
* Server location: `server/Modules/Finance`

## Grade Book

Manage your grades and run what if scenarios. This is a remake of a prior [project](https://github.com/david-j-lee/MyGradeBook) I put together in college with C# in WinForms.

* Client location: `client/src/app/modules/gradebook`
* Server location: `server/Modules/GradeBook`

---

## Restoring Libraries

Restore the libraries for both the root, client and server projects.

### Root

To restore the root project run the following from the root directory run `npm install` in the terminal.

### Client

To restore the client project run the following from the root directory

* `cd client`
* `npm install`

### Server

To restore the client project run the following from the root directory

* `cd server`
* `dotnet restore`
* `dotnet ef update-database`

## Running the Project

After restoring the libraries run `npm run start:dev` for the development or `npm run start` for production.

~~In the file located in the path `client/src/app/core/services/config.service.ts` you must set the url of the WebAPI server.~~

---

## Folder Structure

The Angular 5 project can be found in the `client` folder and the ASP Core 2 WebAPI project can be found in the `server` folder.
