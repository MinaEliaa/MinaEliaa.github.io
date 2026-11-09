#!/bin/bash
# usage: lh.sh URL NAME  -> runs mobile + desktop Lighthouse, prints scores and failing audits
URL=$1; NAME=$2
cd /home/claude/tools
for ff in mobile desktop; do
  extra=""; [ $ff = desktop ] && extra="--preset=desktop"
  CHROME_PATH=/usr/bin/google-chrome node_modules/.bin/lighthouse "$URL" $extra --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/home/claude/crawl/lh/$NAME-$ff.json >/dev/null 2>&1
  python3 - "$ff" "/home/claude/crawl/lh/$NAME-$ff.json" <<'EOF'
import json,sys
ff,f=sys.argv[1],sys.argv[2]; r=json.load(open(f))
print(ff.ljust(8), {k:round(v['score']*100) for k,v in r['categories'].items()})
for k,v in r['categories'].items():
  for a in v['auditRefs']:
    au=r['audits'][a['id']]
    if au['score'] is not None and au['score']<1 and au['scoreDisplayMode'] in ('binary','numeric','metricSavings'): print('   ',k,a['id'],au['score'],au.get('displayValue',''))
m=r['audits']; print('    FCP',m['first-contentful-paint']['displayValue'],'LCP',m['largest-contentful-paint']['displayValue'],'TBT',m['total-blocking-time']['displayValue'],'CLS',m['cumulative-layout-shift']['displayValue'],'SI',m['speed-index']['displayValue'])
EOF
done
