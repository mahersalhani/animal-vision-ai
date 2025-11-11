## 🧠 Model Overview
The model is built using **Transfer Learning** with **MobileNetV2** as the base CNN.  
It’s trained to classify animals such as:

> 🐶 Dog, 🐱 Cat, 🐮 Cow, 🐔 Chicken, 🐘 Elephant, 🐴 Horse, 🐑 Sheep, 🦋 Butterfly, 🕷 Spider, 🐿 Squirrel

---


## ⚙️ Backend (FastAPI)
The backend uses **FastAPI** to:
- Accept an image file from the frontend
- Preprocess the image for MobileNetV2
- Run inference using the trained `.h5` model
- Return the predicted animal and confidence score in JSON format

💻 Frontend (Next.js)

The frontend allows users to:

Upload an animal image

Send it to the backend API

Display the predicted class and confidence score

Run Frontend
cd frontend
npm install
npm run dev


The app will run at http://localhost:3000

🧩 Tech Stack
Layer	Technology
Frontend	Next.js, React, Tailwind CSS
Backend	FastAPI, TensorFlow / Keras
Model	MobileNetV2 (Transfer Learning)
Language	Python, JavaScript / TypeScript
🧪 Training Notebook

The notebooks/notebook.ipynb file includes:

Dataset loading and preprocessing

Transfer learning with MobileNetV2

Training and evaluation

Model saving (tl_model.h5)

📦 Requirements
Python
fastapi
uvicorn
tensorflow
numpy
pillow
matplotlib

Node.js
next
react
tailwindcss

