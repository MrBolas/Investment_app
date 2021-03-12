# Investment app / Manage Vault

## Summary
Manage Vault or Investment App it's a personal project intended to control financial investments in real estate. Truth be told, it's built in a generic fashion allowing the control even a common household with common expenses.

The app allows a control of income and expenses, periodic or singular and a visual evolution of both values through three charts that range in three different time spans.

Initially the app was intended to have more functionality than it has in the moment, the missing features are added when i have available time to dedicate to this project.

The app is served in a docker in a small server that i have deployed.
You can try out the app [here](http://94.62.211.190:8082/).

## Motivation
This project was born from the need to control an investment from family members to allow a more reasonable and delicate overview of the investment as a potential business, and to understand the effect of certain actions could have on potential reveneu of the investment.

## Features
* **Income and Expenses listing** -> Like any expenses app, a detailed form of reading the expenses is needed. In this case i've chosen a list ordered by date.
* **Multiple Investment Managment** -> The app supports several investments per Account. No real limit exist, only database memory.
* **User Accounts** -> Different users can control their own investments.
* **Charts** -> On the detailed view ofthe investment there are three charts. On the left represents Income/Expenses in the current month, in the center Income/Expenses in the current year and in the right, Income/Expenses for all the history. Allowing a more brief balance of the more important time of the month, more important time of the year and if the investment has reach the break even.
* **User profiles** -> Several parts of the application have some customizable functionality. Example, the charts can be viewed has "cumulative" or simple to better evaluate the transaction history. These settigns are stored per user in the database, allowing the user to mantain it's preferences in the view.
* **Managers** -> Managers allow users to share certain investments with other users. The reasoning behind relies on people that share investments, but need different accounts because they don't share all of the investments.
* **Periodic transactions** -> Some transactions are the same every month. There should be an option to only define an Income/Expense once, and repeat it for certain ammount of time.
* **Completed Transactions** -> Because some transaction are added automatically, the user should be able to control when they are really made. As such, the transactions appear the history of the investment, however, the user has to manually confirmed that such transaction happened. This creates a reminder to collect or to pay transactions.

## Technological stack
The project is still in development, the tech stack is mainly a MEAN tech stack.
* **Mongo dB**
* **Expressjs**
* **Nodejs**
* **Angular**

For deployment:
* **Docker**
* **Portrainer**

## Future
Several features need some completion. Some other features are just ideas for now.
Features in need of completion:
* login system -> Add a way to recover account.

Ideas for features:
* mailling/notification system -> it is ideal no notify te user of pending transactions.
