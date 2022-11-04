from pathlib import Path
import os

# from .gcloud import *

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "D:/django_apps/rest/incomeexpenseapi/bigquery1508.json"

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# print(GOOGLE_APPLICATION_CREDENTIALS)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-bip%-n!)0(z)nm-3_5-4q002uf5c5_7a#$3wvwd9em1+yckpdw'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL  = 'authentication.User'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'authentication',
    'drf_yasg',
    'corsheaders'
    ]

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
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

ROOT_URLCONF = 'incomeexpenseapi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'incomeexpenseapi.wsgi.application'

REST_FRAMEWORK = {
    'NON_FIELD_ERRORS_KEY': 'error',
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# superuser: bimerap
# pass: bimerap

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


DEFAULT_FILE_STORAGE = 'incomeexpenseapi.gcloud.GoogleCloudMediaFileStorage'
STATICFILES_STORAGE = 'incomeexpenseapi.gcloud.GoogleCloudStaticFileStorage'

GS_PROJECT_ID = 'spatial-vision-343005'
GS_STATIC_BUCKET_NAME = 'django_bucket_biteam'
GS_MEDIA_BUCKET_NAME = 'django_media_biteam'

STATIC_URL = 'https://storage.googleapis.com/{}/'.format(GS_STATIC_BUCKET_NAME)
STATIC_ROOT = "static/"

PROJECT_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
MEDIA_URL = 'https://storage.googleapis.com/{}/'.format(GS_MEDIA_BUCKET_NAME)
MEDIA_ROOT = "media/"

UPLOAD_ROOT = 'media/uploads/'

DOWNLOAD_ROOT = os.path.join(PROJECT_ROOT, "static/media/downloads")
DOWNLOAD_URL = STATIC_URL + "media/downloads"

# CORS_ALLOWED_ORIGINS = ['*']
# https://pypi.org/project/django-cors-headers/
CORS_ALLOW_ALL_ORIGINS = True

