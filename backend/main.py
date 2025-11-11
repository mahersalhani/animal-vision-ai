from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import os
from tensorflow.keras.models import Model
import base64
import matplotlib.pyplot as plt
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load animal class names from dataset folder
class_names = sorted(os.listdir("../dataset"))

# Load the full model first
model = load_model("../model/tl_model.h5")

# Extract the base MobileNetV2 model
mobilenet_base = model.layers[0]  # This is the MobileNetV2

# Choose an internal layer for feature maps (use 'block_1_expand_relu' for example)
feature_layer = mobilenet_base.get_layer('block_1_expand_relu')

# Build a model to output feature maps from that layer
layer_outputs_model = Model(inputs=mobilenet_base.input, outputs=feature_layer.output)

def prepare_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((128, 128))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)  # <- MobileNetV2 expects this
    img_array = np.expand_dims(img_array, axis=0)
    return img_array



@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    img_array = prepare_image(contents)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]
    confidence = float(np.max(predictions))

    return JSONResponse(content={
        "prediction": predicted_class,
        "confidence": confidence,
    })
