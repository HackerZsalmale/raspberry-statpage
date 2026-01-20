Do these to start it: 

sudo apt install git
git clone https://github.com/HackerZsalmale/raspberry-statpage
sudo npm install pm2 -g
cd /home/admin/raspberry-statpage
pm2 delete all
pm2 start stats.py --name "pi-stats" --interpreter python3
pm2 start server.js --name "pi-server"
pm2 startup
pm2 save
