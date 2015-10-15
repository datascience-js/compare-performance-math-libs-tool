from timeit import Timer
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask import Flask, jsonify
try:
    from flask.ext.cors import CORS  # The typical way to import flask-cors
except ImportError:
    # Path hack allows examples to be run without installation.
    import os
    parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.sys.path.insert(0, parentdir)

    from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app, allow_headers='Content-Type')

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

DictionaryStatements = {
    "testAddMatrix": "x = np.array([[2,7], [4, 9]], np.int32);y = np.array([[2,7], [4, 50000]], np.int32);c=np.add(x,y);",
    "testMulMatrices": "x = np.array([[2,7], [4, 9]], np.int32);y = np.array([[2,7], [4, 50000]], np.int32)c=np.dot(x,y);",
    "testCreateMatrix": "x = np.array([[2,7], [4, 9]], np.int32);"}

# Return average time (for number times of execution) of execution given statement, in  seconds
def getTimeOfNumpyStatements(statement, number=1):
    t = Timer(DictionaryStatements[statement], setup="import numpy as np")
    sumAllLoopsTiming = t.timeit(number=number)
    avgTimePerLoopUsec = (sumAllLoopsTiming / number)

    # TODO: if preferred, may use repeat and get the best result with min func
    return avgTimePerLoopUsec

@app.route("/getTime", methods=["POST"])
def getTime():
    statement = request.json['statement']
    number = int(request.json['number'])
    timeFuncRun = getTimeOfNumpyStatements(statement, number)
    return jsonify(res=timeFuncRun)

@app.route("/getListOfNumpyFuncs", methods=["GET", "POST", "OPTIONS"])
@crossdomain(origin='*')
def getListOfNumpyFuncs():
    return jsonify(res=list(DictionaryStatements.keys()))

if __name__ == "__main__":
    app.run()



# print (getTimeOfNumpyStatements('np.random.uniform(0, 100)', 100))

# import cProfile, pstats
# pr = cProfile.Profile()
# pr.enable()
# # ... do something ...
# np.random.uniform(0, 100)
#
# pr.disable()
#
# ps = pstats.Stats(pr)
# ps.print_stats()
