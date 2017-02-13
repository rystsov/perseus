apt-get install wrk
apt-get install git
apt-get install nodejs
ln -s /usr/bin/nodejs /usr/bin/node
apt-get install npm
npm install --global node-nightly
node-nightly
apt-get install tmux
add-apt-repository ppa:chris-lea/redis-server
apt-get update
apt-get install redis-server=3:3.2.6-3chl1~xenial1
sudo service redis-server stop
hdparm -Tt /dev/sda1
hdparm -Tt /dev/sdb1
cd /mnt
git clone https://github.com/rystsov/gryadka-etcd.git
cd gryadka-etcd
npm install
./bin/get-etcd.sh
sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP
sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP
curl -L http://10.0.0.4:2379/v2/stats/self | python -m json.tool


sudo git clone https://github.com/rystsov/perseus-etcd.git && sudo chown -R rystsov:rystsov perseus-etcd
curl -L http://10.0.0.4:2379/v2/stats/self | python -m json.tool


sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -s 10.0.0.6 -j DROP

sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -s 10.0.0.6 -j DROP
