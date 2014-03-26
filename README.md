#  China map template using d3.js

This is a template to easily create nice map of China using data by provinces with d3js. The map includes Taiwan, HK and Macau.

## Add your data

To generate a map, you can use the small Python script called ```create_d3_map.py``` or pass your values to js variables directly within the html file.

### Per province

You need to parse you data into a 2D array where  each province is associated to a count (int or float).

    var data=[ ["Guangdong",12], ["Guizhou", 15] ...]

Available provinces are :

    ["Gansu", "Qinghai", "Guangxi", "Guizhou", "Chongqing", "Beijing", "Fujian", "Anhui", "Guangdong", "Xizang", "Xinjiang", "Hainan", "Ningxia", "Shaanxi", "Shanxi", "Hubei", "Hunan", "Sichuan", "Yunnan", "Hebei", "Henan", "Liaoning", "Shandong", "Tianjin", "Jiangxi", "Jiangsu", "Shanghai", "Zhejiang", "Jilin", "Inner Mongol", "Heilongjiang", "Taiwan", "Xianggang", "Macau"]


### Colors

Colors scope is defined in the ```colorScale``` function in d3map.js

### Title, description, units and credits

Additional info should be added like this :

    var title='Population of Sina Weibo users for a specific keyword';
    var desc='Based on Sina Weibo user profiles during a period of time. Data from weiboscope.';
    var credits='by Clement Renaud - 2013';
    var units='Volume of tweets';


## Notes

### Map data
To map data about China, we need to combine several maps to include HK, Aomen and Taiwan. 

Map data has been prepared on Mike Bostock's d3js [map tutorial](http://bost.ocks.org/mike/map/) and [this other tutorial](http://www.tnoda.com/blog/2013-12-07)

* http://bl.ocks.org/mbostock/4707858
* http://ccarpenterg.github.io/blog/us-census-visualization-with-d3js/


Map data map need to be downloaded from [Natural Earth](www.naturalearthdata.com) 1:10m Cultural Vectors 

* Admin 0 - Countries (including taiwan and HK)  [Download](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries_lakes.zip)
* Admin 1 - States, Provinces (only the mainland) [Download](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces_lakes.zip)

Then, we use command-line tool ```ogr2ogr``` to filter SHP and keep only relevant part of the map and convert to geojson.

For the countries, we use ISO 3166-1 alpha-3 standard names of the countries : 'CHN', 'HKG', 'TWN' and 'MAC' to generate 2 maps : PRC+Taiwan borders, Aomen+HK borders
 
    ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('CHN','TWN')" zh-chn-twn.topo.json ne_10m_admin_0_countries_lakes.shp

    ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('HKG','MAC')" zh-hkg-mac.geo.json ne_10m_admin_0_countries_lakes.shp

For the provinces, we need only the mainland.
    
    ogr2ogr -f GeoJSON -where "gu_A3 IN ('CHN')" zh-mainland-provinces.json ne_10m_admin_1_states_provinces_lakes.shp 

The we use mapshaper.org to simplify the geometry (make the file smaller) and download it as topojson. Final states of the files are available in this rep. 

TODO : Make the maps files smaller using npm topojson and removing useless fields