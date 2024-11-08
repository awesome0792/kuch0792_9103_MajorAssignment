# IDEA 9103 Major Project 

## How to Play
**Click the Button** to start the music.

### Key Features:
- **Fireworks**: Fireworks pop out according to the music, creating bursts with the match to specific sounds
- **Shapes with Motion**: Rectangles rotate and zoom in and out dynamically, driven by audio 


## Explanation

### Approach
>Audio

I mostly focused on adding shapes based on the music, while other members put focus on changing shapes sizes or movements. I used p5.js’s FFT (Fast Fourier Transform) to analyze the audio frequencies and implement these animations. 

Each visual element’s motion—like size, rotation, and transparency—reacts directly to different aspects of the music.

### Inspirations
>Fireworks

Firstly, I found that I could interpret our code as fireworks which is also one of our initial ideas. 
As inspirations, I looked up some fireworks images on the web

![image](/assets/ArtilleryShellsFireworks.jpg)

*Fig 1. Inspiring fireworks*

With respect to technical implementation, I also found interesting video from The Coding Train on [Youtube](https://www.youtube.com/watch?v=CKeyIbT3vXI&t=683s)

Based on those inspirations, I set my sight on the collaboration of flowers from the group part and fireworks as an original part.

### Technical Thoughts

>Fireworks Animation

The Firework and Particle classes create fireworks that pop out based on the sound spectrum’s mid-range frequencies. The fireworks use Velocity, Acceleration and Gravity to simulate realistic particle movement
- `P5 createVector` for easy vector management such as Add & Multipy 
- `random2D` for distributing particles' velocities when explotion of fireworks

> Rectangles and Circles

I created rectangles and circles that rotate and zoom based on the audio spectrum. The rectangles’ rotation speed and zoom scale are mapped to the audio frequencies.

- `map()` for allocating rotation speed based on the sound volume of the specific frequency

> Flower Shapes

- `frameCount` for rotation


## Acknowledge

[freesound](https://freesound.org/) was used for the song in the code.