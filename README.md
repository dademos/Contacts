# Contacts Demo app

This repository contains a small contacts demo app with CRUD functionality along with list sorting, 
filtering and paging support.
It's meant primarily as a demonstration of my familiarity (or unfamiliarity - you are the judge) with 
particular technologies and patterns and should also give an idea of how I prefer to 
structure my projects and code.

## Backend

The backend is built using ASP.NET Web API and SQL Server, see this [README](./Contacts.WebApi/README.md) for details.

## Frontend

Frontend is built with Angular Material, see the corresponding 
[README](./Contacts.WebUi.AngularMaterial/README.md).

## Hosting and deployment

Everything is deployed to Azure via Azure DevOps pipeline, 
including application of DB migrations. 
The pipeline also runs units tests for both frontend and backend. 
Angular frontend is deplyed to the same Azure App Service as the API.
The app is available at [https://contacts-dghjcuhtaqejbnd7.australiaeast-01.azurewebsites.net/](https://contacts-dghjcuhtaqejbnd7.australiaeast-01.azurewebsites.net/).
