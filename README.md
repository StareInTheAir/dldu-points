# dldu-points

A web application that displays a total and detailed score during a DLDU run on stream. It is designed to integrate into OBS as a browser source. The application uses a Google Docs sheet as its data source, ensuring that any changes made to the sheet automatically update the score in real-time.

## Demo

https://youtu.be/yrKhPNEN7qU

<a href="https://youtu.be/yrKhPNEN7qU">
  <img alt="Screenshot of dldu-points overlaid on Dark Souls" src="docs/00-demo.jpg" width="600" />
</a>

## Google Docs setup

- Open one of the templates:
  - Dark Souls 1 templates
    - [Dark Souls 1 DLDU template German](https://docs.google.com/spreadsheets/d/1DXO5h_w7tQWbocV8spuq2j3x9f9SgPb0Pn1G6DrhW78)
      - Translated by [Platyboar](https://www.twitch.tv/platyboar). Thank you!
      - 304 total points
      - Used in all seasons of DLDU
    - [Dark Souls 1 DLDU template English](https://docs.google.com/spreadsheets/d/1WdxwX-zDKJikdGAqnbnBa7McvssiBd70TqeyY1R0y0o)
      - Created by me
      - 304 total points
      - Used in all seasons of DLDU
  - Dark Souls 2 templates
    - [Dark Souls 2 Soulkeepers template German](https://docs.google.com/spreadsheets/d/1xumcVVFw5qhcQtjFj9XzG9vvmnBE0O5_hX-cNwMdeQU)
      - Created by the [HoB team](https://soulkeepers.online/regelwerk/)
      - 349 total points
      - Used in Soulkeepers season 1
    - [Dark Souls 2 Platyboar template English](https://docs.google.com/spreadsheets/d/1vGRYBNMsS9dg48kC6kD7JJEIJT3M6AHlroRzugD1Rrc)
      - Contributed by [Platyboar](https://www.twitch.tv/platyboar). Thank you!
      - 349 total points
      - More accurate than the Soulkeepers template
    - [Dark Souls 2 Soulkeepers template English](https://docs.google.com/spreadsheets/d/1l-dXYYXkBUVKYW_Kd0p1ej9Nh_M342jcKzd_oVOxtX8)
      - Created by the [HoB team](https://soulkeepers.online/regelwerk/)
      - 340 total points
      - Used in the beginning of Soulkeepers season 1
  - Dark Souls 3 templates
    - [Dark Souls 3 Soulkeepers template German](https://docs.google.com/spreadsheets/d/1cmaPNng-xC8mU4xpEvf5ErETZkQsitIx3xRfpgrBOsc)
      - Contributed by [Platyboar](https://www.twitch.tv/platyboar) et al. Thank you!
      - 359 total points
      - Used in [Soulkeepers season 1](https://soulkeepers.online/regelwerk/)
    - [Dark Souls 3 Soulkeepers template English](https://docs.google.com/spreadsheets/d/1kUuvlwyp4e9X-Rw2cuwQF3L1jGJeE2gjzg5CWtg80P8)
      - Contributed by [Platyboar](https://www.twitch.tv/platyboar) et al. Thank you!
      - 359 total points
      - Used in [Soulkeepers season 1](https://soulkeepers.online/regelwerk/)

- Select `File` → `Make a copy`

<img alt="Screenshot of the 'Make a copy' menu item in Google Docs" src="docs/01-make-a-copy.png" width="350" />

- Name the document and save it to your Google Drive.
- Adjust the sharing settings of your sheet so that anyone with the link can view it. To do this, click the Share button in the top-right corner of Google Docs, and then click this button:

<img alt="Screenshot of the Google Docs share dialog with the 'Change to anyone with the link' button highlighted" src="docs/04-share-dialog.png" width="500" />

- Locate the sheet ID in your browser's address bar (in the URL). You will need this sheet ID during the OBS setup, so copy it now. The sheet ID is the string of numbers, letters, and possibly symbols between `spreadsheets/d/` and `/edit`:

<img alt="Screenshot of the browser address bar with the sheet ID highlighted and selected" src="docs/02-sheet-id.png" />


## OBS setup

A hosted version of the website is available but not public. Contact [stareintheair](https://discord.com/users/277888096757088256) on Discord to request access. I also speak German 😉

- Paste your sheet ID into the URL I will provide.
- Create a new browser source and use the URL you just created.
- Set the width to 350 and the height to 500. Width and height can be adjusted to your needs. The website will automatically use all available space.
- Check `Shutdown source when not visible` to save resources.

<img alt="Screenshot of the OBS browser source window with all text fields filled in" src="docs/06-browser-source.png" width="350" />

### Progress bar

Below the total points is a progress bar that visualizes how many points have already been achieved. Each boss has its own position in the progress bar, i.e. early bosses appear on the left and later bosses on the right:

<img alt="Screenshot of the progress bar with early bosses defeated visualized as green sections" src="docs/09-progress-bar.png" width="350" />

## Structure of the Google Sheet

You can share access to the Google Sheet with moderators or trusted viewers, so that they can update the score for you live during the stream.

- All bosses defined below a level belong to that level.
- Incomplete rows and rows with invalid values will be ignored by the website. Valid rows are still displayed.

<img alt="Screenshot of the Google Sheet with some bosses marked as defeated" src="docs/05-sheet-structure.png" width="350" />

### Bosses

- When a boss is defeated, check the box in the fourth column.
- New bosses can be added as a new row in the Google Sheet and will be automatically displayed on the website. Make sure the type in the first column is set to `boss`.
- The order of the bosses can be changed by reordering the rows.
- Living bosses appear in gray.
- Defeated bosses appear in white.


### Levels

- Bosses in a level will only appear on the website if at least one, but not all, of the bosses in that level have been defeated.
- You can force the bosses of a level to always be displayed by checking the box in the fifth column.
- If you want the same behavior as in version 1, check all the boxes in the fifth column.
- The points of a level will be displayed in gray if at least one boss of that level is still alive.
- The points of a level will be displayed in white if all the bosses in that level have been defeated.
- New bosses can be added as a new row in the Google Sheet and will be automatically displayed on the website. Make sure the type in the first column is set to `level`.
- Levels without bosses will be ignored.
- The order of the levels can be changed by reordering the rows.

## Configuration options


### Seconds per page

By default each page is displayed for 10 seconds. This delay can be changed by adding an additional query parameter to the URL. Append `&secondsPerPage=5` to the URL to halve the display time of each page:

<img alt="Screenshot of the OBS browser source window with the secondsPerPage parameter highlighted" src="docs/07-seconds-per-page.png" width="350" />

### Hide progress bar

To hide the green points progress bar, append `&hideProgressBar` to the URL (same location as seconds per page).

### Hide levels without points

To show only levels with points and hide all levels without points, add `&hideLevelsWithNoPoints` to the URL (same location as with seconds per page). When starting a new run, no levels will be visible until the first boss is defeated.

### Run name / total points label

By default, the label next to the total points reads "Gesamtpunkte: ". You can change this text to anything you like. The easiest way is to select the browser source in OBS, then click the "Interact" button above:

<img alt="Screenshot of the OBS browser source window with the secondsPerPage parameter highlighted" src="docs/11-total-points-label.png" width="350" />

A new window will open showing only dldu-points. Click directly on the "Gesamtpunkte: " text to edit it:

<img alt="Screenshot of OBS with the browser source highlighted. The 'Interact' button is shown above the list of sources" src="docs/10-browser-source-interact.png" width="350" />

Alternatively, you can set the label from the start using a URL query parameter. Add `&totalLabel=Total%20points:%20` to your URL (same location as seconds per page). Replace all spaces with `%20` to avoid problems.

### Text size

The text size can be increased or decreased if necessary. This is better than scaling the browser source itself, because it keeps the text sharp. Use the OBS custom CSS override to change the text size. Add `font-size: 1.3rem;` to the body style section as shown in the screenshot here:

<img alt="Screenshot of the OBS browser source window with font-size CSS override highlighted" src="docs/08-font-size.png" width="350" />

`1rem` doesn't change the size, `0.8rem` reduces the size by 20%, and `2rem` doubles the size. The width and height of the browser source need to be adjusted as well.

### Left aligned layout

The default layout is designed to be placed on the right side of the screen. If you want to put it on the left side, use the following CSS body style to switch the columns: `direction: rtl;` Put it in the same place as in the screenshot above.
