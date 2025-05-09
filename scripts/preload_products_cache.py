import requests
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def preload_products_cache():
    url = "https://mi-backend.onrender.com/api/products/"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        logging.info(f"Successfully preloaded products cache. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to preload products cache: {e}")

if __name__ == "__main__":
    while True:
        preload_products_cache()
        time.sleep(300)  # Sleep for 5 minutes (300 seconds)
