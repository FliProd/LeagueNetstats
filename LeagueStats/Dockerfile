# pull official base image
FROM python:3.9.3-alpine

# set work directory
WORKDIR /LeagueStats/

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
RUN pip install pipenv
COPY Pipfile Pipfile.lock ./
RUN pipenv lock -r > requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . .