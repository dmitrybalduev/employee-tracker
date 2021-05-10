# Employee Tracker

## Description 
This is a simple command-line application to help user manage employees database. There are three tables in database: Employees, Roles and Departments. It allows user view, add employees, departments and update roles. 

## Installation
MacOS users
1. Make sure you have HomeBrew installed on Mac
2. Install npm by running "brew install npm"
3. Clone or fork the repo and navigate to repo directory by using command line
4. In order to resolve dependencies run "npm i"

## Usage
Follow these steps:
1. To populate tables run command from root directory "mysql -uroot < populateTables.sql". If you have different username, change it in -uroot. And if you have password make sure to add -p in command
2. To seed database run command "mysql -uroot < seeds.sql"
3. To start application run "node server.js" 

## Screenshots
![Application](./screenshot.PNG)

