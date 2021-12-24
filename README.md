# dldu-points

A web application that shows a total and a detailed score when playing a DLDU run on stream. It's made for being integrated into OBS as a browser source. A Google Docs sheet is used the data source and changing it automatically update the current score.

## Demo

https://youtu.be/yrKhPNEN7qU

<a href="https://youtu.be/yrKhPNEN7qU">
  <img alt="Screenshot of dldu-points overlayed over Dark Souls" src="docs/00-demo.jpg" width="600" />
</a>

## Google Docs setup

- Open the [template Google Docs sheet](https://docs.google.com/spreadsheets/d/1NIl-058tT5CDlrNdAuthv_8ofH3oMzB3ruT97cJHm4s).
- Select `File` → `Make a copy`

<img alt="Screenshot of make a copy menu item in Google Docs" src="docs/01-make-a-copy.png" width="350" />

- Set a file name and save it to your Google Drive.
- Change your sheet to be viewable by anyone with the link. To do this, click to Share button in Google Docs at the top right and click this button:

<img alt="Screenshot of the Google Docs share dialog with the 'Change to anyone with the link' button highlighted" src="docs/04-share-dialog.png" width="500" />

- In the URL of your browsers address bar you will see the sheet id. You need that sheet ID during the OBS setup, so copy it now. It's the numbers and letters (and maybe symbols) between `spreadsheets/d/` and `/edit`:

<img alt="Screenshot of browser address bar with sheet id highlighted and selected" src="docs/02-sheet-id.png" />


## OBS setup

A deployed and hosted version of the website exists, but it isn't public. Contact stareintheair#7130 on Discord to request access.

- Insert your sheet id into the URL: `https://CENSORED_DOMAIN.com/?sheetId=YOUR_SHEET_ID_HERE`
- Create a new browser source and use the URL you just created.
- Set the width to 350 and the height to 500. Width and height can be adjusted to your needs. The website automatically uses all available space.

<img alt="Screenshot of OBS browser source window with all textfields filled" src="docs/06-browser-source.png" width="350" />

## Structure of the Google sheet

You can share access to the Google sheet with moderators and trusted viewers, so they can update the score live during the stream for you.

### Bosses

- Each boss has its own row in a table.
- If a boss was beaten change the value in the third column from `alive` to `beaten`.
- The order of bosses can be switched by reordering the rows.
- If I missed a boss, new ones can be added in the Google doc and are automatically shown on the website.
- The points are locked to 3 or 5, but the data validation rule can be remove manually, if the points ever change.
- Incomplete rows and rows with invalid values will be ignored by the website. Valid rows will still be displayed.

### Regions

- Each region of Dark Souls has its own table, that can be switched at the bottom:

<img alt="Screenshot of make a copy menu item in Google Docs" src="docs/05-tables.png" width="350" />

- New regions can be added by creating a new table. The name of the table will be the region name. I recommend duplicating an existing one to copy the validation rules.
- The order of the regions on the website can also be changed by reordering the tables in Google Docs via drag and drop.

## Configuration options

### Seconds per page

By default each page is displayed 10 seconds. This delay can be changed by adding an additional query parameter to the URL. Append `&secondsPerPage=5` to the URL to half the display time of each page:

<img alt="Screenshot of OBS browser source windows with secondsPerPage parameter highlighted" src="docs/07-seconds-per-page.png" width="350" />

### Text size

The text size can be increased and decreased if necessary. This is better than scaling the browser source itself, because it will keep the text sharp. Use the OBS custom CSS override to change the text size. Add `font-size: 1.3rem;` to the body style section as seen an the screenshot here:

<img alt="Screenshot of OBS browser source windows with font-size CSS overwrite highlighted" src="docs/08-font-size.png" width="350" />

`1rem` doesn't change the size, `0.8rem` decreases the size by 20 %, and `2rem` doubles it. The width and height of the browser source probably need to be adapted as well.

### Left aligned layout

The default layout is designed to be placed on the right side of the screen. If you want to put it on the left, use the following CSS body style to switch the columns: `direction: rtl;` Put in the same place as in the screenshot above.
