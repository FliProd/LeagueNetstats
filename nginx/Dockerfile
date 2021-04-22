FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

#COPY cert_league-netstats.ethz.ch.crt /etc/ssl/
#COPY privkey.pem /etc/ssl/
#copy ssl certs (noit necessary as it gets copies from certs to certs)
COPY ./certs/cert_league-netstats.ethz.ch.crt /etc/ssl/cert_league-netstats.ethz.ch.crt
COPY ./certs/privkey.pem /etc/ssl/privkey.pem