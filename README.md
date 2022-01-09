# Keto Diet Lib
![alt text](https://raw.githubusercontent.com/netervati/ketodietlib/main/demo/demosite.gif)
Keto Diet Lib is an informative site with comprehensive data on foods and their nutritional values for ketogenic patients. This project is my submission for the [MongoDB Atlas Hackathon on DEV](https://dev.to/devteam/announcing-the-mongodb-atlas-hackathon-on-dev-4b6m) under the category **Choose Your Own Adventure**. Credit goes to [My Food Data](https://myfooddata.com/) for the dataset.

## Primary Technologies
Below are the main technologies that I used:
- Flask (Backend Framework)
- Bootstrap, & Vanilla JS (Frontend Technologies)
- MongoDB (Database)


## Hosting the Application locally
To use Keto Diet Lib, you will need [python 3.9](https://www.python.org/downloads/release/python-390/). You will also need a [MongoDB](https://www.mongodb.com/) account and the [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) application. 

### Setup
Follow the instructions in the MongoDB site and create your own database and user. Make sure to allow your IP address to access MongoDB by setting your cluster's Network Access. Then, create a collection labeled **foodinfo**. Import the **foodinfo.csv** file in the added collection. Afterwards, create a search index with the name **food_search** and set the index fields to **group** and **name**. 

### Installation
Next, follow the step-by-step installation below:
1. Clone this repository
```
$ git clone https://github.com/netervati/ketodietlib
```
2. Start your virtual environment
```
$ pipenv shell
```
3. Install the packages located in the requirements.txt. You can ignore the **gunicorn** package
4. Update the .env file with your MongoDB URI
```
MONGO_URI = YOUR_URI
```
5. Finally, export the flask application and run
```
$ export FLASK_APP=app
$ flask run
```