import subprocess
import time
import json 

def get_cpu_usage():
    try:
        result = subprocess.run(['top', '-bn1'], stdout=subprocess.PIPE, text=True)
        for line in result.stdout.split('\n'):
            if 'Cpu(s)' in line:
                parts = line.split(',')
                for part in parts:
                    if 'id' in part:
                        idle = float(part.split()[0])
                        return round(100.0 - idle, 2)
    except: return 0.0

def get_ram_usage():
    try:
        result = subprocess.run(['free', '-m'], stdout=subprocess.PIPE, text=True)
        for line in result.stdout.split('\n'):
            if 'Mem:' in line:
                parts = line.split()
                total, used = float(parts[1]), float(parts[2])
                return round((used / total) * 100.0, 2)
    except: return 0.0

def get_disk_usage():
    try:
        result = subprocess.run(['df', '-h', '/'], stdout=subprocess.PIPE, text=True)
        cols = result.stdout.split('\n')[1].split()
        return cols[4].replace('%', '') 
    except: return "0"

def main():
    while True:

        stats = {
            "cpu_usage_percent": get_cpu_usage(),
            "ram_usage_percent": get_ram_usage(),
            "disk_usage_percent": int(get_disk_usage()),
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
        }


        with open("stats.json", "w") as f:
            json.dump(stats, f, indent=4)

        print("\033[H\033[J", end="")
        print("Monitoring active...")
        print("Data written to stats.json")
        print(json.dumps(stats, indent=4)) 

        time.sleep(0.3)

def name():
    while True:
        name = {
            "host": subprocess.run(['echo', '$USER@$HOSTNAME'], stdout=subprocess.PIPE, text=True).stdout.strip()
        }
        time.sleep(10)

if __name__ == "__main__":
    main()
