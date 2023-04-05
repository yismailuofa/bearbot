# BearBot

🐻🤖 A Chrome Extension that monitors a UAlberta class for open seats.
It will refresh the page every 5 seconds, beep, send a chrome notification, and enroll once it has found an open seat in the class.

> Except as represented in this agreement, all work product by Developer is provided ​“AS IS”. Other than as provided in this agreement, Developer makes no other warranties, express or implied, and hereby disclaims all implied warranties, including any warranty of merchantability and warranty of fitness for a particular purpose. Develop maintains no affiliation to the University of Alberta.

# Guide

## Installation

1. Download the extension using the button in the top right.

2. Go to the chrome extensions page by typing `chrome://extensions/` in your search bar or by navigating to the chrome settings -> extensions.

3. Click the switch in the top right called `Developer mode`

4. Click load unpacked, and choose the BearBot folder (the one with manifest.json inside).
   <img width="814" alt="image" src="https://user-images.githubusercontent.com/59630201/208400195-197b7dd1-cc4a-40fc-836e-a07ca407ab70.png">

## Usage

1. Click the puzzle piece in your top chrome bar and scroll down BearBot. Then hit the pin icon to pin it to your chrome bar.
   <img width="328" alt="image" src="https://user-images.githubusercontent.com/59630201/208399985-662c8368-b31d-46e3-9646-0158325e616f.png">

2. Go to `https://www.beartracks.ualberta.ca/` and click `Sign In`.
   <img width="1007" alt="image" src="https://user-images.githubusercontent.com/59630201/208400639-36d485cc-4d04-42f7-9d8b-f89fdb04f5a6.png">

3. Got to Class Search and use the search box to search for the class you want to track. It may take a couple clicks

4. Once you are at page like this, click the extension icon in the top right
   <img width="970" alt="image" src="https://user-images.githubusercontent.com/59630201/208400930-140cb285-dfc2-47e6-a1b1-f3f9c7437cda.png">

5. Click `start` to start the script, you can optionally enter a space seperated keyword list to filter which sections are enrolled in.
   Otherwise it will choose the first open section.

6. Once an opening is found, BearBot should click enroll for you. Enjoy!
