from awscrt import io, mqtt, auth, http 
from awsiot import mqtt_connection_builder
import time 
import json 
import random
import datetime
import math
from faker import Faker
fake = Faker()
random.seed(0)

rad = 800 / 111300

final_dest_lat = -55.98282801216771
final_dest_long = -67.26653807526428

lat_origins = [-55.936503688184885, -55.927665169234054, -55.918687568632, -55.91508898150543, -55.914508532943124, -55.91485680312332, -55.91996440635155, -55.9280887519386, -55.93853183686328, -55.94433233447299, -55.94700027167601, -55.9525675485788, -55.95975742988348, -55.9707715929155, -55.97552410541406, -55.97830579304675]
long_origins = [-67.24342434300608, -67.26010408351983, -67.27445824158288, -67.29496567686638, -67.3158874037718, -67.3401234636523, -67.35897373244826, -67.36394523191093, -67.36394523191093, -67.34861644190103, -67.33287336026923, -67.31837315350313, -67.32500181945335, -67.33680913067718, -67.31899459093596, -67.30180148862756]

 #lat_origins = [-55.92225859118267,-55.9351149119588, -55.94252894746586, -55.95496232531181,-55.960736135615925, -55.97383500647655, -55.976252078445214, -55.980507288323366]
#long_origins = [-67.36855296661427, -67.35499828297868, -67.34593669557687, -67.32537644917923,-67.31690536187105, -67.33771259701783,-67.30811468781651, -67.301526563358]


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

    
# Define ENDPOINT, CLIENT_ID, PATH_TO_CERT. PATH_TO_KEY, PATH TO ROOT, MESSAGE, TOPIC AND RANGE
ENDPOINT = "a2wgdknw9m3e2n-ats.iot.us-east-1.amazonaws.com"
CLIENT_ID = "test-thing"
PATH_TO_CERT = "./certificates/c28e489691-certificate.pem.crt"
PATH_TO_KEY = "./certificates/c28e489691daf94c66bdcc24d6d113b58209d328fe8d8f8662621467a89f1b47-private.pem.key"
PATH_TO_ROOT = "./certificates/root.pem"
TOPIC = "nautilus/sensordatacoords"
RANGE = len(lat_origins)
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

for i in range (RANGE): 

    y0 = lat_origins[i]
    x0 = long_origins[i]

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
        "teamId": 11,
        "timestamp": datetime.datetime.now().isoformat(),
        "latitude": str(latitude),
        "longitude": str(longitude),
        "distance": dist
    }

    mqtt_connection.publish(topic=TOPIC, payload=json.dumps(MESSAGE), qos=mqtt.QoS.AT_LEAST_ONCE)
    print("Published: '" + json.dumps(MESSAGE) + "' to the topic: " + "' nautilus/sensordatacoords'")
    time.sleep(3)

print('Publish End')
disconnect_future = mqtt_connection.disconnect()
disconnect_future.result()