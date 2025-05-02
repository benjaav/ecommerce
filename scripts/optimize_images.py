import os
from PIL import Image

# Directory containing product images
IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media', 'products')

# Maximum width and height for resized images
MAX_SIZE = (800, 800)

def optimize_image(image_path):
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            # Resize image maintaining aspect ratio
            img.thumbnail(MAX_SIZE, Image.ANTIALIAS)
            # Save optimized image as JPEG with quality=85
            img.save(image_path, "JPEG", quality=85, optimize=True)
            print(f"Optimized {image_path}")
    except Exception as e:
        print(f"Error optimizing {image_path}: {e}")

def main():
    for root, dirs, files in os.walk(IMAGE_DIR):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(root, file)
                optimize_image(image_path)

if __name__ == "__main__":
    main()
