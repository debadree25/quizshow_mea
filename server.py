import os
import mimetypes
d = os.getcwd()
from http.server import BaseHTTPRequestHandler,HTTPServer
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        pth = os.path.join(d,*(self.path.split('/')))
        try:
            f = open(pth,'rb')
            self.send_response(200,"Success")
            ctype,_ = mimetypes.guess_type(pth)
            self.send_header('Content-type',ctype)
            self.end_headers()
            self.wfile.write(f.read())
        except IOError:
            self.send_error(404,"Error")
    def do_POST(self):
        pth = self.path
        if pth.endswith('leaderboard.json'):
            self.send_response(301)
            cl = self.getheader('content-length')
            print(self.rfile.read(cl))

s = HTTPServer(('',8080),Handler)
s.serve_forever()
