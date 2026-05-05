# Healthhub SRE Runbooks & Playbooks

Ky dokument përmban procedurat standarde për t'u ndjekur gjatë incidenteve kritike (Downtime).

## 1. Incident: Database Unreachable (MySQL)

**Simptomat:**
- API kthen `500 Internal Server Error`.
- Logjet në Elasticsearch tregojnë "Connection Timeout" ose "Access Denied" për `healthhub_db`.

**Playbook:**
1. Verifiko statusin e pod-it/container-it:
   ```bash
   docker ps | grep mysql
   # Ose në K8s: kubectl get pods -n healthhub | grep mysql
   ```
2. Kontrollo logjet e brendshme të databazës për korrupsion:
   ```bash
   docker logs healthhub-mysql-1
   ```
3. Nëse është i bllokuar, rinis shërbimin me vonesë:
   ```bash
   docker restart healthhub-mysql-1
   ```
4. Nëse dështon plotësisht, nis procesin e restaurimit nga MinIO/S3 Backup:
   ```bash
   # Komandë shembull për rikthim nga dump-i i djeshëm
   mysql -u root -p healthhub_db < /backup/latest.sql
   ```

## 2. Incident: Kafka Queue Overflow

**Simptomat:**
- Grafana tregon një ngritje masive në "Consumer Lag".
- Njoftimet (Push Notifications) vonohen.

**Playbook:**
1. Rrit numrin e partiticionëve në Kafka:
   ```bash
   docker exec -it kafka kafka-topics --alter --zookeeper zookeeper:2181 --topic notifications --partitions 5
   ```
2. Shkallëzo vertikalisht Spark Streaming Jobs duke shtuar më shumë punëtorë.

## 3. Incident: Latencë e lartë në API

**Simptomat:**
- Jaeger/OpenTelemetry tregon vonesa >2000ms për `GET /api/mjeku/search`.
- NGINX kthen gabime 502/504.

**Playbook:**
1. Kontrollo shërbimin NGINX:
   ```bash
   docker logs healthhub-nginx-lb-1
   ```
2. Bëj *Scale-Out* backend-in (Shto instanca të reja të API-së):
   ```bash
   docker-compose up -d --scale healthhub-server=3
   ```
3. Verifiko statusin e Elasticsearch në Kibana (`http://localhost:5601`) për të parë mos është rënduar CPU e "Full-Text Search".
