import json
import time

with open('token.json') as f:
    delcount = 0
    data = json.load(f)
    for index, entry in enumerate(data):
        millis = int(round(time.time() * 1000))
        if entry['expires'] - millis < 0:
            delcount += 1
            del data[index]

    with open('token.json', 'w') as outfile:
        json.dump(data, outfile)

    print("Deleted " + str(delcount) + " entries")