"3.2"
import environ, os
from urllib.parse import urlparse
env = environ.Env()
environ.Env.read_env()

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY=env('SECRET_KEY')

# print(env('DEBUG')=="1")

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = env('CREDENTIALS_1') if env('LOCAL') == "1" else env('CREDENTIALS_1')

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = env('DEBUG')=="1"

# DEBUG = True

CLOUDRUN_SERVICE_URL = env("CLOUDRUN_SERVICE_URL", default=None)
if CLOUDRUN_SERVICE_URL:
    ALLOWED_HOSTS = [urlparse(CLOUDRUN_SERVICE_URL).netloc]
    CSRF_TRUSTED_ORIGINS = [CLOUDRUN_SERVICE_URL]
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
else:
    ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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
# 'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build')],

WSGI_APPLICATION = 'backend.wsgi.application'

REST_FRAMEWORK = {
    'NON_FIELD_ERRORS_KEY': 'error',
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

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

TIME_ZONE = env('TIME_ZONE')
#https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/


# STATICFILES_DIRS = [
    # BASE_DIR / 'static',
    # BASE_DIR / 'frontend/build/static'
# ]

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# python manage.py findstatic css/base.css admin/js/core.js => find one of the static URL
# moive the build file to D:\django_apps\rest\venv\Lib\site-packages\django\contrib\admin\static\

DEFAULT_FILE_STORAGE = 'backend.gcloud.GoogleCloudMediaFileStorage'
STATICFILES_STORAGE = 'backend.gcloud.GoogleCloudStaticFileStorage'

GS_PROJECT_ID = 'spatial-vision-343005'
GS_STATIC_BUCKET_NAME = env('GS_STATIC_BUCKET_NAME')
GS_MEDIA_BUCKET_NAME = env('GS_MEDIA_BUCKET_NAME')

STATIC_URL = 'https://storage.googleapis.com/django_bucket_biteam/'
# STATIC_URL = 'static/'

STATIC_ROOT = 'static/'


PROJECT_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
MEDIA_URL = 'https://storage.googleapis.com/{}/'.format(GS_MEDIA_BUCKET_NAME)
MEDIA_ROOT = "media/"

UPLOAD_ROOT = 'media/uploads/'

DOWNLOAD_ROOT = os.path.join(PROJECT_ROOT, "static/media/downloads")
DOWNLOAD_URL = STATIC_URL + "media/downloads"

CORS_ALLOW_ALL_ORIGINS = True


# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
# ]

LOCAL = env('LOCAL')
UAT_URL = env('UAT_URL')
H_TOKEN = env('H_TOKEN')
RUN = env('RUN')
