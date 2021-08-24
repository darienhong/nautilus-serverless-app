from awscrt import io, mqtt, auth, http 
from awsiot import mqtt_connection_builder
import time
import math
import json 
import random
from faker import Faker
fake = Faker()

random.seed(5)

'''
y0 = -55.98282801216771
x0 = -67.26653807526428

-55.92225859118267, -67.36855296661427
-55.94252894746586, -67.34593669557687
-55.95496232531181, -67.32537644917923
-55.97383500647655, -67.33771259701783
-55.980507288323366, -67.301526563358

'''
rad = 1500 / 111300

final_dest_lat = -55.98282801216771
final_dest_long = -67.26653807526428


lat_origins = [-55.92225859118267, -55.94252894746586, -55.95496232531181, -55.97383500647655, -55.980507288323366, -55.98282801216771]
long_origins = [-67.36855296661427, -67.34593669557687, -67.32537644917923, -67.33771259701783, -67.301526563358, -67.26653807526428]

members = [3, 4, 4, 5, 5, 6, 4, 7, 8, 4, 6, 5, 3, 6, 5, 7, 5, 6, 5, 4]

def distance(lat1, lon1, lat2, lon2): 
    R = 6371
    dLat = deg2rad(lat2 - lat1)
    dLon = deg2rad(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(deg2rad(lat1)) * math.cos(deg2rad(lat2)) * math.sin(dLon/2) * math.sin(dLon/2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = R * c  #distance in km 
    return d


def deg2rad(deg): 
    return deg * (math.pi/180)


def main():
# Define ENDPOINT, CLIENT_ID, PATH_TO_CERT. PATH_TO_KEY, PATH TO ROOT, MESSAGE, TOPIC AND RANGE
    ENDPOINT = "a2wgdknw9m3e2n-ats.iot.us-east-1.amazonaws.com"
    CLIENT_ID = "test-thing"
    PATH_TO_CERT = "./certificates/c28e489691-certificate.pem.crt"
    PATH_TO_KEY = "./certificates/c28e489691daf94c66bdcc24d6d113b58209d328fe8d8f8662621467a89f1b47-private.pem.key"
    PATH_TO_ROOT = "./certificates/root.pem"
    TOPIC = "nautilus/sensordata"
    RANGE = 20
    #spin up resources 
    event_loop_group = io.EventLoopGroup(1)
    host_resolver = io.DefaultHostResolver(event_loop_group)
    client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=ENDPOINT,
        cert_filepath=PATH_TO_CERT, 
        pri_key_filepath=PATH_TO_KEY,
        client_bootstrap=client_bootstrap,
        ca_filepath=PATH_TO_ROOT, 
        client_id=CLIENT_ID,
        clean_session=False,
        keep_alive_secs=6
    )

    print("Connection to {} with client ID '{}' ...".format(ENDPOINT, CLIENT_ID))

    #Make the connect call 

    connect_future = mqtt_connection.connect()

    #Future.result() waits until a result is available 

    connect_future.result()
    print("Connected!")

    #Publish message to server desired number of times 

    print('Begin Publish')

    for j in range(5): 

        y0 = lat_origins[j]
        x0 = long_origins[j]
        Faker.seed(1)

        for i in range (RANGE): 

            u = random.random() 
            v = random.random()
            w = rad * math.sqrt(u)
            t = 2 * math.pi * v
            x = w * math.cos(t)
            y = w * math.sin(t)
            x_new = x / math.cos(y0)
            latitude = y + y0
            longitude = x_new + x0
            dist = distance(final_dest_lat, final_dest_long, latitude, longitude)

            MESSAGE = {
                "teamId": i + 1,
                "eventId": "DCH2021",
                "teamCountry": fake.country(),
                "nomembers": members[i],
                "latitude": str(latitude),
                "longitude": str(longitude),
                "distance": dist
            }

            mqtt_connection.publish(topic=TOPIC, payload=json.dumps(MESSAGE), qos=mqtt.QoS.AT_LEAST_ONCE)
            print("Published: '" + json.dumps(MESSAGE) + "' to the topic: " + "' nautilus/sensordata'")
            time.sleep(0.5)

        time.sleep(5)

    print('Publish End')
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    

if __name__ == "__main__": 
    main()