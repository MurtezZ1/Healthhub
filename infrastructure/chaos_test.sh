#!/bin/bash

# Healthhub Chaos Engineering Script
# Përdoret për të simuluar dështime të papritura të nyjeve (nodes).
# Nxjerr në pah nëse Polly (në .NET) dhe Docker Restart Policies funksionojnë saktë.

echo "🔥 FILLIMI I CHAOS ENGINEERING TEST 🔥"
echo "Kujdes: Ky skript do të mbyllë (kill) kontejnerë rastësorë!"

CONTAINERS=("healthhub-mysql-1" "healthhub-redis-1" "healthhub-healthhub-server-1" "healthhub-kafka-1")

while true; do
    # Zgjidh një kontejner rastësor nga lista
    RANDOM_INDEX=$((RANDOM % ${#CONTAINERS[@]}))
    TARGET=${CONTAINERS[$RANDOM_INDEX]}
    
    echo "[Chaos Monkey] 🛑 Duke mbyllur forcërisht: $TARGET"
    docker kill $TARGET
    
    # Prit 30 sekonda para sulmit të radhës (i jep kohë sistemit të rikuperohet nga Docker restart=always)
    sleep 30
done
