# Hypothesis
Hypothesis is a web application I made to help me and others easily log and edit experiments and different tests!

[Website](https://hypothesis.dino.icu)
[API docs](https://hypothesis.nordicpine.hackclub.app/docs)

<img src = "./docs/images/new-experiment-screenshot.png" alt = "New experiment page" width = "700">

## Demo account

Use the following account information to browse demo experiments

**Username**: demo

**Password**: demo1234

> If you are using the demo account, please don't modify, delete or edit the existing demo experiments in any way, and if you create new ones, please delete them when youre finished

## How to use

1. Go do the sign up page and create an account (or go to sign in and sing in using existing account)
2. Click the '+ New experiment' button to create a new experiment
3. Input all information into the fields
4. Click create experiment to add it to the database
5. Naviagte to the experiments tab to view all saved experiments and click on a card to view one


## Features
- Accounts
  - Username and password for secure login
  - Keeping your experiments private and only edited by yourself
  - A currently unused email adress
  - Protected using JWT tokens - Sessions expire after 60 min
 
- Experiments
  - Multiple scientific fields
      - Title, contributors, introduction, hypothesis, materials, method, results, discoussion, conclusion
   
  - Editing and deletion of experiments
  - Clean UI for ease of use
  - Browse experiments
      - Quick cards with a summary of the experiment
      - Search by title and/or filter by date of creation and title
   

## Installation

### Prerequisites
- Python 3.10+
- pip
- Git
- A web browser

### Install files
Clone the repository
```bash
git clone https://github.com/RasmusStenlund/hypothesis.git
cd hypothesis
```
### Backend setup
You need to create a new file named .env and add the following code to it, but replace the placeholder key with a custom hash key

**.env**
```bash
secret_key = "placeholder_hash_key"
```

API setup:
```bash
cd app

python -m venv venv
#windows
venv\Scripts\activate
#mac/linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend setup
This project was made in vanilla HTML, JavaScript and CSS, so no special stup is needed. You will need to change the url for API if you host the API yourself or on another server, if you host locally the url you need is below.

**extra_functions.js**
``` js
const url = "http://127.0.0.1:8000"
```

## Possible future improvements
- Images for experiments
- Tags you can filter by, e.g Biology, Chemistry
- Maybe a usecase for email authentication and password reset
