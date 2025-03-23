# TensorFlow Three Pose

This is just a fun little project where I combined **TensorFlow.js** with **Three.js** to create a simple 3D pose estimation demo. The idea is to take a real-time video feed from your webcam, run **BlazePose** for human pose estimation, and then visualize that pose in 3D with **Three.js**. It's not perfect, but it works! 😄

## Features

- **Real-Time Pose Estimation**: Using TensorFlow.js' BlazePose model, you can track your pose in real-time.
- **3D Visualization**: Watch the estimated pose rendered in 3D scene using Three.js
- **Super Simple**: It's a basic demo, can be edited into anything.

## Live Demo

If you want to see it in action, check out the live demo here!  
https://dolynchuk.github.io/tensorflow-three-pose/

## How to Run It

If you want to play around with this yourself, it's pretty easy to get started. Just follow these steps:

### Prerequisites

You'll need:

- **Node.js** (12 or later)
- **npm** (should come with Node.js)

### Step-by-Step

1. **Clone the repo**:

    ```bash
    git clone https://github.com/dolynchuk/tensorflow-three-pose.git
    cd tensorflow-three-pose
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the project**:

    ```bash
    npm run dev
    ```
    This will start the demo on your local server.

4. **Open your browser** and check it out! It should automatically ask for access to your webcam, and then you'll see yourself in 3D.

## How It Works

Once you're running it:

- **Webcam Feed**: Your camera will feed into the app, and BlazePose will work its magic to detect your body position.
- **3D Pose**: The pose data will then be rendered in 3D space using Three.js.
- **Basic Controls**: You can rotate, zoom, and pan the scene.


Big shout-out to the amazing libraries and projects that made this possible:

- **BlazePose** from TensorFlow.js
- **Three.js** for the awesome 3D rendering
- **TensorFlow.js** for making machine learning in the browser easy and fun!
