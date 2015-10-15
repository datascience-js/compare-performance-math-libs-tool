from timeit import Timer
import cgi, cgitb

def getTimeOfNumpyStatements(statement, number=1):
    t = Timer(statement, setup="import numpy as np")
    return t.timeit(number=number)

print (getTimeOfNumpyStatements('np.random.uniform(0, 100)', 100))

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
