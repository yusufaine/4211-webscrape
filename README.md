# CS4211 Data Webscraper

## Purpose

This was made to scrape women's volleyball statistics from [NAIA](https://naiastats.prestosports.com) as we wanted to be able to create a probabilisitc model of what to expect from a few rallies between 2 teams assuming that each player can be associated to certain number to determine their likelihood of executing an action such as a service ace, kill, block, etc.

The attribute (aces, assists, kills, etc.) per set is normalised as a simple way of determining the likelihood of an event, but the data can be intepreted differently as we improve on the model.

The data that is currently in `assets` was generated on 6 November 2022.

## How to run the application

```bash
# Clone repository
git clone https://github.com/yusufaine/4211-webscrape.git 

# Install dependencies
yarn 

# Create a .env file in the root directory following .env.local
# You only need to explicitly set "true" for the filetype you want to save the data as

# Run the application
yarn start
```

Do note that there are some teams that the application isn't able to scrape the data for but as of writing, there are over 3500 individual statistics that are scrapped.
