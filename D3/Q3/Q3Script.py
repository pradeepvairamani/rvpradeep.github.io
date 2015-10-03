import csv
import json
from operator import itemgetter


def find_overlap(start1, end1, start2, end2):
    s1 = set(range(start1, end1 + 1))
    s2 = set(range(start2, end2 + 1))

    s3 = s1.intersection(s2)
    return len(s3)


with open('arsenal_players.csv', 'rb') as csvfile:
    l = []
    reader = csv.reader(csvfile)
    for line in reader:
        line = [int(x) if x.isdigit() else x for x in line]
        l.append(line)
    l.pop(0)
    l = sorted(l, key=itemgetter(6), reverse=True)
    # print l[0:50]
    final_nodes = []
    final_links = []
    d = {}
    g_arr = l[0:50]
    for k in g_arr:
        d = {"name": k[0], "position": k[1],
             "appearances": k[6], "goals": k[7]}
        final_nodes.append(d)

    uniq = set()
    for i, k in enumerate(g_arr):
        for j, m in enumerate(g_arr):
            if not i == j:
                if ((min(i, j), max(i, j)) not in uniq):
                    overlap_years = find_overlap(k[2], k[3], m[2], m[3])
                    if overlap_years < 1:
                        continue
                    uniq.add((min(i, j), max(i, j)))
                    link = {"source": min(i, j), "target": max(
                        i, j), "value": overlap_years}
                    final_links.append(link)

    # print json.dumps({"nodes" : final_nodes, "links" : final_links})
    with open('afc.json', 'w') as outfile:
        json.dump({"nodes": final_nodes, "links": final_links}, outfile)
