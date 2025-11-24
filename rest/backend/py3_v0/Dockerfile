FROM python:3.9-slim-bullseye
LABEL maintainer="DuyVanMeRap"

ENV DEBIAN_FRONTEND=noninteractive
ENV TERM=linux

# Install dependencies
RUN apt-get update -yqq \
    && apt-get install -yqq --no-install-recommends \
        apt-transport-https \
        apt-utils \
        build-essential \
        ca-certificates \
        curl \
        gnupg \
        dirmngr \
        freetds-bin \
        freetds-dev \
        gosu \
        krb5-user \
        ldap-utils \
        libkrb5-dev \
        libldap2-dev \
        libpq-dev \
        libsasl2-dev \
        libsasl2-modules \
        locales \
        lsb-release \
        netcat \
        nodejs \
        openssh-client \
        postgresql-client \
        python3-dev \
        default-libmysqlclient-dev \
        rsync \
        sasl2-bin \
        software-properties-common \
        sqlite3 \
        sudo \
        unixodbc \
        unixodbc-dev \
        unzip \
        vim \
        yarn \
        zip \
    # Install Microsoft SQL ODBC Driver 18
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl -L https://packages.microsoft.com/config/debian/11/prod.list \
         -o /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update -yqq \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 \
    && echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && pip3 install --upgrade pip
