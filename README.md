# Create a map of Chinese province with d3js

This is a template to easily create nice map of China using d3js.

## Data into the map

To generate a map, I use a small Python script called ```create_d3_map.py```.


Data need to be parse properly in the html file. 

### Count per province

To assign color to each province, 

Available provinces are :

    ["Gansu", "Qinghai", "Guangxi", "Guizhou", "Chongqing", "Beijing", "Fujian", "Anhui", "Guangdong", "Xizang", "Xinjiang", "Hainan", "Ningxia", "Shaanxi", "Shanxi", "Hubei", "Hunan", "Sichuan", "Yunnan", "Hebei", "Henan", "Liaoning", "Shandong", "Tianjin", "Jiangxi", "Jiangsu", "Shanghai", "Zhejiang", "Jilin", "Inner Mongol", "Heilongjiang", "Taiwan", "Xianggang", "Macau"]

The final array should look like this:

    var data=[["Xianggang",53],["Guangdong",24],["Beijing",10],["Shanghai",6],["Taiwan",6],["Qita",5],["Hunan",2],["Yunnan",2],["Zhejiang",2],["Haiwai",2],["Shaanxi",2],["Jiangsu",1],["Anhui",1],["Guangxi",1],["Tianjin",1],["Henan",1],["Liaoning",1],["Fujian",1]];

### Colors

Colors scope is defined in the ```colorScale``` function in d3map.js

### Title, description, units and credits

Additional info should be added like this :

    var title='Population of Sina Weibo users for a specific keyword';
    var desc='Based on Sina Weibo user profiles during a period of time. Data from weiboscope.';
    var credits='by Clement Renaud - 2013';
    var units='Volume of tweets';


## Useful links

Map data has been prepared on Mike Bostock's d3js [map tutorial](http://bost.ocks.org/mike/map/) and [this other tutorial](http://www.tnoda.com/blog/2013-12-07)

* http://bl.ocks.org/mbostock/4707858
* http://ccarpenterg.github.io/blog/us-census-visualization-with-d3js/


### About map data
To map data for Sina Weibo, we need to combine several maps to include HK, Aomen and Taiwan. 

Map data map need to be downloaded from [Natural Earth](www.naturalearthdata.com) 1:10m Cultural Vectors 

* Admin 0 - Countries (including taiwan and HK)  [Download](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries_lakes.zip)
* Admin 1 - States, Provinces (only the mainland) [Download](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces_lakes.zip)

Then, we use command-line tool ```ogr2ogr``` to filter SHP and keep only relevant part of the map and convert to geojson.

For the countries, we use ISO 3166-1 alpha-3 standard names of the countries : 'CHN', 'HKG', 'TWN' and 'MAC'
 
    ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('CHN','TWN')" zh-chn-twn.topo.json ne_10m_admin_0_countries_lakes.shp

    ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('HKG','MAC')" zh-hkg-mac.geo.json ne_10m_admin_0_countries_lakes.shp

For the provinces, we need only the mainland.
    
    ogr2ogr -f GeoJSON -where "gu_A3 IN ('CHN')" zh-mainland-provinces.json ne_10m_admin_1_states_provinces_lakes.shp 

The we use mapshaper.org to simplify the geometry (make the file smaller) and download it as topojson. Final states of the files are available in this rep. 

TODO : Make the maps files smaller using npm topojson and removing useless fields