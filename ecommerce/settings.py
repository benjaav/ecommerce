import os
from pathlib import Path
from datetime import timedelta
from corsheaders.defaults import default_headers, default_methods
import dj_database_url
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-(wlxd-4*159by$$_f+r)ugq5p)^!z2h38b7_$or^ubln-&$a@z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


CORS_ALLOWED_ORIGINS = [
    "https://codestorebl.com",
    "https://www.codestorebl.com",
]

# Si quieres probar con todo abierto (solo mientras debuggeas):
# CORS_ALLOW_ALL_ORIGINS = True

# Asegúrate de permitir el método OPTIONS
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    # añade aquí otros headers que uses
]

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    'codestorebl.com',
    'www.codestorebl.com',
    'api.codestorebl.com',             # si luego apuntas tu API aquí
    'ecommerce-idm5.onrender.com',]

SIMPLE_JWT = {
    # Token de acceso: 1 hora de duración
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),

    # Token de refresco: durará, por ejemplo, 7 días
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),

    # Opcional: para que al refrescar se genere un nuevo refresh token
    'ROTATE_REFRESH_TOKENS': True,
    # Otros ajustes según tu preferencia
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # CORS
    'corsheaders',

    # REST
    'rest_framework',
    'rest_framework_simplejwt',

    # Tu app
    'store',
]

REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
       'rest_framework_simplejwt.authentication.JWTAuthentication',
   ),
   # ...
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
+    'corsheaders.middleware.CorsMiddleware',  # ← debe ser el primero
     'django.middleware.security.SecurityMiddleware',
     'django.contrib.sessions.middleware.SessionMiddleware',
     'django.middleware.common.CommonMiddleware',
     'django.middleware.csrf.CsrfViewMiddleware',
     'django.contrib.auth.middleware.AuthenticationMiddleware',
     'django.contrib.messages.middleware.MessageMiddleware',
     'django.middleware.clickjacking.XFrameOptionsMiddleware',
 ]

ROOT_URLCONF = 'ecommerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ecommerce.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}
# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'store.CustomUser'

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS     = list(default_methods)
CORS_ALLOW_HEADERS     = list(default_headers) + [
    # si usas headers personalizados, agrégalos aquí
]
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Mercado Pago settings
MERCADO_PAGO_ACCESS_TOKEN = 'TEST-38253822250545-041101-0ebb1cbedaa0af046cfbac47a95bbfac-1212312390'  # Reemplaza con tu token real o usa una variable de entorno
