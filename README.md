# Content-aware scaling

## Description

**For a more lengthy explanation, you can read the
[post](https://sanderl.be/posts/content-aware-scaling/) I wrote about this on my
website.**

Resize images the smart way using the content-aware scaling algorithm (by making
use of the seam carving algorithm).

There are a couple of options for resizing an image: you can crop it, but then
you also lose a part of the image. Squeezing pixels into less horizontal or
vertical space is also most likely not wanted due to the distortion that occurs.
This algorithm's approach consists of removing less important parts of the
image, circumventing previously mentioned disadvantages.

Short video of resizing an image using the described technique:

<video src="https://github.com/user-attachments/assets/07281468-ebc1-4e5e-be7e-8117ddc998c3"></video>

[Check out the demo](https://sanderledegen.github.io/content-aware-scaling/)

## Installation
If you want to run the code locally, install the (very few) dependencies using
your favourite package manager and run a `npm run dev`.

# Documentation used
[Wikipedia - Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))\
[Wikipedia - Sobel operator](https://en.wikipedia.org/wiki/Sobel_operator)\
[Wikipedia - Convolution](https://en.wikipedia.org/wiki/Convolution#Discrete_convolution)\
[Wikipedia - Seam carving](https://en.wikipedia.org/wiki/Seam_carving)
