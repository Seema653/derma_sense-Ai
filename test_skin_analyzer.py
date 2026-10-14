import json
from pathlib import Path

from skin_analyzer import analyze_skin_image


# sample.jpg ko isi project folder se automatically find karega
project_folder = Path(__file__).resolve().parent
image_path = project_folder / "sample.jpg"


print("Image path:")
print(image_path)

result = analyze_skin_image(
    image_path=str(image_path),
    user_concern="Oiliness"
)

print("\n===== DermaSense Skin Analysis =====\n")

print(
    json.dumps(
        result,
        indent=4
    )
)