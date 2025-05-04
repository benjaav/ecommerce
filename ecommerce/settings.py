import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-(wlxd-4*159by$$_f+r)ugq5p)^!z2h38b7_$or^ubln-&$a@z')

META_PIXEL_ID     = os.environ.get('META_PIXEL_ID', '698928239277354')
META_ACCESS_TOKEN = os.environ.get('EAAbdSgJidSIBO4gvA96AfrhJ92WVFbFSYSZCBBoMK0Bq7lwfp5TaJSCC1huArScAW5ej4ppekJflecPkCWVXLTZBR5IzTzCgHc0RostBG5W9YqE9lg9cMBRPm8rrFMMAklta2zWEdfmFylCUCg0Xpar7ZC5dbUr1CYRdFdXPMjwcIMAaAEiAAZCSs457zhGGhQZDZD')


DEBUG = True

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if 'localhost' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('localhost')
if '127.0.0.1' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('127.0.0.1')
if 'ecommerce-g7ge.onrender.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('ecommerce-g7ge.onrender.com')
if 'api.codestorebl.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('api.codestorebl.com')



CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://codestorebl.com",
    "https://www.codestorebl.com",
    "http://localhost:3000",
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'OPTIONS',
    'PUT',
    'PATCH',
    'DELETE',
]

CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'x-requested-with',
    'accept',
    'origin',
    'user-agent',
    'x-csrftoken',
]

CSRF_TRUSTED_ORIGINS = [
    "https://codestorebl.com",
    "https://www.codestorebl.com",
]

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

if not DEBUG:
    SESSION_COOKIE_DOMAIN = 'codestorebl.com'
    CSRF_COOKIE_DOMAIN = 'codestorebl.com'
else:
    SESSION_COOKIE_DOMAIN = None
    CSRF_COOKIE_DOMAIN = None

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'store',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_redis',
]

REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework_simplejwt.authentication.JWTAuthentication',
),

   'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.AllowAny',
   ),

   'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
   'PAGE_SIZE': 10,
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuración para evitar bucles de redirección con Cloudflare
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Redirigir a HTTPS en producción
SECURE_SSL_REDIRECT = not DEBUG

# Configuración de cookies seguras
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SAMESITE = 'None'

# Configuración de caché con Redis
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://red-d0behbidbo4c73clom90:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

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

DATABASES = {}

DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    DATABASES['default'] = dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
else:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ecommerce_1vgf',
        'USER': 'ecommerce_1vgf_user',
        'PASSWORD': 'Gljm5RZVAB2yKEAEVApcVdIjUUzF2usW',
        'HOST': 'dpg-d00trg3uibrs73eqsbo0-a.virginia-postgres.render.com',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }

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

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

# Cambia estas URLs para que apunten a tu CDN una vez que esté activo
STATIC_URL = 'https://codestorebl.com/static/'
# Cambia MEDIA_URL para apuntar al Static Site de Render que sirve la carpeta media
MEDIA_URL = 'https://ecommerce-media.onrender.com/'

# Agrega STATIC_ROOT para collectstatic
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MERCADO_PAGO_ACCESS_TOKEN = os.environ.get('MERCADO_PAGO_ACCESS_TOKEN', 'APP_USR-38253822250545-041101-62d1610b796f1e9f8d7dfc01594adebe-1212312390')
