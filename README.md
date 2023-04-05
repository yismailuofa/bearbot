# BearBot

🐻🤖 A Chrome Extension that monitors a UAlberta class for open seats and enroll once it has found an open seat in the class.

> Except as represented in this agreement, all work product by Developer is provided ​“AS IS”. Other than as provided in this agreement, Developer makes no other warranties, express or implied, and hereby disclaims all implied warranties, including any warranty of merchantability and warranty of fitness for a particular purpose. Developer maintains no affiliation to the University of Alberta.

# Guide

## Installation

1. Download the extension using the button in the top right.

2. Go to the Chrome extensions page by typing `chrome://extensions/` in your search bar or by navigating to Chrome settings -> extensions.

3. Click the switch in the top right called `Developer mode`

4. Click load unpacked, and choose the BearBot folder (the one with manifest.json inside).
   <img width="814" alt="image" src="https://user-images.githubusercontent.com/59630201/208400195-197b7dd1-cc4a-40fc-836e-a07ca407ab70.png">

## Usage

1. Click the puzzle piece in your top chrome bar and scroll down BearBot. Then hit the pin icon to pin it to your chrome bar.

2. Go to `https://www.beartracks.ualberta.ca/` and click `Sign In`.

3. Got to Class Search and use the search box to search for the class you want to track. It may take a couple clicks.

4. Once you are at page like this, click the extension icon in the top right and start the bot. You can click away or navigate to other tabs while it runs.
   <img width="860" alt="image" src="https://user-images.githubusercontent.com/59630201/229986575-0a95d8c9-bce9-4482-9028-f82531d24a77.png">

5. You can also optionally enter a space seperated keyword list, e.g `LEC-A2456 LEC-A1-123` to filter which sections are enrolled in. Otherwise it will choose the first open section.

6. Once an opening is found, BearBot should click enroll for you. Enjoy!
