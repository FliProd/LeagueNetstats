#!/bin/sh

scp /Users/noahhampp/Code/Web/LeagueStats/{.env.prod,.env.prod.db,.env.prod.proxy-companion,docker-compose.prod.yml} root@league-netstats.ethz.ch:/public_html/prod
scp -r /Users/noahhampp/Code/Web/LeagueStats/prometheus/* root@league-netstats.ethz.ch:/public_html/prod/prometheus
