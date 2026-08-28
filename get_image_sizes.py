import os
from PIL import Image
import json

directory = r"C:\Users\USER\Desktop\visa-seva\public\Places"
results = {}

for filename in os.listdir(directory):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        filepath = os.path.join(directory, filename)
        try:
            with Image.open(filepath) as img:
                width, height = img.size
                results[f"/Places/{filename}"] = f"{width}x{height}"
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(json.dumps(results, indent=2))
