import json
import os

problems = []

templates = [
    {
        'title': 'Cloud Storage Cost Calculator',
        'desc': 'Calculate the total cost of storing data in the cloud. You are given the storage size in GB, the cost per GB, and the number of months.',
        'diff': 'Easy',
        'input': 'Three space-separated integers: size in GB, cost per GB, and months.',
        'output': 'A single integer representing the total cost.',
        'tc': [('10 2 5', '100'), ('50 1 12', '600')]
    },
    {
        'title': 'Cloud Scalability Predictor',
        'desc': 'A cloud application needs to scale horizontally. Each server can handle a fixed number of requests per second. Given the total incoming requests and server capacity, find the minimum number of servers needed.',
        'diff': 'Easy',
        'input': 'Two space-separated integers: total requests and server capacity.',
        'output': 'A single integer representing the number of servers.',
        'tc': [('1000 200', '5'), ('1050 200', '6')]
    },
    {
        'title': 'Virtual Machine Setup Time',
        'desc': 'Setting up the first VM takes B minutes. Each subsequent VM takes an additional I minutes. Given B, I, and N (number of VMs), calculate the total time to set up all N VMs.',
        'diff': 'Easy',
        'input': 'Three space-separated integers: B, I, N.',
        'output': 'A single integer representing total setup time.',
        'tc': [('10 2 3', '36'), ('5 1 4', '26')]
    },
    {
        'title': 'App Engine Auto-Scaler',
        'desc': 'Google App Engine automatically scales instances. If current CPU utilization exceeds a threshold T, it adds 1 instance. If it drops below T-20, it removes 1 instance. Given the initial instances, threshold T, and a series of CPU utilizations, find the final number of instances.',
        'diff': 'Medium',
        'input': 'The first line contains an integer N (initial instances) and T (threshold). The second line contains an integer K (number of readings). The third line contains K space-separated integers (CPU readings).',
        'output': 'A single integer representing the final number of instances.',
        'tc': [('5 80\n4\n85 90 50 40', '6'), ('2 70\n3\n40 80 90', '3')]
    },
    {
        'title': 'Git Commit History Analyzer',
        'desc': 'You are given N commit hashes. Find the hash that appears most frequently (simulating a reverted or duplicated commit issue). If there is a tie, print the one that appeared first.',
        'diff': 'Medium',
        'input': 'The first line contains N. The next N lines contain one string each (commit hash).',
        'output': 'A single string representing the most frequent commit hash.',
        'tc': [('4\na1b2\nc3d4\na1b2\ne5f6', 'a1b2'), ('3\nxyz\nabc\nxyz', 'xyz')]
    },
    {
        'title': 'Cloud Task Scheduler - FCFS',
        'desc': 'Simulate First-Come-First-Serve scheduling in CloudSim. Given N tasks with their burst times, calculate the total waiting time. All tasks arrive at time 0.',
        'diff': 'Medium',
        'input': 'The first line contains N. The second line contains N space-separated integers (burst times).',
        'output': 'A single integer representing the total waiting time.',
        'tc': [('3\n10 5 8', '25'), ('4\n2 3 5 4', '14')]
    },
    {
        'title': 'Cloud Task Scheduler - SJF',
        'desc': 'Simulate Shortest Job First scheduling in CloudSim. Given N tasks with their burst times (all arriving at time 0), calculate the total waiting time.',
        'diff': 'Medium',
        'input': 'The first line contains N. The second line contains N space-separated integers (burst times).',
        'output': 'A single integer representing the total waiting time.',
        'tc': [('3\n10 5 8', '18'), ('4\n2 3 5 4', '11')]
    },
    {
        'title': 'Cloud Load Balancer',
        'desc': 'A load balancer distributes incoming requests to M servers using Round Robin. Given M servers and N requests, find how many requests the first server processes.',
        'diff': 'Easy',
        'input': 'Two space-separated integers: M and N.',
        'output': 'A single integer representing the number of requests handled by the first server.',
        'tc': [('3 10', '4'), ('5 12', '3')]
    },
    {
        'title': 'AWS EC2 Instance Matcher',
        'desc': 'You need an EC2 instance with at least C CPU cores and R GB RAM. Given N instance types with their CPU and RAM, find the number of suitable instances.',
        'diff': 'Easy',
        'input': 'The first line contains C, R, N. The next N lines contain two integers each (CPU and RAM of the instance).',
        'output': 'A single integer representing the number of suitable instances.',
        'tc': [('4 16 3\n2 8\n4 16\n8 32', '2'), ('2 4 2\n1 2\n2 2', '0')]
    },
    {
        'title': 'Docker Container Bin Packing',
        'desc': 'You have N Docker containers with varying memory requirements and servers with a fixed memory capacity M. Find the minimum number of servers required using the First Fit algorithm.',
        'diff': 'Hard',
        'input': 'The first line contains N and M. The second line contains N space-separated integers (memory of each container).',
        'output': 'A single integer representing the minimum number of servers.',
        'tc': [('4 10\n4 8 1 4', '2'), ('5 10\n5 5 5 5 5', '3')]
    },
    {
        'title': 'Docker Image Size Calculator',
        'desc': 'A Docker image is built from a base image and several layers. Given the base image size and the sizes of N layers, calculate the total image size.',
        'diff': 'Easy',
        'input': 'The first line contains B (base size) and N. The second line contains N space-separated integers (layer sizes).',
        'output': 'A single integer representing the total size.',
        'tc': [('100 3\n10 20 30', '160'), ('50 2\n5 5', '60')]
    },
    {
        'title': 'Kubernetes Pod Scheduler',
        'desc': 'Kubernetes needs to schedule a pod requiring P CPU units. There are N nodes available, each with some free CPU units. Find the index (1-based) of the first node that can accommodate the pod. Output -1 if none can.',
        'diff': 'Medium',
        'input': 'The first line contains P and N. The second line contains N space-separated integers (free CPU of nodes).',
        'output': 'A single integer (the 1-based index or -1).',
        'tc': [('5 3\n2 4 6', '3'), ('10 2\n5 8', '-1')]
    },
    {
        'title': 'Azure Database Transaction Simulator',
        'desc': 'Simulate a key-value store. You are given N operations: 1 means SET (key value), 2 means GET (key), 3 means DELETE (key). For each GET, print the value or -1 if it does not exist.',
        'diff': 'Hard',
        'input': 'The first line contains N. The next N lines contain operations.',
        'output': 'Space-separated integers for each GET operation.',
        'tc': [('5\n1 5 10\n2 5\n3 5\n2 5\n1 2 20', '10 -1'), ('3\n2 1\n1 1 5\n2 1', '-1 5')]
    },
    {
        'title': 'Edge Node Latency Optimizer',
        'desc': 'You have N edge nodes with their latencies from a user. Find the minimum latency.',
        'diff': 'Easy',
        'input': 'The first line contains N. The second line contains N space-separated integers (latencies).',
        'output': 'A single integer representing the minimum latency.',
        'tc': [('4\n50 20 30 10', '10'), ('3\n100 200 150', '100')]
    },
    {
        'title': 'Git Merge Conflict Detector',
        'desc': 'You have two branches modifying files. Given N files modified in branch A and M files modified in branch B, find the number of files modified in both (potential conflicts).',
        'diff': 'Medium',
        'input': 'The first line contains N and M. The next line contains N space-separated file IDs for A. The next line contains M space-separated file IDs for B.',
        'output': 'A single integer representing the number of conflicts.',
        'tc': [('3 3\n1 2 3\n2 3 4', '2'), ('2 2\n10 20\n30 40', '0')]
    },
    {
        'title': 'Cloud Resource Under-provisioning',
        'desc': 'Given N tasks with their required execution times and a hard deadline D, find how many tasks will fail to complete if they are run sequentially.',
        'diff': 'Medium',
        'input': 'The first line contains N and D. The second line contains N space-separated integers (execution times).',
        'output': 'A single integer representing the number of failed tasks.',
        'tc': [('4 10\n3 4 5 2', '2'), ('3 20\n5 5 5', '0')]
    },
    {
        'title': 'S3 Bucket File Organizer',
        'desc': 'You have N file sizes uploaded to an S3 bucket. Calculate the total size of files that are strictly greater than S MB.',
        'diff': 'Easy',
        'input': 'The first line contains N and S. The second line contains N space-separated integers.',
        'output': 'A single integer representing the total size.',
        'tc': [('5 10\n5 15 8 20 12', '47'), ('3 5\n2 3 4', '0')]
    },
    {
        'title': 'Azure Data Factory Pipeline',
        'desc': 'A data pipeline has N stages. Each stage takes T time. However, every 3rd stage takes double time (data validation). Calculate total time.',
        'diff': 'Medium',
        'input': 'Two space-separated integers: N and T.',
        'output': 'A single integer representing total time.',
        'tc': [('4 5', '25'), ('6 10', '80')]
    },
    {
        'title': 'Kubernetes Replica Set Controller',
        'desc': 'A replica set requires R pods. Currently, there are C pods. If C < R, output "Scale Up X" where X is the difference. If C > R, output "Scale Down X". If equal, output "Optimal".',
        'diff': 'Easy',
        'input': 'Two space-separated integers: R and C.',
        'output': 'A string representing the action.',
        'tc': [('5 3', 'Scale Up 2'), ('2 4', 'Scale Down 2')]
    },
    {
        'title': 'GCP BigQuery Cost Estimator',
        'desc': 'BigQuery charges X cents per GB scanned. Given N queries and the MB scanned by each, calculate the total cost in cents (rounded down). 1 GB = 1000 MB for this problem.',
        'diff': 'Medium',
        'input': 'The first line contains N and X. The second line contains N space-separated integers (MBs).',
        'output': 'A single integer representing the total cost.',
        'tc': [('3 5\n500 1500 2000', '20'), ('2 10\n100 200', '3')]
    },
    {
        'title': 'Data Center Energy Consumption',
        'desc': 'A data center consumes P watts at idle. For every 10% CPU utilization, it consumes an extra E watts. Given base P, extra E, and N CPU utilization percentages, find the total power consumed. (Calculate E * (utilization // 10) for each reading)',
        'diff': 'Medium',
        'input': 'The first line contains P, E, N. The second line contains N space-separated integers.',
        'output': 'A single integer representing total power.',
        'tc': [('100 10 2\n50 20', '270'), ('50 5 3\n10 100 0', '205')]
    },
    {
        'title': 'Docker Command Validator',
        'desc': 'A container can be started (1) and stopped (0). It cannot be started if already running, and cannot be stopped if not running. Given N commands, check if the sequence is valid. Start state is stopped.',
        'diff': 'Medium',
        'input': 'The first line contains N. The second line contains N space-separated integers.',
        'output': 'String "Valid" or "Invalid".',
        'tc': [('4\n1 0 1 0', 'Valid'), ('3\n1 1 0', 'Invalid')]
    },
    {
        'title': 'Virtual Machine Migration',
        'desc': 'To save power, VMs are migrated from Server A to Server B. Server B has C capacity remaining. You have N VMs on Server A with given sizes. Find the maximum number of VMs that can be migrated to B.',
        'diff': 'Medium',
        'input': 'The first line contains N and C. The second line contains N space-separated integers. Sort them and pack as many as possible.',
        'output': 'A single integer representing the count.',
        'tc': [('4 10\n5 2 4 3', '3'), ('3 5\n6 7 8', '0')]
    },
    {
        'title': 'Cloud Pricing Optimizer',
        'desc': 'You need to run a task for H hours. Provider A charges X per hour. Provider B charges Y flat fee + Z per hour. Determine which provider is cheaper (Output "A", "B", or "Any").',
        'diff': 'Easy',
        'input': 'Four space-separated integers: H, X, Y, Z.',
        'output': 'String "A", "B", or "Any".',
        'tc': [('10 5 20 2', 'B'), ('5 10 10 10', 'A')]
    },
    {
        'title': 'Git Branching Simulator',
        'desc': 'You start on branch "main". You are given N commands. "1 name" means create and switch to branch name. "2 name" means switch to branch name. Print the final branch name.',
        'diff': 'Medium',
        'input': 'The first line contains N. The next N lines contain operations.',
        'output': 'A single string representing the final branch.',
        'tc': [('3\n1 dev\n1 feature\n2 main', 'main'), ('2\n1 bugfix\n2 bugfix', 'bugfix')]
    },
    {
        'title': 'Cloud Storage Bandwidth',
        'desc': 'You have N users downloading a file of size S MB. The total available bandwidth is B MB/s. Calculate the total time required for all users to finish downloading if bandwidth is equally shared. (ceil(N*S/B))',
        'diff': 'Medium',
        'input': 'Three space-separated integers: N, S, B.',
        'output': 'A single integer representing the time.',
        'tc': [('5 10 2', '25'), ('2 5 10', '1')]
    },
    {
        'title': 'Kubernetes Node Health Checker',
        'desc': 'N nodes send heartbeats. A node is unhealthy if it misses M consecutive heartbeats. Given a binary matrix of N nodes and K time intervals (1=beat, 0=miss), find how many nodes are unhealthy.',
        'diff': 'Hard',
        'input': 'The first line contains N, K, M. The next N lines contain K space-separated integers.',
        'output': 'A single integer representing the count of unhealthy nodes.',
        'tc': [('2 5 3\n1 0 0 0 1\n1 1 0 1 1', '1'), ('3 4 2\n0 0 1 1\n1 0 1 0\n0 0 0 0', '2')]
    },
    {
        'title': 'Docker Compose Port Mapper',
        'desc': 'N containers try to bind to host ports. If a port is already bound, the container fails. Given N port requests, find how many containers fail.',
        'diff': 'Easy',
        'input': 'The first line contains N. The second line contains N space-separated integers (ports).',
        'output': 'A single integer representing the number of failures.',
        'tc': [('4\n8080 8080 3306 8080', '2'), ('3\n80 443 22', '0')]
    },
    {
        'title': 'Cloudsim Server Overload',
        'desc': 'A server is overloaded if its CPU usage exceeds 90%. Given N CPU readings, find the maximum consecutive number of readings where the server was overloaded.',
        'diff': 'Medium',
        'input': 'The first line contains N. The second line contains N space-separated integers.',
        'output': 'A single integer representing the max consecutive overloads.',
        'tc': [('6\n95 92 80 91 99 95', '3'), ('4\n80 85 90 89', '0')]
    },
    {
        'title': 'Azure Disaster Recovery Time',
        'desc': 'Calculate the total downtime during a disaster. You are given N outage events with start and end times in minutes from midnight. Calculate total non-overlapping downtime.',
        'diff': 'Hard',
        'input': 'The first line contains N. The next N lines contain start and end times.',
        'output': 'A single integer representing total downtime.',
        'tc': [('2\n10 20\n15 30', '20'), ('3\n1 5\n10 15\n2 4', '9')]
    }
]

output_file = 'c:/Users/Jeet/Desktop/Projects/GyaanaSetu_BNMIT/generated_problems/sem4_CloudComputing&Applications(Lab).json'
os.makedirs(os.path.dirname(output_file), exist_ok=True)

final_data = []

for t in templates:
    obj = {
        'title': t['title'],
        'description': t['desc'],
        'difficulty': t['diff'],
        'inputFormat': t['input'],
        'outputFormat': t['output'],
        'note': 'Ensure efficient logic to handle constraints.',
        'sampleTestCases': [
            {'input': t['tc'][0][0], 'output': t['tc'][0][1]},
            {'input': t['tc'][1][0], 'output': t['tc'][1][1]}
        ],
        'starterCode': {
            'python': 'def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()',
            'java': 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n    }\n}',
            'cpp': '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
        }
    }
    final_data.append(obj)

with open(output_file, 'w') as f:
    json.dump(final_data, f, indent=4)

print('Success')
