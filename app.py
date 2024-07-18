from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import pm4py
import os
import numpy as np
import time
from dotenv import load_dotenv
from cohort_backend.utils.json_builder import generate_cohort_json
from cohort_backend.data_layer.data_controller import DataController
from cohort_backend.utils.parsing_graphs import parse_DFG_for_webapp
from cohort_backend.cohort_identification.trace_feature import AbstractTraceFeature, ExactTraceFeature, LessThanTraceFeature, GreaterThanOrEqualTraceFeature
from cohort_backend.cohort_identification.cohort_identification import identify_cohorts, split_log
app = Flask(__name__)

# To solve CORS errors
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# For now, take settings from .env file
load_dotenv()
url = os.getenv("URL")
app_key = os.getenv("APP_KEY")
data_pool = os.getenv("DATA_POOL")
data_model = os.getenv("DATA_MODEL")

# API to request the cohorts
@app.route('/v1/cohorts', methods=['GET'])
def request_cohorts():
    
    # Read parameters of request
    k = request.args.get('k', type=int)
    alpha = request.args.get('alpha', type=float)
    max_cohorts = request.args.get('max_cohorts', type=int)
    phi = request.args.get('max_cohorts', type=int)
    event_log = request.args.get("event_log", type=str)
    
    # At first request data from the data laye
    controller = DataController(url=url, app_key=app_key, data_pool=data_pool, data_model=data_model)
    data: pd.DataFrame = controller.request_event_log(event_log)


    # Request the cohorts
    start = time.time()
    print("Start cohort analysis")
    M: set[tuple[AbstractTraceFeature, float]] = identify_cohorts(data, k, alpha=alpha, max_cohorts=max_cohorts, phi=phi)
    print("Finished cohort analysis in " + str(time.time() - start) + " s")
    # Generate required data for each cohort
    cohort_return_data = []

    for cohort in M:
        cohort_data = data.copy()

        # Split the dataframe based on the features
        L1, L2 = split_log(cohort_data, cohort[0])
        
        cohort_return_data.append(generate_cohort_json(id = len(cohort_return_data),
                                                       log = L1,
                                                       name = str(cohort[0]),
                                                       distance=cohort[1]))
        
        cohort_return_data.append(generate_cohort_json(id = len(cohort_return_data),
                                                       log = L2,
                                                       name = "Not" + str(cohort[0]),
                                                       distance=cohort[1]))
        
        
    return jsonify(cohort_return_data)
    
if __name__ == '__main__':
    app.run(debug=True)
