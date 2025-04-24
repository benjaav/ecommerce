import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-(wlxd-4*159by$$_f+r)ugq5p)^!z2h38b7_$or^ubln-&$a@z')

DEBUG = True

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if 'ecommerce-g7ge.onrender.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('ecommerce-g7ge.onrender.com')
if 'api.codestorebl.com' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('api.codestorebl.com')

CORS_ALLOW_ALL_ORIGINS = True
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

# Para desarrollo local sin HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Ajusta el dominio según tu dominio real
SESSION_COOKIE_DOMAIN = 'codestorebl.com'
CSRF_COOKIE_DOMAIN = 'codestorebl.com'


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
]

REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework_simplejwt.authentication.JWTAuthentication',
),

   'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.AllowAny',
   ),
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

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MERCADO_PAGO_ACCESS_TOKEN = os.environ.get('MERCADO_PAGO_ACCESS_TOKEN', 'APP_USR-38253822250545-041101-62d1610b796f1e9f8d7dfc01594adebe-1212312390')