#Ecommerce Express Server

##Docker command  
##Pull a image mongo
- docker pull mongodb/mongodb-community-

##Create a volume
- docker volume create mongovol --opt type=none --opt device=<path-to-folder> --opt o=bind
  
##Create network share
- docker create network mongo-network
  
##Run a container mongo
- docker run -d -p 27020:27017 --net mongo-network -v mongovolSlave02:/data/db --name ecommerce-slave02 mongodb/mongodb-community-server:latest --replSet mongo-replSet
  
##Connect to mongo container running
- docker exec -it ecommerce bash
  
##Using mongo shell
- mongosh
