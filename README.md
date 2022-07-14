# redis-weather-grafana-docker

# 🚀 Grafana Smart Weather Dashboard 🚀

https://github.com/coding-to-music/redis-weather-grafana-docker

From / By https://github.com/RedisTimeSeries/redis-weather

## Environment variables:

```java
OPEN_WEATHER_MAP_KEY=""
```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/redis-weather-grafana-docker.git
git push -u origin main
```

## Error messages

```
Starting redismod              ... done
Starting redis-weather-grafana ... done
Starting redis-weather-app     ... done
Attaching to redismod, redis-weather-grafana, redis-weather-app
redis-weather-grafana | mkdir: can't create directory '/var/lib/grafana/plugins': Permission denied
redis-weather-grafana | GF_PATHS_DATA='/var/lib/grafana' is not writable.
redis-weather-grafana | You may have issues with file permissions, more information here: http://docs.grafana.org/installation/docker/#migrate-to-v51-or-later

snip

redismod   | 1:M 14 Jul 2022 05:31:04.291 * Module 'rg' loaded from /usr/lib/redis/modules/redisgears.so
redismod   | 1:M 14 Jul 2022 05:31:04.292 # Short read or OOM loading DB. Unrecoverable error, aborting now.
redismod   | 1:M 14 Jul 2022 05:31:04.292 # Internal error in RDB reading offset 0, function at rdb.c:2742 -> Unexpected EOF reading RDB file
redismod   | [offset 0] Checking RDB file dump.rdb
redismod   | --- RDB ERROR DETECTED ---
redismod   | [offset 0] Unexpected EOF reading RDB file
redismod   | [additional info] While doing: start
redismod   | [additional info] Reading type 0 (string)
redismod   | [info] 0 keys read
redismod   | [info] 0 expires
redismod   | [info] 0 already expired
redis-weather-grafana exited with code 1
redismod exited with code 1
redis-weather-app | Traceback (most recent call last):
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/connection.py", line 611, in connect
redis-weather-app |     sock = self.retry.call_with_retry(
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/retry.py", line 46, in call_with_retry
redis-weather-app |     return do()
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/connection.py", line 612, in <lambda>
redis-weather-app |     lambda: self._connect(), lambda error: self.disconnect(error)
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/connection.py", line 645, in _connect
redis-weather-app |     for res in socket.getaddrinfo(
redis-weather-app |   File "/usr/local/lib/python3.8/socket.py", line 918, in getaddrinfo
redis-weather-app |     for res in _socket.getaddrinfo(host, port, family, type, proto, flags):
redis-weather-app | socket.gaierror: [Errno -2] Name or service not known
redis-weather-app |
redis-weather-app | During handling of the above exception, another exception occurred:
redis-weather-app |
redis-weather-app | Traceback (most recent call last):
redis-weather-app |   File "openweather_redis_exporter.py", line 30, in <module>
redis-weather-app |     r.delete("places")
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/commands/core.py", line 1588, in delete
redis-weather-app |     return self.execute_command("DEL", *names)
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/client.py", line 1235, in execute_command
redis-weather-app |     conn = self.connection or pool.get_connection(command_name, **options)
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/connection.py", line 1387, in get_connection
redis-weather-app |     connection.connect()
redis-weather-app |   File "/usr/local/lib/python3.8/site-packages/redis/connection.py", line 617, in connect
redis-weather-app |     raise ConnectionError(self._error_message(e))
redis-weather-app | redis.exceptions.ConnectionError: Error -2 connecting to host.docker.internal:6379. Name or service not known.
redis-weather-app exited with code 1
```

# Grafana Smart Weather Dashboard

<div id="badges" align="center">

[![Grafana 7](https://img.shields.io/badge/Grafana-7-blue)](https://www.grafana.com)
[![RedisTimeSeries](https://img.shields.io/badge/RedisTimeSeries-inspired-yellowgreen)](https://oss.redislabs.com/redistimeseries/)
[![Grafana-Redis-Datasource](https://img.shields.io/badge/GrafanaRedisDatasource-integrated-yellow)](https://github.com/RedisTimeSeries/grafana-redis-datasource)

</div>

## Introduction

The purpose of this software is export current, hourly and daily weather forecast from https://openweathermap.org and display it on Grafana dashboards in the various numeric and graphs forms for a precise vision of the weather in the multiple locations, by multiple parameters, including temperature, wind speed, amount of precipitation, percent of cloudiness, a distance of visibility, etc.

There are a lot of interesting locations within a couple of hours drive from my house, and the weather can be very different from one to another. What I really want is a dashboard that shows the weather in a dozen locations on one screen, so I can compare conditions at a glance. And I don’t just want to compare locations near each other, but understand, which is good for particular type of activity: bike ride, rock climbing, drone fly, landscape photography, hiking, etc.

So, additionaly to the current weather and forecast, the dashboard maps for every type of defined activity and show detailed forecast for each activity at particular location. You can customize the activites and their parameters in the config file (see below).

![](images/main_screen_shot.png)

![](images/activity_maps.png)

### The Docker container runs the following applications:

- openweather_redis_exporter.py - app to get weather metrics from https://openweathermap.org
- Redis database with RedisTimeSeries module - to store historical weather data and future forecasts
- Grafana with Redis Data Source - to display the weather data

The top section of the dashboard shows the current conditions for one location, which can be the primary or favorite or just selected from the list of available places (there is a Grafana template variable selection list in the top left corner of the dashboard). The bottom section shows weather conditions for a few different locations, so you can instantly compare the weather in various places.  
Grafana allows me to highlight low/high zones for temperature, dangerous zones for wind speed, display the degree of cloudiness, and mark periods of daytime and nighttime.

## Configuration

`openweather_redis_exporter.py` script comes together with the configuration file `openweather_redis_exporter.json`, which has a number of mandatory and optional parameters:

```
{
	"units":"imperial"|"metric", #units format retrieving data from openweathermap.org. The default is "imperial", if you change it to "metric", you also need to update the units in Grafana dashboard
	"open_weather_api":"<api_key>", #provide your API key, which you will receive after the registration at openweathermap.org
	"redis_host":"host.docker.internal", #default Redis host
	"redis_port":6379, #default Redis port
	"pull_freq":1800, #default frequesncy of pulling data from openweathermap.org
	"places": #the list of locations to get the wether for
	[
		{
		    "name":"NewYork", #Location name. Please note, current version doesn't support spaces in the names
		    "lat":40.71274, #lattitude
		    "lon":-74.005974, #longtitude
		    "activity":[ "Bike" ] #list of activities to monitor for this location
		},
		...
	],
	"activity:Hiking": #definition of activity "Hiking". You can include any number of the metrics with minimum and maximum values accepted for this activity
    [
        {
            "name":"temp",
            "min":20,
            "max":90
        },
        {
            "name":"rain",
            "min":0,
            "max":1
        },
		...
    ],
	"activity:<activity_name>":
    [
		...
    ],
	...
}
```

There's nothing to configure in Redis.

Grafana comes with necessary default settings, including the Grafana Weather dashboard (you can modify this dashboard yourself later). The only thing you need to change in Grafana: Dashboard timezone setting should be `UTC`. This will ensure the data from locations in different time zone are displayed correctly: in a location local time.

## Run using `docker-compose`

The project provides `docker-compose.yml` to start Redis with RedisTimeSeries module, Grafana 7.0 and OpenWeather data exporter.

```bash
docker-compose up
```

## Feedback

We love to hear from users, developers and the whole community interested by this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature and file a bug with GitHub issues.
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## Other interesting resources

- [RedisTimeSeries](https://oss.redislabs.com/redistimeseries/)
- [Grafana Redis Data Source](https://grafana.com/grafana/plugins/redis-datasource)

## License

- Apache License Version 2.0, see [LICENSE](LICENSE)

# Install Grafana

# Install on Debian or Ubuntu

This page explains how to install Grafana dependencies, download and install Grafana, get the service up and running on your Debian or Ubuntu system, and also describes the installation package details.

## Note on upgrading

While the process for upgrading Grafana is very similar to installing Grafana, there are some key backup steps you should perform. Read [Upgrading Grafana]({{< relref "../upgrade-grafana/" >}}) for tips and guidance on updating an existing installation.

> **Note:** You can use [Grafana Cloud](https://grafana.com/products/cloud/features/#cloud-logs) to avoid the overhead of installing, maintaining, and scaling your observability stack. The free forever plan includes Grafana, 10K Prometheus series, 50 GB logs, and more.[Create a free account to get started](https://grafana.com/auth/sign-up/create-user?pg=docs-grafana-install&plcmt=in-text).

## 1. Download and install

You can install Grafana using our official APT repository, by downloading a `.deb` package, or by downloading a binary `.tar.gz` file.

### Install from APT repository

If you install from the APT repository, then Grafana is automatically updated every time you run `apt-get update`.

| Grafana Version           | Package            | Repository                                                |
| ------------------------- | ------------------ | --------------------------------------------------------- |
| Grafana Enterprise        | grafana-enterprise | `https://packages.grafana.com/enterprise/deb stable main` |
| Grafana Enterprise (Beta) | grafana-enterprise | `https://packages.grafana.com/enterprise/deb beta main`   |
| Grafana OSS               | grafana            | `https://packages.grafana.com/oss/deb stable main`        |
| Grafana OSS (Beta)        | grafana            | `https://packages.grafana.com/oss/deb beta main`          |

> **Note:** Grafana Enterprise is the recommended and default edition. It is available for free and includes all the features of the OSS edition. You can also upgrade to the [full Enterprise feature set](https://grafana.com/products/enterprise/?utm_source=grafana-install-page), which has support for [Enterprise plugins](https://grafana.com/grafana/plugins/?enterprise=1&utcm_source=grafana-install-page).

#### To install the latest Enterprise edition:

```bash
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```

Add this repository for stable releases:

```bash
echo "deb https://packages.grafana.com/enterprise/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

Add this repository if you want beta releases:

```bash
echo "deb https://packages.grafana.com/enterprise/deb beta main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

After you add the repository:

```bash
sudo apt-get update
sudo apt-get install grafana-enterprise
```

#### To install the latest OSS release:

```bash
sudo apt-get install -y wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```

Add this repository for stable releases:

```bash
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

Add this repository if you want beta releases:

```bash
echo "deb https://packages.grafana.com/oss/deb beta main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

After you add the repository:

```bash
sudo apt-get update
sudo apt-get install grafana
```

### Install .deb package

If you install the `.deb` package, then you will need to manually update Grafana for each new version.

1. On the [Grafana download page](https://grafana.com/grafana/download), select the Grafana version you want to install.
   - The most recent Grafana version is selected by default.
   - The **Version** field displays only finished releases. If you want to install a beta version, click **Nightly Builds** and then select a version.
1. Select an **Edition**.
   - **Enterprise** - Recommended download. Functionally identical to the open source version, but includes features you can unlock with a license if you so choose.
   - **Open Source** - Functionally identical to the Enterprise version, but you will need to download the Enterprise version if you want Enterprise features.
1. Depending on which system you are running, click **Linux** or **ARM**.
1. Copy and paste the code from the installation page into your command line and run. It follows the pattern shown below.

```bash
sudo apt-get install -y adduser
wget <.deb package url>
sudo dpkg -i grafana<edition>_<version>_amd64.deb
```

## Install from binary .tar.gz file

Download the latest [`.tar.gz` file](https://grafana.com/grafana/download?platform=linux) and extract it. The files extract into a folder named after the Grafana version downloaded. This folder contains all files required to run Grafana. There are no init scripts or install scripts in this package.

```bash
wget <tar.gz package url>
sudo tar -zxvf <tar.gz package>
```

## 2. Start the server

This starts the `grafana-server` process as the `grafana` user, which was created during the package installation.

If you installed with the APT repository or `.deb` package, then you can start the server using `systemd` or `init.d`. If you installed a binary `.tar.gz` file, then you need to execute the binary.

### Start the server with systemd

To start the service and verify that the service has started:

```bash
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl status grafana-server
```

Configure the Grafana server to start at boot:

```bash
sudo systemctl enable grafana-server.service
```

#### Serving Grafana on a port < 1024

{{< docs/shared "systemd/bind-net-capabilities.md" >}}

### Start the server with init.d

To start the service and verify that the service has started:

```bash
sudo service grafana-server start
sudo service grafana-server status
```

Configure the Grafana server to start at boot:

```bash
sudo update-rc.d grafana-server defaults
```

### Execute the binary

The `grafana-server` binary .tar.gz needs the working directory to be the root install directory where the binary and the `public` folder are located.

Start Grafana by running:

```bash
./bin/grafana-server web
```

## Package details

- Installs binary to `/usr/sbin/grafana-server`
- Installs Init.d script to `/etc/init.d/grafana-server`
- Creates default file (environment vars) to `/etc/default/grafana-server`
- Installs configuration file to `/etc/grafana/grafana.ini`
- Installs systemd service (if systemd is available) name `grafana-server.service`
- The default configuration sets the log file at `/var/log/grafana/grafana.log`
- The default configuration specifies a SQLite3 db at `/var/lib/grafana/grafana.db`
- Installs HTML/JS/CSS and other Grafana files at `/usr/share/grafana`

## Next steps

Refer to the [Getting Started]({{< relref "../../getting-started/build-first-dashboard/" >}}) guide for information about logging in, setting up data sources, and so on.

## Configure Grafana

Refer to the [Configuration]({{< relref "../configure-grafana/" >}}) page for details on options for customizing your environment, logging, database, and so on.
