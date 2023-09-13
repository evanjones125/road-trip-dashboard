# Road Trip Dashboard

Road trips are a lot of fun, but they can be unpredictable. In Utah, you never know what kind of weather you're going to run into in the desert — especially if you're covering a large distance by car or van (Utah has 15 unique [Köppen Climate Types](https://en.wikipedia.org/wiki/K%C3%B6ppen_climate_classification) ranging from hot desert to humid subtropical to subarctic to tundra!).

<div style="margin-bottom: 20px">
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/K%C3%B6ppen_Climate_Types_Utah.png" alt="Köppen Climate Types of Utah map" height="150px" />
  <img src="https://loveincorporated.blob.core.windows.net/contentimages/fullsize/67835d69-f466-43bf-b455-3ff1fff7a60c-guide-to-south-utah-road-trip-valley-of-the-g.jpg" alt="Köppen Climate Types of Utah map" height="150px" />
  <img src="https://i.iheart.com/v3/re/new_assets/611e6905ad7bf08ab14a246d?ops=contain(1480,0)" alt="Köppen Climate Types of Utah map" height="150px" />
</div>

This app aims to make your trips more predictable by displaying an entire dashboard with live data about the weather on your upcoming trip as well as live video from some of the hundreds of [road cameras operated by the Utah Department of Transportation](https://udottraffic.utah.gov/map).

[*screenshot of app*]

Enter the starting point of and the stops along your road trip and the dashboard will display the nearest traffic road cameras and the weather info for each stop.

This app is containerized using docker and deployed using AWS Elastic Beansprout, with the frontend hosted in an AWS S3 bucket.

## Future Features:
- [x] show weather data from the NWS API
- [ ] show sunrise/sunset times
- [ ] show moonrise/moonset times
  - [ ] tell the user what time window they'll have to view the sky after sunset when there's no moon in the sky
- [ ] show milky way information
- [ ] let user choose a location on a map when submitting the new trip form (as an alternative to entering an exact latitude and longitude)