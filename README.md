# Mars-Time

Mars-Time is an experimental Martian clock and calendar inspired by real Mars astronomy. It converts Earth UTC into a custom Mars-facing timekeeping system anchored to the Mars 3 landing epoch.

The project is intentionally human-friendly rather than an official scientific standard. It keeps the real Martian sol length as its astronomical base, then displays each sol through a custom clock with 25 hours, 50 minutes per hour, and 71 seconds per minute.

## Time System

- 1 minute = 71 Mars-seconds
- 1 hour = 50 Mars-minutes
- 1 sol = 25 Mars-hours
- 1 sol = 88,750 displayed Mars-seconds
- 1 month = 55 or 56 sols
- 1 Martian year = 668.6 sols

## Calendar Model

Mars-Time starts counting from the Mars 3 touchdown epoch:

```text
1971-12-02 13:52:00 UTC
```

The displayed date format is:

```text
sol.month.year
```

The calendar uses 12 named months:

| Month | Name | Sols |
| --- | --- | ---: |
| 1 | vasant | 56 |
| 2 | dunia | 55 |
| 3 | xing | 56 |
| 4 | mare | 55 |
| 5 | ember | 56 |
| 6 | flor | 55 |
| 7 | sneg | 56 |
| 8 | kijani | 55 |
| 9 | hu | 56 |
| 10 | vent | 55 |
| 11 | luna | 56 |
| 12 | zvezda | 55 |

## Clock Model

The app converts the current UTC time into Mars Sol Date (MSD), shifts the sol boundary for display, and then maps the current sol fraction into:

```text
25 hours x 50 minutes x 71 seconds = 88,750 Mars-seconds
```

A real Martian sol is represented with:

```text
88,775.244147 Earth seconds
```

That means the displayed Mars-seconds are scaled units inside the custom Mars-Time clock, not SI seconds.

## Run Locally

This is a static web project. Open `index.html` directly in a browser, or serve the folder with any local static server.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Structure

```text
.
|-- index.html
|-- src
|   |-- mars-time.js
|   `-- styles.css
|-- README.md
|-- LICENSE
`-- .gitignore
```

## Notes

Mars-Time is experimental. It combines real Mars astronomy with a custom calendar and clock designed for readability, play, and public exploration.
