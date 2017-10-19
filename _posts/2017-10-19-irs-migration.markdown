---
layout: post
title:  "IRS Migration Map"
date:   2017-10-19
tech:  D3.js node bash turfjs HTML CSS JavaScript webpack
image: 'irs-migration.png'
ghsource: 'thfield/irs-migration/'
ghpages: 'irs-migration/'


---

The IRS publishes [data on migration patterns](https://www.irs.gov/statistics/soi-tax-stats-migration-data) within the US based on changes in taxpayers' return addresses. This is an ongoing project to visualize and explore that data, with special attention on San Francisco. Eventually, the project might be modified to explore any county in the US.

For this project, I used D3 v4 to create the map. I couldn't find a chart library using v4 that behaved the way I wanted, so I ended up adapting some code I had written in the [reusable chart pattern](https://bost.ocks.org/mike/chart/).

Most of the data-munging is automated using command line tools like `grep` and `sed` then JavaScript scripts run using node.  The county of interest can then be specified by FIPS code.  As an initial proof-of-concept, I scripted the creation of animated gifs as well.