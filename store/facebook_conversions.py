import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def send_facebook_conversion_event(event_name, event_time, user_data, custom_data):
    """
    Envía un evento a la API de Conversiones de Facebook.

    Parámetros:
    - event_name: Nombre del evento (e.g., 'Purchase')
    - event_time: Timestamp del evento (int)
    - user_data: Diccionario con datos del usuario (hashed email, phone, etc.)
    - custom_data: Diccionario con datos personalizados (valor, moneda, etc.)

    Retorna True si el evento fue enviado correctamente, False en caso contrario.
    """
    access_token = settings.META_ACCESS_TOKEN
    pixel_id = settings.META_PIXEL_ID if hasattr(settings, 'META_PIXEL_ID') else None

    if not access_token or not pixel_id:
        logger.error("Falta configurar META_ACCESS_TOKEN o META_PIXEL_ID en settings.py")
        return False

    url = f"https://graph.facebook.com/v17.0/{pixel_id}/events"
    payload = {
        "data": [
            {
                "event_name": event_name,
                "event_time": event_time,
                "user_data": user_data,
                "custom_data": custom_data,
                "action_source": "website"
            }
        ],
        "access_token": access_token
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        logger.info(f"Evento Facebook enviado: {event_name}, respuesta: {response.json()}")
        return True
    except requests.RequestException as e:
        logger.error(f"Error enviando evento a Facebook: {e}")
        return False
