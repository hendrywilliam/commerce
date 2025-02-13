#!/bin/sh

PROJECT_ID="commerce-450807"
OUTPUT_FILE="./../.env"

# check file
if [ ! -e $OUTPUT_FILE ]; then  
    echo ".env file doesnt exist, creating a new one."
    touch $OUTPUT_FILE
fi 

> $OUTPUT_FILE

echo "fetch secrets & and inject"
for SECRET in $(gcloud secrets list --format="value(name)" --project=$PROJECT_ID); do 
    VALUE=$(gcloud secrets versions access latest --secret=$SECRET --project=$PROJECT_ID)
    
    # inject to .env with key=value format. 
    echo "$SECRET=$VALUE" >> $OUTPUT_FILE
done
echo "all set, you are good to go fam."