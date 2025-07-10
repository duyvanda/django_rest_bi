FROM python:3.9.17-slim-buster
LABEL maintainer="DuyVanMeRap"

# Never prompt the user for choices on installation/configuration of packages
ENV DEBIAN_FRONTEND noninteractive
ENV TERM linux

RUN apt-get update -yqq \
    && apt-get upgrade -yqq \
    && apt-get install -yqq --no-install-recommends \
    apt-transport-https \
    apt-utils \
    # build-essential \
    ca-certificates \
    # freetds-bin \
    # freetds-dev \
    gosu \
    gnupg \
    dirmngr \
    krb5-user \
    # ldap-utils \
    # libkrb5-dev \
    # libldap2-dev \
    libpq-dev \
    libsasl2-2 \
    # libsasl2-dev \
    libsasl2-modules \
    locales  \
    lsb-release \
    # nodejs \
    # openssh-client \
    # postgresql-client \
    python-selinux \
    # sasl2-bin \
    software-properties-common \
    # sqlite3 \
    # sudo \
    # unixodbc \
    # unixodbc-dev \
    # yarn \
    # python3-dev default-libmysqlclient-dev build-essential \
    # zip \
    # unzip \
    # vim \
    # curl \
    # rsync \
    # netcat \
    # && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    # && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    # && apt-get update -yqq \
    # && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    # && apt-get install -y unixodbc-dev \
    # && apt-get install -y libgssapi-krb5-2 \
    # clean up
    && apt-get clean \
    && rm -rf \
        /var/lib/apt/lists/* \
        /tmp/* \
        /var/tmp/* \
        /usr/share/man \
        /usr/share/doc \
        /usr/share/doc-base \
    && pip3 install --upgrade pip
