# DermaSense AI 2.0 – Skin Image Analysis

## Overview

This module performs basic visible skin image analysis for the DermaSense AI 2.0 project.

The module analyzes an uploaded skin image and provides explainable observations based on visible image patterns.

## Features

* Image loading and validation
* Image quality checking
* Brightness analysis
* Contrast analysis
* Sharpness / blur detection
* Shine-like visible area detection
* Redness-like visible area detection
* Darker visible area detection
* Texture-like visible variation detection
* Signal values for analysis
* Explainable observations
* Medical safety disclaimer

## Main File

```text
skin_analyzer.py
```

Main function:

```python
analyze_skin_image(image_path, user_concern=None)
```

## Testing

A sample image can be tested using:

```bash
python test_skin_analyzer.py sample.jpg
```

The analyzer checks whether the image is suitable for visible-pattern analysis before performing the analysis.

## Output

The module returns information such as:

```text
Image quality
Observations
Concerns
Signal values
User concern
```

Example observations include:

```text
Shine-like visible areas
Redness-like visible areas
Darker visible areas
Texture-like visible variation
```

## Image Quality

The module checks:

* Brightness
* Contrast
* Sharpness

If the image quality is too low, the analysis is not performed.

## Safety

This module provides visual observations only.

It does not provide:

* Medical diagnosis
* Disease diagnosis
* Treatment recommendations
* Medication recommendations

Disclaimer:

> Observations only — not a medical diagnosis.

## Project Role

This module is the **Skin Image Analysis component** of DermaSense AI 2.0.

The Flask backend and frontend integration are handled by other project members.

## Supported Image Types

Common image formats such as:

```text
JPG
JPEG
PNG
WEBP
```

can be used as input, subject to the image library's support.

## Testing Status

The module has been tested using a sample skin image and the analysis completed successfully.
