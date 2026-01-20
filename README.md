Do these to start it: <br> 

sudo apt install git <br>
git clone https://github.com/HackerZsalmale/raspberry-statpage <br>
sudo npm install pm2 -g <br>
cd /home/admin/raspberry-statpage <br>
pm2 delete all <br>
pm2 start stats.py --name "pi-stats" --interpreter python3 <br>
pm2 start server.js --name "pi-server" <br>
pm2 startup <br> 
pm2 save <br>
