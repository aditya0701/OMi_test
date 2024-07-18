# Creating Login Credentials
First, you need to create login credentials. Therefore, create a .env file in the backend directory containing URL, APP_KEY, DATA_POOL, and DATA_MODEL. </br>
</br>
Your .env file should then look like this:</br>
```text
URL = https://celonis-seminar-group-2.try.celonis.cloud/
APP_KEY = your_app_key
DATA_POOL = your_data_pool_id
DATA_MODEL = your_data_model_id
```

### Retrieving the APP Key
You can find instructions on how to retrieve an Application Key here:</br>
https://docs.celonis.com/en/registering-application-keys-in-celonis-platform.html

### Retrieving the Data Pool ID and Data Model ID
The data pool ID and data model ID can be retrieved from the URL of the respective data jobs. Therefore, navigate to the data pool "OCPM Data Pool" and the data model "perspective_celonis_Procurement". You can navigate to the data model like this: </br>
1. In your Celonis Platform, click **Data > Data Integration**. </br>
2. Then, click on the **OCPM Data Pool**.</br>
3. In the visualization of the data pool, click on **Data Models**.</br>
4. Now choose the data model **perspective_celonis_Procurement**.</br>
5. Now you can retrieve your_data_pool_id and your_data_model_id from the URL, which should look as follows:
https://celonis-seminar-group-2.try.celonis.cloud/integration/ui/pools/{your_data_pool_id}your_data_pool_id*/data-configuration/process-data-models/{your_data_model_id}?tab=data-model </br>

# Running and Building the Application
You can either run the application using docker or start everything from a terminal.

## Quickstart with Docker
Open your terminal and navigate to the root directory of the project named 'cohorts' where the 'docker-compose.yml' file is located.</br> 
Run the following command to build and start the application:
```bash
docker-compose up --build
```
The web app is now running at:
http://localhost:5173/

To remove the Docker containers, networks, and volumes created, press Ctrl + C in the terminal and then run:
```bash
docker-compose down
```

## Manual Installation and Execution
Alternatively, you can start the app as follows:

### Prerequisites
Make sure you have the following installed on your system:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

### Setting Up the Backend
Navigate into back-end directory:
```bash
cd backend
```

Optionally, create a virtual environment:</br>
On Windows:
```bash
py -m venv cohort_env
cohort_env\Scripts\activate
```

On Unix/macOS:
```bash
python3 -m venv cohort_env
source cohort_env/bin/activate
```
Then, install the required Python packages by running the command:
```bash
pip install -r requirements.txt
```

### Setting Up the Frontend
Navigate into the front-end directory:
```bash
cd frontend
```

In the front-end directory, install the required npm packages:
```bash
npm install
```


### Running the Application
Navigate into the front-end directory:
```bash
cd frontend
```
Then execute the following command in the front-end directory:
```bash
npm start
```

The web app is now running at:
http://localhost:5173/

# Current functionalities
The project is still in development. When running it you will first see a login page. All four input masks (URL, App Key, Data pool and Data model) require an entry. Click 'Login' and you will be directed to a new window which takes approximately 30 seconds to perform the cohort analysis algorithm. When successful the cohorts are shown. However, the cohorts need to be viewed in dark mode theme to properly show the description.  