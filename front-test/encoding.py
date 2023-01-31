import base64
import json
with open("test.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode("utf-8")

print(encoded_string)


data = {"image": encoded_string}

with open("image_data.json", "w") as json_file:
    json.dump(data, json_file)
