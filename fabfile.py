import os
import socket
import BaseHTTPServer, SimpleHTTPServer
import ssl

from fabric.api import *

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(ROOT_DIR, 'tmp')


def run_web_server():
    local('mkdir -p {}'.format(TEMP_DIR))
    ssl_key = os.path.join(TEMP_DIR, 'ssl.key')
    ssl_csr = os.path.join(TEMP_DIR, 'ssl.csr')
    ssl_cert = os.path.join(TEMP_DIR, 'ssl.crt')
    ssl_pem = os.path.join(TEMP_DIR, 'ssl.pem')
    if not os.path.isfile(ssl_key):
        local('openssl genrsa -out {} 1024'.format(ssl_key))
        local('openssl req -new -key {} -out {}'.format(ssl_key, ssl_csr))
        local('openssl x509 -req -days 3650 -in {} -signkey {} -out {}'.format(ssl_csr, ssl_key, ssl_cert))
        local('cat {} {} > {}'.format(ssl_cert, ssl_key, ssl_pem))
    port = 10443
    host = socket.gethostbyname(socket.gethostname())
    puts('Starting https server on https://{}:{}'.format(host, port))
    httpd = BaseHTTPServer.HTTPServer((host, port),
                                      SimpleHTTPServer.SimpleHTTPRequestHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket, certfile=ssl_pem, server_side=True)
    httpd.serve_forever()
