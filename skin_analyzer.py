from PIL import Image
import numpy as np
import cv2


def check_image_quality(image):
    img = np.array(image)

    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    quality_messages = []

    if brightness < 40:
        quality_messages.append("Image is too dark.")

    if brightness > 235:
        quality_messages.append("Image is too bright.")

    if contrast < 20:
        quality_messages.append("Image has low contrast.")

    if sharpness < 30:
        quality_messages.append("Image may be blurry.")

    usable = len(quality_messages) == 0

    return {
        "usable": usable,
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "sharpness": round(sharpness, 2),
        "messages": quality_messages
    }


def analyze_visible_skin_patterns(image):

    img = np.array(image)

    cv_img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)

    # Bright / shiny areas
    brightness_mask = cv2.inRange(
        hsv,
        np.array([0, 0, 180]),
        np.array([180, 80, 255])
    )

    bright_ratio = np.mean(brightness_mask > 0)

    # Redness-like areas
    red1 = cv2.inRange(
        hsv,
        np.array([0, 60, 60]),
        np.array([15, 255, 255])
    )

    red2 = cv2.inRange(
        hsv,
        np.array([165, 60, 60]),
        np.array([180, 255, 255])
    )

    redness_mask = cv2.bitwise_or(red1, red2)

    redness_ratio = np.mean(redness_mask > 0)

    # Dark visible areas
    dark_mask = cv2.inRange(
        hsv,
        np.array([0, 0, 0]),
        np.array([180, 255, 70])
    )

    dark_ratio = np.mean(dark_mask > 0)

    # Texture variation
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

    texture_value = float(
        cv2.Laplacian(gray, cv2.CV_64F).var()
    )

    observations = []
    concerns = []

    if bright_ratio > 0.20:
        observations.append(
            "Shine-like visible areas"
        )
        concerns.append("Oiliness / shine")

    if redness_ratio > 0.08:
        observations.append(
            "Redness-like visible areas"
        )
        concerns.append("Visible redness")

    if dark_ratio > 0.12:
        observations.append(
            "Darker visible areas"
        )
        concerns.append("Uneven visible tone")

    if texture_value > 150:
        observations.append(
            "Texture-like visible variation"
        )
        concerns.append("Visible texture")

    if not observations:
        observations.append(
            "No strong visible pattern detected"
        )

    return {
        "observations": observations,
        "concerns": concerns,
        "signals": {
            "shine_ratio": round(float(bright_ratio), 4),
            "redness_ratio": round(float(redness_ratio), 4),
            "dark_area_ratio": round(float(dark_ratio), 4),
            "texture_value": round(texture_value, 2)
        }
    }


def analyze_skin_image(image_path, user_concern=None):

    try:
        image = Image.open(image_path).convert("RGB")

    except Exception as error:
        return {
            "success": False,
            "error": f"Could not open image: {error}"
        }

    quality = check_image_quality(image)

    if not quality["usable"]:

        return {
            "success": False,
            "image_quality": quality,
            "message": (
                "Image quality is too low for reliable "
                "visible-pattern analysis."
            ),
            "disclaimer": (
                "Observations only — not a medical diagnosis."
            )
        }

    analysis = analyze_visible_skin_patterns(image)

    return {
        "success": True,
        "user_concern": user_concern,
        "image_quality": quality,
        "observations": analysis["observations"],
        "concerns": analysis["concerns"],
        "signals": analysis["signals"],
        "disclaimer": (
            "Observations only — not a medical diagnosis."
        )
    }